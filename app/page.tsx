"use client";
import React, { useState, useEffect } from "react";
import QRCode from "qrcode.react";
import { createClient } from "@supabase/supabase-js";

// 🔹 Conexión a Supabase (usa las variables del entorno)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Page() {
  const [funciones, setFunciones] = useState<any[]>([]);
  const [selectedFuncion, setSelectedFuncion] = useState<number | null>(null);
  const [reservas, setReservas] = useState<any>({});

  // 🟢 Cargar desde localStorage o Supabase
  useEffect(() => {
    const loadData = async () => {
      const localFunciones = localStorage.getItem("funciones");
      const localReservas = localStorage.getItem("reservas");

      if (localFunciones && localReservas) {
        setFunciones(JSON.parse(localFunciones));
        setReservas(JSON.parse(localReservas));
      } else {
        // Buscar en Supabase si no hay datos locales
        const { data, error } = await supabase
          .from("funciones")
          .select("data")
          .order("updated_at", { ascending: false })
          .limit(1)
          .single();

        if (data && data.data) {
          setFunciones(data.data.funciones || []);
          setReservas(data.data.reservas || {});
        }
      }
    };
    loadData();
  }, []);

  // 🟡 Guardar localmente y en Supabase cuando hay cambios
  useEffect(() => {
    if (funciones.length > 0) {
      localStorage.setItem("funciones", JSON.stringify(funciones));
      localStorage.setItem("reservas", JSON.stringify(reservas));
      guardarEnSupabase();
    }
  }, [funciones, reservas]);

  const guardarEnSupabase = async () => {
    await supabase.from("funciones").insert([
      {
        data: {
          funciones,
          reservas,
        },
      },
    ]);
  };

  // ➕ Crear nueva función
  const agregarFuncion = () => {
    const nuevaFuncion = {
      id: Date.now(),
      nombre: `Función ${funciones.length + 1}`,
      asientos: Array(139).fill(false),
    };
    setFunciones([...funciones, nuevaFuncion]);
  };

  // 🎟️ Reservar o liberar butaca
  const toggleButaca = (index: number) => {
    if (selectedFuncion === null) return;
    const nuevasFunciones = [...funciones];
    const funcion = nuevasFunciones.find((f) => f.id === selectedFuncion);
    if (!funcion) return;

    funcion.asientos[index] = !funcion.asientos[index];
    setFunciones(nuevasFunciones);

    const nuevasReservas = { ...reservas };
    nuevasReservas[selectedFuncion] = funcion.asientos;
    setReservas(nuevasReservas);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">🎬 Gestor de Funciones</h1>

      <button
        onClick={agregarFuncion}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        ➕ Agregar función
      </button>

      <div className="mt-6 space-y-3">
        {funciones.map((f) => (
          <div
            key={f.id}
            className={`p-3 rounded-lg cursor-pointer border ${
              f.id === selectedFuncion
                ? "bg-blue-100 border-blue-400"
                : "bg-gray-50 hover:bg-gray-100"
            }`}
            onClick={() => setSelectedFuncion(f.id)}
          >
            {f.nombre} — {f.asientos.filter((a: boolean) => a).length}/139 ocupadas
          </div>
        ))}
      </div>

      {selectedFuncion && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-3">
            🪑 Mapa de butacas — {funciones.find((f) => f.id === selectedFuncion)?.nombre}
          </h2>
          <div className="grid grid-cols-10 gap-2 max-w-md">
            {funciones
              .find((f) => f.id === selectedFuncion)
              ?.asientos.map((ocupado: boolean, index: number) => (
                <button
                  key={index}
                  onClick={() => toggleButaca(index)}
                  className={`w-8 h-8 rounded ${
                    ocupado ? "bg-red-500" : "bg-green-500"
                  }`}
                />
              ))}
          </div>

          <div className="mt-6">
            <QRCode
              value={`Funcion ${selectedFuncion} - ${
                funciones.find((f) => f.id === selectedFuncion)?.asientos.filter((a: boolean) => a)
                  .length
              } butacas ocupadas`}
            />
          </div>
        </div>
      )}
    </div>
  );
}
