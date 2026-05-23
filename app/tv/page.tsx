"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Paciente = {
  id?: number;
  nome: string;
  prioridade: string;
  sala: string;
  senha: string;
};

export default function TVPage() {
  const [paciente, setPaciente] = useState<Paciente | null>(null);

  const carregarUltimo = async () => {
    const { data, error } = await supabase
      .from("historico")
      .select("*")
      .order("id", { ascending: false })
      .limit(1)
      .single();

    console.log("PACIENTE TV:", data);
    console.log("ERRO:", error);

    if (data) {
      setPaciente(data);
    }
  };

  useEffect(() => {
    carregarUltimo();

    const channel = supabase
      .channel("tv-historico")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "historico",
        },
        (payload) => {
          console.log("NOVO PACIENTE:", payload.new);
          setPaciente(payload.new as Paciente);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <main className="min-h-screen bg-black flex items-center justify-center text-white p-10">
      {paciente ? (
        <div className="bg-green-500 w-full max-w-5xl rounded-3xl p-16 text-center shadow-2xl">
          <h1 className="text-6xl font-bold mb-8">
            📢 CHAMANDO PACIENTE
          </h1>

          <h2 className="text-[180px] leading-none font-black">
            {paciente.senha}
          </h2>

          <p className="text-6xl mt-8 font-bold">
            {paciente.nome}
          </p>

          <p className="text-4xl mt-6">
            🟢 {paciente.prioridade}
          </p>

          <div className="bg-white text-black inline-block px-10 py-6 rounded-2xl mt-10 text-5xl font-bold">
            🚪 {paciente.sala}
          </div>
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-6xl font-bold text-green-400">
            🏥 PAINEL HOSPITALAR
          </h1>

          <p className="text-4xl text-gray-300 mt-6">
            Nenhum paciente chamado
          </p>
        </div>
      )}
    </main>
  );
}