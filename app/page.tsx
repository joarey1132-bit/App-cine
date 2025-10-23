"use client";

import React, { useState, useEffect } from "react";

type Funcion = {
  titulo: string;
  horario: string;
  precio: number;
};

type Butaca = {
  fila: number;
  columna: number;
  reservada: boolean;
};

// Crear mapa de butacas
const crearMapa = (filas: number, columnas: number): Butaca[][] =>
  Array.from({ length: filas }, (_, fila) =>
    Array.from({ length: columnas }, (_, columna) => ({
      fila,
      columna,
      reservada: false,
    }))
  );

export default function Page() {
  // Funciones dinámicas
  const [funciones, setFunciones] = useState<Funcion[]>([
    { titulo: "El Exorcista", horario: "Viernes 21:00", precio: 1200 },
  ]);

  // Mapa de butacas por función
  const [mapas, setMapas] = useState([crearMapa(10, 14)] as Butaca[][][]);

  const [funcionActual, setFuncionActual] = useState(0);

  // Cargar desde localStorage
  useEffect(() => {
    const guardadoFunciones = localStorage.getItem("funciones");
    const guardadoMapas = localStorage.getItem("mapas");
    if (guardadoFunciones) setFunciones(JSON.parse(guardadoFunciones));
    if (guardadoMapas) setMapas(JSON.parse(guardadoMapas));
  }, []);

  // Guardar cambios
  useEffect(() => {
    localStorage.setItem("funciones", JSON.stringify(funciones));
    localStorage.setItem("mapas", JSON.stringify(mapas));
  }, [funciones, mapas]);

  // Sincronizar mapas cuando agregamos funciones nuevas
  useEffect(() => {
    if (funciones.length > mapas.length) {
      const nuevosMapas = [...mapas];
      for (let i = mapas.length; i < funciones.length; i++) {
        nuevosMapas.push(crearMapa(10, 14));
      }
      setMapas(nuevosMapas);
    }
  }, [funciones, mapas]);

  // Alternar reserva de butaca
  const toggleButaca = (fila: number, columna: number) => {
    setMapas((prev) => {
      const nuevoMapa = (prev[funcionActual] || crearMapa(10, 14)).map((filaArr) =>
        filaArr.map((b) =>
          b.fila === fila && b.columna === columna
            ? { ...b, reservada: !b.reservada }
            : b
        )
      );
      const nuevoMapas = [...prev];
      nuevoMapas[funcionActual] = nuevoMapa;
      return nuevoMapas;
    });
  };

  // Contadores seguros
  const mapaActual = mapas[funcionActual] || crearMapa(10, 14);
  const funcion = funciones[funcionActual];
  const totalButacas = mapaActual.flat().length;
  const reservadas = mapaActual.flat().filter((b) => b.reservada).length;
  const libres = totalButacas - reservadas;
  const porcentajeReservadas = ((reservadas / totalButacas) * 100).toFixed(2);

  // Actualizar función
  const actualizarFuncion = (campo: keyof Funcion, valor: string | number) => {
    setFunciones((prev) => {
      const nuevo = [...prev];
      nuevo[funcionActual] = { ...nuevo[funcionActual], [campo]: valor };
      return nuevo;
    });
  };

  // Agregar función nueva
  const agregarFuncion = () => {
    setFunciones([
      ...funciones,
      { titulo: "Nueva función", horario: "00:00", precio: 0 },
    ]);
    setFuncionActual(funciones.length); // Ir a la nueva función
  };

  // Eliminar función actual
  const eliminarFuncion = () => {
    if (funciones.length <= 1) return; // Siempre al menos 1 función
    const nuevasFunciones = funciones.filter((_, i) => i !== funcionActual);
    const nuevosMapas = mapas.filter((_, i) => i !== funcionActual);
    setFunciones(nuevasFunciones);
    setMapas(nuevosMapas);
    setFuncionActual(Math.max(0, funcionActual - 1));
  };

  return (
    <div style={{ textAlign: "center", padding: "20px", fontFamily: "sans-serif" }}>
      {/* Pestañas dinámicas */}
      <div style={{ marginBottom: "25px" }}>
        {funciones.map((f, i) => (
          <button
            key={i}
            onClick={() => setFuncionActual(i)}
            style={{
              margin: "5px",
              padding: "10px 20px",
              borderRadius: "10px",
              border: funcionActual === i ? "2px solid #000" : "1px solid gray",
              background: funcionActual === i ? "#ddd" : "#fff",
              cursor: "pointer",
            }}
          >
            {f.titulo} <br />
            <small>{f.horario}</small>
          </button>
        ))}
        <button
          onClick={agregarFuncion}
          style={{
            margin: "5px",
            padding: "10px 20px",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          + Agregar función
        </button>
        <button
          onClick={eliminarFuncion}
          style={{
            margin: "5px",
            padding: "10px 20px",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          🗑️ Eliminar función
        </button>
      </div>

      {/* Inputs editables */}
      <div style={{ marginBottom: "15px" }}>
        <input
          type="text"
          value={funcion.titulo}
          onChange={(e) => actualizarFuncion("titulo", e.target.value)}
          style={{ fontSize: "20px", marginRight: "10px" }}
        />
        <input
          type="text"
          value={funcion.horario}
          onChange={(e) => actualizarFuncion("horario", e.target.value)}
          style={{ fontSize: "16px", marginRight: "10px" }}
        />
        <input
          type="number"
          value={funcion.precio ?? 0}
          onChange={(e) =>
            actualizarFuncion(
              "precio",
              e.target.value === "" ? 0 : parseInt(e.target.value)
            )
          }
          style={{ fontSize: "16px", width: "80px" }}
        />
      </div>

      {/* Contadores */}
      <div style={{ marginBottom: "15px", fontSize: "16px" }}>
        <strong>Total:</strong> {totalButacas} &nbsp;|&nbsp;
        <strong>Reservadas:</strong> {reservadas} &nbsp;|&nbsp;
        <strong>Libres:</strong> {libres} &nbsp;|&nbsp;
        <strong>% Reservadas:</strong> {porcentajeReservadas}%
      </div>

      {/* Mapa de butacas */}
      <div
        style={{
          display: "inline-block",
          backgroundColor: "#fff",
          padding: "15px",
          borderRadius: "10px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        {mapaActual.map((fila, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "center" }}>
            {fila.map((butaca) => (
              <div
                key={`${butaca.fila}-${butaca.columna}`}
                onClick={() => toggleButaca(butaca.fila, butaca.columna)}
                style={{
                  width: "25px",
                  height: "25px",
                  margin: "3px",
                  borderRadius: "4px",
                  background: butaca.reservada ? "#ff6961" : "#90ee90",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
              ></div>
            ))}
          </div>
        ))}
      </div>

      {/* Leyenda */}
      <div style={{ marginTop: "20px", fontSize: "14px", color: "#444" }}>
        <div style={{ display: "inline-flex", alignItems: "center", marginRight: "10px" }}>
          <div
            style={{
              width: "18px",
              height: "18px",
              background: "#90ee90",
              marginRight: "5px",
              borderRadius: "3px",
            }}
          ></div>
          Libre
        </div>
        <div style={{ display: "inline-flex", alignItems: "center" }}>
          <div
            style={{
              width: "18px",
              height: "18px",
              background: "#ff6961",
              marginRight: "5px",
              borderRadius: "3px",
            }}
          ></div>
          Reservada
        </div>
      </div>
    </div>
  );
}
