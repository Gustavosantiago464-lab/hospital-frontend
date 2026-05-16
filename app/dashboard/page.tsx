"use client";

import { useEffect, useState } from "react";

type Paciente = {
  nome: string;
  prioridade: string;
};

export default function Dashboard() {
  const [nome, setNome] = useState("");
  const [prioridade, setPrioridade] = useState("Normal");

  const [fila, setFila] = useState<Paciente[]>([]);

  function adicionarPaciente() {
    if (!nome) return;

    const novoPaciente = {
      nome,
      prioridade,
    };

    setFila([...fila, novoPaciente]);

    setNome("");
  }

  function chamarProximo() {
    const novaFila = [...fila];

    novaFila.shift();

    setFila(novaFila);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-5xl font-bold">
            🏥 Sistema Hospitalar
          </h1>

          <p className="text-slate-400">
            Controle inteligente de pacientes
          </p>
        </div>

        <button
          className="bg-red-500 px-6 py-3 rounded-xl font-bold"
          onClick={() => {
            localStorage.removeItem("logado");
            window.location.href = "/login";
          }}
        >
          Sair
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-slate-900 p-8 rounded-3xl">
          <h2 className="text-4xl font-bold mb-6">
            Novo Paciente
          </h2>

          <input
            placeholder="Nome do paciente"
            value={nome}
            onChange={(e) =>
              setNome(e.target.value)
            }
            className="w-full p-4 rounded-xl bg-slate-800 mb-4"
          />

          <select
            value={prioridade}
            onChange={(e) =>
              setPrioridade(e.target.value)
            }
            className="w-full p-4 rounded-xl bg-slate-800 mb-6"
          >
            <option>🟢 Normal</option>
            <option>🟡 Urgente</option>
            <option>🔴 Emergência</option>
          </select>

          <button
            onClick={adicionarPaciente}
            className="w-full bg-blue-600 hover:bg-blue-700 p-4 rounded-xl font-bold"
          >
            Adicionar Paciente
          </button>
        </div>

        <div className="bg-slate-900 p-8 rounded-3xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-4xl font-bold">
              Fila Hospitalar
            </h2>

            <button
              onClick={chamarProximo}
              className="bg-green-500 px-6 py-3 rounded-xl font-bold"
            >
              Chamar Próximo
            </button>
          </div>

          <div className="space-y-4">
            {fila.map((paciente, index) => (
              <div
                key={index}
                className="bg-slate-800 p-4 rounded-xl"
              >
                <h3 className="text-2xl font-bold">
                  {paciente.nome}
                </h3>

                <p>
                  Prioridade: {paciente.prioridade}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}