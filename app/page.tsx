"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Paciente = {
  nome: string;
  prioridade: string;
  sala: string;
  senha: string;
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

  const [contador, setContador] =
    useState(1);

  // FILA SALVA
  const [fila, setFila] = useState<Paciente[]>(
    () => {
      if (
        typeof window !== "undefined"
      ) {
        const filaSalva =
          localStorage.getItem(
            "fila"
          );

        return filaSalva
          ? JSON.parse(filaSalva)
          : [];
      }

      return [];
    }
  );

  const [painel, setPainel] =
    useState<Paciente | null>(null);

  function gerarSenha() {
    return `A${String(contador).padStart(
      3,
      "0"
    )}`;
  }

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
      senha: gerarSenha(),
    };

    const novaFila = [
      ...fila,
      novoPaciente,
    ];

    setFila(novaFila);

    localStorage.setItem(
      "fila",
      JSON.stringify(novaFila)
    );

    setContador(contador + 1);

    setNome("");
  }

  function chamarProximo() {
    if (fila.length === 0) return;

    const proximo = fila[0];

    setPainel(proximo);

    // SALVA ÚLTIMO CHAMADO
    localStorage.setItem(
      "ultimoChamado",
      JSON.stringify(proximo)
    );

    // HISTÓRICO
    const historicoSalvo =
      localStorage.getItem(
        "historico"
      );

    const historico = historicoSalvo
      ? JSON.parse(historicoSalvo)
      : [];

    const novoHistorico = [
      proximo,
      ...historico,
    ].slice(0, 5);

    localStorage.setItem(
      "historico",
      JSON.stringify(novoHistorico)
    );

    const novaFila = [...fila];

    novaFila.shift();

    setFila(novaFila);

    localStorage.setItem(
      "fila",
      JSON.stringify(novaFila)
    );
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white p-10">
      <div className="max-w-7xl mx-auto">
        {/* TOPO */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-7xl font-black">
              🏥 Hospital AI
            </h1>

            <p className="text-slate-400 text-2xl mt-2">
              Sistema Inteligente Hospitalar
            </p>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem(
                "logado"
              );

              router.push("/login");
            }}
            className="bg-red-500 hover:bg-red-600 transition px-8 py-4 rounded-3xl text-xl font-bold"
          >
            Sair
          </button>
        </div>

        {/* TELÃO */}
        {painel && (
          <div className="bg-green-500 rounded-[40px] p-12 mb-10 text-center animate-pulse shadow-2xl">
            <h2 className="text-5xl font-black mb-5">
              🔊 CHAMANDO PACIENTE
            </h2>

            <h1 className="text-9xl font-black text-white">
              {painel.senha}
            </h1>

            <p className="text-5xl mt-6 font-bold">
              {painel.nome}
            </p>

            <p className="text-3xl mt-4">
              {painel.prioridade}
            </p>

            <div className="mt-8 inline-block bg-white text-black px-10 py-5 rounded-3xl text-5xl font-black">
              🚪 {painel.sala}
            </div>
          </div>
        )}

        {/* GRID */}
        <div className="grid lg:grid-cols-2 gap-10">
          {/* NOVO PACIENTE */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[40px] shadow-2xl">
            <h2 className="text-5xl font-black mb-8">
              Novo Paciente
            </h2>

            <input
              placeholder="Nome do paciente"
              value={nome}
              onChange={(e) =>
                setNome(e.target.value)
              }
              className="w-full bg-black/30 border border-white/10 p-5 rounded-3xl text-2xl mb-6 outline-none"
            />

            <select
              value={prioridade}
              onChange={(e) =>
                setPrioridade(e.target.value)
              }
              className="w-full bg-black/30 border border-white/10 p-5 rounded-3xl text-2xl mb-8"
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
              className="w-full bg-blue-600 hover:bg-blue-700 transition p-5 rounded-3xl text-2xl font-black"
            >
              ➕ Adicionar Paciente
            </button>
          </div>

          {/* FILA */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[40px] shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-5xl font-black">
                Fila Hospitalar
              </h2>

              <button
                onClick={chamarProximo}
                className="bg-green-500 hover:bg-green-600 transition px-8 py-5 rounded-3xl text-2xl font-black"
              >
                🔊 Chamar Próximo
              </button>
            </div>

            <div className="space-y-5">
              {fila.map((paciente, index) => (
                <div
                  key={index}
                  className="bg-black/30 border border-white/10 p-6 rounded-3xl"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-4xl font-black text-cyan-400">
                        {paciente.senha}
                      </h3>

                      <p className="text-2xl mt-2 font-bold">
                        {paciente.nome}
                      </p>

                      <p className="text-xl text-slate-300 mt-2">
                        {
                          paciente.prioridade
                        }
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
      </div>
    </main>
  );
}