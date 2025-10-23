export interface Seat {
  id: string
  selected: boolean
}

export interface CinemaSection {
  name: string
  rows: number
  seatsPerRow: number
  prefix: string
}

export interface CinemaConfig {
  sections: CinemaSection[]
  backRow: {
    name: string
    seats: number
    prefix: string
  }
  totalSeats: number
}

// Cinema configuration: 139 total seats with perfect symmetry
export const CINEMA_CONFIG: CinemaConfig = {
  sections: [
    {
      name: "Lado Izquierdo Total",
      rows: 7,
      seatsPerRow: 5,
      prefix: "L",
    },
    {
      name: "Zona Central Izquierda",
      rows: 7,
      seatsPerRow: 4,
      prefix: "CL",
    },
    {
      name: "Zona Central Derecha",
      rows: 7,
      seatsPerRow: 4,
      prefix: "CR",
    },
    {
      name: "Lado Derecho Total",
      rows: 7,
      seatsPerRow: 5,
      prefix: "R",
    },
  ],
  backRow: {
    name: "Fila Trasera",
    seats: 13,
    prefix: "B",
  },
  totalSeats: 139,
}

/**
 * Generates initial seats object from cinema configuration
 * @returns Record of all seats with their initial state
 */
export function generateInitialSeats(): Record<string, Seat> {
  const initialSeats: Record<string, Seat> = {}

  // Generate seats for each section
  CINEMA_CONFIG.sections.forEach((section) => {
    for (let row = 1; row <= section.rows; row++) {
      for (let col = 1; col <= section.seatsPerRow; col++) {
        const seatId = `${section.prefix}${row}-${col}`
        initialSeats[seatId] = { id: seatId, selected: false }
      }
    }
  })

  // Generate back row seats
  for (let col = 1; col <= CINEMA_CONFIG.backRow.seats; col++) {
    const seatId = `${CINEMA_CONFIG.backRow.prefix}-${col}`
    initialSeats[seatId] = { id: seatId, selected: false }
  }

  return initialSeats
}

/**
 * Gets all seats for a specific row in a section
 * @param section - Cinema section
 * @param row - Row number
 * @param seats - All seats object
 * @returns Array of seats for that row
 */
export function getRowSeats(section: CinemaSection, row: number, seats: Record<string, Seat>): Seat[] {
  const rowSeats: Seat[] = []
  for (let col = 1; col <= section.seatsPerRow; col++) {
    const seatId = `${section.prefix}${row}-${col}`
    if (seats[seatId]) {
      rowSeats.push(seats[seatId])
    }
  }
  return rowSeats
}

/**
 * Gets all back row seats
 * @param seats - All seats object
 * @returns Array of back row seats
 */
export function getBackRowSeats(seats: Record<string, Seat>): Seat[] {
  const backRowSeats: Seat[] = []
  for (let col = 1; col <= CINEMA_CONFIG.backRow.seats; col++) {
    const seatId = `${CINEMA_CONFIG.backRow.prefix}-${col}`
    if (seats[seatId]) {
      backRowSeats.push(seats[seatId])
    }
  }
  return backRowSeats
}

/**
 * Calculates cinema statistics
 * @param seats - All seats object
 * @returns Object with selected count and available count
 */
export function calculateStats(seats: Record<string, Seat>) {
  const selectedCount = Object.values(seats).filter((s) => s.selected).length
  const availableCount = CINEMA_CONFIG.totalSeats - selectedCount

  return {
    selected: selectedCount,
    available: availableCount,
    total: CINEMA_CONFIG.totalSeats,
  }
}

/**
 * Exports cinema map as JSON
 * @param seats - All seats object
 * @returns JSON string of the cinema map
 */
export function exportCinemaMap(seats: Record<string, Seat>): string {
  return JSON.stringify(
    {
      config: CINEMA_CONFIG,
      seats,
      stats: calculateStats(seats),
      exportedAt: new Date().toISOString(),
    },
    null,
    2,
  )
}

/**
 * Imports cinema map from JSON
 * @param jsonString - JSON string of the cinema map
 * @returns Seats object
 */
export function importCinemaMap(jsonString: string): Record<string, Seat> {
  try {
    const data = JSON.parse(jsonString)
    return data.seats || {}
  } catch (error) {
    console.error("Error importing cinema map:", error)
    return generateInitialSeats()
  }
}
