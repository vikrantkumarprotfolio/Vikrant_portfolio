/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, ArrowLeft } from "lucide-react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";

const pdfFile = "/portfolio.pdf";

function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let edges: any[] = [];
    let chains: any[] = [];
    let mouse = { x: -1000, y: -1000 };
    let lastMouseMove = Date.now();

    const resize = () => {
      canvas.width = document.body.scrollWidth;
      canvas.height = document.body.scrollHeight;
      initEdges();
    };

    const initEdges = () => {
      const isMobile = window.innerWidth < 768;
      let S = isMobile ? 100 : 80;
      
      const area = canvas.width * canvas.height;
      if (area > 2000000) {
        S = isMobile ? 120 : 100;
      }

      const finalCols = Math.ceil(canvas.width / S) + 1;
      const finalRows = Math.ceil(canvas.height / S) + 1;

      const edgeMap = new Map();

      const addEdge = (x1: number, y1: number, x2: number, y2: number) => {
        const p1 = `${Math.round(x1)},${Math.round(y1)}`;
        const p2 = `${Math.round(x2)},${Math.round(y2)}`;
        const key = [p1, p2].sort().join('|');
        
        if (!edgeMap.has(key)) {
          edgeMap.set(key, {
            x1, y1, x2, y2,
            p1, p2,
            currentOpacity: 0,
            targetOpacity: 0,
            currentGlow: 0,
            targetGlow: 0,
            pulseOpacity: 0,
            pulseGlow: 0,
            neighbors: [] // To be populated
          });
        }
      };

      for (let col = 0; col < finalCols; col++) {
        for (let row = 0; row < finalRows; row++) {
          const baseX = col * S;
          const baseY = row * S;

          const upA = [baseX, baseY + S];
          const upB = [baseX + S, baseY + S];
          const upC = [baseX + S / 2, baseY];

          addEdge(upA[0], upA[1], upB[0], upB[1]);
          addEdge(upB[0], upB[1], upC[0], upC[1]);
          addEdge(upC[0], upC[1], upA[0], upA[1]);

          const downA = [baseX, baseY];
          const downB = [baseX + S, baseY];
          const downC = [baseX + S / 2, baseY + S];

          addEdge(downA[0], downA[1], downB[0], downB[1]);
          addEdge(downB[0], downB[1], downC[0], downC[1]);
          addEdge(downC[0], downC[1], downA[0], downA[1]);
        }
      }

      edges = Array.from(edgeMap.values());

      // Pre-calculate connectivity for performance
      const pointToEdges = new Map();
      edges.forEach(edge => {
        if (!pointToEdges.has(edge.p1)) pointToEdges.set(edge.p1, []);
        if (!pointToEdges.has(edge.p2)) pointToEdges.set(edge.p2, []);
        pointToEdges.get(edge.p1).push(edge);
        pointToEdges.get(edge.p2).push(edge);
      });

      edges.forEach(edge => {
        const connected = new Set<any>();
        [edge.p1, edge.p2].forEach(p => {
          pointToEdges.get(p).forEach((neighbor: any) => {
            if (neighbor !== edge) connected.add(neighbor);
          });
        });
        edge.neighbors = Array.from(connected);
      });
    };

    const distToSegment = (px: number, py: number, x1: number, y1: number, x2: number, y2: number) => {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const lenSq = dx * dx + dy * dy;
      let t = ((px - x1) * dx + (py - y1) * dy) / lenSq;
      t = Math.max(0, Math.min(1, t));
      const nearX = x1 + t * dx;
      const nearY = y1 + t * dy;
      return Math.hypot(px - nearX, py - nearY);
    };

    const startChain = () => {
      const isMobile = window.innerWidth < 768;
      const maxChains = isMobile ? 2 : 3;
      if (edges.length === 0 || chains.length >= maxChains) return;
      
      const origin = edges[Math.floor(Math.random() * edges.length)];
      
      const chain = {
        startTime: Date.now(),
        rings: [
          { edges: [origin], delay: 0, opacity: 0.9, glow: 24 },
          { edges: [] as any[], delay: 60, opacity: 0.7, glow: 18 },
          { edges: [] as any[], delay: 120, opacity: 0.5, glow: 14 },
          { edges: [] as any[], delay: 180, opacity: 0.3, glow: 10 },
          { edges: [] as any[], delay: 240, opacity: 0.1, glow: 5 },
          { edges: [] as any[], delay: 300, opacity: 0.05, glow: 2 }
        ]
      };

      const visited = new Set([origin]);

      for (let i = 1; i < chain.rings.length; i++) {
        const prevEdges = chain.rings[i - 1].edges;
        const currentRingEdges: any[] = [];
        
        prevEdges.forEach((e: any) => {
          e.neighbors.forEach((neighbor: any) => {
            if (!visited.has(neighbor)) {
              currentRingEdges.push(neighbor);
              visited.add(neighbor);
            }
          });
        });
        chain.rings[i].edges = currentRingEdges;
      }
      chains.push(chain);
    };

    let chainTimer: any = null;
    const scheduleChain = () => {
      const interval = 2000 + Math.random() * 2000;
      chainTimer = setTimeout(() => {
        if (Date.now() - lastMouseMove > 1000) startChain();
        scheduleChain();
      }, interval);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.pageX;
      mouse.y = e.pageY;
      lastMouseMove = Date.now();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].pageX;
        mouse.y = e.touches[0].pageY;
        lastMouseMove = Date.now();
      }
    };

    window.addEventListener('resize', resize);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleTouchMove);

    setTimeout(resize, 100);
    scheduleChain();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const now = Date.now();
      const isMobile = window.innerWidth < 768;
      const glowRadius = isMobile ? 50 : 70; // Smaller radius

      // Update chains
      chains = chains.filter(chain => {
        const elapsed = now - chain.startTime;
        let active = false;
        chain.rings.forEach(ring => {
          if (elapsed >= ring.delay && elapsed < ring.delay + 600) {
            active = true;
            const ringElapsed = elapsed - ring.delay;
            const fade = 1 - (ringElapsed / 600);
            ring.edges.forEach((edge: any) => {
              edge.pulseOpacity = Math.max(edge.pulseOpacity, ring.opacity * fade);
              edge.pulseGlow = Math.max(edge.pulseGlow, ring.glow * fade);
            });
          }
        });
        return elapsed < 1000;
      });

      edges.forEach(edge => {
        const dist = distToSegment(mouse.x, mouse.y, edge.x1, edge.y1, edge.x2, edge.y2);
        
        if (dist < glowRadius) {
          const intensity = 1 - (dist / glowRadius);
          edge.targetOpacity = intensity * 0.8;
          edge.targetGlow = intensity * 18;
        } else {
          edge.targetOpacity = 0;
          edge.targetGlow = 0;
        }

        const finalTargetOpacity = Math.max(edge.targetOpacity, edge.pulseOpacity);
        const finalTargetGlow = Math.max(edge.targetGlow, edge.pulseGlow);

        edge.currentOpacity += (finalTargetOpacity - edge.currentOpacity) * 0.1;
        edge.currentGlow += (finalTargetGlow - edge.currentGlow) * 0.08;

        edge.pulseOpacity = 0;
        edge.pulseGlow = 0;

        if (edge.currentOpacity > 0.01) {
          // Optimization: Only draw glow if it's significant
          const hasGlow = edge.currentGlow > 2;

          if (hasGlow) {
            // Outer glow pass
            ctx.beginPath();
            ctx.moveTo(edge.x1, edge.y1);
            ctx.lineTo(edge.x2, edge.y2);
            ctx.strokeStyle = `rgba(196, 26, 0, ${edge.currentOpacity * 0.3})`;
            ctx.lineWidth = isMobile ? 2 : 3;
            ctx.shadowColor = '#c41a00';
            ctx.shadowBlur = edge.currentGlow * 1.2;
            ctx.stroke();
          }

          // Inner bright core
          ctx.beginPath();
          ctx.moveTo(edge.x1, edge.y1);
          ctx.lineTo(edge.x2, edge.y2);
          ctx.strokeStyle = `rgba(255, 80, 40, ${edge.currentOpacity})`;
          ctx.lineWidth = 1;
          if (hasGlow) {
            ctx.shadowColor = '#ff5028';
            ctx.shadowBlur = edge.currentGlow * 0.8;
          } else {
            ctx.shadowBlur = 0;
          }
          ctx.stroke();
          
          if (hasGlow) ctx.shadowBlur = 0;
        }
      });

      requestAnimationFrame(animate);
    };

    const animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animId);
      clearTimeout(chainTimer);
    };
  }, []);

  return (
    <canvas
      id="bg-canvas"
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        background: 'transparent',
      }}
    />
  );
}

function HomePage() {
  return (
    <div id="page-wrapper" style={{ position: 'relative', minHeight: '100vh' }} className="bg-obsidian">
      <BackgroundCanvas />
      <div className="relative z-10">
        {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 border-b border-white/5 bg-obsidian/80 backdrop-blur-md">
        <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center">
            {/* Logo Image */}
            <img 
              src="/Images/White_Vikrant_logo.png" 
              alt="Vikrant Logo" 
              className="h-10 w-auto"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex gap-8">
            <a href="#work" className="text-[14px] font-normal text-white hover:text-accent-red transition-colors duration-300">Work</a>
            <a href="#about" className="text-[14px] font-normal text-white hover:text-accent-red transition-colors duration-300">About</a>
            <a href="#contact" className="text-[14px] font-normal text-white hover:text-accent-red transition-colors duration-300">Contact</a>
          </div>
        </nav>
      </header>

      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="mb-40 relative">
          {/* Accent Red Lines & Refined Triangle */}
          <div className="absolute -top-20 -left-10 w-px h-64 bg-gradient-to-b from-accent-red/50 to-transparent pointer-events-none" />
          <div className="absolute top-10 -left-20 w-64 h-px bg-gradient-to-r from-accent-red/30 to-transparent pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative"
            >
              <div className="inline-block">
                <h1 className="text-5xl lg:text-8xl font-black uppercase text-white leading-none">
                  Vikrant
                </h1>
                <div className="flex justify-between text-accent-red uppercase font-light text-[12px] lg:text-[20px] mt-2 tracking-[0.2em] lg:tracking-[0.45em] w-full">
                  <span>G</span><span>R</span><span>A</span><span>P</span><span>H</span><span>I</span><span>C</span>
                  <span className="mx-1">&nbsp;</span>
                  <span>D</span><span>E</span><span>S</span><span>I</span><span>G</span><span>N</span><span>E</span><span>R</span>
                </div>
              </div>

              <div className="mt-10">
                <h2 className="text-[22px] lg:text-[26px] font-bold text-white leading-tight lg:whitespace-nowrap">
                  Mindset first. Design second. Results always.
                </h2>
                <p className="text-[16px] font-normal text-[#aaaaaa] leading-[1.7] mt-6">
                  I started with a sketchbook — that is still where every idea begins. Today that same instinct drives how I build brand systems that scale, last, and lead. Trained in design, grounded in technology, focused on one thing — work that actually works.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              className="relative aspect-[4/5] lg:aspect-square"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent z-10" />
              <img 
                src="/Vikrant_Red_Geometry.png" 
                alt="Vikrant Red Geometry"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-2xl opacity-90 shadow-2xl"
              />
              {/* Decorative elements to mimic the sketch feel */}
              <div className="absolute inset-0 border-[20px] border-obsidian z-20 pointer-events-none" />
              
              {/* Refined Sharp Triangle Accent */}
              <div className="absolute -bottom-4 -right-4 w-12 h-12 text-accent-red z-30">
                <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
                  <path d="M100 0 L100 100 L0 100 Z" />
                </svg>
              </div>
              
              {/* Accent Line */}
              <div className="absolute -bottom-10 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent-red/40 to-transparent" />
            </motion.div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="mb-40 scroll-mt-20">
          <div className="max-w-3xl">
            <span className="text-[11px] lg:text-[26px] font-semibold text-accent-red tracking-[0.15em] uppercase">
              ABOUT
            </span>
            <h2 className="text-[36px] font-bold text-white mt-6 mb-8">
              I didn't choose design. Design chose me.
            </h2>
            <div className="text-[16px] font-normal text-[#aaaaaa] leading-[1.8] space-y-6">
              <p>
                I started drawing before I started anything else — sketches, paintings, ideas on paper. That never stopped. That same instinct is what brought me here. I bring two things most designers don't: a creative eye shaped by years of making, and a technical mind built through a Master's in Information Technology. That combination is rare, intentional, and exactly the point. I believe anyone can do anything — it is just a matter of mindset. That belief drives every project I take on.
              </p>
            </div>
            <p className="text-[18px] italic text-accent-red mt-8">
              "Mindset first. Always."
            </p>
          </div>
        </section>

        {/* Portfolio Section */}
        <section id="work" className="scroll-mt-20">
          <div className="flex items-end justify-between mb-12 border-b border-white/10 pb-6">
            <h2 className="text-[11px] lg:text-[26px] font-semibold text-accent-red tracking-[0.15em] uppercase">
              SELECTED WORKS
            </h2>
            <span className="text-[13px] text-[#555555]">2024 — 2026</span>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
            {/* Project Card 1 */}
            <a 
              href="/ekkospire.html"
              className="group relative flex flex-col gap-4 cursor-pointer"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="aspect-video bg-white/5 border border-white/10 rounded-sm overflow-hidden transition-all duration-500 group-hover:border-accent-red/50 group-hover:-translate-y-1 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent-red/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                  <img 
                    src="/Images/Page-D1.png" 
                    alt="Ekkospire Integrated System"
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-90 transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-20">
                    <ArrowUpRight className="w-6 h-6 text-accent-red" />
                  </div>
                </div>
                <div className="flex flex-col gap-1 mt-4">
                  <h3 className="text-[18px] font-bold text-white">Ekkospire™ Integrated System</h3>
                  <p className="text-[13px] font-normal text-[#888888]">Brand Identity & Visual Systems</p>
                </div>
              </motion.div>
            </a>

            {/* Project Card 2 */}
            <motion.div 
              className="group relative flex flex-col gap-4 cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="aspect-video bg-white/5 border border-white/10 rounded-sm overflow-hidden transition-all duration-500 group-hover:border-accent-red/50 group-hover:-translate-y-1 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-red/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="w-full h-full flex items-center justify-center text-white/10 font-bold text-4xl italic">
                  RENDERING...
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <ArrowUpRight className="w-6 h-6 text-accent-red" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-[18px] font-bold text-white">Currently in the making</h3>
                <p className="text-[13px] font-normal text-[#888888]">Good things take time</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="mt-40 pt-20 border-t border-white/5 scroll-mt-20">
          <div className="max-w-2xl">
            <h2 className="text-[40px] font-bold text-white mb-6">Ready when you are.</h2>
            <p className="text-[16px] text-[#aaaaaa] leading-[1.7] mb-10">
              I am looking for a full-time role where I can do my best work and give everything to the team. If you are building something that needs sharp, disciplined design thinking — let's talk.
            </p>
            <a 
              href="mailto:vortzvikrant@gmail.com" 
              className="inline-flex items-center gap-2 text-accent-red text-[16px] font-semibold hover:underline underline-offset-8"
            >
              Get in touch <ArrowUpRight className="w-5 h-5" />
            </a>
          </div>
        </section>
      </main>

      <footer className="py-12 px-6 border-t border-white/5 flex justify-center">
        <p className="text-[12px] text-[#444444] text-center tracking-[0.08em] uppercase">
          © 2026 Vikrant. All rights reserved.
        </p>
      </footer>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}
