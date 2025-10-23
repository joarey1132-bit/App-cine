"use client"

import { useState } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Seat {
  id: string
  selected: boolean
}

interface SeatRowProps {
  seats: Seat[]
  onToggle: (index: number) => void
}

export default function SeatRow({ seats, onToggle }: SeatRowProps) {
  const [hoveredSeat, setHoveredSeat] = useState<number | null>(null)

  return (
    <TooltipProvider>
      <div className="flex gap-2">
        {seats.map((seat, idx) => (
          <Tooltip key={seat.id}>
            <TooltipTrigger asChild>
              <button
                onClick={() => onToggle(idx)}
                onMouseEnter={() => setHoveredSeat(idx)}
                onMouseLeave={() => setHoveredSeat(null)}
                className={`w-6 h-6 rounded transition-all duration-200 cursor-pointer ${
                  seat.selected
                    ? "bg-blue-500 shadow-lg shadow-blue-500/50 scale-110 hover:bg-blue-600"
                    : hoveredSeat === idx
                      ? "bg-slate-400 scale-105"
                      : "bg-slate-500 hover:bg-slate-400"
                }`}
                aria-label={`Butaca ${seat.id} ${seat.selected ? "seleccionada" : "disponible"}`}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">
                {seat.id} - {seat.selected ? "Seleccionada" : "Disponible"}
              </p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  )
}
