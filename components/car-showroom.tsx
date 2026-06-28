"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion"
import Image from "next/image"
import { ArrowRight, Fuel, Gauge, Calendar, Settings } from "lucide-react"
import { DEFAULT_CARS, readSavedCars, type Car } from "@/lib/cars"

function TiltCard({ car }: { car: Car }) {
  const cardRef = useRef<HTMLDivElement>(null)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative group cursor-pointer"
    >
      <div className="glass rounded-2xl overflow-hidden transition-all duration-500 group-hover:shadow-[0_0_50px_oklch(0.75_0.15_45/0.2)]">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={car.image}
            alt={car.name}
            fill
            unoptimized={car.image.startsWith("data:")}
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ transform: "translateZ(50px)" }}
          />
          <div className="absolute top-4 right-4 px-4 py-2 glass rounded-full">
            <span className="text-primary font-bold">{car.price}</span>
          </div>
        </div>

        <div className="p-6" style={{ transform: "translateZ(30px)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-foreground">{car.name}</h3>
            <span className="text-muted-foreground flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {car.year}
            </span>
          </div>

          <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Fuel className="w-4 h-4 text-primary" />
              {car.specs.fuel}
            </span>
            <span className="flex items-center gap-1">
              <Gauge className="w-4 h-4 text-primary" />
              {car.specs.power}
            </span>
            <span className="flex items-center gap-1">
              <Settings className="w-4 h-4 text-primary" />
              {car.specs.transmission}
            </span>
          </div>

          <motion.button
            whileHover={{ x: 5 }}
            className="flex items-center gap-2 text-primary font-medium group/btn"
          >
            <span>Eksploro</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export function CarShowroom() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  const [cars, setCars] = useState<Car[]>(DEFAULT_CARS)

  useEffect(() => {
    setCars([...DEFAULT_CARS, ...readSavedCars()])
  }, [])

  return (
    <section
      ref={sectionRef}
      id="showroom"
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(oklch(0.75 0.15 45) 1px, transparent 1px),
            linear-gradient(90deg, oklch(0.75 0.15 45) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            Koleksioni Ynë
          </motion.span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Zbuloni Veturat <span className="text-primary">Premium</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
            Çdo veturë në koleksionin tonë është zgjedhur me kujdes për të ofruar eksperiencën më të mirë.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-1000">
          {cars.map((car, index) => (
            <motion.div
              key={car.id}
              initial={{ opacity: 0, y: 80 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.12 }}
            >
              <TiltCard car={car} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-12"
        >
          <motion.a
            href="/all-cars"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-full glass text-foreground font-semibold border border-border hover:border-primary/50 transition-all duration-300 inline-flex items-center gap-2"
          >
            <span>Shiko Të Gjitha Veturat</span>
            <ArrowRight className="w-5 h-5" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
