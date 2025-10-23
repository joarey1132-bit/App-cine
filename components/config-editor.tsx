"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"

interface CinemaConfig {
  name: string
  totalSeats: number
  pricePerSeat: number
  sections: Array<{
    name: string
    rows: number
    seatsPerRow: number
  }>
}

interface ConfigEditorProps {
  onConfigChange?: (config: CinemaConfig) => void
}

const DEFAULT_CONFIG: CinemaConfig = {
  name: "Cine Principal",
  totalSeats: 139,
  pricePerSeat: 12,
  sections: [
    { name: "Lado Izquierdo", rows: 7, seatsPerRow: 5 },
    { name: "Zona Central Izquierda", rows: 7, seatsPerRow: 4 },
    { name: "Zona Central Derecha", rows: 7, seatsPerRow: 4 },
    { name: "Lado Derecho", rows: 7, seatsPerRow: 5 },
  ],
}

export default function ConfigEditor({ onConfigChange }: ConfigEditorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [config, setConfig] = useState<CinemaConfig>(DEFAULT_CONFIG)
  const [savedConfigs, setSavedConfigs] = useState<CinemaConfig[]>([])
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [statusMessage, setStatusMessage] = useState("")

  const calculateTotalSeats = (sections: CinemaConfig["sections"]) => {
    return sections.reduce((total, section) => total + section.rows * section.seatsPerRow, 0)
  }

  const handleSectionChange = (index: number, field: string, value: any) => {
    const newSections = [...config.sections]
    newSections[index] = { ...newSections[index], [field]: value }
    const newConfig = { ...config, sections: newSections }
    newConfig.totalSeats = calculateTotalSeats(newSections)
    setConfig(newConfig)
  }

  const handleAddSection = () => {
    const newSections = [
      ...config.sections,
      { name: `Nueva Sección ${config.sections.length + 1}`, rows: 7, seatsPerRow: 4 },
    ]
    const newConfig = { ...config, sections: newSections }
    newConfig.totalSeats = calculateTotalSeats(newSections)
    setConfig(newConfig)
  }

  const handleRemoveSection = (index: number) => {
    if (config.sections.length <= 1) {
      setStatus("error")
      setStatusMessage("Debe haber al menos una sección")
      return
    }
    const newSections = config.sections.filter((_, i) => i !== index)
    const newConfig = { ...config, sections: newSections }
    newConfig.totalSeats = calculateTotalSeats(newSections)
    setConfig(newConfig)
  }

  const handleSaveConfig = () => {
    setSavedConfigs([...savedConfigs, config])
    setStatus("success")
    setStatusMessage("Configuración guardada exitosamente")
    setTimeout(() => setStatus("idle"), 2000)
  }

  const handleApplyConfig = () => {
    onConfigChange?.(config)
    setStatus("success")
    setStatusMessage("Configuración aplicada")
    setTimeout(() => {
      setIsOpen(false)
      setStatus("idle")
    }, 1500)
  }

  const handleLoadConfig = (savedConfig: CinemaConfig) => {
    setConfig(savedConfig)
    setStatus("success")
    setStatusMessage("Configuración cargada")
    setTimeout(() => setStatus("idle"), 1500)
  }

  const handleResetConfig = () => {
    setConfig(DEFAULT_CONFIG)
    setStatus("success")
    setStatusMessage("Configuración reiniciada")
    setTimeout(() => setStatus("idle"), 1500)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-orange-600 hover:bg-orange-700">Configurar Cine</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editor de Configuración del Cine</DialogTitle>
          <DialogDescription>Personaliza la disposición y configuración de tu cine</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Settings */}
          <Card className="bg-slate-700 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white text-lg">Configuración General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-300">Nombre del Cine</Label>
                  <Input
                    value={config.name}
                    onChange={(e) => setConfig({ ...config, name: e.target.value })}
                    className="bg-slate-600 border-slate-500 text-white mt-1"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Precio por Butaca ($)</Label>
                  <Input
                    type="number"
                    value={config.pricePerSeat}
                    onChange={(e) => setConfig({ ...config, pricePerSeat: Number.parseFloat(e.target.value) })}
                    className="bg-slate-600 border-slate-500 text-white mt-1"
                  />
                </div>
              </div>
              <div className="bg-slate-600 rounded p-3">
                <p className="text-slate-300 text-sm">
                  <span className="font-semibold">Total de Butacas:</span> {config.totalSeats}
                </p>
                <p className="text-slate-300 text-sm">
                  <span className="font-semibold">Ingresos Potenciales:</span> $
                  {(config.totalSeats * config.pricePerSeat).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Sections Configuration */}
          <Card className="bg-slate-700 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white text-lg">Secciones</CardTitle>
              <CardDescription className="text-slate-400">Configura las secciones de butacas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {config.sections.map((section, idx) => (
                <div key={idx} className="bg-slate-600 rounded p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="text-white font-semibold">Sección {idx + 1}</h4>
                    {config.sections.length > 1 && (
                      <Button
                        onClick={() => handleRemoveSection(idx)}
                        variant="destructive"
                        size="sm"
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Eliminar
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label className="text-slate-300 text-sm">Nombre</Label>
                      <Input
                        value={section.name}
                        onChange={(e) => handleSectionChange(idx, "name", e.target.value)}
                        className="bg-slate-500 border-slate-400 text-white mt-1 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300 text-sm">Filas</Label>
                      <Input
                        type="number"
                        min="1"
                        value={section.rows}
                        onChange={(e) => handleSectionChange(idx, "rows", Number.parseInt(e.target.value))}
                        className="bg-slate-500 border-slate-400 text-white mt-1 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300 text-sm">Butacas/Fila</Label>
                      <Input
                        type="number"
                        min="1"
                        value={section.seatsPerRow}
                        onChange={(e) => handleSectionChange(idx, "seatsPerRow", Number.parseInt(e.target.value))}
                        className="bg-slate-500 border-slate-400 text-white mt-1 text-sm"
                      />
                    </div>
                  </div>
                  <p className="text-slate-400 text-xs">Subtotal: {section.rows * section.seatsPerRow} butacas</p>
                </div>
              ))}
              <Button onClick={handleAddSection} variant="outline" className="w-full bg-slate-600 border-slate-500">
                + Agregar Sección
              </Button>
            </CardContent>
          </Card>

          {/* Status Messages */}
          {status === "success" && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{statusMessage}</AlertDescription>
            </Alert>
          )}

          {status === "error" && (
            <Alert className="bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{statusMessage}</AlertDescription>
            </Alert>
          )}

          {/* Saved Configurations */}
          {savedConfigs.length > 0 && (
            <Card className="bg-slate-700 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white text-lg">Configuraciones Guardadas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {savedConfigs.map((savedConfig, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-slate-600 p-3 rounded">
                    <div>
                      <p className="text-white font-semibold">{savedConfig.name}</p>
                      <p className="text-slate-400 text-sm">{savedConfig.totalSeats} butacas</p>
                    </div>
                    <Button
                      onClick={() => handleLoadConfig(savedConfig)}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Cargar
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end">
            <Button onClick={handleResetConfig} variant="outline" className="bg-slate-600 border-slate-500">
              Reiniciar
            </Button>
            <Button onClick={handleSaveConfig} className="bg-green-600 hover:bg-green-700">
              Guardar Configuración
            </Button>
            <Button onClick={handleApplyConfig} className="bg-blue-600 hover:bg-blue-700">
              Aplicar Cambios
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
