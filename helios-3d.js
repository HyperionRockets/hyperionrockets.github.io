/* Helios 3D viewer (helios-3d.html in every language).
   Texts come from the H3D object written in each page.
   The model is helios.glb, exported from Blender in millimetres with the rocket axis on +Y. */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

const TXT = window.H3D;
const MODEL = new URL('helios.glb', import.meta.url).href;
const LOGO = new URL('logo.webp', import.meta.url).href;

const stage = document.getElementById('stage');
const loading = document.getElementById('loading');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;


// ---------- no WebGL: show a message and a link back ----------
const gl = document.createElement('canvas').getContext('webgl2') || document.createElement('canvas').getContext('webgl');
if (!gl) {
  loading.remove();
  document.getElementById('nogl').hidden = false;
  throw new Error('WebGL not available');
}


// ---------- renderer, scene, camera ----------
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.toneMapping = THREE.AgXToneMapping; renderer.toneMappingExposure = 1.05;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
stage.appendChild(renderer.domElement);

const labelRenderer = new CSS2DRenderer();
Object.assign(labelRenderer.domElement.style, { position: 'absolute', inset: '0', pointerEvents: 'none' });
stage.appendChild(labelRenderer.domElement);

const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.55;

const camera = new THREE.PerspectiveCamera(32, 1, 0.01, 50);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; controls.dampingFactor = 0.06;
controls.minDistance = 0.35; controls.maxDistance = 5; controls.maxPolarAngle = Math.PI * 0.62;
controls.autoRotate = !reduceMotion; controls.autoRotateSpeed = 0.9;

// lights: warm key with soft shadows, coral and blue rims (logo colours)
const key = new THREE.DirectionalLight(0xfff1e2, 2.4); key.position.set(1.6, 2.2, 1.9);
key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -0.0004; key.shadow.normalBias = 0.01;
Object.assign(key.shadow.camera, { left: -1, right: 1, top: 1.6, bottom: -0.6, near: 0.1, far: 8 });
scene.add(key);
const rimC = new THREE.DirectionalLight(0xd65a5a, 2.2); rimC.position.set(-1.6, 0.9, -1.4); scene.add(rimC);
const rimB = new THREE.DirectionalLight(0x3499bd, 1.8); rimB.position.set(1.7, 0.8, -1.5); scene.add(rimB);
scene.add(new THREE.HemisphereLight(0x9fb4e8, 0x0a1631, 0.35));

const ground = new THREE.Mesh(new THREE.CircleGeometry(2.2, 64), new THREE.ShadowMaterial({ opacity: 0.38 }));
ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);


// ---------- textures drawn on a canvas ----------
function noiseFill(g, w, h, base, vary, streak) {
  g.fillStyle = base; g.fillRect(0, 0, w, h);
  for (let i = 0; i < w * h / 90; i++) {
    const x = Math.random() * w, y = Math.random() * h, a = Math.random() * 0.07;
    g.fillStyle = Math.random() < 0.5 ? `rgba(255,230,200,${a})` : `rgba(40,20,5,${a})`;
    g.fillRect(x, y, 1 + Math.random() * vary, streak * (0.5 + Math.random()));
  }
}

// kraft tube with the spiral seam, the logo and the name
function kraftTexture(logoImg) {
  const W = 1024, H = 3584, c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d');
  noiseFill(g, W, H, '#7A4C2B', 2, 60);
  g.strokeStyle = 'rgba(60,35,18,0.55)'; g.lineWidth = 3;   // spiral seam, 105 mm pitch on 864 mm
  const turns = 864 / 105;
  for (let k = -1; k <= Math.ceil(turns) + 1; k++) {
    g.beginPath();
    for (let u = 0; u <= 1.001; u += 0.01) g.lineTo(u * W, H - (k - u) / turns * H);
    g.stroke();
  }
  const mmU = W / 247.4, mmV = H / 864;   // px per mm around / along the tube
  const cu = 0.82 * W;                    // side that faces the first camera
  if (logoImg) {
    const lw = 70 * mmU, lh = lw * logoImg.height / logoImg.width * mmV / mmU;
    g.drawImage(logoImg, cu - lw / 2, H - 742 * mmV - lh / 2, lw, lh);
  }
  g.save(); g.translate(cu, H - 470 * mmV); g.rotate(-Math.PI / 2);
  g.fillStyle = '#13234A'; g.textAlign = 'center'; g.textBaseline = 'middle';
  if ('fontStretch' in g) g.fontStretch = 'expanded';
  g.font = `800 ${Math.round(58 * mmU)}px Archivo, sans-serif`;
  const tw = g.measureText('HELIOS').width;
  g.scale(300 * mmV / tw, 1); g.fillText('HELIOS', 0, 0); g.restore();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}

function woodTexture() {
  const W = 512, H = 1024, c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d'); g.fillStyle = '#B48855'; g.fillRect(0, 0, W, H);
  for (let x = 0; x < W; x += 2) {
    const d = Math.sin(x * 0.11) * 0.5 + Math.sin(x * 0.037 + 1.3) * 0.5;
    g.strokeStyle = d > 0.35 ? 'rgba(120,80,40,0.35)' : 'rgba(225,195,150,0.18)';
    g.beginPath(); g.moveTo(x, 0);
    for (let y = 0; y <= H; y += 32) g.lineTo(x + Math.sin(y * 0.01 + x * 0.05) * 6, y);
    g.stroke();
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
}

// UVs from positions (mm)
function cylUV(geo, len) {
  const p = geo.attributes.position, uv = new Float32Array(p.count * 2);
  for (let i = 0; i < p.count; i++) {
    uv[2 * i] = (Math.atan2(-p.getZ(i), p.getX(i)) / (2 * Math.PI) + 1) % 1;
    uv[2 * i + 1] = p.getY(i) / len;
  }
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
}
function planarUV(geo, su, sv) {
  const p = geo.attributes.position, uv = new Float32Array(p.count * 2);
  for (let i = 0; i < p.count; i++) { uv[2 * i] = p.getX(i) / su; uv[2 * i + 1] = p.getY(i) / sv; }
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
}

const mats = {
  petg: new THREE.MeshPhysicalMaterial({ color: 0x16264f, roughness: 0.32, clearcoat: 0.5, clearcoatRoughness: 0.15 }),
  phen: new THREE.MeshStandardMaterial({ color: 0x6b4a2f, roughness: 0.6 }),
  al: new THREE.MeshStandardMaterial({ color: 0xc9ced6, roughness: 0.3, metalness: 1 }),
  steel: new THREE.MeshStandardMaterial({ color: 0x9aa1aa, roughness: 0.25, metalness: 1 }),
  delrin: new THREE.MeshStandardMaterial({ color: 0x1b1d22, roughness: 0.4 }),
};


// ---------- exploded view: how far each group moves (metres) ----------
// Part names are the object names in Blender.
const GROUPS = {
  nose:   { match: n => n === 'Ojiva', axial: 0.47 },
  piston: { match: n => n === 'Piston', axial: 0.52 },
  body:   { match: n => n === 'Cos principal', axial: 0 },
  mmt:    { match: n => /^(Portamotor|Anell|Retenidor|Cargol)/.test(n), axial: -0.43, dy: 0.07 },
  fins:   { match: n => /^Fin/.test(n), axial: -0.43, radial: 0.11, dy: -0.07 },
  rails:  { match: n => /^Rail/.test(n), axial: 0 },
};
const parts = [];          // { obj, base, dir, group }
const labelAnchors = [];
const LIFT = 0.45;         // exploded parts are lifted so the tail stays above the floor

let explode = 0, explodeTarget = 0, showLabels = true, rocketRoot = null, lastSpread = 1, dirty = true;


// ---------- load ----------
const pct = document.getElementById('pct');
const loadModel = new GLTFLoader().loadAsync(MODEL, e => {
  if (e.total) pct.textContent = ' ' + Math.round(e.loaded / e.total * 100) + ' %';
});
const loadLogo = new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = LOGO; });
const loadFont = document.fonts ? document.fonts.load('800 40px Archivo').catch(() => {}) : Promise.resolve();

Promise.all([loadModel, loadLogo, loadFont]).then(([gltf, logoImg]) => {
  const root = gltf.scene;
  const wood = woodTexture();
  root.traverse(o => {
    if (!o.isMesh) return;
    o.castShadow = o.receiveShadow = true;
    const n = o.name.replace(/_/g, ' ');   // the loader turns spaces into underscores
    if (n === 'Cos principal') { cylUV(o.geometry, 864); o.material = new THREE.MeshPhysicalMaterial({ map: kraftTexture(logoImg), roughness: 0.48, clearcoat: 0.35, clearcoatRoughness: 0.2 }); }
    else if (n === 'Ojiva') o.material = mats.petg;
    else if (/^Fin|^Anell/.test(n)) { planarUV(o.geometry, 160, 200); o.material = new THREE.MeshPhysicalMaterial({ map: wood, roughness: 0.5, clearcoat: 0.25 }); }
    else if (/^Piston|^Portamotor/.test(n)) o.material = mats.phen;
    else if (/^Retenidor/.test(n)) o.material = mats.al;
    else if (/^Cargol/.test(n)) o.material = mats.steel;
    else if (/^Rail/.test(n)) o.material = mats.delrin;
    for (const [g, def] of Object.entries(GROUPS)) {
      if (!def.match(n)) continue;
      const dir = new THREE.Vector3(0, def.axial, 0);
      if (def.radial) dir.add(new THREE.Vector3(1, 0, 0).applyQuaternion(o.quaternion).multiplyScalar(def.radial));   // fins move out
      parts.push({ obj: o, base: o.position.clone(), dir, group: g });
    }
  });
  root.position.y = 0.0145;   // standing on the fin tips
  rocketRoot = root;
  scene.add(root);

  // part names, placed beside each group
  root.updateMatrixWorld(true);
  for (const [g, def] of Object.entries(GROUPS)) {
    const text = TXT.parts[g];
    if (!text) continue;
    const box = new THREE.Box3();
    parts.filter(p => p.group === g).forEach(p => box.expandByObject(p.obj));
    const el = document.createElement('div'); el.className = 'v-tag'; el.textContent = text;
    const lab = new CSS2DObject(el); lab.center.set(-0.08, 0.5);
    const anchor = new THREE.Object3D();
    anchor.position.copy(root.worldToLocal(box.getCenter(new THREE.Vector3()))).add(new THREE.Vector3(0.09, def.dy || 0, 0));
    anchor.userData = { base: anchor.position.clone(), axial: def.axial };
    anchor.add(lab); root.add(anchor); labelAnchors.push({ anchor, el });
  }
  loading.remove();
  stage.classList.add('ready');
  dirty = true;
  requestAnimationFrame(frame);
}).catch(err => {
  loading.textContent = TXT.error;
  console.error(err);
});


// ---------- size and framing ----------
let narrow = false, target = new THREE.Vector3();
function resize() {
  const w = stage.clientWidth, h = stage.clientHeight;
  renderer.setSize(w, h); labelRenderer.setSize(w, h);
  camera.aspect = w / h;
  narrow = w < 700;
  camera.fov = narrow ? 40 : 32;   // phones: wider view so the panel does not hide the rocket
  camera.updateProjectionMatrix();
  dirty = true;
}
resize();
// phones: aim below the rocket so it shows higher up, above the panel
target = narrow ? new THREE.Vector3(0, 0.36, 0) : new THREE.Vector3(-0.12, 0.6, 0);
if (narrow) camera.position.set(1.62, 0.8, 2.94); else camera.position.set(1.03, 0.85, 2.05);
controls.target.copy(target);
addEventListener('resize', resize);
controls.addEventListener('change', () => { dirty = true; });


// ---------- controls ----------
const slider = document.getElementById('explode'), out = document.getElementById('explodeOut');
const spinBtn = document.getElementById('spin'), labBtn = document.getElementById('labels');
if (reduceMotion) spinBtn.setAttribute('aria-pressed', 'false');

slider.addEventListener('input', () => {
  explodeTarget = slider.value / 100; out.textContent = slider.value + ' %';
  controls.autoRotate = false; spinBtn.setAttribute('aria-pressed', 'false');
  dirty = true;
});
spinBtn.addEventListener('click', () => {
  controls.autoRotate = !controls.autoRotate;
  spinBtn.setAttribute('aria-pressed', String(controls.autoRotate));
  dirty = true;
});
labBtn.addEventListener('click', () => {
  showLabels = !showLabels;
  labBtn.setAttribute('aria-pressed', String(showLabels));
  dirty = true;
});


// ---------- loop: only draws when something moves ----------
const clock = new THREE.Clock();
function frame() {
  requestAnimationFrame(frame);
  const dt = Math.min(clock.getDelta(), 0.1);

  if (explode !== explodeTarget) {
    explode += (explodeTarget - explode) * (reduceMotion ? 1 : 1 - Math.exp(-dt * 7));
    if (Math.abs(explodeTarget - explode) < 0.0005) explode = explodeTarget;
    const e = explode * explode * (3 - 2 * explode);   // smoothstep
    for (const p of parts) p.obj.position.copy(p.base).addScaledVector(p.dir, e);
    if (rocketRoot) rocketRoot.position.y = 0.0145 + LIFT * e;
    // keep the whole stack in view
    const spread = 1 + (narrow ? 0.95 : 0.8) * e;
    const off = camera.position.clone().sub(controls.target);
    controls.target.y = target.y + (narrow ? 0.15 : 0.5) * e;
    camera.position.copy(controls.target).addScaledVector(off, spread / lastSpread);
    lastSpread = spread;
    for (const { anchor } of labelAnchors) {
      anchor.position.copy(anchor.userData.base); anchor.position.y += anchor.userData.axial * e;
    }
    dirty = true;
  }

  if (controls.update()) dirty = true;   // true while turning, damping or auto-rotating
  if (!dirty) return;
  dirty = false;

  const op = showLabels ? Math.min(1, Math.max(0, (explode - 0.35) / 0.4)).toFixed(2) : '0';
  for (const { el } of labelAnchors) el.style.opacity = op;
  renderer.render(scene, camera); labelRenderer.render(scene, camera);
}
