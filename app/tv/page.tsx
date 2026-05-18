"use client";

import { useEffect, useState } from "react";

export default function TV() {
  const [paciente, setPaciente] =
    useState<any>(null);

  useEffect(() => {
    const dados =
      localStorage.getItem(
        "ultimoPaciente"
      );

    if (dados) {
      setPaciente(JSON.parse(dados));
    }
  }, []);

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-10">
      {paciente ? (
        <div className="text-center">
          <h1 className="text-[120px] font-black text-green-400 animate-pulse">
            {paciente.senha}
          </h1>

          <p className="text-6xl mt-10 font-bold">
            {paciente.nome}
          </p>

          <p className="text-4xl mt-5">
            {paciente.prioridade}
          </p>

          <div className="mt-10 bg-blue-600 px-10 py-5 rounded-3xl text-5xl font-black inline-block">
            🚪 {paciente.sala}
          </div>
        </div>
      ) : (
        <h1 className="text-5xl font-bold">
          Nenhum paciente chamado
        </h1>
      )}
    </main>
  );
}