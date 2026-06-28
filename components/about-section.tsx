"use client"

import { useRef } from "react"
import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { Shield, Award, Users, Clock, CheckCircle } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Garanci e Plotë",
    description: "Çdo veturë vjen me garanci të plotë për siguri maksimale."
  },
  {
    icon: Award,
    title: "Cilësi Premium",
    description: "Vetëm veturat më të mira kalojnë standardet tona të larta."
  },
  {
    icon: Users,
    title: "Shërbim Personal",
    description: "Ekipi ynë profesional është gjithmonë në dispozicion."
  },
  {
    icon: Clock,
    title: "Proces i Shpejtë",
    description: "Blerja e veturës bëhet e thjeshtë dhe e shpejtë."
  },
]

const stats = [
  { value: "500+", label: "Vetura të Shitura" },
  { value: "15+", label: "Vite Eksperiencë" },
  { value: "1000+", label: "Klientë të Kënaqur" },
  { value: "24/7", label: "Mbështetje" },
]

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  const parallaxY = useTransform(scrollYProgress, [0, 1], [100, -100])

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-card/30 via-background to-background" />
      
      {/* Decorative circles */}
      <motion.div
        style={{ y: parallaxY }}
        className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl"
      />
      <motion.div
        style={{ y: parallaxY }}
        className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-accent/5 blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-1 rounded-full glass text-primary text-sm font-medium mb-4"
          >
            Rreth Nesh
          </motion.span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Pse të Zgjedhni <span className="text-primary">Bellaqa</span>?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
            Me mbi 15 vite eksperiencë në industrinë e automobilave, ne ofrojmë vetëm më të mirën.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <div className="glass rounded-2xl p-6 h-full transition-all duration-300 group-hover:shadow-[0_0_30px_oklch(0.75_0.15_45/0.1)]">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <feature.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="glass rounded-3xl p-8 sm:p-12"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="text-center"
              >
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-2"
                >
                  {stat.value}
                </motion.p>
                <p className="text-muted-foreground text-sm sm:text-base">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-6 text-muted-foreground"
        >
          {["Vetura të Verifikuara", "Financim i Disponueshëm", "Zëvendësim i Mundshëm"].map((item, index) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="flex items-center gap-2"
            >
              <CheckCircle className="w-5 h-5 text-primary" />
              <span className="text-sm">{item}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
