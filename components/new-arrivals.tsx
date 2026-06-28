"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Clock, Sparkles, MessageCircle } from "lucide-react"
import { getCars, formatPrice, getWhatsAppLink, getStatusColor, getStatusLabel, type Car } from "@/lib/cars"

export function NewArrivals() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  const [cars, setCars] = useState<Car[]>([])

  useEffect(() => {
    async function fetchCars() {
      const allCars = await getCars()
      const newOrRecent = allCars
        .filter(car => car.condition === 'New' || car.year >= 2023)
        .slice(0, 6)
      setCars(newOrRecent)
    }
    fetchCars()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="new-arrivals"
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />

      {/* Animated accent line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12"
        >
          <div>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 text-primary text-sm font-medium mb-3"
            >
              <Sparkles className="w-4 h-4" />
              New in Stock
            </motion.span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance">
              Latest <span className="text-primary">Arrivals</span>
            </h2>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4 }}
          >
            <Link
              href="/all-cars"
              className="mt-4 sm:mt-0 flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
            >
              <span>View All</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Cards Grid */}
        {cars.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading vehicles...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.map((car, index) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 60 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 + index * 0.15 }}
                className="group"
              >
                <div className="relative glass rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_oklch(0.75_0.15_45/0.15)]">
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white ${
                        car.condition === 'New' ? 'bg-primary' : getStatusColor(car.status)
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      {car.condition === 'New' ? 'NEW' : getStatusLabel(car.status)}
                    </motion.div>
                  </div>

                  {/* Image */}
                  <Link href={`/car/${car.id}`}>
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={car.images[0] || '/images/placeholder.jpg'}
                        alt={car.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <Link href={`/car/${car.id}`} className="hover:text-primary transition-colors">
                        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                          {car.name}
                        </h3>
                      </Link>
                      <span className="text-muted-foreground text-sm">{car.year}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold text-primary">{formatPrice(car.price)}</p>
                      <div className="flex gap-2">
                        <a
                          href={getWhatsAppLink(car.name)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 hover:bg-green-500 hover:text-white transition-all duration-300"
                        >
                          <MessageCircle className="w-5 h-5" />
                        </a>
                        <Link
                          href={`/car/${car.id}`}
                          className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                        >
                          <ArrowRight className="w-5 h-5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Limited Offer Banner */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 relative overflow-hidden rounded-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-card to-accent/20 animate-gradient" />
          <div className="relative glass p-8 sm:p-12 text-center">
            <motion.p
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-primary text-sm font-semibold tracking-widest uppercase mb-3"
            >
              Limited Time Offers
            </motion.p>
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 text-balance">
              Don't miss the opportunity for your ideal car
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto text-pretty">
              Special prices this month. Contact us now to reserve your dream car.
            </p>
            <motion.a
              href="https://wa.me/38344123456?text=Hello%2C%20I%20am%20interested%20in%20your%20special%20offers."
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold glow-primary transition-all duration-300 hover:shadow-[0_0_50px_oklch(0.75_0.15_45/0.6)]"
            >
              <MessageCircle className="w-5 h-5" />
              Contact Now
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
