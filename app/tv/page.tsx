"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TVPage() {
  const [paciente, setPaciente] =
    useState<any>(null);

  async function carregarUltimo() {
    const { data, error } =
      await supabase
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
    carregarUltimo();

    const intervalo = setInterval(() => {
      carregarUltimo();
    }, 2000);

    return () =>
      clearInterval(intervalo);
  }, []);

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-10">
      {paciente ? (
        <div className="bg-green-500 w-full max-w-5xl rounded-[50px] p-20 text-center shadow-2xl">
          <h1 className="text-6xl font-black mb-10">
            🔊 CHAMANDO PACIENTE
          </h1>

          <h2 className="text-[180px] font-black leading-none">
            {paciente.senha}
          </h2>

          <p className="text-6xl font-bold mt-10">
            {paciente.nome}
          </p>

          <p className="text-4xl mt-5">
            {paciente.prioridade}
          </p>

          <div className="mt-10 inline-block bg-white text-black px-10 py-5 rounded-3xl text-5xl font-black">
            🚪 {paciente.sala}
          </div>
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-6xl font-black text-green-400">
            🏥 PAINEL HOSPITALAR
          </h1>

          <p className="text-3xl text-slate-300 mt-5">
            Nenhum paciente chamado
          </p>
        </div>
      )}
    </main>
  );
}