"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [fila, setFila] = useState<any[]>([]);
  const [nome, setNome] = useState("");
  const [prioridade, setPrioridade] = useState("normal");

  const [pacienteChamado, setPacienteChamado] =
    useState<any>(null);

  async function carregarFila() {
    const resposta = await fetch("http://localhost:3001/fila");
    const dados = await resposta.json();
    setFila(dados);
  }

  async function adicionarPaciente() {
    if (!nome) return;

    const senha =
      "A" +
      String(Date.now()).slice(-3);

    await fetch("http://localhost:3001/fila", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome,
        prioridade,
        senha,
      }),
    });

    setNome("");
    carregarFila();
  }

  async function removerPaciente(id: number) {
    await fetch(`http://localhost:3001/fila/${id}`, {
      method: "DELETE",
    });

    carregarFila();
  }

  async function chamarProximo() {
    if (fila.length === 0) {
      alert("Nenhum paciente na fila");
      return;
    }

    const paciente = fila[0];

    // SOM
    const audio = new Audio("/som.mp3");
    audio.play();

    setPacienteChamado(paciente);

    // ENVIA PARA TV
    await fetch("http://localhost:3001/chamar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paciente),
    });

    // REMOVE DA FILA
    await removerPaciente(paciente.id);

    setTimeout(() => {
      setPacienteChamado(null);
    }, 5000);
  }

  useEffect(() => {
    const logado =
      localStorage.getItem("logado");

    if (!logado) {
      router.push("/login");
    }

    carregarFila();

    const intervalo = setInterval(() => {
      carregarFila();
    }, 2000);

    return () => clearInterval(intervalo);
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* TOPO */}
        <div className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-5xl font-bold">
              🏥 Sistema Hospitalar
            </h1>

            <p className="text-slate-400 mt-2">
              Controle inteligente de pacientes
            </p>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem("logado");
              router.push("/login");
            }}
            className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-xl font-bold"
          >
            Sair
          </button>
        </div>

        {/* PAINEL CHAMADA */}
        {pacienteChamado && (
          <div className="bg-green-600 rounded-3xl p-10 mb-8 text-center animate-pulse shadow-2xl">
            <h2 className="text-3xl font-bold mb-4">
              🔊 CHAMANDO PACIENTE
            </h2>

            <h1 className="text-7xl font-extrabold">
              {pacienteChamado.senha}
            </h1>

            <p className="text-4xl mt-4 font-bold">
              {pacienteChamado.nome}
            </p>

            <p className="text-2xl mt-4">
              Dirigir-se para Sala 03
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* FORM */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold mb-6">
              Novo Paciente
            </h2>

            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome do paciente"
              className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 mb-4 outline-none"
            />

            <select
              value={prioridade}
              onChange={(e) =>
                setPrioridade(e.target.value)
              }
              className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 mb-4 outline-none"
            >
              <option value="normal">
                🟢 Normal
              </option>

              <option value="alta">
                🔴 Alta
              </option>
            </select>

            <button
              onClick={adicionarPaciente}
              className="w-full bg-blue-600 hover:bg-blue-700 transition p-4 rounded-xl font-bold text-lg"
            >
              Adicionar Paciente
            </button>
          </div>

          {/* FILA */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">
                Fila Hospitalar
              </h2>

              <button
                onClick={chamarProximo}
                className="bg-green-600 hover:bg-green-700 transition px-4 py-2 rounded-xl font-bold"
              >
                Chamar Próximo
              </button>
            </div>

            <div className="space-y-4">
              {fila.map((paciente) => (
                <div
                  key={paciente.id}
                  className={`p-5 rounded-2xl flex justify-between items-center transition hover:scale-[1.02]
                  ${
                    paciente.prioridade === "alta"
                      ? "bg-red-900"
                      : "bg-slate-800"
                  }`}
                >
                  <div>
                    <h3 className="text-2xl font-bold">
                      {paciente.senha}
                    </h3>

                    <p className="text-xl">
                      {paciente.nome}
                    </p>

                    <p className="text-slate-300">
                      Prioridade:{" "}
                      {paciente.prioridade}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      removerPaciente(paciente.id)
                    }
                    className="bg-red-500 hover:bg-red-600 transition px-5 py-2 rounded-xl font-bold"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}