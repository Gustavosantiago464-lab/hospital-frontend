"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import jsPDF from "jspdf";

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
  const gerarPDF = () => {
    const pdf = new jsPDF();
  
    pdf.setFontSize(20);
    pdf.text("Relatorio Hospital AI", 20, 20);
  
    pdf.text(`Total: ${total}`, 20, 50);
    pdf.text(`Normal: ${normal}`, 20, 65);
    pdf.text(`Urgente: ${urgente}`, 20, 80);
    pdf.text(`Emergencia: ${emergencia}`, 20, 95);
  
    pdf.save("relatorio-hospital.pdf");
  };

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
      <button
  onClick={gerarPDF}
  className="mb-8 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl font-bold"
>
  📄 Baixar PDF
</button>
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