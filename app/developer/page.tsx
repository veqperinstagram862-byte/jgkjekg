"use client"

import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ImagePlus, Lock, Save, Trash2 } from "lucide-react"
import { DEFAULT_CARS, readSavedCars, saveCars, type Car } from "@/lib/cars"

type FormState = {
  name: string
  year: string
  price: string
  fuel: string
  power: string
  transmission: string
  image: string
}

const emptyForm: FormState = {
  name: "",
  year: new Date().getFullYear().toString(),
  price: "€",
  fuel: "Diesel",
  power: "",
  transmission: "Automatik",
  image: "",
}

export default function DeveloperPage() {
  const [form, setForm] = useState<FormState>(emptyForm)
  const [savedCars, setSavedCars] = useState<Car[]>([])
  const [message, setMessage] = useState("")
  const [accessCode, setAccessCode] = useState("")
  const [isUnlocked, setIsUnlocked] = useState(false)

  useEffect(() => {
    setSavedCars(readSavedCars())
    setIsUnlocked(window.sessionStorage.getItem("bellaqa-developer-access") === "yes")
  }, [])

  const unlockDeveloperPage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (accessCode.trim() === "bellaqa2026") {
      window.sessionStorage.setItem("bellaqa-developer-access", "yes")
      setIsUnlocked(true)
      setMessage("")
      return
    }

    setMessage("Kodi nuk është i saktë.")
  }

  const updateForm = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setMessage("Ju lutem zgjidhni vetëm foto.")
      return
    }

    const reader = new FileReader()
    reader.onload = () => updateForm("image", String(reader.result))
    reader.readAsDataURL(file)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!form.name.trim() || !form.year.trim() || !form.price.trim() || !form.image) {
      setMessage("Plotësoni emrin, vitin, çmimin dhe foton e veturës.")
      return
    }

    const car: Car = {
      id: Date.now(),
      name: form.name.trim(),
      year: Number(form.year),
      price: form.price.trim(),
      image: form.image,
      specs: {
        fuel: form.fuel.trim() || "N/A",
        power: form.power.trim() || "N/A",
        transmission: form.transmission.trim() || "N/A",
      },
    }

    const nextCars = [car, ...savedCars]
    setSavedCars(nextCars)
    saveCars(nextCars)
    setForm(emptyForm)
    setMessage("Vetura u shtua me sukses. Tani shfaqet te faqja ‘Të Gjitha Veturat’.")
  }

  const removeCar = (id: number) => {
    const nextCars = savedCars.filter((car) => car.id !== id)
    setSavedCars(nextCars)
    saveCars(nextCars)
    setMessage("Vetura u fshi.")
  }

  const clearAddedCars = () => {
    setSavedCars([])
    saveCars([])
    setMessage("Të gjitha veturat e shtuara u fshinë.")
  }

  if (!isUnlocked) {
    return (
      <main className="min-h-screen bg-background text-foreground px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[80vh] max-w-md items-center justify-center">
          <form onSubmit={unlockDeveloperPage} className="glass w-full rounded-2xl p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-3 text-primary">
                <Lock className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Panel privat</p>
                <h1 className="text-2xl font-bold">Developer Login</h1>
              </div>
            </div>
            <label className="space-y-2">
              <span className="text-sm text-muted-foreground">Kodi i developer-it</span>
              <input
                value={accessCode}
                onChange={(event) => setAccessCode(event.target.value)}
                className="w-full rounded-xl border border-border bg-background/70 px-4 py-3 outline-none focus:border-primary"
                placeholder="Shkruaj kodin"
                type="password"
              />
            </label>
            {message && <p className="mt-4 rounded-xl bg-primary/10 px-4 py-3 text-sm text-primary">{message}</p>}
            <button type="submit" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 font-semibold text-primary-foreground glow-primary">
              Hyr në panel
            </button>
          </form>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link href="/all-cars" className="mb-8 inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Shko te faqja e veturave
        </Link>

        <div className="mb-10">
          <p className="mb-3 inline-flex rounded-full glass px-4 py-1 text-sm font-medium text-primary">Paneli i Developer-it</p>
          <h1 className="text-3xl font-bold sm:text-5xl">Shto foto dhe të dhëna të veturave</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Këtu shtohen veturat. Vizitorët nuk e shohin këtë panel; ata shohin vetëm faqen “Të Gjitha Veturat”.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm text-muted-foreground">Emri i veturës</span>
                <input value={form.name} onChange={(e) => updateForm("name", e.target.value)} className="w-full rounded-xl border border-border bg-background/70 px-4 py-3 outline-none focus:border-primary" placeholder="Mercedes GLE 350d" />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-muted-foreground">Viti</span>
                <input value={form.year} onChange={(e) => updateForm("year", e.target.value)} className="w-full rounded-xl border border-border bg-background/70 px-4 py-3 outline-none focus:border-primary" placeholder="2024" type="number" />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-muted-foreground">Çmimi</span>
                <input value={form.price} onChange={(e) => updateForm("price", e.target.value)} className="w-full rounded-xl border border-border bg-background/70 px-4 py-3 outline-none focus:border-primary" placeholder="€45,000" />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-muted-foreground">Karburanti</span>
                <input value={form.fuel} onChange={(e) => updateForm("fuel", e.target.value)} className="w-full rounded-xl border border-border bg-background/70 px-4 py-3 outline-none focus:border-primary" placeholder="Diesel" />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-muted-foreground">Fuqia</span>
                <input value={form.power} onChange={(e) => updateForm("power", e.target.value)} className="w-full rounded-xl border border-border bg-background/70 px-4 py-3 outline-none focus:border-primary" placeholder="190 HP" />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-muted-foreground">Transmisioni</span>
                <input value={form.transmission} onChange={(e) => updateForm("transmission", e.target.value)} className="w-full rounded-xl border border-border bg-background/70 px-4 py-3 outline-none focus:border-primary" placeholder="Automatik" />
              </label>
            </div>

            <label className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-background/50 p-8 text-center hover:border-primary/60 transition-colors">
              <ImagePlus className="mb-3 h-10 w-10 text-primary" />
              <span className="font-semibold">Zgjidh foto të veturës</span>
              <span className="mt-1 text-sm text-muted-foreground">PNG, JPG ose WEBP</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>

            {form.image && (
              <div className="mt-6 overflow-hidden rounded-2xl border border-border">
                <Image src={form.image} alt="Pamja e fotos" width={900} height={520} unoptimized className="h-72 w-full object-cover" />
              </div>
            )}

            {message && <p className="mt-5 rounded-xl bg-primary/10 px-4 py-3 text-sm text-primary">{message}</p>}

            <button type="submit" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 font-semibold text-primary-foreground glow-primary transition-transform hover:scale-[1.01]">
              <Save className="h-5 w-5" />
              Ruaj veturën
            </button>
          </form>

          <aside className="glass rounded-2xl p-6 sm:p-8">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">Veturat e shtuara</h2>
                <p className="text-sm text-muted-foreground">Default: {DEFAULT_CARS.length} / Shtuar: {savedCars.length}</p>
              </div>
              {savedCars.length > 0 && (
                <button onClick={clearAddedCars} className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground hover:text-primary">
                  Fshiji krejt
                </button>
              )}
            </div>

            <div className="space-y-4">
              {savedCars.length === 0 ? (
                <p className="rounded-xl border border-border bg-background/40 p-5 text-muted-foreground">Ende nuk ka vetura të shtuara nga developer-i.</p>
              ) : (
                savedCars.map((car) => (
                  <div key={car.id} className="flex gap-4 rounded-xl border border-border bg-background/40 p-3">
                    <Image src={car.image} alt={car.name} width={120} height={90} unoptimized className="h-24 w-32 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-semibold">{car.name}</h3>
                      <p className="text-sm text-muted-foreground">{car.year} • {car.price}</p>
                      <button onClick={() => removeCar(car.id)} className="mt-3 inline-flex items-center gap-1 text-sm text-destructive hover:underline">
                        <Trash2 className="h-4 w-4" />
                        Fshij
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
