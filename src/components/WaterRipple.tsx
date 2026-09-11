import React, { useRef, useEffect } from 'react';

// Monochrome water ripple — pure light/shadow distortion, no color

const VERT = `
  attribute vec2 a_pos;
  varying vec2 v_uv;
  void main() {
    v_uv = a_pos * 0.5 + 0.5;
    gl_Position = vec4(a_pos, 0.0, 1.0);
  }
`;

const RIPPLE_FRAG = `
  precision highp float;
  uniform sampler2D u_prev;
  uniform sampler2D u_curr;
  uniform vec2 u_res;
  uniform vec2 u_mouse;
  uniform float u_active;
  varying vec2 v_uv;
  
  void main() {
    vec2 t = 1.0 / u_res;
    float top    = texture2D(u_curr, v_uv + vec2(0.0, t.y)).r;
    float bottom = texture2D(u_curr, v_uv - vec2(0.0, t.y)).r;
    float left   = texture2D(u_curr, v_uv - vec2(t.x, 0.0)).r;
    float right  = texture2D(u_curr, v_uv + vec2(t.x, 0.0)).r;
    float prev   = texture2D(u_prev, v_uv).r;
    
    float next = (top + bottom + left + right) * 0.5 - prev;
    next *= 0.982;
    
    if (u_active > 0.5) {
      float d = distance(v_uv, u_mouse);
      if (d < 0.035) next += (1.0 - d / 0.035) * 0.12;
    }
    
    gl_FragColor = vec4(next, next, next, 1.0);
  }
`;

// Render pass — outputs a monochrome brightness displacement
const RENDER_FRAG = `
  precision highp float;
  uniform sampler2D u_ripple;
  uniform vec2 u_res;
  varying vec2 v_uv;
  
  void main() {
    vec2 t = 1.0 / u_res;
    float dx = texture2D(u_ripple, v_uv + vec2(t.x, 0.0)).r 
             - texture2D(u_ripple, v_uv - vec2(t.x, 0.0)).r;
    float dy = texture2D(u_ripple, v_uv + vec2(0.0, t.y)).r 
             - texture2D(u_ripple, v_uv - vec2(0.0, t.y)).r;
    
    // Pure monochrome — just the surface normal brightness
    float light = (dx + dy) * 4.0 + 0.5;
    gl_FragColor = vec4(light, light, light, 1.0);
  }
`;

interface Props { visible: boolean; }

export const WaterRipple: React.FC<Props> = ({ visible }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: false });
    if (!gl) return;

    const W = 256, H = 256;
    canvas.width = W;
    canvas.height = H;

    const rippleProg = mkProg(gl, VERT, RIPPLE_FRAG);
    const renderProg = mkProg(gl, VERT, RENDER_FRAG);
    if (!rippleProg || !renderProg) return;

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);

    const mkFBO = () => {
      const tex = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, W, H, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      const fbo = gl.createFramebuffer()!;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      return { tex, fbo };
    };

    let prev = mkFBO(), curr = mkFBO(), temp = mkFBO();

    const drawQuad = (prog: WebGLProgram) => {
      const a = gl.getAttribLocation(prog, 'a_pos');
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.enableVertexAttribArray(a);
      gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const loop = () => {
      if (!visible) { animRef.current = requestAnimationFrame(loop); return; }

      // Ripple sim
      gl.useProgram(rippleProg);
      gl.bindFramebuffer(gl.FRAMEBUFFER, temp.fbo);
      gl.viewport(0, 0, W, H);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, prev.tex);
      gl.uniform1i(gl.getUniformLocation(rippleProg, 'u_prev'), 0);
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, curr.tex);
      gl.uniform1i(gl.getUniformLocation(rippleProg, 'u_curr'), 1);
      gl.uniform2f(gl.getUniformLocation(rippleProg, 'u_res'), W, H);
      gl.uniform2f(gl.getUniformLocation(rippleProg, 'u_mouse'), mouseRef.current.x, 1.0 - mouseRef.current.y);
      gl.uniform1f(gl.getUniformLocation(rippleProg, 'u_active'), mouseRef.current.active ? 1 : 0);
      drawQuad(rippleProg);

      // Swap
      const old = prev; prev = curr; curr = temp; temp = old;

      // Render
      gl.useProgram(renderProg);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, W, H);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, curr.tex);
      gl.uniform1i(gl.getUniformLocation(renderProg, 'u_ripple'), 0);
      gl.uniform2f(gl.getUniformLocation(renderProg, 'u_res'), W, H);
      drawQuad(renderProg);

      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);

    const parent = canvas.parentElement;
    const onMove = (e: MouseEvent) => {
      const r = parent?.getBoundingClientRect();
      if (!r) return;
      mouseRef.current.x = (e.clientX - r.left) / r.width;
      mouseRef.current.y = (e.clientY - r.top) / r.height;
      mouseRef.current.active = true;
    };
    const onLeave = () => { mouseRef.current.active = false; };

    parent?.addEventListener('mousemove', onMove);
    parent?.addEventListener('mouseleave', onLeave);
    return () => {
      cancelAnimationFrame(animRef.current);
      parent?.removeEventListener('mousemove', onMove);
      parent?.removeEventListener('mouseleave', onLeave);
    };
  }, [visible]);

  return (
    <canvas ref={canvasRef} style={{
      position: 'absolute', inset: 0, width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: 15,
      mixBlendMode: 'soft-light',
      opacity: visible ? 0.35 : 0,
      transition: 'opacity 1s ease',
    }} />
  );
};

function mkShader(gl: WebGLRenderingContext, t: number, s: string) {
  const sh = gl.createShader(t)!;
  gl.shaderSource(sh, s); gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) { console.error(gl.getShaderInfoLog(sh)); return null; }
  return sh;
}
function mkProg(gl: WebGLRenderingContext, vs: string, fs: string) {
  const v = mkShader(gl, gl.VERTEX_SHADER, vs), f = mkShader(gl, gl.FRAGMENT_SHADER, fs);
  if (!v || !f) return null;
  const p = gl.createProgram()!;
  gl.attachShader(p, v); gl.attachShader(p, f); gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) { console.error(gl.getProgramInfoLog(p)); return null; }
  return p;
}
