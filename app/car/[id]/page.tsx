"use client"

import { useEffect, useState, use } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Calendar, Fuel, Gauge, Settings, MessageCircle, Palette, Cog, Star, Calculator, GitCompare, ArrowLeft, CircleAlert as AlertCircle } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { getCarById, getCars, formatPrice, formatMileage, getWhatsAppLink, getStatusColor, getStatusLabel, type Car } from "@/lib/cars"
import { useCompare } from "@/lib/compare-context"

function ImageGallery({ images, carName }: { images: string[]; carName: string }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const allImages = images.length > 0 ? images : ['/images/placeholder.jpg']

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % allImages.length)
  const prevImage = () => setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length)

  return (
    <div className="space-y-4">
      <div className="relative aspect-[16/10] rounded-2xl overflow-hidden glass">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full h-full"
        >
          <Image
            src={allImages[currentIndex]}
            alt={`${carName} - Image ${currentIndex + 1}`}
            fill
            className="object-cover"
          />
        </motion.div>
        {allImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full glass hover:bg-primary/20 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-foreground" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full glass hover:bg-primary/20 transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-foreground" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {allImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex ? 'w-8 bg-primary' : 'bg-foreground/30'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      {allImages.length > 1 && (
        <div className="grid grid-cols-6 gap-2">
          {allImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all ${
                index === currentIndex ? 'border-primary' : 'border-transparent hover:border-primary/50'
              }`}
            >
              <Image src={img} alt={`${carName} thumbnail ${index + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function FinancingCalculator({ price }: { price: number }) {
  const [downPayment, setDownPayment] = useState(Math.round(price * 0.2))
  const [months, setMonths] = useState(60)
  const [interestRate, setInterestRate] = useState(5.5)

  const loanAmount = price - downPayment
  const monthlyInterestRate = interestRate / 100 / 12
  const monthlyPayment = loanAmount > 0 && months > 0
    ? (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, months)) / (Math.pow(1 + monthlyInterestRate, months) - 1)
    : 0
  const totalPayment = monthlyPayment * months
  const totalInterest = totalPayment - loanAmount

  return (
    <div className="glass rounded-2xl p-6 space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Calculator className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-foreground">Financing Calculator</h3>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Down Payment
          </label>
          <input
            type="range"
            min={Math.round(price * 0.1)}
            max={Math.round(price * 0.9)}
            step={500}
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <p className="text-right text-lg font-semibold text-primary">{formatPrice(downPayment)}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Loan Term (months)
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[12, 24, 36, 48, 60, 72, 84, 96].map((m) => (
              <button
                key={m}
                onClick={() => setMonths(m)}
                className={`py-2 rounded-lg text-sm font-medium transition-all ${
                  months === m
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-primary/10 text-muted-foreground'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Interest Rate: {interestRate}%
          </label>
          <input
            type="range"
            min={1}
            max={15}
            step={0.1}
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>
      </div>

      <div className="pt-6 border-t border-border space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Loan Amount</span>
          <span className="font-semibold text-foreground">{formatPrice(loanAmount)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Monthly Payment</span>
          <span className="text-2xl font-bold text-primary">{formatPrice(monthlyPayment)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Total Interest</span>
          <span className="font-semibold text-foreground">{formatPrice(totalInterest)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Total Payment</span>
          <span className="font-semibold text-foreground">{formatPrice(totalPayment)}</span>
        </div>
      </div>
    </div>
  )
}

export default function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [car, setCar] = useState<Car | null>(null)
  const [relatedCars, setRelatedCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const { addToCompare, isInCompare } = useCompare()
  const isComparing = car ? isInCompare(car.id) : false

  useEffect(() => {
    async function fetchCar() {
      const carData = await getCarById(resolvedParams.id)
      setCar(carData)
      if (carData) {
        const allCars = await getCars()
        setRelatedCars(allCars.filter(c => c.id !== carData.id && c.brand === carData.brand).slice(0, 3))
      }
      setLoading(false)
    }
    fetchCar()
  }, [resolvedParams.id])

  if (loading) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-24">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-32" />
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="aspect-[16/10] bg-muted rounded-2xl" />
              <div className="space-y-6">
                <div className="h-10 bg-muted rounded w-3/4" />
                <div className="h-6 bg-muted rounded w-1/4" />
                <div className="h-32 bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  if (!car) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">Car Not Found</h1>
          <p className="text-muted-foreground mb-8">The car you are looking for does not exist or has been removed.</p>
          <Link
            href="/all-cars"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to All Cars
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  const isSold = car.status === 'sold'

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="relative overflow-hidden px-4 pb-24 pt-28 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-card/40 via-background to-background" />
        <div className="relative mx-auto max-w-7xl">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link href="/all-cars" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to All Cars
            </Link>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left - Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <ImageGallery images={car.images} carName={car.name} />
            </motion.div>

            {/* Right - Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Status Badge */}
              <span className={`inline-flex px-4 py-1.5 rounded-full text-sm font-bold text-white ${getStatusColor(car.status)}`}>
                {getStatusLabel(car.status)}
              </span>

              {/* Title & Price */}
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">{car.name}</h1>
                <p className="text-muted-foreground">{car.brand} {car.model}</p>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-primary">{formatPrice(car.price)}</span>
                {car.condition === 'New' && (
                  <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-sm font-medium">NEW</span>
                )}
              </div>

              {/* Quick Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: Calendar, label: 'Year', value: car.year },
                  { icon: Gauge, label: 'Mileage', value: formatMileage(car.mileage) },
                  { icon: Fuel, label: 'Fuel', value: car.fuel_type },
                  { icon: Settings, label: 'Transmission', value: car.transmission },
                ].map((spec) => (
                  <div key={spec.label} className="glass rounded-xl p-4 text-center">
                    <spec.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">{spec.label}</p>
                    <p className="font-semibold text-foreground">{spec.value}</p>
                  </div>
                ))}
              </div>

              {/* Full Specs */}
              <div className="glass rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-bold text-foreground">Specifications</h3>
                <div className="grid grid-cols-2 gap-y-3 gap-x-6">
                  {[
                    { icon: Cog, label: 'Engine', value: car.engine },
                    { icon: Palette, label: 'Color', value: car.color },
                    { icon: Star, label: 'Condition', value: car.condition },
                  ].map((spec) => (
                    <div key={spec.label} className="flex items-center gap-3">
                      <spec.icon className="w-4 h-4 text-primary shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">{spec.label}</p>
                        <p className="text-sm font-medium text-foreground">{spec.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="glass rounded-2xl p-6">
                <h3 className="text-lg font-bold text-foreground mb-3">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {car.description || 'No description available for this vehicle.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                {!isSold && (
                  <a
                    href={getWhatsAppLink(car.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-3 rounded-full bg-green-500 px-8 py-4 font-semibold text-white hover:bg-green-600 transition-all shadow-lg hover:shadow-green-500/25"
                  >
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp Interest
                  </a>
                )}
                <button
                  onClick={() => addToCompare(car)}
                  className={`px-6 py-4 rounded-full font-semibold transition-all flex items-center gap-2 ${
                    isComparing
                      ? 'bg-primary text-primary-foreground'
                      : 'glass hover:border-primary/50 text-foreground'
                  }`}
                >
                  <GitCompare className="w-5 h-5" />
                  {isComparing ? 'Added' : 'Compare'}
                </button>
              </div>
            </motion.div>
          </div>

          {/* Financing Calculator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16 max-w-2xl"
          >
            <FinancingCalculator price={car.price} />
          </motion.div>

          {/* Related Cars */}
          {relatedCars.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-20"
            >
              <h2 className="text-2xl font-bold text-foreground mb-8">More from {car.brand}</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedCars.map((relatedCar) => (
                  <Link
                    key={relatedCar.id}
                    href={`/car/${relatedCar.id}`}
                    className="glass rounded-2xl overflow-hidden group hover:border-primary/50 transition-all"
                  >
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={relatedCar.images[0] || '/images/placeholder.jpg'}
                        alt={relatedCar.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className={`absolute left-3 top-3 px-2 py-1 rounded-full text-xs font-bold text-white ${getStatusColor(relatedCar.status)}`}>
                        {getStatusLabel(relatedCar.status)}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground">{relatedCar.name}</h3>
                      <p className="text-primary font-bold">{formatPrice(relatedCar.price)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
