"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ResetPassword() {
  const [senha, setSenha] = useState("");

  const alterarSenha = async () => {
    const { error } =
      await supabase.auth.updateUser({
        password: senha,
      });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Senha alterada com sucesso!");

    window.location.href = "/login";
  };

  return (
    <main className="min-h-screen bg-black flex items-center justify-center text-white">
      <div className="bg-zinc-900 p-10 rounded-3xl w-[400px]">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Nova Senha
        </h1>

        <input
          type="password"
          placeholder="Nova senha"
          value={senha}
          onChange={(e) =>
            setSenha(e.target.value)
          }
          className="w-full p-4 rounded-xl bg-zinc-800 mb-6"
        />

        <button
          onClick={alterarSenha}
          className="w-full bg-blue-600 p-4 rounded-xl font-bold"
        >
          Salvar Nova Senha
        </button>
      </div>
    </main>
  );
}