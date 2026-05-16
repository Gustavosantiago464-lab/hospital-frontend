"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [fila, setFila] = useState<any[]>([]);

  async function carregarFila() {
    const resposta = await fetch(
      "http://localhost:3001/fila"
    );

    const dados = await resposta.json();

    setFila(dados);
  }

  useEffect(() => {
    carregarFila();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-5xl font-bold mb-10">
        📊 Dashboard Hospitalar
      </h1>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-slate-900 p-8 rounded-3xl">
          <p>Total Pacientes</p>

          <h2 className="text-5xl font-bold">
            {fila.length}
          </h2>
        </div>

        <div className="bg-red-900 p-8 rounded-3xl">
          <p>Prioridade Alta</p>

          <h2 className="text-5xl font-bold">
            {
              fila.filter(
                (p) =>
                  p.prioridade === "alta"
              ).length
            }
          </h2>
        </div>

        <div className="bg-green-900 p-8 rounded-3xl">
          <p>Sistema</p>

          <h2 className="text-5xl font-bold">
            ONLINE
          </h2>
        </div>
      </div>
    </main>
  );
}