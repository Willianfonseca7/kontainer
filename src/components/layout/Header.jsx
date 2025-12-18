import { Link, NavLink } from 'react-router-dom'
import { buttonClasses } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { AvatarMenu } from '@/components/layout/AvatarMenu'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/kontainers', label: 'Kontainers' },
  { to: '/about', label: 'Über uns' },
  { to: '/contact', label: 'Contact' },
]

const navLinkClass =
  'px-3 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground'

export function Header() {
  const { isAuthenticated } = useAuth()

  return (
    <header className="border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-primary/10" />
          <div className="leading-tight">
            <p className="text-base font-semibold">Kontainer</p>
            <p className="text-xs text-muted-foreground">Self Storage Digital</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? `${navLinkClass} text-foreground` : navLinkClass
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {!isAuthenticated ? (
          <div className="flex items-center gap-2">
            <Link to="/login" className={buttonClasses('ghost')}>
              Entrar / Cadastrar
            </Link>
          </div>
        ) : (
          <AvatarMenu />
        )}
      </div>
    </header>
  )
}
