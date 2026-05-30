"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function RelatoriosPage() {
  const [total, setTotal] = useState(0);
  const [normal, setNormal] = useState(0);
  const [urgente, setUrgente] = useState(0);
  const [emergencia, setEmergencia] = useState(0);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    const { data } = await supabase
      .from("historico")
      .select("*");

    if (!data) return;

    setTotal(data.length);
    setNormal(
      data.filter((p) => p.prioridade === "Normal").length
    );
    setUrgente(
      data.filter((p) => p.prioridade === "Urgente").length
    );
    setEmergencia(
      data.filter((p) => p.prioridade === "Emergência").length
    );
  };

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-5xl font-bold mb-10">
        📊 Relatórios
      </h1>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-zinc-900 p-6 rounded-3xl">
          <h2 className="text-gray-400">
            Total
          </h2>

          <p className="text-5xl font-bold text-cyan-400">
            {total}
          </p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-3xl">
          <h2 className="text-gray-400">
            Normal
          </h2>

          <p className="text-5xl font-bold text-green-400">
            {normal}
          </p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-3xl">
          <h2 className="text-gray-400">
            Urgente
          </h2>

          <p className="text-5xl font-bold text-yellow-400">
            {urgente}
          </p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-3xl">
          <h2 className="text-gray-400">
            Emergência
          </h2>

          <p className="text-5xl font-bold text-red-400">
            {emergencia}
          </p>
        </div>
      </div>
    </main>
  );
}