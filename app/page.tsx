import ProjectShowcase from "@/components/ui/demo"
import { TestimonialsSection } from "@/components/testimonials-section"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <ProjectShowcase />
      <TestimonialsSection />
    </main>
  )
}
