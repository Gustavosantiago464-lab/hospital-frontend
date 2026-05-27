"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Paciente = {
  id: number;
  nome: string;
  prioridade: string;
  sala: string;
  senha: string;
};

export default function TVPage() {
  const [paciente, setPaciente] = useState<Paciente | null>(null);

  async function carregarUltimo() {
    const { data } = await supabase
      .from("historico")
      .select("*")
      .order("id", { ascending: false })
      .limit(1)
      .single();

    if (data) {
      setPaciente(data);
    }
  }

  useEffect(() => {
    carregarUltimo();

    const channel = supabase
      .channel("tv-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "historico",
        },
        (payload) => {
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
      {!paciente ? (
        <div className="text-center">
          <h1 className="text-6xl font-bold text-green-500">
            🏥 PAINEL HOSPITALAR
          </h1>

          <p className="text-4xl mt-8">
            Nenhum paciente chamado
          </p>
        </div>
      ) : (
        <div className="bg-green-500 text-center rounded-3xl p-16 w-full max-w-5xl">
          <h1 className="text-5xl font-bold mb-8">
            🔊 CHAMANDO PACIENTE
          </h1>

          <div className="text-9xl font-extrabold">
            {paciente.senha}
          </div>

          <div className="text-5xl mt-6">
            {paciente.nome}
          </div>

          <div className="text-3xl mt-6">
            🟢 {paciente.prioridade}
          </div>

          <div className="text-5xl mt-10 bg-white text-black inline-block px-10 py-5 rounded-2xl font-bold">
            🚪 Sala {paciente.sala}
          </div>
        </div>
      )}
    </main>
  );
}