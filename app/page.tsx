"use client"

import { motion, useScroll, useSpring } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { CarShowroom } from "@/components/car-showroom"
import { FeaturedCar } from "@/components/featured-car"
import { NewArrivals } from "@/components/new-arrivals"
import { AboutSection } from "@/components/about-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"

export default function Home() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <main className="relative min-h-screen bg-background overflow-hidden">
      {/* Progress Bar */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-[100]"
      />

      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Car Showroom */}
      <CarShowroom />

      {/* Featured Car */}
      <FeaturedCar />

      {/* New Arrivals */}
      <NewArrivals />

      {/* About Section */}
      <AboutSection />

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <Footer />

      {/* WhatsApp Button */}
      <WhatsAppButton />
    </main>
  )
}
