"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from "lucide-react"

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  const [formState, setFormState] = useState({
    name: "",
    phone: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted:", formState)
  }

  const contactInfo = [
    {
      icon: MapPin,
      label: "Adresa",
      value: "Rruga Adem Jashari, Prizren, Kosovë",
    },
    {
      icon: Phone,
      label: "Telefon",
      value: "+383 44 123 456",
    },
    {
      icon: Mail,
      label: "Email",
      value: "info@bellaqaprizren.com",
    },
    {
      icon: Clock,
      label: "Orari",
      value: "E Hënë - E Shtunë: 09:00 - 19:00",
    },
  ]

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1 rounded-full glass text-primary text-sm font-medium mb-4"
          >
            <MessageCircle className="w-4 h-4" />
            Na Kontaktoni
          </motion.span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Jemi Këtu për <span className="text-primary">Ju</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
            Keni pyetje? Na kontaktoni dhe do t&apos;ju përgjigjemi sa më shpejt.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="space-y-6">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ x: 5 }}
                  className="flex items-start gap-4 p-4 rounded-xl glass transition-all duration-300 hover:shadow-[0_0_20px_oklch(0.75_0.15_45/0.1)]"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">{item.label}</p>
                    <p className="text-foreground font-medium">{item.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Map placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 }}
              className="mt-8 aspect-video rounded-2xl glass overflow-hidden"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d47618.07821562!2d20.696!3d42.213!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1353063b9d4b1e1b%3A0x8ad80d7a1d437d!2sPrizren!5e0!3m2!1sen!2s!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale hover:grayscale-0 transition-all duration-500"
              />
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 sm:p-8">
              <h3 className="text-xl font-semibold text-foreground mb-6">Dërgoni Mesazh</h3>
              
              <div className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-2">
                    Emri i Plotë
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="text"
                    id="name"
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary text-foreground placeholder-muted-foreground transition-all duration-300 outline-none"
                    placeholder="Emri juaj"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-muted-foreground mb-2">
                    Numri i Telefonit
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="tel"
                    id="phone"
                    value={formState.phone}
                    onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary text-foreground placeholder-muted-foreground transition-all duration-300 outline-none"
                    placeholder="+383 44 XXX XXX"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-muted-foreground mb-2">
                    Mesazhi
                  </label>
                  <motion.textarea
                    whileFocus={{ scale: 1.01 }}
                    id="message"
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary text-foreground placeholder-muted-foreground transition-all duration-300 outline-none resize-none"
                    placeholder="Shkruani mesazhin tuaj këtu..."
                    required
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold glow-primary transition-all duration-300 hover:shadow-[0_0_40px_oklch(0.75_0.15_45/0.5)]"
                >
                  <Send className="w-5 h-5" />
                  <span>Dërgo Mesazhin</span>
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
