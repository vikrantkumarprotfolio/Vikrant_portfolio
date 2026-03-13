/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, ArrowLeft } from "lucide-react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";

const pdfFile = "/portfolio.pdf";

function HomePage() {
  return (
    <div className="min-h-screen selection:bg-accent-red/30">
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
                src="/src/Vikrant_Red_Geometry.png" 
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
        <section id="about" className="mb-40">
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
        <section id="work">
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
                <h3 className="text-[18px] font-bold text-white">Clinical Asset Framework</h3>
                <p className="text-[13px] font-normal text-[#888888]">Visual Communication & Corporate Strategy</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="mt-40 pt-20 border-t border-white/5">
          <div className="max-w-2xl">
            <h2 className="text-[40px] font-bold text-white mb-6">Ready when you are.</h2>
            <p className="text-[16px] text-[#aaaaaa] leading-[1.7] mb-10">
              I am looking for a full-time role where I can do my best work and give everything to the team. If you are building something that needs sharp, disciplined design thinking — let's talk.
            </p>
            <a 
              href="mailto:contact@vikrantkumar.com" 
              className="inline-flex items-center gap-2 text-accent-red text-[16px] font-semibold hover:underline underline-offset-8"
            >
              Get in touch <ArrowUpRight className="w-5 h-5" />
            </a>
          </div>
        </section>
      </main>

      <footer className="py-12 px-6 border-t border-white/5 flex justify-center">
        <p className="text-[12px] text-[#444444] text-center tracking-[0.08em] uppercase">
          © 2026 Vikrant. All rights reserved. Designed with precision. Built with purpose.
        </p>
      </footer>
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
