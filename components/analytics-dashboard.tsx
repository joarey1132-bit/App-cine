"use client"

import { useMemo } from "react"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CINEMA_CONFIG, type Seat } from "@/lib/cinema-config"

interface AnalyticsDashboardProps {
  seats: Record<string, Seat>
}

export default function AnalyticsDashboard({ seats }: AnalyticsDashboardProps) {
  const analytics = useMemo(() => {
    const stats = {
      total: CINEMA_CONFIG.totalSeats,
      selected: 0,
      available: 0,
      occupancyRate: 0,
      sectionStats: [] as Array<{
        name: string
        selected: number
        available: number
        total: number
        occupancy: number
      }>,
    }

    // Calculate overall stats
    Object.values(seats).forEach((seat) => {
      if (seat.selected) stats.selected++
      else stats.available++
    })
    stats.occupancyRate = Math.round((stats.selected / stats.total) * 100)

    // Calculate section stats
    CINEMA_CONFIG.sections.forEach((section) => {
      let sectionSelected = 0
      let sectionTotal = 0

      for (let row = 1; row <= section.rows; row++) {
        for (let col = 1; col <= section.seatsPerRow; col++) {
          const seatId = `${section.prefix}${row}-${col}`
          sectionTotal++
          if (seats[seatId]?.selected) sectionSelected++
        }
      }

      stats.sectionStats.push({
        name: section.name,
        selected: sectionSelected,
        available: sectionTotal - sectionSelected,
        total: sectionTotal,
        occupancy: Math.round((sectionSelected / sectionTotal) * 100),
      })
    })

    // Back row stats
    let backRowSelected = 0
    for (let col = 1; col <= CINEMA_CONFIG.backRow.seats; col++) {
      const seatId = `${CINEMA_CONFIG.backRow.prefix}-${col}`
      if (seats[seatId]?.selected) backRowSelected++
    }

    stats.sectionStats.push({
      name: CINEMA_CONFIG.backRow.name,
      selected: backRowSelected,
      available: CINEMA_CONFIG.backRow.seats - backRowSelected,
      total: CINEMA_CONFIG.backRow.seats,
      occupancy: Math.round((backRowSelected / CINEMA_CONFIG.backRow.seats) * 100),
    })

    return stats
  }, [seats])

  const pieData = [
    { name: "Seleccionadas", value: analytics.selected, color: "#3b82f6" },
    { name: "Disponibles", value: analytics.available, color: "#64748b" },
  ]

  const COLORS = ["#3b82f6", "#64748b"]

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-700 border-slate-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Ocupación Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-400">{analytics.occupancyRate}%</div>
            <p className="text-xs text-slate-400 mt-1">
              {analytics.selected} de {analytics.total} butacas
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-700 border-slate-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Seleccionadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500">{analytics.selected}</div>
            <p className="text-xs text-slate-400 mt-1">Butacas reservadas</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-700 border-slate-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">{analytics.available}</div>
            <p className="text-xs text-slate-400 mt-1">Butacas libres</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-700 border-slate-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Ingresos Potenciales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">${(analytics.selected * 12).toLocaleString()}</div>
            <p className="text-xs text-slate-400 mt-1">A $12 por butaca</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card className="bg-slate-700 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white">Distribución de Butacas</CardTitle>
            <CardDescription className="text-slate-400">Proporción de ocupación</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} butacas`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card className="bg-slate-700 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white">Ocupación por Sección</CardTitle>
            <CardDescription className="text-slate-400">Porcentaje de ocupación por zona</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.sectionStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="name" stroke="#94a3b8" angle={-45} textAnchor="end" height={100} />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                  formatter={(value) => `${value}%`}
                />
                <Bar dataKey="occupancy" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Section Details Table */}
      <Card className="bg-slate-700 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white">Detalles por Sección</CardTitle>
          <CardDescription className="text-slate-400">Estadísticas detalladas de cada zona</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-600">
                  <th className="text-left py-2 px-4 text-slate-300 font-semibold">Sección</th>
                  <th className="text-center py-2 px-4 text-slate-300 font-semibold">Total</th>
                  <th className="text-center py-2 px-4 text-slate-300 font-semibold">Seleccionadas</th>
                  <th className="text-center py-2 px-4 text-slate-300 font-semibold">Disponibles</th>
                  <th className="text-center py-2 px-4 text-slate-300 font-semibold">Ocupación</th>
                </tr>
              </thead>
              <tbody>
                {analytics.sectionStats.map((section, idx) => (
                  <tr key={idx} className="border-b border-slate-600 hover:bg-slate-600/50">
                    <td className="py-2 px-4 text-slate-300">{section.name}</td>
                    <td className="text-center py-2 px-4 text-slate-300">{section.total}</td>
                    <td className="text-center py-2 px-4 text-blue-400 font-semibold">{section.selected}</td>
                    <td className="text-center py-2 px-4 text-green-400 font-semibold">{section.available}</td>
                    <td className="text-center py-2 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 bg-slate-600 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${section.occupancy}%` }}
                          ></div>
                        </div>
                        <span className="text-slate-300 font-semibold w-10 text-right">{section.occupancy}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
