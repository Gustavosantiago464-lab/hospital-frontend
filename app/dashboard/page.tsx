"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Paciente = {
  id?: number;
  nome: string;
  prioridade: string;
  sala: string;
  senha: string;
};

export default function Dashboard() {
  const [nome, setNome] = useState("");
  const [prioridade, setPrioridade] = useState("Normal");
  const [fila, setFila] = useState<Paciente[]>([]);
  const [chamado, setChamado] = useState<Paciente | null>(null);
  const [atendidosHoje, setAtendidosHoje] = useState(0);
  const [atendidosTotal, setAtendidosTotal] = useState(0);

  useEffect(() => {
    const verificarSessao = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
  
      if (!session) {
        window.location.href = "/login";
      }
    };
  
    verificarSessao();
  }, []);

  const gerarSenha = () => {
    const numero = fila.length + 1;
    return `A${String(numero).padStart(3, "0")}`;
  };

  const carregarFila = async () => {
    const { data } = await supabase
      .from("pacientes")
      .select("*")
      .order("id", { ascending: true });

    if (data) {
      setFila(data);
    }
  };
  const carregarEstatisticas = async () => {
    const { count } = await supabase
      .from("historico")
      .select("*", {
        count: "exact",
        head: true,
      });
  
    setAtendidosHoje(count || 0);
    setAtendidosTotal(count || 0);
  };

  const adicionarPaciente = async () => {
    if (!nome) return;

    const senha = gerarSenha();

    const novoPaciente = {
      nome,
      prioridade,
      sala: `Sala 0${Math.floor(Math.random() * 5) + 1}`,
      senha,
    };

    await supabase.from("pacientes").insert([novoPaciente]);

    setNome("");
    carregarFila();
  };

  const chamarProximo = async () => {
    if (fila.length === 0) return;

    const paciente = fila[0];

    setChamado(paciente);

    const novaFila = fila.slice(1);
    setFila(novaFila);

    await supabase.from("historico").insert([
        {
          nome: paciente.nome,
          prioridade: paciente.prioridade,
          sala: paciente.sala,
          senha: paciente.senha,
          data_atendimento: new Date(
            Date.now() - 3 * 60 * 60 * 1000
          ),
        },
      ]);

    await supabase
      .from("pacientes")
      .delete()
      .eq("id", paciente.id);
      carregarEstatisticas();

    localStorage.setItem(
      "ultimoPaciente",
      JSON.stringify(paciente)
    );
  };

  useEffect(() => {
    carregarFila();
    carregarEstatisticas();

    const channel = supabase
      .channel("pacientes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "pacientes",
        },
        () => {
          carregarFila();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-4 gap-4 mb-8">
  <div className="bg-zinc-900 p-6 rounded-3xl">
    <h3 className="text-gray-400">
      Pacientes na fila
    </h3>

    <p className="text-5xl font-bold text-cyan-400">
      {fila.length}
    </p>
  </div>

  <div className="bg-zinc-900 p-6 rounded-3xl">
    <h3 className="text-gray-400">
      Total Atendidos
    </h3>

    <p className="text-5xl font-bold text-green-400">
      {atendidosHoje}
    </p>
  </div>

  <div className="bg-zinc-900 p-6 rounded-3xl">
    <h3 className="text-gray-400">
      Histórico
    </h3>

    <p className="text-5xl font-bold text-purple-400">
      {atendidosTotal}
    </p>
  </div>

  <div className="bg-zinc-900 p-6 rounded-3xl">
    <h3 className="text-gray-400">
      Última senha
    </h3>

    <p className="text-5xl font-bold text-yellow-400">
      {chamado?.senha || "-"}
    </p>
  </div>
</div>
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-5xl font-bold">
              🏥 Hospital AI
            </h1>

            <p className="text-gray-400 mt-2">
              Sistema Inteligente Hospitalar
            </p>

            <div className="mt-4 flex gap-4">
  <button
    onClick={async () => {
      await supabase.auth.signOut();
      window.location.href = "/login";
    }}
    className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-xl font-bold"
  >
    Sair
  </button>

  <button
    onClick={() => {
      window.location.href = "/historico";
    }}
    className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-xl font-bold"
  >
    📋 Histórico
  </button>
  <button
  onClick={() => {
    window.location.href = "/relatorios";
  }}
  className="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-xl font-bold"
>
  📊 Relatórios
</button>

</div>   
          </div>
        </div>

        {chamado && (
          <div className="bg-green-500 rounded-3xl p-10 text-center mb-10">
            <h2 className="text-5xl font-bold mb-4">
              📢 CHAMANDO PACIENTE
            </h2>

            <h1 className="text-9xl font-black">
              {chamado.senha}
            </h1>

            <p className="text-4xl mt-4">
              {chamado.nome}
            </p>

            <p className="text-2xl mt-3">
              🟢 {chamado.prioridade}
            </p>

            <div className="bg-white text-black inline-block px-8 py-4 rounded-2xl mt-6 text-4xl font-bold">
              🚪 {chamado.sala}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-zinc-900 p-6 rounded-3xl">
            <h2 className="text-4xl font-bold mb-6">
              Novo Paciente
            </h2>

            <input
              type="text"
              placeholder="Nome do paciente"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full p-4 rounded-xl bg-zinc-800 mb-4 text-xl"
            />

            <select
              value={prioridade}
              onChange={(e) =>
                setPrioridade(e.target.value)
              }
              className="w-full p-4 rounded-xl bg-zinc-800 mb-4 text-xl"
            >
              <option>Normal</option>
              <option>Urgente</option>
              <option>Emergência</option>
            </select>

            <button
              onClick={adicionarPaciente}
              className="w-full bg-blue-600 hover:bg-blue-700 transition p-4 rounded-xl text-2xl font-bold"
            >
              + Adicionar Paciente
            </button>
          </div>

          <div className="bg-zinc-900 p-6 rounded-3xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-4xl font-bold">
                Fila Hospitalar
              </h2>

              <button
                onClick={chamarProximo}
                className="bg-green-500 hover:bg-green-600 transition px-6 py-4 rounded-2xl text-xl font-bold"
              >
                📢 Chamar Próximo
              </button>
            </div>

            <div className="space-y-4">
              {fila.map((paciente) => (
                <div
                  key={paciente.id}
                  className="bg-zinc-800 p-5 rounded-2xl flex items-center justify-between"
                >
                  <div>
                    <h3 className="text-3xl font-bold text-cyan-400">
                      {paciente.senha}
                    </h3>

                    <p className="text-2xl">
                      {paciente.nome}
                    </p>

                    <p className="text-lg text-green-400">
                      🟢 {paciente.prioridade}
                    </p>
                  </div>

                  <div className="bg-blue-600 px-5 py-3 rounded-xl text-xl font-bold">
                    {paciente.sala}
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