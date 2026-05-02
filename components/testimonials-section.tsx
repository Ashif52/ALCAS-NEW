"use client";
import React from "react";
import { CircularTestimonials } from "./ui/circular-testimonials";

const testimonials = [
  {
    quote:
      "We're currently updating our client success stories with our latest projects. Stay tuned to see how we've helped brands like Healthifem and AL Sam reach new heights.",
    name: "Success Stories",
    designation: "Coming Soon",
    src: "/resources/logos/healthifem.png",
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
