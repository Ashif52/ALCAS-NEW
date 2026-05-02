"use client";

import React, { useEffect, useState } from "react";
import Spline from "@splinetool/react-spline";
import ProjectShowcase from "@/components/ui/demo";
import { TestimonialsSection } from "@/components/testimonials-section";
import ProjectCarousel from "@/components/ui/feature-carousel";
import Link from "next/link";

const brands = [
  { id: 'healthifem', label: 'Healthifem', image: 'resources/logos/healthifem.png?v=2', description: 'Empowering wellness through digital transformation.' },
  { id: 'gulf_parlor', label: 'Gulf Parlor', image: 'resources/logos/gulf_parlor.png?v=2', description: 'Premium dining experiences redefined.' },
  { id: 'freaks', label: 'Freaks 2.0', image: 'resources/logos/freaks.png?v=2', description: 'Creative boundary-pushing design.' },
  { id: 'bsc', label: 'BSC', image: 'resources/logos/bsc.png?v=2', description: 'Streamlined corporate identity systems.' },
  { id: 'al_sam', label: 'AL Sam', image: 'resources/logos/al_sam.png?v=2', description: 'Global logistics and trade connectivity.' },
  { id: 'sacola', label: 'Sacola', image: 'resources/logos/sacola.png?v=2', description: 'Innovative retail solutions for the next gen.' },
  { id: 'quest', label: 'Quest', image: 'resources/logos/quest.png?v=2', description: 'Data-driven research and analytics.' },
  { id: 'pp', label: 'PP', image: 'resources/logos/pp.png?v=2', description: 'Uncompromising quality and precision.' },
  { id: 'pixel', label: 'Pixel', image: 'resources/logos/pixel.png?v=2', description: 'Perfecting detail in digital photography.' },
  { id: 'osia', label: 'Osia', image: 'resources/logos/osia.png?v=2', description: 'Luxury brand positioning and identities.' }
];

export default function Home() {
  const [isNavActive, setIsNavActive] = useState(false);
  const [isActionHubActive, setIsActionHubActive] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });

  // Handle Scroll Animations (Simplified Reveal)
  useEffect(() => {
    const reveals = document.querySelectorAll(".reveal");
    const handleScroll = () => {
      reveals.forEach((reveal) => {
        const windowHeight = window.innerHeight;
        const revealTop = reveal.getBoundingClientRect().top;
        const revealPoint = 150;
        if (revealTop < windowHeight - revealPoint) {
          reveal.classList.add("active");
        }
      });
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const showComingSoon = (botName: string) => {
    setToast({ show: true, message: `${botName} Coming Soon` });
    setTimeout(() => setToast({ show: false, message: "" }), 3000);
  };

  return (
    <main className="min-h-screen">
      {/* HEADER / NAVBAR */}
      <header className="header" id="header">
        <nav className="navbar container">
          <div className="nav-brand">
            <img src="/images/alcas.jpg" alt="ALCAS Logo" className="nav-logo" />
            <div className="brand-text">
              <span className="brand-name">ALCAS</span>
              <span className="brand-subtitle">DIGITAL MARKETING AGENCY</span>
            </div>
          </div>

          <ul className={`nav-menu ${isNavActive ? "active" : ""}`} id="navMenu">
            <li><Link href="#home" className="nav-link active">Home</Link></li>
            <li><Link href="/services.html" className="nav-link">Services</Link></li>
            <li><Link href="/careers.html" className="nav-link">Careers</Link></li>
            <li><Link href="/pricing.html" className="nav-link">Pricing</Link></li>
            <li><Link href="/contact.html" className="nav-link">Contact</Link></li>
          </ul>

          <div className="nav-toggle" id="navToggle" onClick={() => setIsNavActive(!isNavActive)}>
            <i className={`fas ${isNavActive ? "fa-times" : "fa-bars"}`}></i>
          </div>
        </nav>
      </header>

      {/* HERO SECTION WITH SPLINE BACKGROUND */}
      <section className="hero" id="home">
        <div className="hero-video-container" style={{ background: "radial-gradient(circle at 60% 50%, #1a1a1a 0%, #000 100%)" }}>
          <Spline scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode" />
          <div className="hero-overlay" style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)", pointerEvents: "none" }}></div>
        </div>

        <div className="hero-content container" style={{ pointerEvents: "none" }}>
          <div className="hero-text" style={{ pointerEvents: "auto" }}>
            <h1 className="hero-title shining-text">Nothing to Something.</h1>
            <p className="hero-subtitle">
              At Alcas, we're more than just a digital marketing agency — we're your growth partner. We craft stunning websites and create data-driven marketing strategies to help your brand stand out, attract attention, and thrive in the digital world.
            </p>

            <div className="hero-buttons">
              <Link href="/services.html" className="btn btn-primary">
                <i className="fas fa-rocket"></i> View Our Services
              </Link>
              <Link href="/contact.html" className="btn btn-secondary">
                <i className="fas fa-handshake"></i> Let's Talk
              </Link>
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <h3>05+</h3>
                <p>Year of Experience</p>
              </div>
              <div className="stat-item">
                <h3>150+</h3>
                <p>Projects Completed</p>
              </div>
              <div className="stat-item">
                <h3>99.9%</h3>
                <p>Custom Solutions</p>
              </div>
              <div className="stat-item">
                <h3>24/7</h3>
                <p>Support</p>
              </div>
            </div>
          </div>
        </div>

        <div className="scroll-indicator">
          <i className="fas fa-chevron-down"></i>
        </div>
      </section>

      {/* PROJECT SHOWCASE (NEXT.JS COMPONENT) */}
      <section className="portfolio py-20 bg-[#fffdf9]" id="portfolio">
        <ProjectShowcase />
      </section>

      {/* BRAND PARTNERS (NEXT.JS COMPONENT) */}
      <section className="brand-partners py-24 bg-[#0a0a0b]" id="brands">
        <div className="container">
           <ProjectCarousel 
            title={<>Our <span className="text-orange-500">Brand Partners</span></>}
            subtitle="Innovative brands that trust ALCAS for their digital growth and strategic excellence."
            projects={brands}
           />
        </div>
      </section>

      {/* CORE SERVICES SUMMARY */}
      <section className="benefits py-24" id="services-summary">
        <div className="container">
          <div className="section-header text-center mb-16">
            <h2 className="section-title text-4xl font-bold mb-4">Our Core Services</h2>
            <p className="section-subtitle text-gray-600">Complete digital business systems designed for rapid growth</p>
          </div>

          <div className="benefits-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="benefit-card reveal p-8 bg-white rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-xl">
              <div className="benefit-icon w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 text-2xl mb-6">
                <i className="fas fa-code"></i>
              </div>
              <h3 className="text-xl font-bold mb-4">Website Development</h3>
              <p className="text-gray-600">High-performance, conversion-focused websites designed to grow your business online.</p>
            </div>

            <div className="benefit-card reveal p-8 bg-white rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-xl">
              <div className="benefit-icon w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 text-2xl mb-6">
                <i className="fas fa-database"></i>
              </div>
              <h3 className="text-xl font-bold mb-4">CRM Implementation</h3>
              <p className="text-gray-600">Smart CRM systems to capture, manage, and convert leads efficiently.</p>
            </div>

            <div className="benefit-card reveal p-8 bg-white rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-xl">
              <div className="benefit-icon w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 text-2xl mb-6">
                <i className="fas fa-hashtag"></i>
              </div>
              <h3 className="text-xl font-bold mb-4">Social Media Growth</h3>
              <p className="text-gray-600">Strategic content and engagement to turn followers into loyal customers.</p>
            </div>

            <div className="benefit-card reveal p-8 bg-white rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-xl">
              <div className="benefit-icon w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 text-2xl mb-6">
                <i className="fas fa-bullhorn"></i>
              </div>
              <h3 className="text-xl font-bold mb-4">Performance Marketing</h3>
              <p className="text-gray-600">Data-driven ad campaigns that generate high-quality leads and measurable ROI.</p>
            </div>

            <div className="benefit-card reveal p-8 bg-white rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-xl">
              <div className="benefit-icon w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 text-2xl mb-6">
                <i className="fas fa-robot"></i>
              </div>
              <h3 className="text-xl font-bold mb-4">AI & Automation</h3>
              <p className="text-gray-600">Intelligent workflows and chatbots to streamline operations and boost efficiency.</p>
            </div>

            <div className="benefit-card reveal p-8 bg-white rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-xl">
              <div className="benefit-icon w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 text-2xl mb-6">
                <i className="fas fa-palette"></i>
              </div>
              <h3 className="text-xl font-bold mb-4">Branding & Creative</h3>
              <p className="text-gray-600">Powerful brand identities and creatives that make your business stand out.</p>
            </div>
          </div>

          <div className="text-center mt-12 flex flex-wrap justify-center gap-6">
            <Link href="/services.html" className="btn btn-primary px-12 py-4">
              View Full Service Details <i className="fas fa-arrow-right ml-2"></i>
            </Link>
            <Link href="/pricing.html" className="btn btn-secondary px-12 py-4 border-2 border-[#e65100] text-[#e65100] hover:bg-[#e65100] hover:text-white transition-all">
              View Pricing & Packages <i className="fas fa-tag ml-2"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* PROCESS SECTION */}
      <section className="timeline py-24 bg-gray-50" id="process">
        <div className="container">
          <div className="section-header text-center mb-16">
            <h2 className="section-title text-4xl font-bold mb-4">Our Process</h2>
            <p className="section-subtitle text-gray-600">A sequence designed to transform visions into dominant digital realities.</p>
          </div>

          <div className="timeline-container relative max-w-4xl mx-auto">
            <div className="timeline-item reveal mb-12 flex items-start gap-8">
              <div className="timeline-marker w-12 h-12 rounded-full bg-[#e65100] text-white flex items-center justify-center flex-shrink-0">
                <i className="fas fa-search"></i>
              </div>
              <div className="timeline-content">
                <h3 className="text-2xl font-bold mb-2">01. Discover & Strategize</h3>
                <p className="text-gray-600">We dive deep into your brand DNA, charting a precise roadmap uniquely aligned with your ultimate business objectives.</p>
              </div>
            </div>

            <div className="timeline-item reveal mb-12 flex items-start gap-8">
              <div className="timeline-marker w-12 h-12 rounded-full bg-[#e65100] text-white flex items-center justify-center flex-shrink-0">
                <i className="fas fa-hammer"></i>
              </div>
              <div className="timeline-content">
                <h3 className="text-2xl font-bold mb-2">02. Engineer & Craft</h3>
                <p className="text-gray-600">Our team builds striking, high-performance digital assets that instantly captivate your audience and outshine the competition.</p>
              </div>
            </div>

            <div className="timeline-item reveal flex items-start gap-8">
              <div className="timeline-marker w-12 h-12 rounded-full bg-[#e65100] text-white flex items-center justify-center flex-shrink-0">
                <i className="fas fa-rocket"></i>
              </div>
              <div className="timeline-content">
                <h3 className="text-2xl font-bold mb-2">03. Launch & Elevate</h3>
                <p className="text-gray-600">We deploy your project with flawless precision, continuously optimizing the results for explosive growth and brand dominance.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS (NEXT.JS COMPONENT) */}
      <TestimonialsSection />

      {/* FOOTER */}
      <footer className="site-footer bg-[#0a0a0b] text-white py-20 relative overflow-hidden">
        <div className="footer-glow absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-orange-900/20 blur-[120px] pointer-events-none"></div>
        <div className="container relative z-10">
          <div className="newsletter-box mb-20 p-12 bg-white/5 rounded-[40px] border border-white/10 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-8 reveal">
            <div className="newsletter-content max-w-xl">
              <h3 className="text-3xl font-bold mb-2">Stay ahead with ALCAS Digital</h3>
              <p className="text-gray-400">Join thousands of professionals who trust ALCAS Digital for innovative business solutions.</p>
            </div>
            <div className="newsletter-form flex w-full md:w-auto gap-4">
              <input type="email" placeholder="Enter your email" className="bg-white/10 border border-white/20 rounded-2xl px-6 py-4 flex-grow md:w-80 outline-none focus:border-orange-500 transition-all" />
              <button className="btn btn-primary px-8">Subscribe</button>
            </div>
          </div>

          <div className="footer-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            <div className="footer-brand">
              <div className="brand-text mb-6">
                <span className="brand-name block text-3xl font-bold tracking-tighter">ALCAS</span>
                <span className="brand-subtitle block text-xs font-bold tracking-[0.2em] text-orange-500">DIGITAL MARKETING AGENCY</span>
              </div>
              <p className="text-gray-400 mb-8">Empowering businesses with reliable, scalable, and innovative digital solutions. We transform your visions into reality.</p>
              <div className="footer-socials flex gap-4">
                <a href="#" className="social-link w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-orange-600 hover:border-orange-600 transition-all"><i className="fab fa-facebook-f"></i></a>
                <a href="#" className="social-link w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-orange-600 hover:border-orange-600 transition-all"><i className="fab fa-instagram"></i></a>
                <a href="#" className="social-link w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-orange-600 hover:border-orange-600 transition-all"><i className="fab fa-twitter"></i></a>
                <a href="#" className="social-link w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-orange-600 hover:border-orange-600 transition-all"><i className="fab fa-linkedin-in"></i></a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6">Solutions</h4>
              <ul className="footer-links space-y-4">
                <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-all">Business Automation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-all">Cloud Services</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-all">Data Analytics</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-all">API Integrations</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-all">Custom Software</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6">Company</h4>
              <ul className="footer-links space-y-4">
                <li><Link href="/" className="text-gray-400 hover:text-orange-500 transition-all">About Us</Link></li>
                <li><Link href="/services.html" className="text-gray-400 hover:text-orange-500 transition-all">Our Services</Link></li>
                <li><Link href="/pricing.html" className="text-gray-400 hover:text-orange-500 transition-all">Pricing Plans</Link></li>
                <li><Link href="/faqs.html" className="text-gray-400 hover:text-orange-500 transition-all">FAQs</Link></li>
                <li><Link href="/careers.html" className="text-gray-400 hover:text-orange-500 transition-all">Careers</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6">Contact Us</h4>
              <ul className="footer-links space-y-4">
                <li><a href="mailto:alcas2k25@gmail.com" className="text-gray-400 hover:text-orange-500 transition-all flex items-center gap-3"><i className="fas fa-envelope text-orange-500"></i> alcas2k25@gmail.com</a></li>
                <li><a href="tel:+919176040364" className="text-gray-400 hover:text-orange-500 transition-all flex items-center gap-3"><i className="fas fa-phone text-orange-500"></i> +91 91760 40364</a></li>
                <li className="text-gray-400 flex items-start gap-3"><i className="fas fa-map-marker-alt text-orange-500 mt-1"></i> No. 249, 9th cross street, M. K. B. Nagar, Chennai - 600039</li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-gray-500">
            <p>&copy; 2024 ALCAS Digital Marketing Agency. All rights reserved.</p>
            <div className="legal-links flex gap-8">
              <Link href="/terms.html" className="hover:text-white transition-all">Terms of Service</Link>
              <Link href="/privacy.html" className="hover:text-white transition-all">Privacy Policy</Link>
              <Link href="/cookies.html" className="hover:text-white transition-all">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* CONSOLIDATED ACTION HUB */}
      <div className={`action-hub ${isActionHubActive ? "active" : ""}`} id="actionHub">
        <div className="action-sub-wrap">
          <div className="action-btn btn-voicebot" data-label="Voice Bot" onClick={() => showComingSoon("Voice Bot")}>
            <i className="fas fa-microphone"></i>
          </div>
          <div className="action-btn btn-chatbot" data-label="Chatbot" onClick={() => showComingSoon("Chatbot")}>
            <i className="fas fa-comment-dots"></i>
          </div>
          <a href="https://wa.me/919176040364" className="action-btn btn-whatsapp" data-label="WhatsApp" target="_blank">
            <i className="fab fa-whatsapp"></i>
          </a>
        </div>
        <div className="action-main" id="actionMain" onClick={() => setIsActionHubActive(!isActionHubActive)}>
          <i className="fas fa-plus"></i>
        </div>
      </div>

      {/* COMING SOON TOAST */}
      <div className={`coming-soon-toast ${toast.show ? "show" : ""}`} id="comingSoonToast">
        <i className="fas fa-rocket"></i>
        <span>{toast.message}</span>
      </div>

      <style jsx>{`
        .coming-soon-toast {
          position: fixed;
          bottom: 120px;
          right: 30px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(15px);
          padding: 12px 24px;
          border-radius: 50px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          display: flex;
          align-items: center;
          gap: 12px;
          z-index: 10000;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          pointer-events: none;
        }
        .coming-soon-toast.show {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </main>
  );
}
