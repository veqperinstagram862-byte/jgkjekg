"use client"

import { motion } from "framer-motion"
import { MessageCircle } from "lucide-react"

export function WhatsAppButton() {
  const phoneNumber = "38344123456"
  const message = encodeURIComponent("Përshëndetje! Jam i interesuar për veturat tuaja.")
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2, type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 group"
      aria-label="Na kontaktoni në WhatsApp"
    >
      {/* Tooltip */}
      <motion.span
        initial={{ opacity: 0, x: 10 }}
        whileHover={{ opacity: 1, x: 0 }}
        className="hidden sm:block px-3 py-2 rounded-lg bg-foreground text-background text-sm font-medium whitespace-nowrap"
      >
        Na shkruani në WhatsApp
      </motion.span>

      {/* Button */}
      <div className="relative">
        {/* Pulse rings */}
        <motion.div
          animate={{
            scale: [1, 1.5, 1.5],
            opacity: [0.5, 0, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1,
          }}
          className="absolute inset-0 rounded-full bg-[#25D366]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1.3],
            opacity: [0.5, 0, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1,
            delay: 0.3,
          }}
          className="absolute inset-0 rounded-full bg-[#25D366]"
        />

        {/* Main button */}
        <div className="relative w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-[0_4px_20px_rgba(37,211,102,0.4)] transition-shadow hover:shadow-[0_4px_30px_rgba(37,211,102,0.6)]">
          <MessageCircle className="w-7 h-7 text-white" fill="white" />
        </div>
      </div>
    </motion.a>
  )
}
