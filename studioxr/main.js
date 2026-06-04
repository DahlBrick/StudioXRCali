/* ═══════════════════════════════════════════════════════════
   STUDIO XR — main.js
   Orden de carga: projects.js → members/*.js → three.js → main.js
   ═══════════════════════════════════════════════════════════ */

'use strict';

// ─── MEMBERS REGISTRY ────────────────────────────────────────
const ALL_MEMBERS = [
  typeof MEMBER_ALEJO   !== 'undefined' ? MEMBER_ALEJO   : null,
  typeof MEMBER_ANDRES  !== 'undefined' ? MEMBER_ANDRES  : null,
  typeof MEMBER_NICOLAS !== 'undefined' ? MEMBER_NICOLAS : null,
  typeof MEMBER_JULIAN  !== 'undefined' ? MEMBER_JULIAN  : null,
].filter(Boolean);

// ─── DOM READY ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderMembers();
  renderProjectCards();
  initCursor();
  initScrollLine();
  initNav();
  initReveal();
  initCardTilt();

  // Three.js scenes init after lib loads
  if (typeof THREE !== 'undefined') {
    initAllThree();
  } else {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    s.onload = initAllThree;
    document.head.appendChild(s);
  }
});

/* ════════════════════════════════════════════════════════════
   RENDER MEMBERS — from members/*.js data
   ════════════════════════════════════════════════════════════ */
function renderMembers() {
  const container = document.getElementById('members-container');
  if (!container || !ALL_MEMBERS.length) return;

  container.innerHTML = ALL_MEMBERS.map((m, i) => {
    const isReverse = i % 2 !== 0;
    const layoutClass = isReverse ? 'mlayout rev' : 'mlayout';
    const totalStr = String(ALL_MEMBERS.length).padStart(2,'0');
    const indexStr = String(m.index).padStart(2,'0');

    const skillsHTML = m.skills.map(s =>
      `<span class="msk">${s}</span>`
    ).join('');

    const linksHTML = Object.entries(m.links)
      .filter(([,v]) => v)
      .map(([k,v]) => `<a href="${v}" target="_blank" rel="noopener" class="mlnk">${capitalize(k)} ↗</a>`)
      .join('');

    const photoContent = m.photo
      ? `<img src="${m.photo}" alt="${m.name}" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0;"
           onerror="this.style.display='none'">`
      : '';

    return `
<!-- MIEMBRO: ${m.name.toUpperCase()} -->
<div class="msec" id="member-${m.id}">
  <div class="${layoutClass}">
    <div class="mphoto">
      <div class="mpbox">
        ${photoContent}
        <span class="mpinitial">${m.initial}</span>
      </div>
      <span class="mnum">${String(i+1).padStart(2,'0')}</span>
    </div>
    <div class="mcont rv">
      <p class="midx">Miembro ${indexStr} / ${totalStr}</p>
      <p class="mrtag">${m.role}</p>
      <h2 class="mnameb">${m.name}</h2>
      <p class="mbio">${m.bio}</p>
      <div class="msr">${skillsHTML}</div>
      <div class="mlinks">${linksHTML || '<span style="color:var(--wm);font-family:var(--fm);font-size:10px">Links próximamente</span>'}</div>
    </div>
  </div>
</div>`;
  }).join('\n');

  // Re-observe new .rv elements
  initReveal();
}

/* ════════════════════════════════════════════════════════════
   RENDER PROJECT CARDS — from data/projects.js
   ════════════════════════════════════════════════════════════ */
function renderProjectCards() {
  const grid = document.querySelector('.pgrid');
  if (!grid || typeof PROJECTS === 'undefined') return;

  grid.innerHTML = PROJECTS.map((p, i) => {
    const spanClass = p.featured ? ' class="pcard rv" style="grid-column:span 2;aspect-ratio:16/7"'
                                 : ' class="pcard rv"';
    const tagsHTML = p.tags.map(t => `<span style="font-family:var(--fm);font-size:8px;letter-spacing:1px;text-transform:uppercase;color:var(--wm);border:1px solid var(--wf);padding:3px 8px;">${t}</span>`).join('');
    return `
<div${spanClass}>
  <div class="tilt-glare"></div>
  <div class="pph">
    ${p.image
      ? `<img src="${p.image}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0;opacity:.7;" onerror="this.style.display='none'">`
      : ''}
    <span class="ppt">0${i+1}</span>
  </div>
  <div class="pov">
    <p class="pcat">${p.category}</p>
    <h3 class="ptitle">${p.title}</h3>
    <p class="pdesc">${p.desc}</p>
    <div style="display:flex;gap:6px;margin-top:10px;flex-wrap:wrap">${tagsHTML}</div>
  </div>
  <div class="parr">↗</div>
</div>`;
  }).join('');

  // Re-init tilt on new cards
  initCardTilt();
}

/* ════════════════════════════════════════════════════════════
   CURSOR
   ════════════════════════════════════════════════════════════ */
function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; });
  (function animCursor() {
    rx += (mx-rx)*0.14; ry += (my-ry)*0.14;
    dot.style.left  = mx+'px'; dot.style.top  = my+'px';
    ring.style.left = rx+'px'; ring.style.top = ry+'px';
    requestAnimationFrame(animCursor);
  })();
  document.addEventListener('mouseleave', () => { dot.style.opacity=0; ring.style.opacity=0; });
  document.addEventListener('mouseenter', () => { dot.style.opacity=1; ring.style.opacity=1; });
}

/* ════════════════════════════════════════════════════════════
   SCROLL LINE
   ════════════════════════════════════════════════════════════ */
function initScrollLine() {
  const line = document.getElementById('scroll-line');
  if (!line) return;
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    line.style.width = pct + '%';
  }, { passive: true });
}

/* ════════════════════════════════════════════════════════════
   NAV
   ════════════════════════════════════════════════════════════ */
function initNav() {
  const hbg = document.getElementById('hbg');
  const mob = document.getElementById('mob');
  if (hbg && mob) {
    hbg.addEventListener('click', () => {
      hbg.classList.toggle('open');
      mob.classList.toggle('open');
    });
  }
  window.cm = function() {
    hbg && hbg.classList.remove('open');
    mob && mob.classList.remove('open');
  };
  const nas = document.querySelectorAll('.nlinks a');
  window.addEventListener('scroll', () => {
    let cur = '';
    document.querySelectorAll('section[id]').forEach(s => {
      if (window.scrollY >= s.offsetTop - 80) cur = s.id;
    });
    nas.forEach(a => {
      a.style.color = a.getAttribute('href') === '#'+cur ? 'var(--orange)' : '';
    });
  }, { passive: true });
}

/* ════════════════════════════════════════════════════════════
   SCROLL REVEAL
   ════════════════════════════════════════════════════════════ */
function initReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('vis'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.rv:not(.vis)').forEach(el => io.observe(el));
}

/* ════════════════════════════════════════════════════════════
   CARD TILT 3D
   ════════════════════════════════════════════════════════════ */
function initCardTilt() {
  document.querySelectorAll('.pcard').forEach(card => {
    if (card.dataset.tilt) return; // already initialized
    card.dataset.tilt = '1';
    const glare = card.querySelector('.tilt-glare');
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top)  / r.height;
      const rY = (x - 0.5) * 18;
      const rX = (y - 0.5) * -14;
      card.style.transform    = `perspective(800px) rotateX(${rX}deg) rotateY(${rY}deg) scale3d(1.02,1.02,1.02)`;
      card.style.transition   = 'transform .08s ease';
      if (glare) {
        glare.style.background = `radial-gradient(circle at ${x*100}% ${y*100}%, rgba(255,255,255,0.09) 0%, transparent 60%)`;
        glare.style.opacity    = '1';
      }
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform  = 'perspective(800px) rotateX(0) rotateY(0) scale3d(1,1,1)';
      card.style.transition = 'transform .4s ease';
      if (glare) glare.style.opacity = '0';
    });
  });
}

/* ════════════════════════════════════════════════════════════
   THREE.JS — ALL SCENES
   ════════════════════════════════════════════════════════════ */
function initAllThree() {
  initHeroScene();
  initSectionParticles();
  initMidScene();
  initGallery3D();
}

/* ── HERO ICOSAHEDRON ──────────────────────────────────────── */
function initHeroScene() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const sec = document.getElementById('hero');
  let W = sec.offsetWidth, H = sec.offsetHeight;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(W, H);
  renderer.setClearColor(0x000000, 0);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, W/H, 0.1, 100);
  camera.position.set(0, 0, 5);

  const ico = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2.2, 1),
    new THREE.MeshBasicMaterial({ color:0xE8600A, wireframe:true, transparent:true, opacity:0.18 })
  );
  scene.add(ico);

  const ico2 = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.1, 0),
    new THREE.MeshBasicMaterial({ color:0xE8600A, wireframe:true, transparent:true, opacity:0.09 })
  );
  scene.add(ico2);

  const pCount = 140, pos = new Float32Array(pCount*3);
  for (let i=0; i<pCount; i++) {
    pos[i*3]   = (Math.random()-.5)*16;
    pos[i*3+1] = (Math.random()-.5)*16;
    pos[i*3+2] = (Math.random()-.5)*8;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({
    color:0xE8600A, size:0.032, transparent:true, opacity:0.3
  })));

  let tx=0, ty=0;
  document.addEventListener('mousemove', e => {
    tx = (e.clientX/innerWidth  - 0.5) * 0.7;
    ty = (e.clientY/innerHeight - 0.5) * 0.5;
  });
  window.addEventListener('resize', () => {
    W = sec.offsetWidth; H = sec.offsetHeight;
    camera.aspect = W/H; camera.updateProjectionMatrix();
    renderer.setSize(W, H);
  }, { passive:true });

  let t = 0;
  (function tick() {
    requestAnimationFrame(tick);
    t += 0.005;
    const sp = Math.min(window.scrollY / sec.offsetHeight, 1);
    const sc = 1 + sp * 1.4;
    ico.scale.set(sc, sc, sc);
    ico2.scale.set(sc*.9, sc*.9, sc*.9);
    ico.material.opacity  = 0.18 * (1 - sp*0.9);
    ico2.material.opacity = 0.09 * (1 - sp*0.95);
    ico.rotation.x  = t*.4 + ty + sp*Math.PI*.5;
    ico.rotation.y  = t*.6 + tx + sp*Math.PI;
    ico2.rotation.x = -t*.5;
    ico2.rotation.y =  t*.8;
    camera.position.x += (tx*.8 - camera.position.x) * .04;
    camera.position.y += (-ty*.8- camera.position.y) * .04;
    renderer.render(scene, camera);
  })();
}

/* ── SECTION PARTICLES (parallax) ─────────────────────────── */
function initSectionParticles() {
  const ids    = ['empresa','servicios','proyectos','equipo'];
  const colors = [0xE8600A, 0xFF8040, 0xE8600A, 0xFF6020];

  ids.forEach((id, idx) => {
    const sec    = document.getElementById(id);
    const canvas = document.getElementById('particles-'+id);
    if (!sec || !canvas) return;

    let W = sec.offsetWidth, H = sec.offsetHeight;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias:false, alpha:true });
    renderer.setPixelRatio(1);
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W/H, 0.1, 100);
    camera.position.z = 4;

    const pCount = 60 + idx*15;
    const positions = new Float32Array(pCount*3);
    const speeds    = new Float32Array(pCount);
    for (let i=0; i<pCount; i++) {
      positions[i*3]   = (Math.random()-.5)*12;
      positions[i*3+1] = (Math.random()-.5)*8;
      positions[i*3+2] = (Math.random()-.5)*4;
      speeds[i] = 0.3 + Math.random()*.7;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions,3));
    scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({
      color: colors[idx], size:0.028, transparent:true, opacity: 0.18+idx*.03
    })));

    [[-3,1,0],[3,-1,0],[0,2,-1],[-2,-2,0]].forEach((pos, gi) => {
      const g = gi%2===0 ? new THREE.OctahedronGeometry(0.18+gi*.06,0)
                         : new THREE.TetrahedronGeometry(0.14+gi*.05,0);
      const mesh = new THREE.Mesh(g, new THREE.MeshBasicMaterial({
        color:colors[idx], wireframe:true, transparent:true, opacity:0.12+gi*.04
      }));
      mesh.position.set(...pos);
      mesh.userData.speed = 0.3 + gi*.2;
      scene.add(mesh);
    });

    window.addEventListener('resize', () => {
      W = sec.offsetWidth; H = sec.offsetHeight;
      renderer.setSize(W,H); camera.aspect=W/H; camera.updateProjectionMatrix();
    }, { passive:true });

    let t = 0;
    (function tick() {
      requestAnimationFrame(tick);
      t += 0.004;
      const rect     = sec.getBoundingClientRect();
      const parallax = (rect.top / innerHeight) * 1.2;
      camera.position.y = parallax * (0.4+idx*.15);
      camera.position.x = parallax * (0.2+idx*.1);
      scene.children.forEach(child => {
        if (child.userData.speed) {
          child.rotation.x += 0.008 * child.userData.speed;
          child.rotation.y += 0.012 * child.userData.speed;
        }
      });
      const posAttr = scene.children[0].geometry.attributes.position;
      for (let i=0; i<pCount; i++) {
        posAttr.array[i*3+1] += 0.0008 * speeds[i];
        if (posAttr.array[i*3+1] > 4) posAttr.array[i*3+1] = -4;
      }
      posAttr.needsUpdate = true;
      renderer.render(scene, camera);
    })();
  });
}

/* ── MID SCENE (morphing) ──────────────────────────────────── */
function initMidScene() {
  const container = document.getElementById('scene-3d');
  if (!container) return;
  const canvas = document.getElementById('three-scene');
  let W = container.offsetWidth, H = container.offsetHeight;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true });
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.setSize(W,H);
  renderer.setClearColor(0x000000,0);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, W/H, 0.1, 100);
  camera.position.set(0,0,6);

  const shapes = [
    new THREE.IcosahedronGeometry(2,1),
    new THREE.SphereGeometry(2,12,8),
    new THREE.BoxGeometry(2.8,2.8,2.8)
  ];
  const morphTargets  = shapes.map(g => g.attributes.position.array);
  const basePosArr    = morphTargets[0];
  const morphGeo      = new THREE.BufferGeometry();
  const morphPos      = new Float32Array(basePosArr.slice());
  morphGeo.setAttribute('position', new THREE.BufferAttribute(morphPos,3));
  const morphMesh = new THREE.Mesh(morphGeo,
    new THREE.MeshBasicMaterial({ color:0xE8600A, wireframe:true, transparent:true, opacity:0.28 })
  );
  scene.add(morphMesh);
  scene.add(new THREE.Mesh(
    new THREE.OctahedronGeometry(1.2,0),
    new THREE.MeshBasicMaterial({ color:0xFF8040, wireframe:true, transparent:true, opacity:0.32 })
  ));
  scene.add(new THREE.Mesh(
    new THREE.TetrahedronGeometry(0.65,0),
    new THREE.MeshBasicMaterial({ color:0xE8600A, wireframe:true, transparent:true, opacity:0.55 })
  ));
  [1.8,2.5].forEach((r,i) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(r,0.004,2,80),
      new THREE.MeshBasicMaterial({ color:0xE8600A, transparent:true, opacity:0.14-i*.04 })
    );
    ring.rotation.x = Math.PI/(2.5+i);
    ring.rotation.z = Math.PI*i/6;
    scene.add(ring);
  });

  let currentShape=0, targetShape=0, morphProgress=1;
  const shapeLabel = container.querySelector('.scene-label');
  const shapeNames = ['icosaedro','esfera','cubo'];

  function getTargetShape() {
    const pct = window.scrollY / document.body.scrollHeight;
    return pct < 0.35 ? 0 : pct < 0.65 ? 1 : 2;
  }

  let stx=0, sty=0;
  document.addEventListener('mousemove', e => {
    stx = (e.clientX/innerWidth  - 0.5)*1.2;
    sty = (e.clientY/innerHeight - 0.5)*0.8;
  });
  window.addEventListener('resize', () => {
    W = container.offsetWidth;
    renderer.setSize(W,H); camera.aspect=W/H; camera.updateProjectionMatrix();
  }, { passive:true });

  let t=0;
  (function tick() {
    requestAnimationFrame(tick);
    t += 0.006;
    const newTarget = getTargetShape();
    if (newTarget !== targetShape) {
      currentShape = targetShape; targetShape = newTarget; morphProgress = 0;
      if (shapeLabel) shapeLabel.textContent = shapeNames[targetShape];
    }
    morphProgress = Math.min(morphProgress + 0.018, 1);
    const ease = morphProgress < 0.5
      ? 2*morphProgress*morphProgress
      : 1 - Math.pow(-2*morphProgress+2,2)/2;
    const src = morphTargets[currentShape];
    const dst = morphTargets[targetShape];
    const vCount = Math.min(src.length, dst.length, morphPos.length);
    for (let i=0; i<vCount; i++) morphPos[i] = src[i] + (dst[i]-src[i]) * ease;
    morphGeo.attributes.position.needsUpdate = true;
    morphGeo.computeBoundingSphere();
    morphMesh.rotation.y = t*.4 + stx*.3;
    morphMesh.rotation.x = t*.25 + sty*.2;
    scene.children[1].rotation.y = -t*.7;
    scene.children[1].rotation.z =  t*.3;
    scene.children[2].rotation.x =  t*1.2;
    scene.children[2].rotation.y =  t*.9;
    scene.children.filter(c=>c.geometry&&c.geometry.type==='TorusGeometry')
      .forEach((r,i) => { r.rotation.z+=.004*(i+1); r.rotation.y+=.002*(i+1); });
    const ps = 1 + Math.sin(t*1.8)*.025;
    morphMesh.scale.set(ps,ps,ps);
    renderer.render(scene,camera);
  })();
}

/* ════════════════════════════════════════════════════════════
   THE GALLERY 3D — sala inmersiva con pantallas de proyectos
   ════════════════════════════════════════════════════════════ */
function initGallery3D() {
  const container = document.getElementById('gallery-3d');
  if (!container) return;
  if (typeof PROJECTS === 'undefined' || !PROJECTS.length) return;

  let W = container.offsetWidth;
  let H = container.offsetHeight;

  // ── Renderer ──
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(W, H);
  renderer.setClearColor(0x080809, 1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  const scene  = new THREE.Scene();
  scene.fog    = new THREE.FogExp2(0x080809, 0.055);
  const camera = new THREE.PerspectiveCamera(52, W/H, 0.1, 60);
  camera.position.set(0, 1.2, 7);
  camera.lookAt(0, 0.8, 0);

  // ── Ambient light ──
  scene.add(new THREE.AmbientLight(0xffffff, 0.06));

  // ── Floor ──
  const floorGeo = new THREE.PlaneGeometry(30, 30, 24, 24);
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x0a0a0c, roughness: 0.8, metalness: 0.4
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1.4;
  floor.receiveShadow = true;
  scene.add(floor);

  // ── Floor grid lines ──
  const gridHelper = new THREE.GridHelper(30, 30, 0xE8600A, 0x1a1a1c);
  gridHelper.position.y = -1.39;
  gridHelper.material.opacity    = 0.25;
  gridHelper.material.transparent = true;
  scene.add(gridHelper);

  // ── Ceiling subtle ──
  const ceiling = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 30),
    new THREE.MeshBasicMaterial({ color:0x080809 })
  );
  ceiling.rotation.x =  Math.PI/2;
  ceiling.position.y =  5;
  scene.add(ceiling);

  // ── Background particles (dust) ──
  const dustCount = 200;
  const dustPos   = new Float32Array(dustCount*3);
  for (let i=0; i<dustCount; i++) {
    dustPos[i*3]   = (Math.random()-.5)*20;
    dustPos[i*3+1] = Math.random()*5 - 1;
    dustPos[i*3+2] = (Math.random()-.5)*14;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos,3));
  scene.add(new THREE.Points(dustGeo, new THREE.PointsMaterial({
    color:0xE8600A, size:0.018, transparent:true, opacity:0.25
  })));

  // ── Screens — arrange in arc ──────────────────────────────
  const screens = [];
  const overlayEl = document.getElementById('gallery-overlay');

  PROJECTS.forEach((proj, i) => {
    const angle  = (i / PROJECTS.length) * Math.PI * 1.1 - Math.PI * 0.55;
    const radius = 4.8;
    const px     = Math.sin(angle) * radius;
    const pz     = -Math.cos(angle) * radius + 1;

    // Screen frame (outer border)
    const frameGeo = new THREE.BoxGeometry(2.5, 1.65, 0.06);
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x111114, roughness:0.5, metalness:0.8,
      emissive: new THREE.Color(proj.accentColor || '#E8600A'),
      emissiveIntensity: 0.08
    });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    frame.position.set(px, 0.5, pz);
    frame.lookAt(0, 0.5, 2.5);
    frame.castShadow = true;
    scene.add(frame);

    // Screen surface (inner display)
    const screenGeo = new THREE.PlaneGeometry(2.2, 1.38);
    const screenMat = new THREE.MeshStandardMaterial({
      color: 0x0c0c10, roughness:0.9, metalness:0.1,
      emissive: new THREE.Color(proj.accentColor || '#E8600A'),
      emissiveIntensity: 0.04
    });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(px, 0.5, pz + 0.04);
    screen.lookAt(0, 0.5, 2.5);
    screen.userData = { project: proj, frame, screenMat, frameMat, index: i };
    scene.add(screen);
    screens.push(screen);

    // Screen label (project number)
    // Point light per screen
    const light = new THREE.PointLight(
      new THREE.Color(proj.accentColor || '#E8600A'),
      0, 3.5
    );
    light.position.set(px, 0.5, pz + 0.3);
    scene.add(light);
    screen.userData.light = light;

    // Stand / pedestal
    const standGeo = new THREE.CylinderGeometry(0.06, 0.1, 1.4, 8);
    const standMat = new THREE.MeshStandardMaterial({ color:0x111114, roughness:0.6, metalness:0.9 });
    const stand    = new THREE.Mesh(standGeo, standMat);
    stand.position.set(px, -0.7, pz);
    scene.add(stand);

    // Number label above screen
    const numGeo = new THREE.PlaneGeometry(0.3, 0.18);
    const numMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(proj.accentColor || '#E8600A'),
      transparent:true, opacity:0.7
    });
    const numPlane = new THREE.Mesh(numGeo, numMat);
    numPlane.position.set(px, 1.48, pz + 0.05);
    numPlane.lookAt(0, 1.48, 2.5);
    scene.add(numPlane);
  });

  // ── Raycaster for hover & click ───────────────────────────
  const raycaster = new THREE.Raycaster();
  const mouse     = new THREE.Vector2(-10,-10);
  let   hovered   = null;
  let   autoRotY  = 0;
  let   userRotY  = 0;
  let   targetRotY= 0;

  container.addEventListener('mousemove', e => {
    const rect = container.getBoundingClientRect();
    mouse.x =  ((e.clientX - rect.left) / W) * 2 - 1;
    mouse.y = -((e.clientY - rect.top)  / H) * 2 + 1;
    // Subtle camera pan from mouse
    targetRotY = (mouse.x) * 0.35;
  });

  container.addEventListener('click', () => {
    if (hovered && overlayEl) {
      const p = hovered.userData.project;
      showGalleryOverlay(p, overlayEl);
    }
  });

  // Keyboard nav
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  autoRotY -= 0.3;
    if (e.key === 'ArrowRight') autoRotY += 0.3;
    if (e.key === 'Escape' && overlayEl) overlayEl.classList.remove('active');
  });

  window.addEventListener('resize', () => {
    W = container.offsetWidth; H = container.offsetHeight;
    renderer.setSize(W,H); camera.aspect=W/H; camera.updateProjectionMatrix();
  }, { passive:true });

  // ── Render loop ───────────────────────────────────────────
  let t = 0;
  (function tick() {
    requestAnimationFrame(tick);
    t += 0.008;

    // Scroll parallax: rotate gallery scene with scroll
    const galleryRect = container.getBoundingClientRect();
    const scrollInfluence = -(galleryRect.top / innerHeight) * 0.4;

    // Auto-rotate + user offset
    autoRotY += 0.0018;
    userRotY += (targetRotY - userRotY) * 0.06;

    // Camera orbit
    const totalRot = autoRotY + userRotY + scrollInfluence;
    camera.position.x = Math.sin(totalRot) * 0.8;
    camera.position.z = 7 + Math.cos(totalRot) * 0.4;
    camera.lookAt(0, 0.8, 0);

    // Dust drift
    const dustAttr = dustGeo.attributes.position;
    for (let i=0; i<dustCount; i++) {
      dustAttr.array[i*3+1] += 0.0006;
      if (dustAttr.array[i*3+1] > 4) dustAttr.array[i*3+1] = -1.2;
    }
    dustAttr.needsUpdate = true;

    // Raycasting
    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(screens);

    if (hovered) {
      hovered.userData.light.intensity = 0.5 + Math.sin(t*3)*0.15;
      hovered.userData.frameMat.emissiveIntensity = 0.25 + Math.sin(t*2)*0.05;
      hovered.userData.screenMat.emissiveIntensity = 0.14;
      if (container.style.cursor !== 'pointer') container.style.cursor = 'pointer';
    }

    if (hits.length > 0) {
      const newHovered = hits[0].object;
      if (newHovered !== hovered) {
        if (hovered) resetScreen(hovered);
        hovered = newHovered;
        hovered.userData.light.intensity = 0.7;
        hovered.userData.frameMat.emissiveIntensity = 0.3;
        // Scale up frame slightly
        hovered.userData.frame.scale.set(1.04,1.04,1.04);
      }
    } else {
      if (hovered) { resetScreen(hovered); hovered = null; container.style.cursor = 'default'; }
    }

    // Idle screen pulse
    screens.forEach((s,i) => {
      if (s === hovered) return;
      s.userData.light.intensity      = 0.08 + Math.sin(t*1.2 + i*1.1)*0.04;
      s.userData.screenMat.emissiveIntensity = 0.02 + Math.sin(t*.8+i)*.015;
    });

    renderer.render(scene, camera);
  })();

  function resetScreen(s) {
    s.userData.light.intensity             = 0.08;
    s.userData.frameMat.emissiveIntensity  = 0.08;
    s.userData.screenMat.emissiveIntensity = 0.04;
    s.userData.frame.scale.set(1,1,1);
  }
}

/* ── GALLERY OVERLAY (2D info panel) ─────────────────────── */
function showGalleryOverlay(project, overlayEl) {
  const tagsHTML = project.tags.map(t =>
    `<span style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:1px;text-transform:uppercase;color:rgba(232,96,10,0.8);border:1px solid rgba(232,96,10,0.3);padding:4px 10px">${t}</span>`
  ).join('');
  const membersHTML = project.members.map(id => {
    const m = ALL_MEMBERS.find(m => m.id === id);
    return m ? `<span style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:1px;text-transform:uppercase;color:rgba(240,237,232,0.5)">${m.name}</span>` : '';
  }).join('');

  overlayEl.innerHTML = `
    <div class="gallery-overlay-inner">
      <button class="gallery-close" onclick="document.getElementById('gallery-overlay').classList.remove('active')">✕</button>
      <p style="font-family:'Space Mono',monospace;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#E8600A;margin-bottom:14px">
        — Proyecto
      </p>
      <h2 style="font-family:'Black Han Sans',sans-serif;font-size:clamp(32px,5vw,56px);line-height:.95;letter-spacing:1px;text-transform:uppercase;margin-bottom:18px">
        ${project.title}
      </h2>
      <p style="font-family:'Space Mono',monospace;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#E8600A;margin-bottom:16px">
        ${project.category}
      </p>
      <p style="font-size:15px;color:rgba(240,237,232,0.6);font-weight:300;line-height:1.75;margin-bottom:28px;max-width:500px">
        ${project.desc}
      </p>
      <div style="display:flex;gap:7px;flex-wrap:wrap;margin-bottom:20px">${tagsHTML}</div>
      ${membersHTML ? `<p style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:rgba(240,237,232,0.28);margin-bottom:28px">Equipo: ${membersHTML}</p>` : ''}
      ${project.link ? `<a href="${project.link}" target="_blank" rel="noopener" style="font-family:'Space Mono',monospace;font-size:10px;letter-spacing:2px;text-transform:uppercase;background:#E8600A;color:#090909;padding:12px 28px;text-decoration:none;display:inline-block;font-weight:700">Ver proyecto ↗</a>` : ''}
    </div>`;
  overlayEl.classList.add('active');
}

/* ─── helpers ─── */
function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
