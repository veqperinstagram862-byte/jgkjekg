"use client"

import { useRef } from "react"
import { motion, useInView, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { Star, Shield, Award, ArrowRight } from "lucide-react"

export function FeaturedCar() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const glowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.6, 0.3])

  return (
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      {/* Animated Background */}
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute inset-0"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-card via-background to-secondary/30" />
        {/* Animated glow */}
        <motion.div 
          style={{ opacity: glowOpacity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/20 blur-[150px]"
        />
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: "easeOut" }}
            className="order-2 lg:order-1"
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
            >
              <Star className="w-4 h-4 fill-primary" />
              Vetura e Javës
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance"
            >
              Mercedes-AMG GT <span className="text-primary">Coupé</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-muted-foreground text-lg mb-8 text-pretty"
            >
              Kombinimi perfekt i fuqisë dhe elegancës. Motori V8 biturbo prodhon 585 kuajfuqi 
              për një përvojë të paharrueshme në çdo kilometër.
            </motion.p>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="grid grid-cols-2 gap-4 mb-8"
            >
              {[
                { icon: Shield, label: "Garanci 2 Vjeçare" },
                { icon: Award, label: "Cilësi Premium" },
              ].map((feature, index) => (
                <div
                  key={feature.label}
                  className="flex items-center gap-3 p-4 rounded-xl glass"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">{feature.label}</span>
                </div>
              ))}
            </motion.div>

            {/* Price and CTA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-6"
            >
              <div>
                <p className="text-muted-foreground text-sm">Çmimi Special</p>
                <p className="text-3xl font-bold text-primary">€124,900</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold glow-primary transition-all duration-300 hover:shadow-[0_0_50px_oklch(0.75_0.15_45/0.6)]"
              >
                <span>Rezervo Tani</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Car Image */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: "easeOut" }}
            className="order-1 lg:order-2 relative"
          >
            <div className="relative aspect-[4/3] lg:aspect-square">
              {/* Glow behind car */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 via-transparent to-accent/10 blur-2xl transform scale-110" />
              
              {/* Car image */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-full h-full"
              >
                <Image
                  src="/images/featured-car.jpg"
                  alt="Mercedes-AMG GT Coupé"
                  fill
                  className="object-contain drop-shadow-2xl"
                />
              </motion.div>

              {/* Decorative elements */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-4 -right-4 w-32 h-32 border border-primary/20 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-4 -left-4 w-24 h-24 border border-accent/20 rounded-full"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
