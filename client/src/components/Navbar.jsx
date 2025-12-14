import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Navbar = ({ user, onLogout }) => {
  const { isAdmin } = useAuth()

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-xl font-bold text-pink-600">
              🍬 Sweet Shop
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">
              Welcome, <span className="font-semibold">{user?.username}</span>
              {isAdmin() && (
                <span className="ml-2 px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                  ADMIN
                </span>
              )}
            </span>
            <button
              onClick={onLogout}
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

