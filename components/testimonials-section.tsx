"use client";
import React from "react";
import { CircularTestimonials } from "./ui/circular-testimonials";

const testimonials = [
  {
    quote: "Thanks to the stunning logo you created for our shop, we experienced a 45% increase in brand visibility and a 30% growth in new customer visits within the first quarter. You truly made our brand look premium!",
    name: "SBJ Jewelry",
    designation: "Chennai, India",
    src: "/images/alcas.jpg", // Placeholder for actual client logo if available
  },
  {
    quote: "We needed a fresh, modern platform to represent our fitness brand. They delivered a stunning website, fully optimized with SEO best practices, resulting in a 300% increase in organic traffic.",
    name: "Niya Fit",
    designation: "Chennai, India",
    src: "/images/alcas.jpg",
  },
  {
    quote: "Your creative logo design helped Mithra’s Biryani achieve a 35% growth in new customer reach after our rebranding. Your sense of branding and communication made the process perfectly elegant.",
    name: "Mithra's Biryani",
    designation: "Chennai, India",
    src: "/images/alcas.jpg",
  }
];

export const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-[#0a0a0b] overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 reveal">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-display">
            Client Success Stories
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Don't just take our word for it. Hear from the founders and visionaries who leveled up their businesses with ALCAS.
          </p>
        </div>

        <div className="flex justify-center items-center">
           <CircularTestimonials
            testimonials={testimonials}
            autoplay={true}
            colors={{
              name: "#ffffff",
              designation: "#E63946",
              testimony: "#e5e7eb",
              arrowBackground: "#E63946",
              arrowForeground: "#ffffff",
              arrowHoverBackground: "#C1121F",
            }}
            fontSizes={{
              name: "32px",
              designation: "18px",
              quote: "20px",
            }}
          />
        </div>
      </div>
    </section>
  );
};
