<div align="center">
  <img src="https://raw.githubusercontent.com/qwertyuii7/AETHEON/main/public/images/sculptures/Classic%20Sculptures.jpg" alt="AETHEON Banner" width="100%" style="border-radius: 8px; margin-bottom: 20px;">
  
  <h1 align="center">AETHEON</h1>
  <p align="center">
    <strong>Curators of monumental aesthetics. Bridging antiquity and the modern sanctuary through masterful marble craft.</strong>
  </p>
  
  <p align="center">
    <a href="#about">About</a> •
    <a href="#cinematic-experience">Cinematic Experience</a> •
    <a href="#technical-architecture">Technical Architecture</a> •
    <a href="#getting-started">Getting Started</a>
  </p>
</div>

---

## 🏛 About AETHEON

AETHEON is a premium e-commerce storefront and digital storytelling experience designed for the curation of monumental Greek and Roman sculptures. Far beyond a standard storefront, the site is designed to feel like an interactive museum exhibition, utilizing cutting-edge web technologies to deliver a narrative-driven journey.

## ✨ Cinematic Experience

The AETHEON digital platform sets a new standard for web luxury:

- **Scroll-Driven Video Canvas**: A high-performance, frame-by-frame scrubbing engine that drives the user through three breathtaking acts (Courtyard → Temple Interior → Sky/Gods) tied strictly to their scroll position.
- **WebGL Interactive Water Ripples**: A real-time, interactive liquid ripple simulation. Ping-pong framebuffers simulate physically accurate wave propagation originating from the user's cursor.
- **Dynamic Story Integration**: Sculptural masterpieces organically fade into the environment alongside cinematic typography, anchoring the narrative to the artwork itself.
- **Seamless Crossfades**: Intelligent scroll-triggered opacity masks that elegantly transition the user between acts without jarring interruptions.
- **Premium Fluid Typography**: Implemented utilizing the elegant *Ethereal Nymeria* typeface, scaling flawlessly across all devices via fluid `clamp()` sizing.

## 🛠 Technical Architecture

Built for extreme performance without sacrificing aesthetic fidelity:

* **Framework**: React 18 / Vite
* **Animation Engine**: GSAP (GreenSock) & ScrollTrigger
* **Smooth Scrolling**: Lenis
* **Styling**: Tailwind CSS v4 & Pure Vanilla CSS (for layout-safe component rendering)
* **Graphics Rendering**: 
  * Canvas API for optimized, throttled image drawing (capped DPR for retina stability)
  * Raw WebGL shaders for pixel-level displacement mapping (Water Ripple)
* **Performance Enhancements**:
  * *Progressive Frame Loading*: Loads every 3rd frame instantly to allow immediate user scrolling, filling in the gaps in the background.
  * *rAF Batching*: Draw calls are strictly throttled to the `requestAnimationFrame` loop to prevent excessive GPU taxation during rapid scrolls.
  * *Nearest-Frame Fallback*: Dynamically searches for the closest loaded frame to prevent black flashes on slower networks.

## 🚀 Getting Started

To run the AETHEON platform locally:

### 1. Clone the repository
```bash
git clone https://github.com/qwertyuii7/AETHEON.git
cd AETHEON
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```

Your cinematic experience will be served at `http://localhost:5173`.

---
<div align="center">
  <p><i>"Monuments that outlive empires. Your sanctuary, immortalized."</i></p>
  <p>© 2026 AETHEON Antiquities. All rights reserved.</p>
</div>
