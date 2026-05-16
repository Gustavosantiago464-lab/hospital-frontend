"use client";

import { useState } from "react";

export default function Home() {
  const [nome, setNome] = useState("");
  const [fila, setFila] = useState<string[]>([]);

  function adicionarPaciente() {
    if (!nome) return;

    setFila([...fila, nome]);

    setNome("");
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-5xl font-bold mb-10">
        🏥 Sistema Hospitalar
      </h1>

      <input
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder="Nome do paciente"
        className="w-full p-4 rounded-xl bg-slate-800 mb-4"
      />

      <button
        onClick={adicionarPaciente}
        className="bg-blue-600 px-6 py-3 rounded-xl"
      >
        Adicionar Paciente
      </button>

      <div className="mt-10 space-y-4">
        {fila.map((paciente, index) => (
          <div
            key={index}
            className="bg-slate-800 p-4 rounded-xl"
          >
            {paciente}
          </div>
        ))}
      </div>
    </main>
  );
}