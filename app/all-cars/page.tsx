"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, Fuel, Gauge, Settings, Search, MessageCircle, GitCompare, Eye, X, CircleAlert as AlertCircle } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { getCars, searchCars, formatPrice, formatMileage, getWhatsAppLink, getStatusColor, getStatusLabel, type Car } from "@/lib/cars"
import { useCompare } from "@/lib/compare-context"

function StatusBadge({ status }: { status: Car['status'] }) {
  return (
    <span className={`absolute left-4 top-4 z-10 px-3 py-1.5 rounded-full text-xs font-bold text-white ${getStatusColor(status)}`}>
      {getStatusLabel(status)}
    </span>
  )
}

function CarCard({ car, onCompare }: { car: Car; onCompare: () => void }) {
  const { isInCompare } = useCompare()
  const isComparing = isInCompare(car.id)
  const isSold = car.status === 'sold'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group glass overflow-hidden rounded-2xl transition-all duration-300 hover:border-primary/50 ${isSold ? 'opacity-70' : ''}`}
    >
      <Link href={`/car/${car.id}`}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <StatusBadge status={car.status} />
          <Image
            src={car.images[0] || '/images/placeholder.jpg'}
            alt={car.name}
            fill
            className={`object-cover transition-transform duration-700 group-hover:scale-105 ${isSold ? 'grayscale-[30%]' : ''}`}
          />
          {isSold && (
            <div className="absolute inset-0 bg-background/20 flex items-center justify-center">
              <span className="bg-red-500/90 text-white px-4 py-2 rounded-full text-sm font-bold">SOLD</span>
            </div>
          )}
          <div className="absolute right-4 bottom-4 rounded-full glass px-4 py-2">
            <span className="font-bold text-primary">{formatPrice(car.price)}</span>
          </div>
        </div>
      </Link>
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <Link href={`/car/${car.id}`} className="hover:text-primary transition-colors">
            <h2 className="text-xl font-bold text-foreground">{car.name}</h2>
          </Link>
          <span className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {car.year}
          </span>
        </div>
        <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3 mb-4">
          <span className="flex items-center gap-2">
            <Fuel className="h-4 w-4 text-primary" />
            {car.fuel_type}
          </span>
          <span className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-primary" />
            {formatMileage(car.mileage)}
          </span>
          <span className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-primary" />
            {car.transmission}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/car/${car.id}`}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-primary/10 px-4 py-2.5 text-sm font-medium text-primary hover:bg-primary hover:text-primary-foreground transition-all"
          >
            <Eye className="h-4 w-4" />
            View Details
          </Link>
          {!isSold && (
            <a
              href={getWhatsAppLink(car.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-500/10 px-4 py-2.5 text-sm font-medium text-green-500 hover:bg-green-500 hover:text-white transition-all"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
          )}
          <button
            onClick={onCompare}
            className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
              isComparing
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
            }`}
          >
            <GitCompare className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function SearchSuggestions({
  cars,
  query,
  onSelect,
  onClose
}: {
  cars: Car[]
  query: string
  onSelect: (car: Car) => void
  onClose: () => void
}) {
  if (!query.trim() || cars.length === 0) return null

  const filtered = cars.filter(car => {
    const searchTerms = query.toLowerCase().split(' ')
    const carText = `${car.name} ${car.brand} ${car.model} ${car.year} ${car.fuel_type} ${car.transmission} ${car.color} ${car.condition} ${getStatusLabel(car.status)}`.toLowerCase()
    return searchTerms.every(term => carText.includes(term))
  }).slice(0, 6)

  if (filtered.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute top-full left-0 right-0 mt-2 glass rounded-xl overflow-hidden z-50"
    >
      {filtered.map((car) => (
        <button
          key={car.id}
          onClick={() => {
            onSelect(car)
            onClose()
          }}
          className="flex items-center gap-4 w-full px-4 py-3 hover:bg-primary/10 transition-colors text-left"
        >
          <div className="relative w-16 h-12 rounded-lg overflow-hidden shrink-0">
            <Image
              src={car.images[0] || '/images/placeholder.jpg'}
              alt={car.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground truncate">{car.name}</p>
            <p className="text-sm text-muted-foreground">
              {car.year} • {formatPrice(car.price)} • {getStatusLabel(car.status)}
            </p>
          </div>
        </button>
      ))}
    </motion.div>
  )
}

function CompareModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { compareList, removeFromCompare, clearCompare } = useCompare()

  if (!isOpen || compareList.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-6xl max-h-[90vh] overflow-auto glass rounded-2xl p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Compare Cars</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${compareList.length}, 1fr)` }}>
          {compareList.map((car) => (
            <div key={car.id} className="space-y-4">
              <button onClick={() => removeFromCompare(car.id)} className="w-full text-right text-sm text-muted-foreground hover:text-primary">
                Remove
              </button>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                <Image src={car.images[0] || '/images/placeholder.jpg'} alt={car.name} fill className="object-cover" />
              </div>
              <h3 className="text-lg font-bold text-foreground">{car.name}</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-semibold text-primary">{formatPrice(car.price)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Year</span>
                  <span className="font-semibold">{car.year}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Mileage</span>
                  <span className="font-semibold">{formatMileage(car.mileage)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Fuel</span>
                  <span className="font-semibold">{car.fuel_type}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Transmission</span>
                  <span className="font-semibold">{car.transmission}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Engine</span>
                  <span className="font-semibold">{car.engine}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Condition</span>
                  <span className="font-semibold">{car.condition}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Color</span>
                  <span className="font-semibold">{car.color}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Status</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold text-white ${getStatusColor(car.status)}`}>
                    {getStatusLabel(car.status)}
                  </span>
                </div>
              </div>
              <Link
                href={`/car/${car.id}`}
                onClick={onClose}
                className="block w-full text-center py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <button onClick={clearCompare} className="px-6 py-2 rounded-lg border border-border hover:bg-muted transition-colors">
            Clear All
          </button>
          <button onClick={onClose} className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function AllCarsPage() {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [showCompare, setShowCompare] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const { addToCompare, compareList } = useCompare()

  useEffect(() => {
    async function fetchCars() {
      const data = await getCars()
      setCars(data)
      setLoading(false)
    }
    fetchCars()
  }, [])

  const filteredCars = cars.filter(car => {
    if (!searchQuery.trim()) return true
    const searchTerms = searchQuery.toLowerCase().split(' ')
    const carText = `${car.name} ${car.brand} ${car.model} ${car.year} ${car.fuel_type} ${car.transmission} ${car.color} ${car.condition} ${getStatusLabel(car.status)}`.toLowerCase()
    return searchTerms.every(term => carText.includes(term))
  })

  const handleSelectSuggestion = useCallback((car: Car) => {
    setSearchQuery(car.name)
  }, [])

  const handleCompare = useCallback((car: Car) => {
    addToCompare(car)
  }, [addToCompare])

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="relative overflow-hidden px-4 pb-24 pt-36 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-card/40 via-background to-background" />
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(oklch(0.75 0.15 45) 1px, transparent 1px), linear-gradient(90deg, oklch(0.75 0.15 45) 1px, transparent 1px)`,
            backgroundSize: '100px 100px',
          }} />
        </div>
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="mb-4 inline-flex rounded-full glass px-4 py-1 text-sm font-medium text-primary">All Vehicles</p>
            <h1 className="text-4xl font-bold sm:text-6xl">Our Complete Collection</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Explore our premium selection of vehicles. Find your perfect match.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div ref={searchRef} className="relative">
              <div className="relative glass rounded-xl overflow-hidden">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  placeholder="Search by name, brand, model, year, fuel, transmission..."
                  className="w-full pl-12 pr-4 py-4 bg-transparent border-0 outline-none text-foreground placeholder-muted-foreground"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-muted transition-colors"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
              </div>
              <AnimatePresence>
                {isSearchFocused && searchQuery.trim() && (
                  <SearchSuggestions
                    cars={cars}
                    query={searchQuery}
                    onSelect={handleSelectSuggestion}
                    onClose={() => setIsSearchFocused(false)}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Compare Button */}
          {compareList.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed bottom-24 right-6 z-40"
            >
              <button
                onClick={() => setShowCompare(true)}
                className="flex items-center gap-3 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold shadow-lg hover:scale-105 transition-transform"
              >
                <GitCompare className="w-5 h-5" />
                Compare ({compareList.length})
              </button>
            </motion.div>
          )}

          {/* Results Count */}
          <div className="mb-8 flex items-center justify-between">
            <p className="text-muted-foreground">
              {loading ? 'Loading...' : `${filteredCars.length} car${filteredCars.length !== 1 ? 's' : ''} found`}
            </p>
          </div>

          {/* Cars Grid */}
          {loading ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="glass rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-[4/3] bg-muted" />
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                    <div className="h-10 bg-muted rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredCars.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No cars found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your search terms</p>
              <button
                onClick={() => setSearchQuery('')}
                className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Clear Search
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredCars.map((car) => (
                <CarCard key={car.id} car={car} onCompare={() => handleCompare(car)} />
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
      <WhatsAppButton />
      <AnimatePresence>
        <CompareModal isOpen={showCompare} onClose={() => setShowCompare(false)} />
      </AnimatePresence>
    </main>
  )
}
