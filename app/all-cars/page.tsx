"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Calendar, Fuel, Gauge, Settings } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { DEFAULT_CARS, readSavedCars, type Car } from "@/lib/cars"

function CarCard({ car }: { car: Car }) {
  return (
    <div className="glass overflow-hidden rounded-2xl transition-all duration-300 hover:border-primary/50">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={car.image}
          alt={car.name}
          fill
          unoptimized={car.image.startsWith("data:")}
          className="object-cover transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute right-4 top-4 rounded-full glass px-4 py-2">
          <span className="font-bold text-primary">{car.price}</span>
        </div>
      </div>
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-foreground">{car.name}</h2>
          <span className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {car.year}
          </span>
        </div>
        <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
          <span className="flex items-center gap-2">
            <Fuel className="h-4 w-4 text-primary" />
            {car.specs.fuel}
          </span>
          <span className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-primary" />
            {car.specs.power}
          </span>
          <span className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-primary" />
            {car.specs.transmission}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function AllCarsPage() {
  const [cars, setCars] = useState<Car[]>(DEFAULT_CARS)

  useEffect(() => {
    setCars([...readSavedCars(), ...DEFAULT_CARS])
  }, [])

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="relative overflow-hidden px-4 pb-24 pt-36 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-card/40 via-background to-background" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="mb-4 inline-flex rounded-full glass px-4 py-1 text-sm font-medium text-primary">Të gjitha veturat</p>
            <h1 className="text-4xl font-bold sm:text-6xl">Koleksioni i Plotë</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Këtu shfaqen veturat ekzistuese dhe çdo veturë e re që shtohet nga paneli privat i developer-it.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </div>
      </section>
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
