"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import jsPDF from "jspdf";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
  } from "recharts";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function RelatoriosPage() {
  const [total, setTotal] = useState(0);
  const [normal, setNormal] = useState(0);
  const [urgente, setUrgente] = useState(0);
  const [emergencia, setEmergencia] = useState(0);
  const [historico, setHistorico] = useState<any[]>([]);
  const [dadosGraficoDia, setDadosGraficoDia] = useState<any[]>([]);
 
  const dadosGrafico = [
    { nome: "Normal", total: normal },
    { nome: "Urgente", total: urgente },
    { nome: "Emergência", total: emergencia },
  ];

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    const { data } = await supabase
      .from("historico")
      .select("*");

    if (!data) return;

    setHistorico(data);

    setTotal(data.length);

    setNormal(
      data.filter(
        (p) => p.prioridade === "Normal"
      ).length
    );

    setUrgente(
      data.filter(
        (p) => p.prioridade === "Urgente"
      ).length
    );

    setEmergencia(
      data.filter(
        (p) => p.prioridade === "Emergência"
      ).length
    );
    const agrupado: any = {};

data.forEach((item) => {
  const dia = new Date(
    item.data_atendimento
  ).toLocaleDateString("pt-BR");

  agrupado[dia] = (agrupado[dia] || 0) + 1;
});

const graficoDia = Object.keys(agrupado).map(
  (dia) => ({
    dia,
    atendimentos: agrupado[dia],
  })
);

setDadosGraficoDia(graficoDia);
console.log("Grafico Dia:", graficoDia);
  };

  const gerarPDF = () => {
    const pdf = new jsPDF();

    pdf.setFontSize(20);
    pdf.text("Relatorio Hospital AI", 20, 20);

    pdf.setFontSize(12);

    pdf.text(`Total: ${total}`, 20, 40);
    pdf.text(`Normal: ${normal}`, 20, 50);
    pdf.text(`Urgente: ${urgente}`, 20, 60);
    pdf.text(`Emergencia: ${emergencia}`, 20, 70);

    let y = 90;

    pdf.setFontSize(14);
    pdf.text("Pacientes Atendidos", 20, y);

    y += 15;

    historico.forEach((paciente) => {
      const data =
        paciente.data_atendimento
          ? new Date(
              paciente.data_atendimento
            ).toLocaleString("pt-BR")
          : "-";

      pdf.setFontSize(10);

      pdf.text(
        `${paciente.senha} | ${paciente.nome} | ${paciente.prioridade}`,
        20,
        y
      );

      y += 6;

      pdf.text(
        `${paciente.sala} | ${data}`,
        20,
        y
      );

      y += 10;

      if (y > 270) {
        pdf.addPage();
        y = 20;
      }
    });

    pdf.save("relatorio-hospital.pdf");
  };

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold mb-10">
          📊 Relatórios
        </h1>

        <div className="flex gap-4 mb-8">
          <button
            onClick={gerarPDF}
            className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl font-bold"
          >
            📄 Baixar PDF
          </button>

          <button
            onClick={() => {
              window.location.href =
                "/dashboard";
            }}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-bold"
          >
            ⬅️ Dashboard
          </button>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-10">
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

        <div className="bg-zinc-900 rounded-3xl p-6">
          <h2 className="text-3xl font-bold mb-6">
            📋 Últimos Atendimentos
          </h2>

          <div className="space-y-4">
            {historico.map((paciente) => (
              <div
                key={paciente.id}
                className="bg-zinc-800 p-4 rounded-2xl"
              >
                <h3 className="text-xl font-bold text-cyan-400">
                  {paciente.senha}
                </h3>

                <p>{paciente.nome}</p>

                <p>
                  Prioridade:{" "}
                  {paciente.prioridade}
                </p>

                <p>
                  Sala: {paciente.sala}
                </p>

                <p>
                  Data:{" "}
                  {paciente.data_atendimento
                    ? new Date(
                        paciente.data_atendimento
                      ).toLocaleString(
                        "pt-BR"
                      )
                    : "-"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-zinc-900 rounded-3xl p-6 mt-10">
        <h2 className="text-3xl font-bold mb-6">
          📈 Atendimentos por Prioridade
        </h2>

        <div style={{ width: "100%", height: 350 }}>
          <ResponsiveContainer>
            <BarChart data={dadosGrafico}>
              <XAxis dataKey="nome" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-zinc-900 p-6 rounded-3xl mt-10">
  <h2 className="text-2xl font-bold mb-6">
    📈 Atendimentos por Dia
  </h2>
  <p>{JSON.stringify(dadosGraficoDia)}</p>

  <div style={{ width: "100%", height: 350 }}>
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={dadosGraficoDia}>
      <XAxis dataKey="dia" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="atendimentos" fill="#22c55e" />
    </BarChart>
  </ResponsiveContainer>
</div>
</div>
 </main>
  );
}