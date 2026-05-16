"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [usuario, setUsuario] =
    useState("");

  const [senha, setSenha] =
    useState("");

  const router = useRouter();

  function entrar() {
    if (
      usuario === "admin" &&
      senha === "123"
    ) {
      localStorage.setItem(
        "logado",
        "true"
      );

      router.push("/");
    } else {
      alert("Login inválido");
    }
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-8">
      <div className="bg-slate-900 border border-slate-700 p-10 rounded-[40px] w-full max-w-md shadow-2xl">
        <h1 className="text-5xl font-black text-white text-center mb-3">
          🏥 Hospital
        </h1>

        <p className="text-slate-400 text-center mb-10">
          Sistema Inteligente
        </p>

        <input
          placeholder="Usuário"
          value={usuario}
          onChange={(e) =>
            setUsuario(e.target.value)
          }
          className="w-full bg-slate-800 text-white p-5 rounded-2xl mb-5 text-xl"
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) =>
            setSenha(e.target.value)
          }
          className="w-full bg-slate-800 text-white p-5 rounded-2xl mb-8 text-xl"
        />

        <button
          onClick={entrar}
          className="w-full bg-blue-600 hover:bg-blue-700 transition p-5 rounded-2xl text-2xl font-black text-white"
        >
          Entrar
        </button>
      </div>
    </main>
  );
}