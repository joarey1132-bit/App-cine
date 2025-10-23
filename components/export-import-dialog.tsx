"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { importCinemaMap, type Seat } from "@/lib/cinema-config"
import { AlertCircle, CheckCircle } from "lucide-react"

interface ExportImportDialogProps {
  onImport: (seats: Record<string, Seat>) => void
  selectedSeats: string[]
}

export default function ExportImportDialog({ onImport, selectedSeats }: ExportImportDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [importStatus, setImportStatus] = useState<"idle" | "success" | "error">("idle")
  const [importMessage, setImportMessage] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const seats = importCinemaMap(content)
        onImport(seats)
        setImportStatus("success")
        setImportMessage("Mapa importado exitosamente")
        setTimeout(() => {
          setIsOpen(false)
          setImportStatus("idle")
        }, 2000)
      } catch (error) {
        setImportStatus("error")
        setImportMessage("Error al importar el archivo. Verifica que sea un archivo JSON válido.")
      }
    }
    reader.readAsText(file)
  }

  const exportAsJSON = () => {
    const data = {
      selectedSeats,
      exportedAt: new Date().toISOString(),
      format: "json",
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `cinema-selection-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportAsCSV = () => {
    const csv = ["Butaca,Estado", ...selectedSeats.map((seat) => `${seat},Seleccionada`)].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `cinema-selection-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-purple-600 hover:bg-purple-700">Exportar/Importar</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Exportar e Importar Mapas</DialogTitle>
          <DialogDescription>Gestiona tus mapas de cine con opciones de exportación e importación</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Export Section */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Exportar Selección</h3>
            <div className="flex gap-2">
              <Button onClick={exportAsJSON} variant="outline" size="sm" className="flex-1 bg-transparent">
                JSON
              </Button>
              <Button onClick={exportAsCSV} variant="outline" size="sm" className="flex-1 bg-transparent">
                CSV
              </Button>
            </div>
          </div>

          {/* Import Section */}
          <div className="space-y-3 pt-4 border-t">
            <h3 className="font-semibold text-sm">Importar Mapa</h3>
            <input ref={fileInputRef} type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            <Button onClick={() => fileInputRef.current?.click()} variant="outline" size="sm" className="w-full">
              Seleccionar Archivo JSON
            </Button>
          </div>

          {/* Status Messages */}
          {importStatus === "success" && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{importMessage}</AlertDescription>
            </Alert>
          )}

          {importStatus === "error" && (
            <Alert className="bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{importMessage}</AlertDescription>
            </Alert>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
