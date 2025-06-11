  let scene, camera, renderer, clock;
        let sun, planets = [];
        let planetData = [];
        let controls = {};
        let isAnimating = true;
        let animationSpeed = 1;
        let mouseX = 0, mouseY = 0;
        let cameraRadius = 100;
        let cameraTheta = 0, cameraPhi = Math.PI / 4;
        let isDarkMode = true;
        let followingPlanet = null;
        let cameraMode = 'free'; // 'free', 'following', 'top', 'side'

        // Enhanced planet data with more details
        const planetInfo = [
            { name: 'Mercury', radius: 0.4, distance: 8, speed: 4.15, color: 0x8C7853, realDistance: 0.39, realSize: 2440 },
            { name: 'Venus', radius: 0.9, distance: 12, speed: 1.62, color: 0xFFC649, realDistance: 0.72, realSize: 6052 },
            { name: 'Earth', radius: 1, distance: 16, speed: 1, color: 0x6B93D6, realDistance: 1.0, realSize: 6371 },
            { name: 'Mars', radius: 0.5, distance: 20, speed: 0.53, color: 0xC1440E, realDistance: 1.52, realSize: 3390 },
            { name: 'Jupiter', radius: 3, distance: 28, speed: 0.08, color: 0xD8CA9D, realDistance: 5.20, realSize: 69911 },
            { name: 'Saturn', radius: 2.5, distance: 36, speed: 0.03, color: 0xFAD5A5, realDistance: 9.58, realSize: 58232 },
            { name: 'Uranus', radius: 1.5, distance: 44, speed: 0.01, color: 0x4FD0E4, realDistance: 19.22, realSize: 25362 },
            { name: 'Neptune', radius: 1.4, distance: 52, speed: 0.006, color: 0x4B70DD, realDistance: 30.05, realSize: 24622 }
        ];

        function init() {
            // Create scene
            scene = new THREE.Scene();
            updateSceneBackground();

            // Create camera
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.set(0, 30, 60);

            // Create renderer
            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            document.getElementById('container').appendChild(renderer.domElement);

            // Create clock
            clock = new THREE.Clock();

            // Add enhanced stars
            createEnhancedStars();

            // Create sun
            createSun();

            // Create planets
            createPlanets();

            // Add lighting
            setupLighting();

            // Setup controls
            setupControls();

            // Create individual planet controls
            createPlanetControls();

            // Create planet labels
            createPlanetLabels();

            // Setup theme toggle
            setupThemeToggle();

            // Add event listeners
            addEventListeners();

            // Hide loading screen
            document.getElementById('loading').style.display = 'none';
            document.getElementById('info').style.display = 'block';
            document.getElementById('controls').style.display = 'block';
            document.getElementById('planetControls').style.display = 'block';
            document.getElementById('cameraControls').style.display = 'block';

            // Start animation
            animate();
        }

        function updateSceneBackground() {
            if (isDarkMode) {
                scene.background = new THREE.Color(0x000011);
            } else {
                scene.background = new THREE.Color(0x87CEEB); // Sky blue
            }
        }

        function createEnhancedStars() {
            // Remove existing stars
            const existingStars = scene.children.filter(child => child.name === 'stars');
            existingStars.forEach(stars => scene.remove(stars));

            if (isDarkMode) {
                // Create multiple star layers for depth
                for (let layer = 0; layer < 3; layer++) {
                    const starsGeometry = new THREE.BufferGeometry();
                    const starsMaterial = new THREE.PointsMaterial({ 
                        color: 0xFFFFFF, 
                        size: 0.5 + layer * 0.3,
                        transparent: true,
                        opacity: 0.8 - layer * 0.2
                    });

                    const starsVertices = [];
                    const numStars = 3000 - layer * 500;
                    
                    for (let i = 0; i < numStars; i++) {
                        const radius = 800 + layer * 200;
                        const x = (Math.random() - 0.5) * radius * 2;
                        const y = (Math.random() - 0.5) * radius * 2;
                        const z = (Math.random() - 0.5) * radius * 2;
                        starsVertices.push(x, y, z);
                    }

                    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
                    const stars = new THREE.Points(starsGeometry, starsMaterial);
                    stars.name = 'stars';
                    scene.add(stars);
                }

                // Add some twinkling effect with animated stars
                const twinkleGeometry = new THREE.BufferGeometry();
                const twinkleMaterial = new THREE.PointsMaterial({ 
                    color: 0xFFFFFF, 
                    size: 1.5,
                    transparent: true,
                    opacity: 0.6
                });

                const twinkleVertices = [];
                for (let i = 0; i < 200; i++) {
                    const x = (Math.random() - 0.5) * 1500;
                    const y = (Math.random() - 0.5) * 1500;
                    const z = (Math.random() - 0.5) * 1500;
                    twinkleVertices.push(x, y, z);
                }

                twinkleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(twinkleVertices, 3));
                const twinkleStars = new THREE.Points(twinkleGeometry, twinkleMaterial);
                twinkleStars.name = 'stars';
                scene.add(twinkleStars);
            }
        }

        function createSun() {
            const sunGeometry = new THREE.SphereGeometry(3, 32, 32);
            const sunMaterial = new THREE.MeshBasicMaterial({ 
                color: 0xFFD700,
                emissive: 0xFFAA00,
                emissiveIntensity: 0.3
            });
            sun = new THREE.Mesh(sunGeometry, sunMaterial);
            sun.userData = { name: 'Sun', type: 'star' };
            scene.add(sun);

            // Add sun glow effect
            const glowGeometry = new THREE.SphereGeometry(4, 32, 32);
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: 0xFFD700,
                transparent: true,
                opacity: 0.1
            });
            const sunGlow = new THREE.Mesh(glowGeometry, glowMaterial);
            scene.add(sunGlow);

            // Add sun corona
            const coronaGeometry = new THREE.SphereGeometry(5, 32, 32);
            const coronaMaterial = new THREE.MeshBasicMaterial({
                color: 0xFFAA00,
                transparent: true,
                opacity: 0.05
            });
            const sunCorona = new THREE.Mesh(coronaGeometry, coronaMaterial);
            scene.add(sunCorona);
        }

        function createPlanets() {
            planetInfo.forEach((info, index) => {
                // Create planet
                const geometry = new THREE.SphereGeometry(info.radius, 32, 32);
                const material = new THREE.MeshLambertMaterial({ color: info.color });
                const planet = new THREE.Mesh(geometry, material);
                
                // Set initial position
                planet.position.x = info.distance;
                planet.userData = {
                    name: info.name,
                    distance: info.distance,
                    speed: info.speed,
                    originalSpeed: info.speed,
                    currentSpeedMultiplier: 1,
                    angle: Math.random() * Math.PI * 2,
                    originalColor: info.color,
                    index: index,
                    realDistance: info.realDistance,
                    realSize: info.realSize,
                    type: 'planet'
                };

                scene.add(planet);
                planets.push(planet);

                // Create orbit line
                const orbitGeometry = new THREE.RingGeometry(info.distance - 0.1, info.distance + 0.1, 64);
                const orbitMaterial = new THREE.MeshBasicMaterial({
                    color: isDarkMode ? 0x444444 : 0x666666,
                    transparent: true,
                    opacity: 0.3,
                    side: THREE.DoubleSide
                });
                const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
                orbit.rotation.x = Math.PI / 2;
                orbit.userData = { type: 'orbit' };
                scene.add(orbit);

                // Add Saturn's rings
                if (info.name === 'Saturn') {
                    const ringGeometry = new THREE.RingGeometry(info.radius + 0.5, info.radius + 1.5, 32);
                    const ringMaterial = new THREE.MeshLambertMaterial({
                        color: 0xC4A484,
                        transparent: true,
                        opacity: 0.7,
                        side: THREE.DoubleSide
                    });
                    const rings = new THREE.Mesh(ringGeometry, ringMaterial);
                    rings.rotation.x = Math.PI / 2;
                    planet.add(rings);
                }

                // Add Earth's moon
                if (info.name === 'Earth') {
                    const moonGeometry = new THREE.SphereGeometry(0.27, 16, 16);
                    const moonMaterial = new THREE.MeshLambertMaterial({ color: 0xC0C0C0 });
                    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
                    moon.position.set(2, 0, 0);
                    moon.userData = { name: 'Moon', type: 'moon' };
                    planet.add(moon);
                }
            });
        }

        function createPlanetControls() {
            const controlsList = document.getElementById('planetControlsList');
            
            planets.forEach((planet, index) => {
                const controlDiv = document.createElement('div');
                controlDiv.className = 'planet-control';
                controlDiv.innerHTML = `
                    <div class="planet-name">${planet.userData.name}</div>
                    <div class="control-row">
                        <label>Speed:</label>
                        <input type="range" 
                               id="planet-speed-${index}" 
                               min="0" 
                               max="5" 
                               step="0.1" 
                               value="1">
                        <span class="speed-value" id="speed-value-${index}">1.0x</span>
                    </div>
                    <div class="control-row">
                        <button class="reset-planet-btn" onclick="resetPlanetSpeed(${index})">Reset</button>
                        <button class="reset-planet-btn" onclick="focusOnPlanet(${index})" style="background: rgba(76, 175, 80, 0.2); border-color: rgba(76, 175, 80, 0.5); color: #4CAF50;">Focus</button>
                    </div>
                `;
                controlsList.appendChild(controlDiv);

                // Add event listener for the speed slider
                const speedSlider = document.getElementById(`planet-speed-${index}`);
                const speedValue = document.getElementById(`speed-value-${index}`);
                
                speedSlider.addEventListener('input', (e) => {
                    const newSpeedMultiplier = parseFloat(e.target.value);
                    planet.userData.currentSpeedMultiplier = newSpeedMultiplier;
                    speedValue.textContent = newSpeedMultiplier.toFixed(1) + 'x';
                });
            });
        }

        function resetPlanetSpeed(planetIndex) {
            const planet = planets[planetIndex];
            const speedSlider = document.getElementById(`planet-speed-${planetIndex}`);
            const speedValue = document.getElementById(`speed-value-${planetIndex}`);
            
            planet.userData.currentSpeedMultiplier = 1;
            speedSlider.value = 1;
            speedValue.textContent = '1.0x';
        }

        function resetAllPlanetSpeeds() {
            planets.forEach((planet, index) => {
                resetPlanetSpeed(index);
            });
        }

        function focusOnPlanet(planetIndex) {
            const planet = planets[planetIndex];
            followingPlanet = planet;
            cameraMode = 'following';
            
            // Animate camera to planet
            const targetRadius = planet.userData.distance + 10;
            animateCameraTo(planet.position.x, planet.position.y + 5, planet.position.z, targetRadius);
        }

        function focusOnSun() {
            followingPlanet = null;
            cameraMode = 'free';
            animateCameraTo(0, 10, 20, 30);
        }

        function viewFromTop() {
            followingPlanet = null;
            cameraMode = 'top';
            cameraTheta = 0;
            cameraPhi = 0.1;
            cameraRadius = 80;
            updateCameraPosition();
        }

        function viewFromSide() {
            followingPlanet = null;
            cameraMode = 'side';
            cameraTheta = 0;
            cameraPhi = Math.PI / 2;
            cameraRadius = 80;
            updateCameraPosition();
        }

        function followEarth() {
            const earth = planets.find(p => p.userData.name === 'Earth');
            if (earth) {
                followingPlanet = earth;
                cameraMode = 'following';
            }
        }

        function animateCameraTo(x, y, z, radius) {
            const startPos = camera.position.clone();
            const endPos = new THREE.Vector3(x, y, z);
            const startTime = Date.now();
            const duration = 1000; // 1 second

            function updateCamera() {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic

                camera.position.lerpVectors(startPos, endPos, easeProgress);
                camera.lookAt(0, 0, 0);

                if (progress < 1) {
                    requestAnimationFrame(updateCamera);
                }
            }

            updateCamera();
        }

        function setupLighting() {
            // Ambient light
            const ambientLight = new THREE.AmbientLight(isDarkMode ? 0x404040 : 0x808080, isDarkMode ? 0.2 : 0.4);
            scene.add(ambientLight);

            // Point light from sun
            const sunLight = new THREE.PointLight(0xFFFFFF, isDarkMode ? 2 : 1.5, 200);
            sunLight.position.set(0, 0, 0);
            sunLight.castShadow = true;
            sunLight.shadow.mapSize.width = 2048;
            sunLight.shadow.mapSize.height = 2048;
            scene.add(sunLight);
        }

        function setupControls() {
            // Global speed control
            const speedSlider = document.getElementById('speedSlider');
            const speedValue = document.getElementById('speedValue');
            
            speedSlider.addEventListener('input', (e) => {
                animationSpeed = parseFloat(e.target.value);
                speedValue.textContent = animationSpeed + 'x';
            });

            // Pause button
            document.getElementById('pauseBtn').addEventListener('click', () => {
                isAnimating = !isAnimating;
                const btn = document.getElementById('pauseBtn');
                btn.textContent = isAnimating ? '⏸️ Pause' : '▶️ Resume';
            });

            // Reset button
            document.getElementById('resetBtn').addEventListener('click', () => {
                cameraTheta = 0;
                cameraPhi = Math.PI / 4;
                cameraRadius = 100;
                followingPlanet = null;
                cameraMode = 'free';
                updateCameraPosition();
            });
        }

        function setupThemeToggle() {
            const themeToggle = document.getElementById('themeToggle');
            
            themeToggle.addEventListener('click', () => {
                isDarkMode = !isDarkMode;
                document.body.classList.toggle('light-mode', !isDarkMode);
                themeToggle.textContent = isDarkMode ? '🌙 Dark Mode' : '☀️ Light Mode';
                
                // Update scene background and stars
                updateSceneBackground();
                createEnhancedStars();
                
                // Update orbit colors
                scene.children.forEach(child => {
                    if (child.userData && child.userData.type === 'orbit') {
                        child.material.color.setHex(isDarkMode ? 0x444444 : 0x666666);
                    }
                });
                
                // Update planet labels
                setTimeout(() => {
                    // Remove old labels
                    planets.forEach(planet => {
                        const oldLabel = planet.children.find(child => child.userData && child.userData.type === 'label');
                        if (oldLabel) {
                            planet.remove(oldLabel);
                        }
                    });
                    
                    const oldSunLabel = sun.children.find(child => child.userData && child.userData.type === 'label');
                    if (oldSunLabel) {
                        sun.remove(oldSunLabel);
                    }
                    
                    // Create new labels with updated theme
                    createPlanetLabels();
                }, 100);
                
                // Update lighting
                scene.children.forEach(child => {
                    if (child.type === 'AmbientLight') {
                        child.color.setHex(isDarkMode ? 0x404040 : 0x808080);
                        child.intensity = isDarkMode ? 0.2 : 0.4;
                    }
                    if (child.type === 'PointLight') {
                        child.intensity = isDarkMode ? 2 : 1.5;
                    }
                });
            });
        }

        function createPlanetLabels() {
            // Create text labels for planets
            planets.forEach((planet, index) => {
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = 256;
                canvas.height = 64;
                
                // Set font and style
                context.font = '20px Arial';
                context.fillStyle = isDarkMode ? '#ffffff' : '#000000';
                context.textAlign = 'center';
                context.textBaseline = 'middle';
                
                // Add background
                context.fillStyle = isDarkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.9)';
                context.fillRect(0, 0, canvas.width, canvas.height);
                
                // Add text
                context.fillStyle = isDarkMode ? '#ffffff' : '#000000';
                context.fillText(planet.userData.name, canvas.width / 2, canvas.height / 2);
                
                // Create texture from canvas
                const texture = new THREE.CanvasTexture(canvas);
                texture.needsUpdate = true;
                
                // Create sprite material
                const spriteMaterial = new THREE.SpriteMaterial({ 
                    map: texture,
                    transparent: true,
                    opacity: 0.8
                });
                
                // Create sprite
                const sprite = new THREE.Sprite(spriteMaterial);
                sprite.scale.set(8, 2, 1);
                sprite.position.set(0, planet.userData.radius + 3, 0);
                sprite.userData = { type: 'label', planetName: planet.userData.name };
                
                // Add sprite to planet
                planet.add(sprite);
            });

            // Create Sun label
            const sunCanvas = document.createElement('canvas');
            const sunContext = sunCanvas.getContext('2d');
            sunCanvas.width = 256;
            sunCanvas.height = 64;
            
            sunContext.font = 'bold 24px Arial';
            sunContext.fillStyle = isDarkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.9)';
            sunContext.fillRect(0, 0, sunCanvas.width, sunCanvas.height);
            
            sunContext.fillStyle = isDarkMode ? '#ffffff' : '#000000';
            sunContext.textAlign = 'center';
            sunContext.textBaseline = 'middle';
            sunContext.fillText('Sun', sunCanvas.width / 2, sunCanvas.height / 2);
            
            const sunTexture = new THREE.CanvasTexture(sunCanvas);
            sunTexture.needsUpdate = true;
            
            const sunSpriteMaterial = new THREE.SpriteMaterial({ 
                map: sunTexture,
                transparent: true,
                opacity: 0.9
            });
            
            const sunSprite = new THREE.Sprite(sunSpriteMaterial);
            sunSprite.scale.set(10, 2.5, 1);
            sunSprite.position.set(0, 6, 0);
            sunSprite.userData = { type: 'label', planetName: 'Sun' };
            
            sun.add(sunSprite);
        }

        function updatePlanetLabels() {
            // Update label visibility based on camera distance
            const cameraPosition = camera.position;
            
            planets.forEach(planet => {
                const distance = cameraPosition.distanceTo(planet.position);
                const label = planet.children.find(child => child.userData && child.userData.type === 'label');
                
                if (label) {
                    // Fade labels based on distance
                    const maxDistance = 150;
                    const minDistance = 20;
                    let opacity = 1;
                    
                    if (distance > maxDistance) {
                        opacity = 0;
                    } else if (distance > minDistance) {
                        opacity = 1 - (distance - minDistance) / (maxDistance - minDistance);
                    }
                    
                    label.material.opacity = opacity * 0.8;
                    
                    // Scale labels based on distance
                    const scale = Math.max(0.5, Math.min(2, distance / 50));
                    label.scale.set(8 * scale, 2 * scale, 1);
                }
            });

            // Update Sun label
            const sunDistance = cameraPosition.distanceTo(sun.position);
            const sunLabel = sun.children.find(child => child.userData && child.userData.type === 'label');
            
            if (sunLabel) {
                const maxDistance = 200;
                const minDistance = 30;
                let opacity = 1;
                
                if (sunDistance > maxDistance) {
                    opacity = 0;
                } else if (sunDistance > minDistance) {
                    opacity = 1 - (sunDistance - minDistance) / (maxDistance - minDistance);
                }
                
                sunLabel.material.opacity = opacity * 0.9;
                
                const scale = Math.max(0.5, Math.min(2, sunDistance / 80));
                sunLabel.scale.set(10 * scale, 2.5 * scale, 1);
            }
        }

        function addEventListeners() {
            let isDragging = false;
            let previousMousePosition = { x: 0, y: 0 };

            renderer.domElement.addEventListener('mousedown', (e) => {
                isDragging = true;
                previousMousePosition = { x: e.clientX, y: e.clientY };
            });

            renderer.domElement.addEventListener('mousemove', (e) => {
                if (isDragging && cameraMode === 'free') {
                    const deltaMove = {
                        x: e.clientX - previousMousePosition.x,
                        y: e.clientY - previousMousePosition.y
                    };
                    cameraTheta -= deltaMove.x * 0.01;
                    cameraPhi += deltaMove.y * 0.01;
                    cameraPhi = Math.max(0.1, Math.min(Math.PI - 0.1, cameraPhi));
                    updateCameraPosition();
                    previousMousePosition = { x: e.clientX, y: e.clientY };
                } else {
                    // Tooltip and highlight
                    const mouse = new THREE.Vector2(
                        (e.clientX / window.innerWidth) * 2 - 1,
                        -(e.clientY / window.innerHeight) * 2 + 1
                    );
                    const raycaster = new THREE.Raycaster();
                    raycaster.setFromCamera(mouse, camera);
                    const intersects = raycaster.intersectObjects(planets);

                    planets.forEach(p => p.material.color.setHex(p.userData.originalColor));

                    if (intersects.length > 0) {
                        const planet = intersects[0].object;
                        planet.material.color.setHex(0xFFFFFF);
                        document.getElementById('planetInfo').textContent = planet.userData.name;
                        showPlanetTooltip(planet, e);
                    } else {
                        document.getElementById('planetInfo').textContent = 'Hover over planets for info';
                        hidePlanetTooltip();
                    }
                }
            });

            renderer.domElement.addEventListener('mouseup', () => {
                isDragging = false;
            });

            renderer.domElement.addEventListener('mouseleave', () => {
                isDragging = false;
                hidePlanetTooltip();
            });

            renderer.domElement.addEventListener('click', (e) => {
                const mouse = new THREE.Vector2(
                    (e.clientX / window.innerWidth) * 2 - 1,
                    -(e.clientY / window.innerHeight) * 2 + 1
                );
                const raycaster = new THREE.Raycaster();
                raycaster.setFromCamera(mouse, camera);
                const intersects = raycaster.intersectObjects(planets);
                if (intersects.length > 0) {
                    const planet = intersects[0].object;
                    focusOnPlanet(planet.userData.index);
                }
            });

            renderer.domElement.addEventListener('wheel', (e) => {
                // Smooth zoom in/out
                let target = cameraRadius + e.deltaY * 0.04;
                target = Math.max(25, Math.min(150, target));
                animateCameraRadius(target);
            });

            window.addEventListener('resize', () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            });
        }

        function animateCameraRadius(target) {
            let start = cameraRadius;
            let t = 0, duration = 0.6; // seconds
            function zoomAnim() {
                t += 1/60;
                let prog = t/duration;
                if(prog < 1) {
                    cameraRadius = start + (target - start) * (1 - Math.pow(1-prog, 3));
                    requestAnimationFrame(zoomAnim);
                } else {
                    cameraRadius = target;
                }
            }
            zoomAnim();
        }

        function updateCameraPosition() {
            let cx = 0, cy = 0, cz = 0;
            if (followingPlanet && cameraMode === 'following') {
                cx = followingPlanet.position.x;
                cy = followingPlanet.position.y + 3;
                cz = followingPlanet.position.z;
            }
            const x = cameraRadius * Math.sin(cameraPhi) * Math.sin(cameraTheta) + cx;
            const y = cameraRadius * Math.cos(cameraPhi) + cy;
            const z = cameraRadius * Math.sin(cameraPhi) * Math.cos(cameraTheta) + cz;
            camera.position.set(x, y, z);
            camera.lookAt(cx, cy, cz);
        }

        function animate() {
            requestAnimationFrame(animate);
            if (isAnimating) {
                const delta = clock.getDelta();
                planets.forEach((planet) => {
                    const ud = planet.userData;
                    ud.angle += ud.speed * ud.currentSpeedMultiplier * animationSpeed * delta * 0.5;
                    planet.position.x = ud.distance * Math.cos(ud.angle);
                    planet.position.z = ud.distance * Math.sin(ud.angle);
                });
            }
            if (followingPlanet && cameraMode === 'following') updateCameraPosition();
            updatePlanetLabels();
            renderer.render(scene, camera);
        }

        function showPlanetTooltip(planet, event) {
            const tooltip = document.getElementById('planetTooltip');
            tooltip.classList.add('visible');
            tooltip.style.left = (event.clientX) + 'px';
            tooltip.style.top = (event.clientY - 30) + 'px';
            document.getElementById('tooltipName').textContent = planet.userData.name;
            document.getElementById('tooltipDistance').textContent = 'Distance: ' + planet.userData.realDistance + ' AU';
            document.getElementById('tooltipSpeed').textContent = 'Speed: ' + (planet.userData.currentSpeedMultiplier * planet.userData.speed).toFixed(2) + 'x';
            document.getElementById('tooltipSize').textContent = 'Size: ' + planet.userData.realSize + ' km';
        }
        function hidePlanetTooltip() {
            document.getElementById('planetTooltip').classList.remove('visible');
        }

        // Expose reset/focus for buttons
        window.resetPlanetSpeed = resetPlanetSpeed;
        window.focusOnPlanet = focusOnPlanet;
        window.resetAllPlanetSpeeds = resetAllPlanetSpeeds;
        window.focusOnSun = focusOnSun;
        window.viewFromTop = viewFromTop;
        window.viewFromSide = viewFromSide;
        window.followEarth = followEarth;

        window.onload = init;