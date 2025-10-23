import type React from "react"
import "./globals.css" // Import globals.css at the top of the file

// ... existing code ...

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.app'
    };
