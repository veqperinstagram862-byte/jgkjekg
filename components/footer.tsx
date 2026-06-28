"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  const links = {
    vetura: [
      { label: "BMW", href: "#" },
      { label: "Mercedes-Benz", href: "#" },
      { label: "Audi", href: "#" },
      { label: "Porsche", href: "#" },
      { label: "Range Rover", href: "#" },
    ],
    sherbime: [
      { label: "Blerje", href: "#" },
      { label: "Financim", href: "#" },
      { label: "Garanci", href: "#" },
      { label: "Servis", href: "#" },
    ],
    info: [
      { label: "Rreth Nesh", href: "#about" },
      { label: "Kontakt", href: "#contact" },
      { label: "Lokacioni", href: "#contact" },
    ],
  }

  const socials = [
    { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
  ]

  return (
    <footer className="relative bg-card/50 border-t border-border">
      {/* Glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="#hero" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center glow-primary">
                <span className="text-primary-foreground font-bold text-xl">B</span>
              </div>
              <div>
                <p className="text-foreground font-semibold text-lg">Bellaqa</p>
                <p className="text-muted-foreground text-xs tracking-widest uppercase">Prizren</p>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm mb-6">
              Autosalloni më i besueshëm në Prizren. Eksperiencë premium në çdo veturë.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socials.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links - Vetura */}
          <div>
            <h4 className="text-foreground font-semibold mb-4">Vetura</h4>
            <ul className="space-y-3">
              {links.vetura.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links - Sherbime */}
          <div>
            <h4 className="text-foreground font-semibold mb-4">Shërbime</h4>
            <ul className="space-y-3">
              {links.sherbime.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-foreground font-semibold mb-4">Kontakt</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span>Rruga Adem Jashari, Prizren, Kosovë</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <a href="tel:+38344123456" className="hover:text-primary transition-colors">
                  +383 44 123 456
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <a href="mailto:info@bellaqaprizren.com" className="hover:text-primary transition-colors">
                  info@bellaqaprizren.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © {currentYear} Autosalloni Bellaqa Prizren. Të gjitha të drejtat e rezervuara.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors">Politika e Privatësisë</Link>
            <Link href="#" className="hover:text-primary transition-colors">Kushtet e Përdorimit</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
