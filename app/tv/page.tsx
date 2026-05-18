"use client";

import { useEffect, useState } from "react";

export default function TV() {
  const [paciente, setPaciente] =
    useState<any>(null);

  useEffect(() => {
    const ultimo =
      localStorage.getItem(
        "ultimoPaciente"
      );

    if (ultimo) {
      setPaciente(JSON.parse(ultimo));
    }

    const intervalo = setInterval(() => {
      const atualizado =
        localStorage.getItem(
          "ultimoPaciente"
        );

      if (atualizado) {
        setPaciente(
          JSON.parse(atualizado)
        );
      }
    }, 1000);

    return () =>
      clearInterval(intervalo);
  }, []);

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-10">
      {paciente ? (
        <div className="bg-green-500 w-full max-w-6xl rounded-[50px] p-20 text-center shadow-2xl">
          <h1 className="text-6xl font-black mb-10">
            🔊 CHAMANDO PACIENTE
          </h1>

          <h2 className="text-[180px] font-black leading-none">
            {paciente.senha}
          </h2>

          <p className="text-6xl mt-10 font-bold">
            {paciente.nome}
          </p>

          <p className="text-4xl mt-5">
            {paciente.prioridade}
          </p>

          <div className="mt-10 inline-block bg-white text-black px-14 py-7 rounded-[30px] text-6xl font-black">
            🚪 {paciente.sala}
          </div>
        </div>
      ) : (
        <h1 className="text-6xl font-black">
          Aguardando chamada...
        </h1>
      )}
    </main>
  );
}