import HeroSection from "@/components/hero-section"
import { GridBackground } from "@/components/grid-background"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <GridBackground />
      <div className="flex-grow z-10 relative">
        <HeroSection />
      </div>
      <Footer />
    </div>
  )
}
