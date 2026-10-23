"use client";

import { useEffect, useRef } from "react";

// The hero: a sphere of agents. Points are the network, arcs are who talks to whom, and the
// bright packets are work moving between them. It turns slowly and leans toward the pointer.
// three.js is loaded after the page has painted, so the name and the buttons never wait for it.

export function NetworkSphere() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    let disposed = false;
    let cleanup = () => {};

    import("three").then((THREE) => {
      if (disposed) return;
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const small = innerWidth < 760;
      const css = getComputedStyle(canvas);
      const col = (v: string, f: string) => new THREE.Color(css.getPropertyValue(v).trim() || f);
      const ground = col("--ground", "#0a0d14"), ink2 = col("--ink-2", "#b4bccd"), ink = col("--ink", "#eef1f7"), line = col("--net-line", "#4a5878"), accent = col("--accent", "#d4ff3a");

      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true }); } catch { return; } // no WebGL: the hero is fine without it
      renderer.setClearColor(ground, 1);
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
      const world = new THREE.Group(); scene.add(world);

      const R = 2.15, N = small ? 1500 : 2600;
      const pos = new Float32Array(N * 3);
      for (let i = 0; i < N; i++) {
        const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * Math.PI * (3 - Math.sqrt(5));
        pos.set([Math.cos(th) * r * R, y * R, Math.sin(th) * r * R], i * 3);
      }
      const dotGeo = new THREE.BufferGeometry(); dotGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      const dotMat = new THREE.ShaderMaterial({
        transparent: true, depthWrite: false,
        uniforms: { uSize: { value: 2.2 * renderer.getPixelRatio() }, uColor: { value: ink2 } },
        vertexShader: `uniform float uSize; varying float vFront;
          void main(){ vec4 mv = modelViewMatrix * vec4(position,1.); vec3 n = normalize((modelMatrix*vec4(position,0.)).xyz);
            vFront = smoothstep(-0.6, 0.9, n.z); gl_PointSize = uSize * (0.55 + vFront*0.6); gl_Position = projectionMatrix * mv; }`,
        fragmentShader: `uniform vec3 uColor; varying float vFront;
          void main(){ float d = length(gl_PointCoord-.5); if(d>.5) discard; gl_FragColor = vec4(uColor, (0.10 + vFront*0.55) * smoothstep(.5,.2,d)); }`,
      });
      world.add(new THREE.Points(dotGeo, dotMat));

      // agents: a spread-out subset of the points, each linked to its nearest neighbours
      const A = small ? 70 : 110;
      const agents = Array.from({ length: A }, (_, i) => { const k = (i * 7919) % N; return new THREE.Vector3(pos[k * 3], pos[k * 3 + 1], pos[k * 3 + 2]); });
      const adj: number[][] = agents.map(() => []), links: [number, number][] = [];
      agents.forEach((a, i) => {
        agents.map((b, j) => [j, a.distanceTo(b)] as const).filter(([j]) => j !== i).sort((x, y) => x[1] - y[1]).slice(0, 3).forEach(([j]) => {
          if (!adj[i].includes(j)) { links.push([i, j]); adj[i].push(j); adj[j].push(i); }
        });
      });
      const arc = (a: InstanceType<typeof THREE.Vector3>, b: InstanceType<typeof THREE.Vector3>, t: number) =>
        a.clone().lerp(b, t).normalize().multiplyScalar(R * (1.01 + Math.sin(Math.PI * t) * 0.09));
      const linePts: InstanceType<typeof THREE.Vector3>[] = [];
      for (const [i, j] of links) for (let s = 0; s < 12; s++) linePts.push(arc(agents[i], agents[j], s / 12), arc(agents[i], agents[j], (s + 1) / 12));
      world.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(linePts), new THREE.LineBasicMaterial({ color: line, transparent: true, opacity: 0.55 })));
      world.add(new THREE.Points(new THREE.BufferGeometry().setFromPoints(agents.map((a) => a.clone().multiplyScalar(1.01))), new THREE.PointsMaterial({ color: ink, size: 0.055 })));

      // packets of work travelling the links
      const P = small ? 26 : 42;
      const packets = Array.from({ length: P }, (_, p) => { const a = (p * 13) % A; return { a, b: adj[a][p % adj[a].length], t: Math.random(), v: 0.25 + Math.random() * 0.35 }; });
      const pktPos = new Float32Array(P * 3);
      const pktGeo = new THREE.BufferGeometry(); pktGeo.setAttribute("position", new THREE.BufferAttribute(pktPos, 3));
      const pktMat = new THREE.ShaderMaterial({
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
        uniforms: { uSize: { value: 15 * renderer.getPixelRatio() }, uColor: { value: accent } },
        vertexShader: `uniform float uSize; void main(){ vec4 mv = modelViewMatrix*vec4(position,1.); gl_PointSize = uSize * (7.0 / -mv.z); gl_Position = projectionMatrix*mv; }`,
        fragmentShader: `uniform vec3 uColor; void main(){ float d = length(gl_PointCoord-.5); float a = smoothstep(.5,.0,d); gl_FragColor = vec4(uColor, a*a); }`,
      });
      world.add(new THREE.Points(pktGeo, pktMat));
      world.rotation.set(0.35, 0, 0.12);

      const size = () => {
        const W = canvas.clientWidth, H = canvas.clientHeight;
        renderer.setSize(W, H, false); camera.aspect = W / H;
        // beside the text on wide screens, centred behind everything on a phone
        if (W > 960) camera.setViewOffset(W, H, -W * 0.2, 0, W, H); else camera.clearViewOffset();
        camera.position.z = W > 960 ? 7.2 : 8.4;
        camera.updateProjectionMatrix();
      };
      size();
      const ro = new ResizeObserver(size); ro.observe(canvas);

      let px = 0, py = 0, ex = 0, ey = 0, last = performance.now(), running = false, raf = 0;
      const onMove = (e: PointerEvent) => { px = e.clientX / innerWidth - 0.5; py = e.clientY / innerHeight - 0.5; };
      addEventListener("pointermove", onMove);
      const step = (now: number) => {
        const dt = Math.min(0.05, (now - last) / 1000); last = now;
        ex += (px - ex) * 0.06; ey += (py - ey) * 0.06;
        world.rotation.y += dt * 0.09;
        world.rotation.x = 0.35 + ey * 0.35; world.rotation.z = 0.12 - ex * 0.2;
        for (let p = 0; p < P; p++) {
          const k = packets[p]; k.t += dt * k.v;
          if (k.t >= 1) { k.t = 0; k.a = k.b; const nb = adj[k.a]; k.b = nb[(Math.random() * nb.length) | 0]; }
          const v = arc(agents[k.a], agents[k.b], k.t); pktPos.set([v.x, v.y, v.z], p * 3);
        }
        pktGeo.attributes.position.needsUpdate = true;
        renderer.render(scene, camera);
        if (running) raf = requestAnimationFrame(step);
      };
      const setRun = (on: boolean) => {
        if (on && !running && !reduce) { running = true; last = performance.now(); raf = requestAnimationFrame(step); }
        if (!on) { running = false; cancelAnimationFrame(raf); }
      };
      step(performance.now());
      canvas.classList.add("on");
      let inView = true;
      const io = new IntersectionObserver(([e]) => { inView = e.isIntersecting; setRun(inView && !document.hidden); });
      io.observe(canvas);
      const onVis = () => setRun(inView && !document.hidden);
      document.addEventListener("visibilitychange", onVis);

      cleanup = () => {
        setRun(false); ro.disconnect(); io.disconnect();
        removeEventListener("pointermove", onMove); document.removeEventListener("visibilitychange", onVis);
        renderer.dispose();
      };
    });

    return () => { disposed = true; cleanup(); };
  }, []);

  return <canvas ref={ref} className="net" aria-hidden="true" />;
}
