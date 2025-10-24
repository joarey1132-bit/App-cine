"use client";
import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

// Tipos
type Butaca = {
  id: number;
  disponible: boolean;
  reserva?: {
    nombre: string;
    apellido: string;
    dni: string;
    telefono: string;
  };
};

type Funcion = {
  id: number;
  titulo: string;
  horario: string;
  precio: number;
  butacas: Butaca[];
};

export default function Page() {
  const [funciones, setFunciones] = useState<Funcion[]>([
    {
      id: 1,
      titulo: "Función 1",
      horario: "18:00",
      precio: 1000,
      butacas: Array.from({ length: 140 }, (_, i) => ({
        id: i + 1,
        disponible: true,
      })),
    },
  ]);

  const [reservaVisible, setReservaVisible] = useState<boolean>(false);

  // Funciones de manejo de funciones
  const agregarFuncion = () => {
    const nuevaFuncion: Funcion = {
      id: funciones.length + 1,
      titulo: "Nueva Función",
      horario: "00:00",
      precio: 0,
      butacas: Array.from({ length: 140 }, (_, i) => ({
        id: i + 1,
        disponible: true,
      })),
    };
    setFunciones([...funciones, nuevaFuncion]);
  };

  const borrarFuncion = (id: number) => {
    setFunciones(funciones.filter((f) => f.id !== id));
  };

  const modificarFuncion = (id: number, campo: string, valor: string | number) => {
    setFunciones(
      funciones.map((f) =>
        f.id === id ? { ...f, [campo]: valor } : f
      )
    );
  };

  // Funciones de manejo de reservas
  const reservarButaca = (funcionId: number, butacaId: number) => {
    const nombre = prompt("Nombre:") || "";
    const apellido = prompt("Apellido:") || "";
    const dni = prompt("DNI:") || "";
    const telefono = prompt("Teléfono:") || "";

    setFunciones(
      funciones.map((f) => {
        if (f.id === funcionId) {
          const nuevasButacas = f.butacas.map((b) =>
            b.id === butacaId
              ? {
                  ...b,
                  disponible: false,
                  reserva: { nombre, apellido, dni, telefono },
                }
              : b
          );
          return { ...f, butacas: nuevasButacas };
        }
        return f;
      })
    );
  };

  const descargarQR = (reserva: Butaca["reserva"], butacaId: number) => {
    if (!reserva) return;
    const canvas = document.createElement("canvas");
    const size = 300; // tamaño QR
    canvas.width = size;
    canvas.height = size;

    const qr = (
      <QRCodeCanvas
        value={`Butaca ${butacaId}\nNombre: ${reserva.nombre}\nApellido: ${reserva.apellido}\nDNI: ${reserva.dni}\nTeléfono: ${reserva.telefono}`}
        size={size}
        level="H"
        includeMargin={true}
      />
    );

    const tempDiv = document.createElement("div");
    tempDiv.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = "#000000";
      ctx.font = "14px Arial";
      ctx.fillText(`Nombre: ${reserva.nombre}`, 10, size - 60);
      ctx.fillText(`Apellido: ${reserva.apellido}`, 10, size - 40);
      ctx.fillText(`DNI: ${reserva.dni}`, 10, size - 25);
      ctx.fillText(`Tel: ${reserva.telefono}`, 10, size - 10);
    }

    const link = document.createElement("a");
    link.download = `butaca-${butacaId}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", backgroundColor: "#ffde2f", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center", color: "#be1824" }}>Cine</h1>

      <button onClick={agregarFuncion} style={{ marginBottom: "20px" }}>Agregar Función</button>

      {funciones.map((f) => (
        <div key={f.id} style={{ marginBottom: "30px", padding: "10px", backgroundColor: "#ffffff", border: "2px solid #be1824" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <input
                type="text"
                value={f.titulo}
                onChange={(e) => modificarFuncion(f.id, "titulo", e.target.value)}
              />
              <input
                type="text"
                value={f.horario}
                onChange={(e) => modificarFuncion(f.id, "horario", e.target.value)}
              />
              <input
                type="number"
                value={f.precio}
                onChange={(e) => modificarFuncion(f.id, "precio", Number(e.target.value))}
              />
            </div>
            <button onClick={() => borrarFuncion(f.id)} style={{ backgroundColor: "#be1824", color: "#fff" }}>Borrar Función</button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(20, 1fr)", gap: "5px", marginTop: "10px" }}>
            {f.butacas.map((b) => (
              <button
                key={b.id}
                style={{
                  backgroundColor: b.disponible ? "#ffde2f" : "#be1824",
                  color: "#000",
                  padding: "5px",
                  fontSize: "12px",
                }}
                onClick={() => b.disponible && reservarButaca(f.id, b.id)}
              >
                {b.id}
              </button>
            ))}
          </div>

          <button onClick={() => setReservaVisible(!reservaVisible)} style={{ marginTop: "10px" }}>
            {reservaVisible ? "Ocultar Reservas" : "Mostrar Reservas"}
          </button>

          {reservaVisible && (
            <div style={{ marginTop: "10px" }}>
              {f.butacas
                .filter((b) => !b.disponible && b.reserva)
                .map((b) => (
                  <div key={b.id} style={{ marginBottom: "5px", padding: "5px", border: "1px solid #000" }}>
                    Butaca {b.id} - {b.reserva?.nombre} {b.reserva?.apellido} - {b.reserva?.dni} - {b.reserva?.telefono}
                    <button onClick={() => descargarQR(b.reserva, b.id)} style={{ marginLeft: "10px" }}>Descargar QR</button>
                  </div>
                ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
