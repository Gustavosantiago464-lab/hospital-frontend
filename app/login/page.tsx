"use client";

import { useState } from "react";

type Paciente = {
  nome: string;
  prioridade: string;
};

export default function Home() {
  const [nome, setNome] = useState("");
  const [prioridade, setPrioridade] =
    useState("🟢 Normal");

  const [fila, setFila] = useState<Paciente[]>([]);

  function adicionarPaciente() {
    if (!nome.trim()) return;

    const novoPaciente = {
      nome,
      prioridade,
    };

    setFila((filaAtual) => [
      ...filaAtual,
      novoPaciente,
    ]);

    setNome("");
  }

  function chamarProximo() {
    if (fila.length === 0) return;

    const novaFila = [...fila];

    novaFila.shift();

    setFila(novaFila);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-white p-10">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-6xl font-bold flex items-center gap-4">
            🏥 Sistema Hospitalar
          </h1>

          <p className="text-slate-400 mt-2 text-lg">
            Controle inteligente de pacientes
          </p>
        </div>

        <button
          className="bg-red-500 hover:bg-red-600 transition px-6 py-3 rounded-2xl font-bold shadow-lg"
          onClick={() => {
            localStorage.removeItem("logado");

            window.location.href =
              "/login";
          }}
        >
          Sair
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-slate-900/70 border border-slate-700 p-8 rounded-3xl shadow-2xl backdrop-blur">
          <h2 className="text-5xl font-bold mb-8">
            Novo Paciente
          </h2>

          <input
            placeholder="Nome do paciente"
            value={nome}
            onChange={(e) =>
              setNome(e.target.value)
            }
            className="w-full p-5 rounded-2xl bg-slate-800 text-white mb-5 outline-none text-xl"
          />

          <select
            value={prioridade}
            onChange={(e) =>
              setPrioridade(e.target.value)
            }
            className="w-full p-4 rounded-2xl bg-slate-800 text-white mb-6 text-lg"
          >
            <option>
              🟢 Normal
            </option>

            <option>
              🟡 Urgente
            </option>

            <option>
              🔴 Emergência
            </option>
          </select>

          <button
            onClick={adicionarPaciente}
            className="w-full bg-blue-600 hover:bg-blue-700 transition p-5 rounded-2xl text-2xl font-bold shadow-lg"
          >
            Adicionar Paciente
          </button>
        </div>

        <div className="bg-slate-900/70 border border-slate-700 p-8 rounded-3xl shadow-2xl backdrop-blur">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-5xl font-bold">
              Fila Hospitalar
            </h2>

            <button
              onClick={chamarProximo}
              className="bg-green-500 hover:bg-green-600 transition px-6 py-4 rounded-2xl text-xl font-bold shadow-lg"
            >
              Chamar Próximo
            </button>
          </div>

          <div className="space-y-4">
            {fila.map((paciente, index) => (
              <div
                key={index}
                className="bg-slate-800 border border-slate-700 p-5 rounded-2xl"
              >
                <h3 className="text-2xl font-bold">
                  {paciente.nome}
                </h3>

                <p className="text-slate-300 mt-2">
                  {paciente.prioridade}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}