"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const fazerLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      alert("Email ou senha inválidos");
      return;
    }

    window.location.href = "/dashboard";
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
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        <button
  onClick={async () => {
    const email = prompt("Digite seu email:");

    if (!email) return;

    const { error } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo:
          window.location.origin +
          "/reset-password",
      }
    );

    if (error) {
      alert(error.message);
    } else {
      alert("Email de recuperação enviado!");
    }
  }}
  className="mt-4 w-full text-blue-300 hover:text-blue-200"
>
  Esqueci minha senha
</button>       
      </div>
    </main>
  );
}