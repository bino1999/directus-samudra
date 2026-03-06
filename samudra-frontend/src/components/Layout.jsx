import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/activity', label: 'Activity', icon: '📋' },
  { to: '/masterlist', label: 'Masterlist', icon: '📄' },
  { to: '/woc', label: 'WOC Upload', icon: '📁' },
]

const Layout = () => {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="w-full bg-gradient-to-r from-teal-600 to-teal-500 border-b border-teal-700/50 shadow-lg sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-8">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center font-bold text-xl">
                ⚙️
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-white tracking-tight">Samudra</h1>
                <p className="text-xs text-teal-100">Data Management Portal</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-md font-medium text-sm transition-all ${
                      isActive
                        ? 'bg-white/20 text-white shadow-sm'
                        : 'text-teal-50 hover:bg-white/10'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* User Section */}
            <div className="flex items-center gap-3 ml-auto">
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <span className="text-xl">👤</span>
                  <div>
                    <p className="text-sm font-semibold text-white leading-tight">
                      {user?.email?.split('@')[0] || 'User'}
                    </p>
                    <p className="text-xs text-teal-100 leading-tight">
                      {typeof user?.role === 'object' ? user?.role?.name : user?.role || 'User'}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white text-sm font-medium transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-8 w-full">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-slate-900 border-t border-slate-700/50 mt-12">
        <div className="max-w-[1600px] mx-auto px-6 py-6 flex items-center justify-between text-xs text-slate-400">
          <p>© 2026 Samudra. All rights reserved.</p>
          <p>Version 1.0.0</p>
        </div>
      </footer>
    </div>
  )
}

export default Layout
