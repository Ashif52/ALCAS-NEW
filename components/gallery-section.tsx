"use client";

import React, { useEffect, useState } from "react";
import { CircularGallery, GalleryItem } from "@/components/ui/circular-gallery";

const fallbackGalleryData: GalleryItem[] = [
  {
    common: "ALCAS Brand Reel",
    binomial: "9:16 Showcase Video",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-vertical-view-of-a-neon-sign-at-night-42898-large.mp4",
    photo: {
      url: "https://images.unsplash.com/photo-1583499871880-de841d1ace2a?w=900&auto=format&fit=crop&q=80",
      text: "Brand Reel",
      by: "ALCAS Agency",
    },
  },
  {
    common: "SBJ Jewellers Showcase",
    binomial: "Brand Identity & Design",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smartphone-with-a-vertical-screen-41551-large.mp4",
    photo: {
      url: "https://images.unsplash.com/photo-1571406761758-9a3eed5338ef?w=900&auto=format&fit=crop&q=80",
      text: "SBJ Showcase",
      by: "ALCAS Team",
    },
  },
  {
    common: "Futuristic 3D Motion",
    binomial: "Digital Marketing Campaign",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-vertical-shot-of-a-futuristic-tunnel-with-lights-42903-large.mp4",
    photo: {
      url: "https://images.unsplash.com/photo-1619664208054-41eefeab29e9?w=900&auto=format&fit=crop&q=80",
      text: "3D Motion",
      by: "Creative Studio",
    },
  },
  {
    common: "NMG Marine Dashboard",
    binomial: "Enterprise CRM & Web App",
    photo: {
      url: "https://images.unsplash.com/photo-1662841238473-f4b137e123cb?w=900&auto=format&fit=crop&q=80",
      text: "NMG Marine Dashboard",
      by: "Full Stack Team",
    },
  },
  {
    common: "Lend-It Fintech",
    binomial: "Financial Interface",
    photo: {
      url: "https://images.unsplash.com/photo-1589648751789-c8ecb7a88bd5?w=900&auto=format&fit=crop&q=80",
      text: "Lend-It Interface",
      by: "ALCAS UI Lab",
    },
  },
];

export const GallerySection = () => {
  const [items, setItems] = useState<GalleryItem[]>(fallbackGalleryData);

  useEffect(() => {
    fetch("/api/videos")
      .then((res) => res.json())
      .then((videos) => {
        if (Array.isArray(videos) && videos.length > 0) {
          const mapped: GalleryItem[] = videos.map((v) => ({
            id: v.id,
            common: v.title,
            binomial: v.subtitle || "9:16 Vertical Reel",
            videoUrl: v.videoUrl,
            photo: {
              url: v.poster || v.videoUrl || fallbackGalleryData[0].photo.url,
              text: v.title,
              by: "ALCAS Admin",
            },
          }));
          setItems(mapped);
        }
      })
      .catch(() => {
        /* use fallbacks */
      });
  }, []);

  return (
    <section className="w-full bg-[#0a0a0c] text-white pt-24 pb-12 relative overflow-hidden">
      <div className="container mx-auto px-4 mb-6 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
          3D <span className="text-[#E63946]">Reels Gallery</span>
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Explore our 9:16 vertical video reels and brand showcases. Scroll up or down to rotate through the 3D gallery.
        </p>
      </div>

      <div className="w-full h-[520px] relative flex items-center justify-center">
        <CircularGallery items={items} radius={380} autoRotateSpeed={0.03} />
      </div>
    </section>
  );
};

export default GallerySection;
