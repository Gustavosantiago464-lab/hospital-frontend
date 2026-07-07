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
  cpf?: string;
  telefone?: string;
  data_nascimento?: string;
  sexo?: string;
  alergias?: string;
  prioridade: string;
  sala: string;
  senha: string;
};

export default function Dashboard() {
  const [nome, setNome] = useState("");
  const [prioridade, setPrioridade] = useState("Normal");
  const [fila, setFila] = useState<Paciente[]>([]);
  const [busca, setBusca] = useState("");
  const [chamado, setChamado] = useState<Paciente | null>(null);
  const [pacienteSelecionado, setPacienteSelecionado] =
  useState<Paciente | null>(null);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [atendidosHoje, setAtendidosHoje] = useState(0);
  const [atendidosTotal, setAtendidosTotal] = useState(0);
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [sexo, setSexo] = useState("Masculino");
  const [alergias, setAlergias] = useState("")
  
  useEffect(() => {
    const verificarSessao = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setNome("");
      setCpf("");
      setTelefone("");
      setDataNascimento("");
      setSexo("Masculino");
      setAlergias("");
      setPrioridade("Normal");
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
      cpf,
      telefone,
      data_nascimento: dataNascimento,
      sexo,
      alergias,
      prioridade,
      status: "Aguardando",
      sala: `Sala ${Math.floor(Math.random() * 5) + 1}`,
      senha,
    }; 

    const { error } = await supabase
    .from("pacientes")
    .insert([novoPaciente]);
  
  if (error) {
    alert(error.message);
    console.log(error);
    return;
  }
    setNome("");
    carregarFila();
  };
  const salvarPaciente = async () => {
    if (!pacienteSelecionado) return;
  
    const { error } = await supabase
      .from("pacientes")
      .update({
        nome: pacienteSelecionado.nome,
        cpf: pacienteSelecionado.cpf,
        telefone: pacienteSelecionado.telefone,
        data_nascimento: pacienteSelecionado.data_nascimento,
        sexo: pacienteSelecionado.sexo,
        alergias: pacienteSelecionado.alergias,
        prioridade: pacienteSelecionado.prioridade,
      })
      .eq("id", pacienteSelecionado.id);
  
    if (error) {
      alert(error.message);
      return;
    }
  
    alert("Paciente atualizado com sucesso!");
    setModoEdicao(false);
    carregarFila();
  };
  const excluirPaciente = async () => {
    if (!pacienteSelecionado) return;
  
    const confirmar = confirm(
      "Tem certeza que deseja excluir este paciente?"
    );
  
    if (!confirmar) return;
  
    const { error } = await supabase
      .from("pacientes")
      .delete()
      .eq("id", pacienteSelecionado.id);
  
    if (error) {
      alert(error.message);
      return;
    }
  
    alert("Paciente excluído com sucesso!");
  
    setPacienteSelecionado(null);
    setModoEdicao(false);
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
<input
  type="text"
  placeholder="CPF"
  value={cpf}
  onChange={(e) => setCpf(e.target.value)}
  className="w-full p-4 rounded-xl bg-zinc-800 mb-4 text-xl"
/>

<input
  type="text"
  placeholder="Telefone"
  value={telefone}
  onChange={(e) => setTelefone(e.target.value)}
  className="w-full p-4 rounded-xl bg-zinc-800 mb-4 text-xl"
/>

<input
  type="date"
  value={dataNascimento}
  onChange={(e) => setDataNascimento(e.target.value)}
  className="w-full p-4 rounded-xl bg-zinc-800 mb-4 text-xl"
/>

<select
  value={sexo}
  onChange={(e) => setSexo(e.target.value)}
  className="w-full p-4 rounded-xl bg-zinc-800 mb-4 text-xl"
>
  <option>Masculino</option>
  <option>Feminino</option>
  <option>Outro</option>
</select>
<input
  type="text"
  placeholder="Alergias"
  value={alergias}
  onChange={(e) => setAlergias(e.target.value)}
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
            <input
  type="text"
  placeholder="Pesquisar por nome, CPF ou telefone"
  value={busca}
  onChange={(e) => setBusca(e.target.value)}
  className="w-full p-3 rounded-xl bg-zinc-800 mb-4"
/>
            <div className="space-y-4">
            {fila
  .filter((paciente) =>
    paciente.nome
      ?.toLowerCase()
      .includes(busca.toLowerCase()) ||
    paciente.cpf
      ?.toLowerCase()
      .includes(busca.toLowerCase()) ||
    paciente.telefone
      ?.toLowerCase()
      .includes(busca.toLowerCase())
  )
  .map((paciente) => (
    <div
    key={paciente.id}
    onClick={() => {
      setPacienteSelecionado(paciente);
    }}
    className="bg-zinc-800 p-5 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-zinc-700"
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
      {pacienteSelecionado && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
    <div className="bg-zinc-900 p-8 rounded-3xl w-[500px]">
      <h2 className="text-3xl font-bold mb-6">
        Dados do Paciente
      </h2>

      {modoEdicao ? (
  <input
    type="text"
    value={pacienteSelecionado.nome}
    onChange={(e) =>
      setPacienteSelecionado({
        ...pacienteSelecionado,
        nome: e.target.value,
      })
    }
    className="w-full p-3 rounded-xl bg-zinc-800 mb-3"
  />
) : (
  <p><b>Nome:</b> {pacienteSelecionado.nome}</p>
)}
      <p><b>CPF:</b> {pacienteSelecionado.cpf}</p>
      <p><b>Telefone:</b> {pacienteSelecionado.telefone}</p>
      <p><b>Data Nasc.:</b> {pacienteSelecionado.data_nascimento}</p>
      <p><b>Sexo:</b> {pacienteSelecionado.sexo}</p>
      <p><b>Alergias:</b> {pacienteSelecionado.alergias}</p>
      <p><b>Senha:</b> {pacienteSelecionado.senha}</p>
      <p><b>Prioridade:</b> {pacienteSelecionado.prioridade}</p>
      <p><b>Sala:</b> {pacienteSelecionado.sala}</p>
      {modoEdicao ? (
  <button
    onClick={salvarPaciente}
    className="mb-3 w-full bg-green-600 hover:bg-green-700 p-3 rounded-xl font-bold"
  >
    💾 Salvar Alterações
  </button>
) : (
  <button
    onClick={() => setModoEdicao(true)}
    className="mb-3 w-full bg-yellow-500 hover:bg-yellow-600 p-3 rounded-xl font-bold"
  >
    ✏️ Editar Paciente
  </button>
)}

<button
  onClick={excluirPaciente}
  className="mb-3 w-full bg-red-700 hover:bg-red-800 p-3 rounded-xl font-bold"
>
  🗑️ Excluir Paciente
</button>

<button
  onClick={() => {
    setPacienteSelecionado(null);
    setModoEdicao(false);
  }}
  className="mt-6 w-full bg-red-600 p-3 rounded-xl"
>
  Fechar
</button>
    </div>
  </div>
)}
    </main>
  );
}