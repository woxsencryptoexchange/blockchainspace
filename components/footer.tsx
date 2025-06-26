"use client"

import { motion } from "framer-motion"
import { Twitter, Linkedin, Mail, Phone, MapPin, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Footer() {
  const socialLinks = [
    { icon: Twitter, href: "https://x.com/Woxsen", label: "Twitter" },
    { icon: Linkedin, href: "https://www.linkedin.com/company/airesearchcentre/posts/?feedView=all", label: "LinkedIn" },
  ]

  const quickLinks = [
    { name: "Noob View", href: "/" },
    { name: "Pro View", href: "/pro" },
    { name: "AIRC Website", href: "https://wou.aircwou.in/" },
  ]

  return (
    <footer className="bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <h3 className="text-2xl font-bold text-black dark:text-white mb-4">BlockchainSpace</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
              Comprehensive blockchain network analytics platform providing real-time insights into the decentralized
              ecosystem.
            </p>
            <div className="mb-6">
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-2">Developed by</p>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">W</span>
                </div>
                <div>
                  <p className="font-semibold text-black dark:text-white">AIRC Department</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Woxsen University</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h4 className="font-semibold text-black dark:text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                    <Link
                    href={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                    >
                    {link.name}
                    </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h4 className="font-semibold text-black dark:text-white mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Woxsen University, Hyderabad</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <a
                  href="mailto:airc@woxsen.edu.in"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                >
                  airc@woxsen.edu.in
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">+91 40 2858 5000</span>
              </div>
            </div>

            {/* Contact Us Button */}
            <Button
              className="mt-4 w-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
              onClick={() => window.open("mailto:airc@woxsen.edu.in", "_blank")}
            >
              <Mail className="w-4 h-4 mr-2" />
              Contact Us
            </Button>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-4 md:mb-0">
            © 2025 BlockchainSpace. All rights reserved. Built with ❤️ by AIRC, Woxsen University.
          </p>
   
        </motion.div>
      </div>
    </footer>
  )
}
