"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function HistoricoPage() {
  const [historico, setHistorico] = useState<any[]>([]);

  const carregarHistorico = async () => {
    const { data } = await supabase
      .from("historico")
      .select("*")
      .order("id", { ascending: false });

    if (data) setHistorico(data);
  };

  useEffect(() => {
    carregarHistorico();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-5xl font-bold mb-8">
        📋 Histórico de Atendimentos
      </h1>

      <div className="space-y-4">
        {historico.map((paciente) => (
          <div
            key={paciente.id}
            className="bg-zinc-900 p-5 rounded-2xl"
          >
            <h2 className="text-2xl font-bold text-cyan-400">
              {paciente.senha}
            </h2>

            <p>{paciente.nome}</p>

            <p>Prioridade: {paciente.prioridade}</p>

            <p>Sala: {paciente.sala}</p>
            <p>
  Data:{" "}
  {paciente.data_atendimento
    ? new Date(
        paciente.data_atendimento
      ).toLocaleString("pt-BR")
    : "-"}
</p>
          </div>
        ))}
      </div>
    </main>
  );
}