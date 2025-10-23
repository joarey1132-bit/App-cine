"use client"

import { useState, useEffect } from "react"
import SeatRow from "./seat-row"
import ExportImportDialog from "./export-import-dialog"
import {
  type Seat,
  CINEMA_CONFIG,
  generateInitialSeats,
  getRowSeats,
  getBackRowSeats,
  calculateStats,
  exportCinemaMap,
} from "@/lib/cinema-config"
import { Button } from "@/components/ui/button"

type FilterType = "all" | "available" | "selected"

interface CinemaMapProps {
  seats?: Record<string, Seat>
  onSeatsUpdate?: (seats: Record<string, Seat>) => void
}

export default function CinemaMap({ seats: initialSeats, onSeatsUpdate }: CinemaMapProps) {
  const [seats, setSeats] = useState<Record<string, Seat>>(initialSeats || generateInitialSeats)
  const [filter, setFilter] = useState<FilterType>("all")
  const [selectedSeatsList, setSelectedSeatsList] = useState<string[]>([])

  useEffect(() => {
    const selected = Object.entries(seats)
      .filter(([_, seat]) => seat.selected)
      .map(([id, _]) => id)
    setSelectedSeatsList(selected)
    onSeatsUpdate?.(seats)
  }, [seats, onSeatsUpdate])

  const toggleSeat = (seatId: string) => {
    setSeats((prev) => ({
      ...prev,
      [seatId]: { ...prev[seatId], selected: !prev[seatId].selected },
    }))
  }

  const selectAll = () => {
    setSeats((prev) => {
      const updated = { ...prev }
      Object.keys(updated).forEach((key) => {
        updated[key] = { ...updated[key], selected: true }
      })
      return updated
    })
  }

  const deselectAll = () => {
    setSeats((prev) => {
      const updated = { ...prev }
      Object.keys(updated).forEach((key) => {
        updated[key] = { ...updated[key], selected: false }
      })
      return updated
    })
  }

  const stats = calculateStats(seats)

  const handleExport = () => {
    const mapData = exportCinemaMap(seats)
    const blob = new Blob([mapData], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `cinema-map-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (importedSeats: Record<string, Seat>) => {
    setSeats(importedSeats)
  }

  const shouldShowSeat = (seat: Seat): boolean => {
    if (filter === "all") return true
    if (filter === "selected") return seat.selected
    if (filter === "available") return !seat.selected
    return true
  }

  const getFilteredRowSeats = (section: any, row: number): Seat[] => {
    const rowSeats = getRowSeats(section, row, seats)
    return rowSeats.filter(shouldShowSeat)
  }

  const getFilteredBackRowSeats = (): Seat[] => {
    const backRowSeats = getBackRowSeats(seats)
    return backRowSeats.filter(shouldShowSeat)
  }

  return (
    <div className="bg-slate-800 rounded-lg p-8 shadow-2xl">
      {/* Pantalla */}
      <div className="mb-12 text-center">
        <div className="inline-block bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-3 rounded-lg font-bold text-lg shadow-lg">
          PANTALLA
        </div>
      </div>

      {/* Filter and Bulk Action Controls */}
      <div className="mb-8 flex flex-wrap gap-3 justify-center items-center">
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
            className={filter === "all" ? "bg-blue-600 hover:bg-blue-700" : ""}
          >
            Todas
          </Button>
          <Button
            variant={filter === "available" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("available")}
            className={filter === "available" ? "bg-green-600 hover:bg-green-700" : ""}
          >
            Disponibles
          </Button>
          <Button
            variant={filter === "selected" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("selected")}
            className={filter === "selected" ? "bg-blue-600 hover:bg-blue-700" : ""}
          >
            Seleccionadas
          </Button>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={selectAll} className="bg-green-600 hover:bg-green-700">
            Seleccionar Todo
          </Button>
          <Button size="sm" onClick={deselectAll} className="bg-red-600 hover:bg-red-700">
            Deseleccionar Todo
          </Button>
        </div>
      </div>

      {/* Selected Seats Display */}
      {selectedSeatsList.length > 0 && (
        <div className="mb-6 p-4 bg-slate-700 rounded-lg">
          <p className="text-slate-300 text-sm mb-2">
            <span className="font-semibold">{selectedSeatsList.length}</span> butaca(s) seleccionada(s):
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedSeatsList.map((seatId) => (
              <span
                key={seatId}
                className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold cursor-pointer hover:bg-blue-700 transition-colors"
                onClick={() => toggleSeat(seatId)}
                title="Click para deseleccionar"
              >
                {seatId}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Secciones de butacas */}
      <div className="space-y-4 mb-8">
        {[1, 2, 3, 4, 5, 6, 7].map((row) => (
          <div key={`row-${row}`} className="flex justify-center items-center gap-4">
            <div className="text-slate-400 text-xs font-semibold w-8 text-right">{row}</div>
            {CINEMA_CONFIG.sections.map((section) => (
              <SeatRow
                key={`${section.prefix}-${row}`}
                seats={getFilteredRowSeats(section, row)}
                onToggle={(idx) => {
                  const rowSeats = getRowSeats(section, row, seats)
                  const filteredSeats = rowSeats.filter(shouldShowSeat)
                  const actualSeat = rowSeats[rowSeats.indexOf(filteredSeats[idx])]
                  toggleSeat(actualSeat.id)
                }}
              />
            ))}
          </div>
        ))}

        <div className="flex justify-center items-center gap-4 mt-8 pt-8 border-t border-slate-600">
          <div className="text-slate-400 text-sm font-semibold w-20">Trasera</div>
          <SeatRow
            seats={getFilteredBackRowSeats()}
            onToggle={(idx) => {
              const backRowSeats = getBackRowSeats(seats)
              const filteredSeats = backRowSeats.filter(shouldShowSeat)
              const actualSeat = backRowSeats[backRowSeats.indexOf(filteredSeats[idx])]
              toggleSeat(actualSeat.id)
            }}
          />
        </div>
      </div>

      {/* Estadísticas */}
      <div className="mt-12 pt-8 border-t border-slate-600">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-slate-700 rounded-lg p-4">
            <p className="text-slate-400 text-sm mb-1">Butacas Disponibles</p>
            <p className="text-2xl font-bold text-green-400">{stats.available}</p>
          </div>
          <div className="bg-slate-700 rounded-lg p-4">
            <p className="text-slate-400 text-sm mb-1">Butacas Seleccionadas</p>
            <p className="text-2xl font-bold text-blue-400">{stats.selected}</p>
          </div>
          <div className="bg-slate-700 rounded-lg p-4">
            <p className="text-slate-400 text-sm mb-1">Total de Butacas</p>
            <p className="text-2xl font-bold text-white">{stats.total}</p>
          </div>
        </div>
      </div>

      {/* Export/Import and Download Buttons */}
      <div className="mt-8 flex justify-center gap-4 flex-wrap">
        <ExportImportDialog onImport={handleImport} selectedSeats={selectedSeatsList} />
        <Button onClick={handleExport} className="bg-blue-600 hover:bg-blue-700">
          Descargar Mapa Completo
        </Button>
      </div>

      {/* Leyenda */}
      <div className="mt-8 flex justify-center gap-8 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-slate-500 rounded"></div>
          <span className="text-slate-300">Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span className="text-slate-300">Seleccionada</span>
        </div>
      </div>
    </div>
  )
}
