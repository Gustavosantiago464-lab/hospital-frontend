"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Paciente = {
  nome: string;
  prioridade: string;
  sala: string;
  senha: string;
};

export default function TVPage() {
  const [paciente, setPaciente] =
    useState<Paciente | null>(null);

  async function carregarPainel() {
    const { data, error } = await supabase
      .from("historico")
      .select("*")
      .order("id", {
        ascending: false,
      })
      .limit(1);

    console.log(data);
    console.log(error);

    if (data && data.length > 0) {
      setPaciente(data[0]);
    }
  }

  useEffect(() => {
    carregarPainel();

    const intervalo = setInterval(() => {
      carregarPainel();
    }, 2000);

    return () =>
      clearInterval(intervalo);
  }, []);

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-10">
      {paciente ? (
        <div className="bg-green-500 w-full max-w-5xl rounded-[50px] p-16 text-center shadow-2xl">
          <h1 className="text-6xl font-black mb-8">
            🔊 CHAMANDO PACIENTE
          </h1>

          <h2 className="text-[150px] font-black">
            {paciente.senha}
          </h2>

          <p className="text-6xl font-bold mt-6">
            {paciente.nome}
          </p>

          <p className="text-4xl mt-4">
            {paciente.prioridade}
          </p>

          <div className="mt-10 inline-block bg-white text-black px-12 py-6 rounded-3xl text-5xl font-black">
            🚪 {paciente.sala}
          </div>
        </div>
      ) : (
        <h1 className="text-5xl font-black text-green-400">
          🏥 PAINEL HOSPITALAR
          <p className="text-3xl text-white mt-6">
            Nenhum paciente chamado
          </p>
        </h1>
      )}
    </main>
  );
}