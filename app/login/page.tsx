"use client";

import { useState } from "react";

export default function LoginPage() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");

  const fazerLogin = () => {
    if (usuario === "admin" && senha === "123") {
      localStorage.setItem("logado", "true");

      window.location.href = "/dashboard";
    } else {
      alert("Usuário ou senha inválidos");
    }
  };

  return (
    <main className="min-h-screen bg-black flex items-center justify-center text-white">
      <div className="bg-blue-950/60 border border-blue-400 p-10 rounded-3xl w-[400px] backdrop-blur-xl">
        <h1 className="text-5xl font-bold text-center">
          🏥 Hospital
        </h1>

        <p className="text-center text-gray-300 mt-2 mb-8">
          Sistema Inteligente
        </p>

        <input
          type="text"
          placeholder="Usuário"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          className="w-full p-4 rounded-xl bg-blue-900/60 mb-4 outline-none"
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full p-4 rounded-xl bg-blue-900/60 mb-6 outline-none"
        />

        <button
          onClick={fazerLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 transition p-4 rounded-xl text-2xl font-bold"
        >
          Entrar
        </button>
      </div>
    </main>
  );
}