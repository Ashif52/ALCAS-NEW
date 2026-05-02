'use client'

import React from 'react';
import { ProjectCarousel } from '@/components/ui/feature-carousel';

const projects = [
  {
    image: '/projects/nmg-marine.png',
    title: 'NMG Marine Service',
    role: 'Full Stack Developer',
    description:
      'Complete digital platform for marine service operations. Built responsive service website with clear service segmentation, inquiry flow, and optimized UI for industrial/service-based users.',
    link: 'https://nmgmarineservice.com/',
    tags: ['Full Stack', 'Client Project', 'Production'],
  },
  {
    image: '/projects/lend-it.png',
    title: 'Lend-It',
    role: 'Frontend Developer',
    description:
      'Modern lending platform interface focused on simplicity and user engagement. Built responsive UI for loan-related workflows with clean user flows for financial product access.',
    link: 'https://lend-it-jade.vercel.app/',
    tags: ['Fintech', 'Frontend', 'Web App'],
  },
  {
    image: '/projects/bethel-impex.png',
    title: 'Bethel Express Impex',
    role: 'Frontend & Web Developer',
    description:
      'Corporate website for an import/export company to improve digital presence and lead generation. Built modern UI aligned with global trade business standards, optimized for SEO.',
    link: 'https://www.bethelexpressimpex.com/',
    tags: ['Branding', 'Corporate', 'SEO'],
  },
  {
    image: '/projects/nmg-dashboard.png',
    title: 'NMG Marine Dashboard',
    role: 'Full Stack Developer',
    description:
      'Admin dashboard for managing marine service operations, requests, and internal data. Implemented role-based access, structured data handling, and fast performance.',
    link: 'https://www.nmgmarineservice.in/dashboard',
    tags: ['Dashboard', 'Admin', 'Enterprise'],
  },
  {
    image: '/projects/niya-fitness.png',
    title: 'NiyaFitness',
    role: 'Web Developer',
    description:
      'Vibrant fitness website with workout plans, personal training services, and membership options. Bold typography with energetic design and responsive layout.',
    link: 'https://niyafit46.wixsite.com/niyafitness',
    tags: ['Fitness', 'Branding', 'Website'],
  },
];

const ProjectShowcase: React.FC = () => {
  const title = (
    <>
      Our{' '}
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-purple-500">
        Client Work
      </span>{' '}
      & Live Projects
    </>
  );

  return (
    <div className="w-full">
      <ProjectCarousel
        title={title}
        subtitle="Enterprise platforms, dashboards, and brand websites — shipped and running in production."
        projects={projects}
      />
    </div>
  );
};

export default ProjectShowcase;
