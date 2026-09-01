import { createContext, useContext, useState } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [barbeiro, setBarbeiro] = useState(() => {
    const stored = localStorage.getItem("barbeiro");
    return stored ? JSON.parse(stored) : null;
  });

  async function login(email, senha) {
    const { data } = await api.post("/api/auth/login", { email, senha });
    localStorage.setItem("token", data.token);
    const barbeiroInfo = { id: data.barbeiroId, nome: data.nome };
    localStorage.setItem("barbeiro", JSON.stringify(barbeiroInfo));
    setBarbeiro(barbeiroInfo);
    return barbeiroInfo;
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("barbeiro");
    setBarbeiro(null);
  }

  return (
    <AuthContext.Provider value={{ barbeiro, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
