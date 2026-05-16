"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Paciente = {
  nome: string;
  prioridade: string;
  sala: string;
};

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const logado =
      localStorage.getItem("logado");

    if (!logado) {
      router.push("/login");
    }
  }, []);

  const [nome, setNome] = useState("");
  const [prioridade, setPrioridade] =
    useState("🟢 Normal");

  const [fila, setFila] = useState<Paciente[]>([]);

  const [painel, setPainel] =
    useState<Paciente | null>(null);

  function adicionarPaciente() {
    if (!nome.trim()) return;

    const salas = [
      "Sala 01",
      "Sala 02",
      "Sala 03",
      "Sala 04",
    ];

    const novaSala =
      salas[
        Math.floor(
          Math.random() * salas.length
        )
      ];

    const novoPaciente = {
      nome,
      prioridade,
      sala: novaSala,
    };

    setFila((filaAtual) => [
      ...filaAtual,
      novoPaciente,
    ]);

    setNome("");
  }

  function chamarProximo() {
    if (fila.length === 0) return;

    const proximo = fila[0];

    setPainel(proximo);

    const novaFila = [...fila];

    novaFila.shift();

    setFila(novaFila);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 text-white p-10">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-6xl font-black">
            🏥 Sistema Hospitalar
          </h1>

          <p className="text-slate-400 text-xl mt-2">
            Controle inteligente de pacientes
          </p>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem(
              "logado"
            );

            router.push("/login");
          }}
          className="bg-red-500 hover:bg-red-600 transition px-8 py-4 rounded-2xl font-bold text-xl shadow-lg"
        >
          Sair
        </button>
      </div>

      {/* TELÃO */}
      {painel && (
        <div className="bg-green-500 text-center rounded-[40px] p-12 mb-10 animate-pulse shadow-2xl">
          <h2 className="text-5xl font-black mb-6">
            🔊 CHAMANDO PACIENTE
          </h2>

          <h1 className="text-8xl font-black">
            {painel.nome}
          </h1>

          <p className="text-4xl mt-6">
            {painel.prioridade}
          </p>

          <div className="mt-8 bg-white text-black inline-block px-10 py-5 rounded-3xl text-5xl font-black">
            🚪 {painel.sala}
          </div>
        </div>
      )}

      {/* CONTEÚDO */}
      <div className="grid lg:grid-cols-2 gap-10">
        {/* NOVO PACIENTE */}
        <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-700 p-10 rounded-[40px] shadow-2xl">
          <h2 className="text-5xl font-black mb-8">
            Novo Paciente
          </h2>

          <input
            placeholder="Nome do paciente"
            value={nome}
            onChange={(e) =>
              setNome(e.target.value)
            }
            className="w-full bg-slate-800 border border-slate-700 p-5 rounded-2xl text-2xl mb-6 outline-none"
          />

          <select
            value={prioridade}
            onChange={(e) =>
              setPrioridade(e.target.value)
            }
            className="w-full bg-slate-800 border border-slate-700 p-5 rounded-2xl text-2xl mb-8"
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
            className="w-full bg-blue-600 hover:bg-blue-700 transition p-5 rounded-2xl text-2xl font-black shadow-xl"
          >
            Adicionar Paciente
          </button>
        </div>

        {/* FILA */}
        <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-700 p-10 rounded-[40px] shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-5xl font-black">
              Fila Hospitalar
            </h2>

            <button
              onClick={chamarProximo}
              className="bg-green-500 hover:bg-green-600 transition px-8 py-5 rounded-2xl text-2xl font-black shadow-xl"
            >
              Chamar Próximo
            </button>
          </div>

          <div className="space-y-5">
            {fila.map((paciente, index) => (
              <div
                key={index}
                className="bg-slate-800 border border-slate-700 p-6 rounded-3xl"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-3xl font-black">
                      {paciente.nome}
                    </h3>

                    <p className="text-xl text-slate-300 mt-2">
                      {paciente.prioridade}
                    </p>
                  </div>

                  <div className="bg-blue-600 px-5 py-3 rounded-2xl text-xl font-bold">
                    {paciente.sala}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}