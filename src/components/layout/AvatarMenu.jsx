import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export function AvatarMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const initials = (user?.username || user?.email || "U")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold uppercase"
      >
        {initials}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-md border bg-popover p-2 shadow-lg">
          <Link
            to="/account"
            className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
            onClick={() => setOpen(false)}
          >
            Meu perfil
          </Link>
          <Link
            to="/my-reservations"
            className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
            onClick={() => setOpen(false)}
          >
            Minhas reservas
          </Link>
          <button
            onClick={() => {
              setOpen(false);
              logout();
            }}
            className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-muted"
          >
            Sair
          </button>
        </div>
      )}
    </div>
  );
}
