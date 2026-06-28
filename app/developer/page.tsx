"use client"

import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ImagePlus, Lock, Save, Trash2, CreditCard as Edit, X, Check, Star, Plus } from "lucide-react"
import { getCars, createCar, updateCar, deleteCar, formatPrice, type Car, type CarFormData, type CarStatus, type CarCondition } from "@/lib/cars"

type FormState = {
  name: string
  brand: string
  model: string
  year: string
  price: string
  mileage: string
  fuel_type: string
  transmission: string
  engine: string
  color: string
  condition: CarCondition
  status: CarStatus
  description: string
  images: string[]
  featured: boolean
}

const emptyForm: FormState = {
  name: "",
  brand: "",
  model: "",
  year: new Date().getFullYear().toString(),
  price: "",
  mileage: "0",
  fuel_type: "Petrol",
  transmission: "Automatic",
  engine: "",
  color: "",
  condition: "Used",
  status: "available",
  description: "",
  images: [],
  featured: false,
}

export default function DeveloperPage() {
  const [form, setForm] = useState<FormState>(emptyForm)
  const [cars, setCars] = useState<Car[]>([])
  const [message, setMessage] = useState("")
  const [accessCode, setAccessCode] = useState("")
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setIsUnlocked(window.sessionStorage.getItem("bellaqa-developer-access") === "yes")
  }, [])

  const fetchCars = async () => {
    const data = await getCars()
    setCars(data)
  }

  useEffect(() => {
    if (isUnlocked) {
      fetchCars()
    }
  }, [isUnlocked])

  const unlockDeveloperPage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (accessCode.trim() === "bellaqa2026") {
      window.sessionStorage.setItem("bellaqa-developer-access", "yes")
      setIsUnlocked(true)
      setMessage("")
      return
    }

    setMessage("Incorrect access code.")
  }

  const updateForm = (field: keyof FormState, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const newImages: string[] = []
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue

      const reader = new FileReader()
      const dataUrl = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(String(reader.result))
        reader.readAsDataURL(file)
      })
      newImages.push(dataUrl)
    }

    setForm((current) => ({ ...current, images: [...current.images, ...newImages] }))
  }

  const removeImage = (index: number) => {
    setForm((current) => ({
      ...current,
      images: current.images.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    if (!form.name.trim() || !form.brand.trim() || !form.model.trim() || !form.year.trim() || !form.price.trim()) {
      setMessage("Please fill in all required fields.")
      setLoading(false)
      return
    }

    if (form.images.length === 0) {
      setMessage("Please add at least one image.")
      setLoading(false)
      return
    }

    const carData: CarFormData = {
      name: form.name.trim(),
      brand: form.brand.trim(),
      model: form.model.trim(),
      year: Number(form.year),
      price: Number(form.price.replace(/[^0-9]/g, "")),
      mileage: Number(form.mileage.replace(/[^0-9]/g, "")),
      fuel_type: form.fuel_type,
      transmission: form.transmission,
      engine: form.engine || "N/A",
      color: form.color || "N/A",
      condition: form.condition,
      status: form.status,
      description: form.description,
      images: form.images,
      featured: form.featured,
    }

    let success = false
    if (editingId) {
      const updated = await updateCar(editingId, carData)
      success = !!updated
      if (success) setMessage("Car updated successfully!")
    } else {
      const created = await createCar(carData)
      success = !!created
      if (success) setMessage("Car added successfully!")
    }

    if (success) {
      setForm(emptyForm)
      setEditingId(null)
      fetchCars()
    } else {
      setMessage("Failed to save car. Please try again.")
    }

    setLoading(false)
  }

  const handleEdit = (car: Car) => {
    setForm({
      name: car.name,
      brand: car.brand,
      model: car.model,
      year: car.year.toString(),
      price: car.price.toString(),
      mileage: car.mileage.toString(),
      fuel_type: car.fuel_type,
      transmission: car.transmission,
      engine: car.engine,
      color: car.color,
      condition: car.condition,
      status: car.status,
      description: car.description,
      images: car.images,
      featured: car.featured,
    })
    setEditingId(car.id)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this car?")) return

    const success = await deleteCar(id)
    if (success) {
      setMessage("Car deleted successfully!")
      fetchCars()
      if (editingId === id) {
        setEditingId(null)
        setForm(emptyForm)
      }
    } else {
      setMessage("Failed to delete car.")
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm(emptyForm)
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
                <p className="text-sm text-muted-foreground">Private Panel</p>
                <h1 className="text-2xl font-bold">Developer Login</h1>
              </div>
            </div>
            <label className="space-y-2">
              <span className="text-sm text-muted-foreground">Access Code</span>
              <input
                value={accessCode}
                onChange={(event) => setAccessCode(event.target.value)}
                className="w-full rounded-xl border border-border bg-background/70 px-4 py-3 outline-none focus:border-primary"
                placeholder="Enter access code"
                type="password"
              />
            </label>
            {message && <p className="mt-4 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{message}</p>}
            <button type="submit" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 font-semibold text-primary-foreground glow-primary">
              Enter Panel
            </button>
          </form>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link href="/all-cars" className="mb-8 inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to All Cars
        </Link>

        <div className="mb-10">
          <p className="mb-3 inline-flex rounded-full glass px-4 py-1 text-sm font-medium text-primary">Admin Panel</p>
          <h1 className="text-3xl font-bold sm:text-5xl">
            {editingId ? "Edit Car" : "Add New Car"}
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Manage your car inventory. Add, edit, or remove vehicles from the showroom.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          {/* Form */}
          <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 sm:p-8">
            {editingId && (
              <div className="mb-6 flex items-center justify-between">
                <span className="text-sm text-primary font-medium">Editing mode</span>
                <button type="button" onClick={cancelEdit} className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1">
                  <X className="w-4 h-4" /> Cancel
                </button>
              </div>
            )}

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <label className="space-y-2">
                <span className="text-sm text-muted-foreground">Name *</span>
                <input
                  value={form.name}
                  onChange={(e) => updateForm("name", e.target.value)}
                  className="w-full rounded-xl border border-border bg-background/70 px-4 py-3 outline-none focus:border-primary"
                  placeholder="BMW 520d xDrive"
                  required
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-muted-foreground">Brand *</span>
                <input
                  value={form.brand}
                  onChange={(e) => updateForm("brand", e.target.value)}
                  className="w-full rounded-xl border border-border bg-background/70 px-4 py-3 outline-none focus:border-primary"
                  placeholder="BMW"
                  required
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-muted-foreground">Model *</span>
                <input
                  value={form.model}
                  onChange={(e) => updateForm("model", e.target.value)}
                  className="w-full rounded-xl border border-border bg-background/70 px-4 py-3 outline-none focus:border-primary"
                  placeholder="520d xDrive"
                  required
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-muted-foreground">Year *</span>
                <input
                  value={form.year}
                  onChange={(e) => updateForm("year", e.target.value)}
                  className="w-full rounded-xl border border-border bg-background/70 px-4 py-3 outline-none focus:border-primary"
                  placeholder="2024"
                  type="number"
                  required
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-muted-foreground">Price (EUR) *</span>
                <input
                  value={form.price}
                  onChange={(e) => updateForm("price", e.target.value)}
                  className="w-full rounded-xl border border-border bg-background/70 px-4 py-3 outline-none focus:border-primary"
                  placeholder="45000"
                  type="number"
                  required
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-muted-foreground">Mileage (km)</span>
                <input
                  value={form.mileage}
                  onChange={(e) => updateForm("mileage", e.target.value)}
                  className="w-full rounded-xl border border-border bg-background/70 px-4 py-3 outline-none focus:border-primary"
                  placeholder="25000"
                  type="number"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-muted-foreground">Fuel Type</span>
                <select
                  value={form.fuel_type}
                  onChange={(e) => updateForm("fuel_type", e.target.value)}
                  className="w-full rounded-xl border border-border bg-background/70 px-4 py-3 outline-none focus:border-primary"
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Plug-in Hybrid">Plug-in Hybrid</option>
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm text-muted-foreground">Transmission</span>
                <select
                  value={form.transmission}
                  onChange={(e) => updateForm("transmission", e.target.value)}
                  className="w-full rounded-xl border border-border bg-background/70 px-4 py-3 outline-none focus:border-primary"
                >
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                  <option value="Semi-Automatic">Semi-Automatic</option>
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm text-muted-foreground">Engine</span>
                <input
                  value={form.engine}
                  onChange={(e) => updateForm("engine", e.target.value)}
                  className="w-full rounded-xl border border-border bg-background/70 px-4 py-3 outline-none focus:border-primary"
                  placeholder="2.0L TwinPower Turbo"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-muted-foreground">Color</span>
                <input
                  value={form.color}
                  onChange={(e) => updateForm("color", e.target.value)}
                  className="w-full rounded-xl border border-border bg-background/70 px-4 py-3 outline-none focus:border-primary"
                  placeholder="Alpine White"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-muted-foreground">Condition</span>
                <select
                  value={form.condition}
                  onChange={(e) => updateForm("condition", e.target.value as CarCondition)}
                  className="w-full rounded-xl border border-border bg-background/70 px-4 py-3 outline-none focus:border-primary"
                >
                  <option value="New">New</option>
                  <option value="Used">Used</option>
                  <option value="Certified Pre-Owned">Certified Pre-Owned</option>
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm text-muted-foreground">Status</span>
                <select
                  value={form.status}
                  onChange={(e) => updateForm("status", e.target.value as CarStatus)}
                  className="w-full rounded-xl border border-border bg-background/70 px-4 py-3 outline-none focus:border-primary"
                >
                  <option value="available">Available</option>
                  <option value="reserved">Reserved</option>
                  <option value="sold">Sold</option>
                </select>
              </label>
            </div>

            <label className="mt-6 block space-y-2">
              <span className="text-sm text-muted-foreground">Description</span>
              <textarea
                value={form.description}
                onChange={(e) => updateForm("description", e.target.value)}
                className="w-full rounded-xl border border-border bg-background/70 px-4 py-3 outline-none focus:border-primary min-h-[100px] resize-none"
                placeholder="Describe the car's features, condition, and history..."
              />
            </label>

            <label className="mt-4 flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => updateForm("featured", e.target.checked)}
                className="w-5 h-5 rounded accent-primary"
              />
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Star className="w-4 h-4 text-primary" />
                Featured car (show in homepage highlights)
              </span>
            </label>

            {/* Image Upload */}
            <div className="mt-6">
              <span className="text-sm text-muted-foreground mb-2 block">Images *</span>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-background/50 p-8 text-center hover:border-primary/60 transition-colors">
                <ImagePlus className="mb-3 h-10 w-10 text-primary" />
                <span className="font-semibold">Add Images</span>
                <span className="mt-1 text-sm text-muted-foreground">PNG, JPG or WEBP (multiple allowed)</span>
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
              </label>
            </div>

            {/* Image Previews */}
            <AnimatePresence>
              {form.images.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-3"
                >
                  {form.images.map((img, index) => (
                    <div key={index} className="relative aspect-[4/3] rounded-xl overflow-hidden group">
                      <Image src={img} alt={`Preview ${index + 1}`} fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-destructive text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {message && (
              <p className={`mt-5 rounded-xl px-4 py-3 text-sm ${message.includes("success") ? "bg-green-500/10 text-green-500" : "bg-destructive/10 text-destructive"}`}>
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 font-semibold text-primary-foreground glow-primary transition-transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                "Saving..."
              ) : editingId ? (
                <>
                  <Check className="h-5 w-5" />
                  Update Car
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5" />
                  Add Car
                </>
              )}
            </button>
          </form>

          {/* Car List */}
          <aside className="glass rounded-2xl p-6 sm:p-8">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">All Cars ({cars.length})</h2>
                <p className="text-sm text-muted-foreground">Manage existing vehicles</p>
              </div>
            </div>

            <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
              {cars.length === 0 ? (
                <p className="rounded-xl border border-border bg-background/40 p-5 text-muted-foreground">No cars in inventory.</p>
              ) : (
                cars.map((car) => (
                  <div
                    key={car.id}
                    className={`flex gap-4 rounded-xl border border-border bg-background/40 p-3 ${editingId === car.id ? "ring-2 ring-primary" : ""}`}
                  >
                    <div className="relative w-24 h-20 shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={car.images[0] || "/images/placeholder.jpg"}
                        alt={car.name}
                        fill
                        className="object-cover"
                      />
                      <span className={`absolute top-1 left-1 px-1.5 py-0.5 rounded text-[10px] font-bold text-white ${
                        car.status === "available" ? "bg-green-500" : car.status === "reserved" ? "bg-yellow-500" : "bg-red-500"
                      }`}>
                        {car.status.toUpperCase()}
                      </span>
                      {car.featured && (
                        <Star className="absolute bottom-1 right-1 w-4 h-4 text-yellow-400 fill-yellow-400" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-semibold">{car.name}</h3>
                      <p className="text-sm text-muted-foreground">{car.year} - {formatPrice(car.price)}</p>
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => handleEdit(car)}
                          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          <Edit className="h-3 w-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(car.id)}
                          className="inline-flex items-center gap-1 text-xs text-destructive hover:underline"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </button>
                      </div>
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
