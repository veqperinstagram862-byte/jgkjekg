import { supabase } from './supabase'

export type CarStatus = 'available' | 'reserved' | 'sold'
export type CarCondition = 'New' | 'Used' | 'Certified Pre-Owned'

export type Car = {
  id: string
  name: string
  brand: string
  model: string
  year: number
  price: number
  mileage: number
  fuel_type: string
  transmission: string
  engine: string
  color: string
  condition: CarCondition
  status: CarStatus
  description: string
  images: string[]
  featured: boolean
  created_at: string
  updated_at: string
}

export type CarFormData = {
  name: string
  brand: string
  model: string
  year: number
  price: number
  mileage: number
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

export async function getCars(): Promise<Car[]> {
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching cars:', error)
    return []
  }

  return data || []
}

export async function getCarById(id: string): Promise<Car | null> {
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching car:', error)
    return null
  }

  return data
}

export async function getFeaturedCars(): Promise<Car[]> {
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching featured cars:', error)
    return []
  }

  return data || []
}

export async function getAvailableCars(): Promise<Car[]> {
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .neq('status', 'sold')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching available cars:', error)
    return []
  }

  return data || []
}

export async function searchCars(query: string): Promise<Car[]> {
  const searchTerm = query.toLowerCase().trim()

  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .or(`name.ilike.%${searchTerm},brand.ilike.%${searchTerm},model.ilike.%${searchTerm}`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error searching cars:', error)
    return []
  }

  return data || []
}

export async function createCar(car: CarFormData): Promise<Car | null> {
  const { data, error } = await supabase
    .from('cars')
    .insert([car])
    .select()
    .single()

  if (error) {
    console.error('Error creating car:', error)
    return null
  }

  return data
}

export async function updateCar(id: string, car: Partial<CarFormData>): Promise<Car | null> {
  const { data, error } = await supabase
    .from('cars')
    .update({ ...car, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating car:', error)
    return null
  }

  return data
}

export async function deleteCar(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('cars')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting car:', error)
    return false
  }

  return true
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatMileage(mileage: number): string {
  return new Intl.NumberFormat('de-DE').format(mileage) + ' km'
}

export function getWhatsAppLink(carName: string, phoneNumber: string = '38344123456'): string {
  const message = encodeURIComponent(`Hello, I am interested in ${carName}. Is it still available?`)
  return `https://wa.me/${phoneNumber}?text=${message}`
}

export function getStatusColor(status: CarStatus): string {
  switch (status) {
    case 'available':
      return 'bg-green-500'
    case 'reserved':
      return 'bg-yellow-500'
    case 'sold':
      return 'bg-red-500'
    default:
      return 'bg-gray-500'
  }
}

export function getStatusLabel(status: CarStatus): string {
  switch (status) {
    case 'available':
      return 'Available'
    case 'reserved':
      return 'Reserved'
    case 'sold':
      return 'Sold'
    default:
      return status
  }
}

// Legacy compatibility
export const CARS_STORAGE_KEY = "bellaqa-cars"

export function readSavedCars(): Car[] {
  return []
}

export function saveCars(cars: Car[]) {
  // No longer used - using Supabase
}
