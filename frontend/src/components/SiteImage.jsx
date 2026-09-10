import { useState } from "react";
import api from "../api/client";
import PlaceholderImage from "./PlaceholderImage";

// Mostra a foto real cadastrada pelo dono (GET /api/imagens/{slot}); se não existir
// ou falhar ao carregar, cai de volta pro placeholder.
export default function SiteImage({ slot, label, className = "" }) {
  const [erro, setErro] = useState(false);
  const src = `${api.defaults.baseURL}/api/imagens/${slot}`;

  if (erro) {
    return <PlaceholderImage label={label} className={className} />;
  }

  return (
    <img
      src={src}
      alt={label}
      className={`object-cover ${className}`}
      onError={() => setErro(true)}
    />
  );
}
