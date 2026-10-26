// Full-page 3D scene — a fixed WebGL canvas behind the page. The camera flies down through
// monochrome wireframe solids as you scroll (three.js via CDN import map, no build step).
import * as THREE from 'three';

const canvas = document.getElementById('scene');
if (canvas) init(canvas);

function init(canvas) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch (e) {
    canvas.remove();
    return;
  }

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const INK = 0x0e0e0e;
  const MID = 0x8c8a84;
  const PAPER = 0xeceae5;
  const DEPTH = 36; // world units the camera travels over a full page scroll

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.z = 9;

  // Every part is a paper-coloured solid (hides back edges) with ink edge lines, like a workshop-manual drawing.
  function part(geo, angle = 25, opacity = 0.7) {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: PAPER, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 })));
    g.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo, angle), new THREE.LineBasicMaterial({ color: INK, transparent: true, opacity })));
    return g;
  }
  const inkMat = new THREE.MeshBasicMaterial({ color: INK, side: THREE.DoubleSide });
  const lathe = (pts, seg = 48) => new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), seg);
  const polar = (r, a) => new THREE.Vector2(Math.cos(a) * r, Math.sin(a) * r);

  // Alloy wheel + tyre (axis = y): treaded tyre profile, rim barrel, five twin-spoke face, lug nuts.
  function wheel() {
    const g = new THREE.Group();
    g.add(part(lathe([
      [0.62, -0.2], [0.66, -0.23], [0.8, -0.25], [0.93, -0.2], [0.985, -0.16], [1, -0.14], [1, -0.07], [0.97, -0.05],
      [0.97, 0.05], [1, 0.07], [1, 0.14], [0.985, 0.16], [0.93, 0.2], [0.8, 0.25], [0.66, 0.23], [0.62, 0.2], [0.62, -0.2],
    ], 48), 2, 0.6));
    g.add(part(lathe([[0.54, -0.17], [0.62, -0.17], [0.64, -0.14], [0.62, -0.1], [0.6, -0.1], [0.6, 0.1], [0.62, 0.1], [0.64, 0.14], [0.62, 0.17], [0.54, 0.17]], 48), 5));
    for (let k = 0; k < 5; k++) {
      for (const off of [-0.11, 0.11]) {
        const phi = (k * 2 * Math.PI) / 5 + off;
        const spoke = part(new THREE.BoxGeometry(0.46, 0.05, 0.075), 20, 0.9);
        spoke.position.set(Math.cos(phi) * 0.37, 0.07, Math.sin(phi) * 0.37);
        spoke.rotation.y = -phi;
        g.add(spoke);
      }
    }
    const hub = part(new THREE.CylinderGeometry(0.17, 0.17, 0.14, 24), 20, 0.9);
    hub.position.y = 0.07;
    g.add(hub);
    for (let k = 0; k < 5; k++) {
      const a = (k * 2 * Math.PI) / 5 + Math.PI / 5;
      const nut = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.03, 6), inkMat);
      nut.position.set(Math.cos(a) * 0.105, 0.15, Math.sin(a) * 0.105);
      g.add(nut);
    }
    return g;
  }

  // Drilled brake rotor with hat + caliper (axis = y).
  function rotor() {
    const g = new THREE.Group();
    g.add(part(lathe([[0, 0.2], [0.3, 0.2], [0.42, 0.06], [1, 0.06], [1, -0.06], [0.42, -0.06], [0, -0.06]], 64), 8));
    const holes = new THREE.InstancedMesh(new THREE.CircleGeometry(0.035, 10), inkMat, 80);
    const d = new THREE.Object3D();
    let n = 0;
    for (const face of [1, -1]) {
      for (const [r, count, phase] of [[0.62, 20, 0], [0.82, 20, 0.5]]) {
        for (let k = 0; k < count; k++) {
          const a = ((k + phase) / count) * Math.PI * 2;
          d.position.set(Math.cos(a) * r, face * 0.0615, Math.sin(a) * r);
          d.rotation.set(-face * Math.PI / 2, 0, 0);
          d.updateMatrix();
          holes.setMatrixAt(n++, d.matrix);
        }
      }
    }
    g.add(holes);
    const sector = new THREE.Shape();
    sector.absarc(0, 0, 1.12, -0.5, 0.5, false);
    sector.absarc(0, 0, 0.72, 0.5, -0.5, true);
    const cal = new THREE.ExtrudeGeometry(sector, { depth: 0.32, bevelEnabled: false, curveSegments: 16 });
    cal.translate(0, 0, -0.16);
    cal.rotateX(Math.PI / 2);
    g.add(part(cal, 20, 0.85));
    return g;
  }

  // Coil-over shock: helical spring, damper body + rod, spring perches (axis = y).
  function shock() {
    const g = new THREE.Group();
    class Helix extends THREE.Curve {
      getPoint(t, target = new THREE.Vector3()) {
        const a = t * 6.5 * Math.PI * 2;
        return target.set(Math.cos(a) * 0.62, (t - 0.5) * 3.2, Math.sin(a) * 0.62);
      }
    }
    // line-work only: a solid fill would hide the back half of each coil
    g.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.TubeGeometry(new Helix(), 130, 0.07, 6, false), 1), new THREE.LineBasicMaterial({ color: INK, transparent: true, opacity: 0.6 })));
    const body = part(new THREE.CylinderGeometry(0.2, 0.2, 1.7, 20), 20, 0.9);
    body.position.y = -0.75;
    const rod = part(new THREE.CylinderGeometry(0.07, 0.07, 1.8, 14), 20, 0.9);
    rod.position.y = 0.9;
    g.add(body, rod);
    for (const y of [-1.62, 1.62]) {
      const perch = part(new THREE.CylinderGeometry(0.78, 0.78, 0.06, 32), 20, 0.9);
      perch.position.y = y;
      g.add(perch);
    }
    return g;
  }

  // Steering wheel (axis = z): rim, hub, T-spokes, 12 o'clock marker.
  function steering() {
    const g = new THREE.Group();
    g.add(part(new THREE.TorusGeometry(1, 0.11, 10, 56), 8, 0.7));
    const hub = part(new THREE.CylinderGeometry(0.3, 0.3, 0.16, 24), 20, 0.9);
    hub.rotation.x = Math.PI / 2;
    g.add(hub);
    for (const [w, h, x, y] of [[0.74, 0.1, -0.64, 0], [0.74, 0.1, 0.64, 0], [0.1, 0.62, 0, -0.6]]) {
      const sp = part(new THREE.BoxGeometry(w, h, 0.08), 20, 0.9);
      sp.position.set(x, y, 0);
      g.add(sp);
    }
    const mark = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.12, 0.1), inkMat);
    mark.position.set(0, 1, 0);
    g.add(mark);
    return g;
  }

  // Spur gear (axis = z): 20 involute-ish teeth, bore, five lightening holes.
  function gear() {
    const N = 20;
    const step = (Math.PI * 2) / N;
    const shape = new THREE.Shape();
    const outline = [];
    for (let i = 0; i < N; i++) {
      const a = i * step;
      outline.push(polar(1.0, a - 0.3 * step), polar(1.2, a - 0.14 * step), polar(1.2, a + 0.14 * step), polar(1.0, a + 0.3 * step));
    }
    shape.setFromPoints(outline);
    const bore = new THREE.Path();
    bore.absarc(0, 0, 0.24, 0, Math.PI * 2, true);
    shape.holes.push(bore);
    for (let k = 0; k < 5; k++) {
      const c = polar(0.62, (k * Math.PI * 2) / 5);
      const hole = new THREE.Path();
      hole.absarc(c.x, c.y, 0.17, 0, Math.PI * 2, true);
      shape.holes.push(hole);
    }
    const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.34, bevelEnabled: false, curveSegments: 20 });
    geo.translate(0, 0, -0.17);
    const g = new THREE.Group();
    g.add(part(geo, 15, 0.85));
    return g;
  }

  // Piston (axis = y): crown, ring grooves, skirt, wrist pin.
  function piston() {
    const g = new THREE.Group();
    g.add(part(lathe([
      [0, 1.0], [0.64, 1.0], [0.66, 0.97], [0.66, 0.86], [0.58, 0.86], [0.58, 0.8], [0.66, 0.8], [0.66, 0.7], [0.58, 0.7],
      [0.58, 0.64], [0.66, 0.64], [0.66, 0.54], [0.58, 0.54], [0.58, 0.48], [0.66, 0.48], [0.66, -0.8], [0, -0.8],
    ], 32), 4, 0.6));
    const pin = part(new THREE.CylinderGeometry(0.14, 0.14, 1.5, 18), 20, 0.9);
    pin.rotation.z = Math.PI / 2;
    pin.position.y = -0.2;
    g.add(pin);
    // connecting rod: beam + big-end eye (crankpin axis parallel to the wrist pin)
    const beam = part(new THREE.BoxGeometry(0.16, 1.5, 0.3), 20, 0.9);
    beam.position.y = -1.0;
    const eye = part(new THREE.TorusGeometry(0.36, 0.1, 10, 28), 20, 0.9);
    eye.rotation.y = Math.PI / 2;
    eye.position.y = -1.8;
    g.add(beam, eye);
    g.position.y = 0.6; // re-centre on the spin axis
    const wrap = new THREE.Group();
    wrap.add(g);
    return wrap;
  }

  // x is a multiple of the half-width; y is world height down the page; tilt is the fixed pose,
  // spin is about the part's own axis.
  const specs = [
    { build: wheel, scale: 2.1, tilt: [1.15, -0.4, 0], axis: 'y', x: 0.62, y: 0, spin: 0.35 },
    { build: rotor, scale: 1.8, tilt: [1.05, 0.3, 0.2], axis: 'y', x: -0.72, y: -6, spin: 0.3 },
    { build: shock, scale: 1.1, tilt: [0.15, 0, 0.4], axis: 'y', x: 0.78, y: -12, spin: 0.3 },
    { build: steering, scale: 1.8, tilt: [-0.5, 0.45, 0], axis: 'z', x: -0.7, y: -18, spin: 0.35 },
    { build: gear, scale: 1.6, tilt: [-0.4, -0.55, 0], axis: 'z', x: 0.74, y: -24, spin: 0.3 },
    { build: piston, scale: 1.5, tilt: [0.25, 0, -0.35], axis: 'y', x: -0.74, y: -30, spin: 0.35 },
  ];
  const objects = specs.map((s, i) => {
    const spinner = s.build();
    const mesh = new THREE.Group(); // fixed pose; the inner group spins about the part's axis
    mesh.add(spinner);
    mesh.rotation.set(...s.tilt);
    scene.add(mesh);
    return { mesh, spinner, i, ...s };
  });

  // Particle field spread through the whole fly-through for depth parallax.
  const count = innerWidth < 760 ? 500 : 1400;
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 24;
    pos[i * 3 + 1] = -Math.random() * (DEPTH + 8) + 4;
    pos[i * 3 + 2] = -8 + Math.random() * 12;
  }
  const ptsGeo = new THREE.BufferGeometry();
  ptsGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  scene.add(new THREE.Points(ptsGeo, new THREE.PointsMaterial({ color: MID, size: 0.045 })));

  let half = 5; // half the visible world width at the object plane
  function resize() {
    const w = innerWidth;
    const h = innerHeight;
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    half = 9 * Math.tan((camera.fov * Math.PI) / 360) * camera.aspect;
    const small = Math.min(1, camera.aspect / 1.5);
    objects.forEach((o) => {
      o.mesh.position.x = o.x * half * (camera.aspect < 0.9 ? 0.8 : 1);
      o.mesh.position.y = o.y;
      o.mesh.scale.setScalar(o.scale * Math.max(0.5, small));
    });
    if (reduceMotion) draw(0);
  }

  const pointer = { x: 0, y: 0 };
  addEventListener('pointermove', (e) => {
    pointer.x = (e.clientX / innerWidth - 0.5) * 2;
    pointer.y = (e.clientY / innerHeight - 0.5) * 2;
  });

  const clock = new THREE.Clock();
  let camY = 0;
  let camX = 0;
  let camYTarget = 0;

  function progress() {
    const max = document.documentElement.scrollHeight - innerHeight;
    return max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
  }

  function draw(dt) {
    const p = progress();
    camYTarget = -p * DEPTH;
    const prev = camY;
    camY += (camYTarget - camY) * (reduceMotion ? 1 : Math.min(1, dt * 5));
    camX += (pointer.x * 0.8 - camX) * Math.min(1, dt * 3);
    const vel = camY - prev; // fast scrolling whips the solids around

    camera.position.set(camX + Math.sin(p * 7) * 0.7, camY - pointer.y * 0.5, 9 - Math.sin(p * Math.PI) * 1.5);
    camera.rotation.z = Math.sin(p * 5) * 0.04;

    const t = clock.getElapsedTime();
    objects.forEach((o) => {
      o.spinner.rotation[o.axis] += dt * o.spin + vel * 0.6; // fast scrolling spins them up
      o.mesh.rotation.y = o.tilt[1] + Math.sin(t * 0.4 + o.i) * 0.12;
    });
    renderer.render(scene, camera);
  }

  new ResizeObserver(resize).observe(document.documentElement);
  resize();

  if (reduceMotion) {
    addEventListener('scroll', () => draw(0), { passive: true });
    return;
  }

  let last = 0;
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
    last = now;
    if (!document.hidden) draw(dt);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
