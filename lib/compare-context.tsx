'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Car } from './cars'

type CompareContextType = {
  compareList: Car[]
  addToCompare: (car: Car) => void
  removeFromCompare: (carId: string) => void
  isInCompare: (carId: string) => boolean
  clearCompare: () => void
  canAddMore: boolean
}

const CompareContext = createContext<CompareContextType | null>(null)

const MAX_COMPARE = 3

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareList, setCompareList] = useState<Car[]>([])

  const addToCompare = useCallback((car: Car) => {
    setCompareList((prev) => {
      if (prev.length >= MAX_COMPARE) return prev
      if (prev.some((c) => c.id === car.id)) return prev
      return [...prev, car]
    })
  }, [])

  const removeFromCompare = useCallback((carId: string) => {
    setCompareList((prev) => prev.filter((c) => c.id !== carId))
  }, [])

  const isInCompare = useCallback((carId: string) => {
    return compareList.some((c) => c.id === carId)
  }, [compareList])

  const clearCompare = useCallback(() => {
    setCompareList([])
  }, [])

  const canAddMore = compareList.length < MAX_COMPARE

  return (
    <CompareContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        isInCompare,
        clearCompare,
        canAddMore,
      }}
    >
      {children}
    </CompareContext.Provider>
  )
}

export function useCompare() {
  const context = useContext(CompareContext)
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider')
  }
  return context
}
