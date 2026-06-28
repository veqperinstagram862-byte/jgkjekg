export type Car = {
  id: number
  name: string
  year: number
  price: string
  image: string
  specs: {
    fuel: string
    power: string
    transmission: string
  }
}

export const DEFAULT_CARS: Car[] = [
  {
    id: 1,
    name: "BMW 520d",
    year: 2023,
    price: "€42,900",
    image: "/images/car-1.jpg",
    specs: { fuel: "Diesel", power: "190 HP", transmission: "Automatik" },
  },
  {
    id: 2,
    name: "Audi A6 Quattro",
    year: 2022,
    price: "€48,500",
    image: "/images/car-2.jpg",
    specs: { fuel: "Benzinë", power: "245 HP", transmission: "Automatik" },
  },
  {
    id: 3,
    name: "Porsche Cayenne",
    year: 2023,
    price: "€89,900",
    image: "/images/car-3.jpg",
    specs: { fuel: "Benzinë", power: "340 HP", transmission: "Automatik" },
  },
]

export const CARS_STORAGE_KEY = "bellaqa-cars"

export function readSavedCars(): Car[] {
  if (typeof window === "undefined") return []

  try {
    const savedCars = window.localStorage.getItem(CARS_STORAGE_KEY)
    if (!savedCars) return []

    const parsedCars = JSON.parse(savedCars)
    return Array.isArray(parsedCars) ? parsedCars : []
  } catch {
    return []
  }
}

export function saveCars(cars: Car[]) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(CARS_STORAGE_KEY, JSON.stringify(cars))
}
