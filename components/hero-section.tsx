"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { ChevronDown, Sparkles } from "lucide-react"

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window
      setMousePosition({
        x: (clientX - innerWidth / 2) / 50,
        y: (clientY - innerHeight / 2) / 50,
      })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated Background */}
      <motion.div 
        style={{ y, scale }}
        className="absolute inset-0 z-0"
      >
        <div 
          className="absolute inset-0 transition-transform duration-300 ease-out"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          }}
        >
          <Image
            src="/images/hero-car.jpg"
            alt="Premium veturë"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background/80" />
      </motion.div>

      {/* Particles */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div 
        style={{ opacity }}
        className="relative z-20 text-center px-4 max-w-5xl mx-auto"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">Autosalloni Bellaqa Prizren</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight text-balance"
        >
          <span className="block">Eksperiencë</span>
          <span className="block mt-2">
            <span className="text-primary">Premium</span> në Çdo Veturë
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-pretty"
        >
          Shpejtësi, stil dhe besim në një vend. Zbuloni koleksionin tonë ekskluziv të veturave luksoze.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.a
            href="#showroom"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold text-lg overflow-hidden glow-primary transition-all duration-300 hover:shadow-[0_0_50px_oklch(0.75_0.15_45/0.6)]"
          >
            <span className="relative z-10">Eksploro Veturat</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary via-[oklch(0.8_0.12_50)] to-primary"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.5 }}
            />
          </motion.a>
          
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-full glass text-foreground font-semibold text-lg border border-border hover:border-primary/50 transition-all duration-300"
          >
            Na Kontakto
          </motion.a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto"
        >
          {[
            { value: "500+", label: "Vetura të Shitura" },
            { value: "15+", label: "Vite Eksperiencë" },
            { value: "100%", label: "Klientë të Kënaqur" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 + index * 0.1 }}
              className="text-center"
            >
              <p className="text-2xl sm:text-3xl font-bold text-primary">{stat.value}</p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.a
          href="#showroom"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
        >
          <span className="text-xs tracking-widest uppercase">Shkoni Poshtë</span>
          <ChevronDown className="w-5 h-5" />
        </motion.a>
      </motion.div>
    </section>
  )
}
