# 3D-Solar-System

# 🌌 3D Solar System Simulation

A fully interactive, real-time 3D simulation of the Solar System using **Three.js**, complete with planetary orbits, individual speed controls, camera modes, tooltips, and light/dark themes.

## 🚀 Live Features

- 🌞 3D Sun with glowing corona
- 🪐 8 Realistic Planets (scaled by size & distance)
- 🌙 Moon orbiting Earth
- 💍 Saturn’s rings
- 🔭 Interactive camera controls (Top view, Side view, Follow Earth)
- ⚙️ Real-time speed sliders (Global & Per-Planet)
- 🌓 Light/Dark theme toggle
- 🛰️ Hover tooltips with real data (AU, km, speed)
- 🧭 Click on any planet to focus camera

---

## 🧱 Basic Requirements

To build and run this project, you need:

### ✅ Prerequisites
| Requirement           | Description                                                                 |
|-----------------------|-----------------------------------------------------------------------------|
| HTML                  | Basic structure and UI elements                                              |
| CSS                   | Styling UI panels, tooltips, sliders, theme                                 |
| JavaScript            | Core animation, event listeners, logic                                      |
| [Three.js](https://threejs.org/) | 3D rendering, scene setup, mesh generation, camera, lighting                |
| Web browser           | Any modern browser with WebGL support (Chrome, Edge, Firefox, Safari, etc.) |

No installation or server is required—just open the `index.html` in a browser.

---
# 🌌 3D Solar System Simulation

[🔗 View Project on GitHub](https://github.com/Bhumica-jaiswal/3D-Solar-System.git)

A fully interactive, real-time 3D simulation of the Solar System...


## 📁 Project Structure

```
📁 solar-system/
├── index.html          # Entry point HTML file
├── main.js             # JavaScript logic: scene, camera, controls, planets
├── styles.css          # Styling for UI, panels, buttons, sliders
```

---

## 🛠️ Technologies Used

| Layer      | Tools Used        |
|------------|-------------------|
| Rendering  | Three.js, WebGL   |
| UI         | HTML, CSS         |
| Control    | JavaScript        |
| Effects    | Canvas textures, BufferGeometry, Raycasting |
| Deployment | Local or GitHub Pages |

---

## 🧰 How It Works

### 🌍 Planet Generation
- Planet data (name, radius, orbit distance, speed, color, etc.) is stored in an array.
- Each planet is rendered as a `THREE.Mesh` and animated using trigonometric functions for circular motion.
- Orbits are `THREE.RingGeometry`, rendered flat on the XZ plane.

### 🎛 Speed Control
- `animationSpeed` (global) and `currentSpeedMultiplier` (per-planet) are multiplied during each frame update to change revolution speed dynamically.

### 🔎 Interactions
- `mousemove`: Shows tooltip with AU, size, speed.
- `click`: Focus camera on selected planet.
- `mousedown + move`: Rotates scene in free mode.
- `wheel`: Zooms camera.

---

## 🏁 Getting Started

1. Clone or download the repository.
2. Open `index.html` in any modern browser.
3. Interact using sliders, buttons, and camera controls.

---

## 📦 Deployment

### GitHub Pages
To host this online:
1. Push your code to a GitHub repository.
2. Go to **Settings → Pages → Source** → Select `main` branch and `/root`.
3. Wait a few seconds, then visit the provided URL.

---

## 🙌 Credits

Made with ❤️ using [Three.js](https://threejs.org/).  
Created by **Bhumica Jaiswal**.

---

## 📜 License

This project is open-source and free to use for educational purposes.
