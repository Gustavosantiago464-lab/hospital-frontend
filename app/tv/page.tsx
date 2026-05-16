"use client";

import { useEffect, useState } from "react";

export default function TVHospital() {
  const [paciente, setPaciente] = useState<any>(null);

  async function carregarUltimoChamado() {
    try {
      const resposta = await fetch(
        "http://localhost:3001/ultimo"
      );

      const dados = await resposta.json();

      setPaciente(dados);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    carregarUltimoChamado();

    const intervalo = setInterval(() => {
      carregarUltimoChamado();
    }, 2000);

    return () => clearInterval(intervalo);
  }, []);

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-10">
      <div className="text-center w-full">
        <h1 className="text-7xl font-bold mb-12 text-green-400">
          🏥 PAINEL HOSPITALAR
        </h1>

        {paciente ? (
          <div className="bg-slate-900 border border-green-500 rounded-[40px] p-20 shadow-2xl animate-pulse">
            <p className="text-4xl text-slate-400 mb-6">
              SENHA CHAMADA
            </p>

            <h2 className="text-[170px] font-extrabold text-green-400 leading-none">
              {paciente.senha}
            </h2>

            <p className="text-6xl mt-10 font-bold">
              {paciente.nome}
            </p>

            <div className="mt-12 text-5xl">
              🚪 Sala 03
            </div>
          </div>
        ) : (
          <div className="text-6xl text-slate-500">
            Nenhum paciente chamado
          </div>
        )}
      </div>
    </main>
  );
}