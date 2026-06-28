"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Phone, MapPin } from "lucide-react"
import Link from "next/link"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { label: "Ballina", href: "/#hero" },
    { label: "Vetura", href: "/#showroom" },
    { label: "Të Gjitha Veturat", href: "/all-cars" },
    { label: "E Re", href: "/#new-arrivals" },
    { label: "Rreth Nesh", href: "/#about" },
    { label: "Kontakt", href: "/#contact" },
  ]

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "glass py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/#hero" className="flex items-center gap-3 group">
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center glow-primary">
                  <span className="text-primary-foreground font-bold text-xl">B</span>
                </div>
              </motion.div>
              <div className="hidden sm:block">
                <p className="text-foreground font-semibold text-lg tracking-tight">Bellaqa</p>
                <p className="text-muted-foreground text-xs tracking-widest uppercase">Prizren</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className="relative text-muted-foreground hover:text-foreground transition-colors duration-300 text-sm font-medium tracking-wide group"
                  >
                    {item.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Contact Info & CTA */}
            <div className="hidden lg:flex items-center gap-6">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm">Prizren, Kosovë</span>
              </div>
              <motion.a
                href="tel:+38344123456"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-medium text-sm glow-primary transition-shadow hover:shadow-[0_0_40px_oklch(0.75_0.15_45/0.5)]"
              >
                <Phone className="w-4 h-4" />
                <span>Na Telefono</span>
              </motion.a>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg glass"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden pt-20"
          >
            <div className="absolute inset-0 bg-background/95 backdrop-blur-xl" />
            <nav className="relative flex flex-col items-center justify-center h-full gap-8">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-3xl font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.a
                href="tel:+38344123456"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold text-lg glow-primary"
              >
                <Phone className="w-5 h-5" />
                <span>Na Telefono</span>
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
