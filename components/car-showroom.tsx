"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Fuel, Gauge, Calendar, Settings, MessageCircle } from "lucide-react"
import { getFeaturedCars, formatPrice, formatMileage, getWhatsAppLink, getStatusColor, getStatusLabel, type Car } from "@/lib/cars"
import { useCompare } from "@/lib/compare-context"

function TiltCard({ car }: { car: Car }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const { addToCompare, isInCompare } = useCompare()

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

  const isSold = car.status === 'sold'

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
      className="relative group"
    >
      <div className={`glass rounded-2xl overflow-hidden transition-all duration-500 group-hover:shadow-[0_0_50px_oklch(0.75_0.15_45/0.2)] ${isSold ? 'opacity-70' : ''}`}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={car.images[0] || '/images/placeholder.jpg'}
            alt={car.name}
            fill
            className={`object-cover transition-transform duration-700 group-hover:scale-110 ${isSold ? 'grayscale-[30%]' : ''}`}
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ transform: "translateZ(50px)" }}
          />
          <span className={`absolute left-4 top-4 z-10 px-3 py-1.5 rounded-full text-xs font-bold text-white ${getStatusColor(car.status)}`}>
            {getStatusLabel(car.status)}
          </span>
          <div className="absolute top-4 right-4 px-4 py-2 glass rounded-full">
            <span className="text-primary font-bold">{formatPrice(car.price)}</span>
          </div>
        </div>

        <div className="p-6" style={{ transform: "translateZ(30px)" }}>
          <div className="flex items-center justify-between mb-4">
            <Link href={`/car/${car.id}`} className="hover:text-primary transition-colors">
              <h3 className="text-xl font-bold text-foreground">{car.name}</h3>
            </Link>
            <span className="text-muted-foreground flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {car.year}
            </span>
          </div>

          <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Fuel className="w-4 h-4 text-primary" />
              {car.fuel_type}
            </span>
            <span className="flex items-center gap-1">
              <Gauge className="w-4 h-4 text-primary" />
              {formatMileage(car.mileage)}
            </span>
            <span className="flex items-center gap-1">
              <Settings className="w-4 h-4 text-primary" />
              {car.transmission}
            </span>
          </div>

          <div className="flex gap-2">
            <Link
              href={`/car/${car.id}`}
              className="flex-1 flex items-center justify-center gap-2 text-primary font-medium px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary hover:text-primary-foreground transition-all"
            >
              <span>View Details</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            {!isSold && (
              <a
                href={getWhatsAppLink(car.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function CarShowroom() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  const [cars, setCars] = useState<Car[]>([])

  useEffect(() => {
    async function fetchCars() {
      const featuredCars = await getFeaturedCars()
      if (featuredCars.length === 0) {
        const { getCars } = await import('@/lib/cars')
        const allCars = await getCars()
        setCars(allCars.slice(0, 6))
      } else {
        setCars(featuredCars)
      }
    }
    fetchCars()
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
            Our Collection
          </motion.span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Discover <span className="text-primary">Premium</span> Vehicles
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
            Every vehicle in our collection is carefully selected to offer the best experience.
          </p>
        </motion.div>

        {cars.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading vehicles...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-1000">
            {cars.slice(0, 6).map((car, index) => (
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
        )}

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
            <span>View All Cars</span>
            <ArrowRight className="w-5 h-5" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
