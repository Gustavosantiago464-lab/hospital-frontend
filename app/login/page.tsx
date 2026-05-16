"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");

  const router = useRouter();

  function entrar() {
    if (
      usuario === "admin" &&
      senha === "123"
    ) {
      localStorage.setItem("logado", "true");

      router.push("/");
    } else {
      alert("Login inválido");
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
      <div className="bg-slate-900 p-10 rounded-3xl w-full max-w-md shadow-2xl">
        <h1 className="text-4xl text-white font-bold mb-8 text-center">
          🔐 Login Hospital
        </h1>

        <input
          placeholder="Usuário"
          value={usuario}
          onChange={(e) =>
            setUsuario(e.target.value)
          }
          className="w-full p-4 rounded-xl bg-slate-800 text-white mb-4"
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) =>
            setSenha(e.target.value)
          }
          className="w-full p-4 rounded-xl bg-slate-800 text-white mb-6"
        />

        <button
          onClick={entrar}
          className="w-full bg-blue-600 hover:bg-blue-700 transition p-4 rounded-xl text-white font-bold"
        >
          Entrar
        </button>
      </div>
    </main>
  );
}