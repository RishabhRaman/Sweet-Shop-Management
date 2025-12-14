import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { sweetsAPI } from '../services/api'
import SweetCard from '../components/SweetCard'
import SweetModal from '../components/SweetModal'
import SearchFilters from '../components/SearchFilters'
import Navbar from '../components/Navbar'

const Dashboard = () => {
  const { user, logout, isAdmin } = useAuth()
  const [sweets, setSweets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    name: '',
    category: '',
    minPrice: '',
    maxPrice: '',
  })
  const [showModal, setShowModal] = useState(false)
  const [editingSweet, setEditingSweet] = useState(null)

  useEffect(() => {
    // Only fetch if user is authenticated
    if (user) {
      fetchSweets()
    }
  }, [filters, user])

  const fetchSweets = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await sweetsAPI.getAll(filters)
      setSweets(response.data.sweets || [])
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch sweets')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingSweet(null)
    setShowModal(true)
  }

  const handleEdit = (sweet) => {
    setEditingSweet(sweet)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this sweet?')) {
      return
    }

    try {
      await sweetsAPI.delete(id)
      fetchSweets()
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete sweet')
    }
  }

  const handlePurchase = async (id, quantity = 1) => {
    try {
      await sweetsAPI.purchase(id, quantity)
      fetchSweets()
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to purchase sweet')
    }
  }

  const handleRestock = async (id, quantity) => {
    try {
      await sweetsAPI.restock(id, quantity)
      fetchSweets()
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to restock sweet')
    }
  }

  const handleModalClose = () => {
    setShowModal(false)
    setEditingSweet(null)
    fetchSweets()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={logout} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sweet Shop Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage your sweet inventory</p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <SearchFilters filters={filters} onFilterChange={setFilters} />
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            + Add New Sweet
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-600">Loading sweets...</div>
          </div>
        ) : sweets.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-600">No sweets found. {isAdmin() && 'Add your first sweet!'}</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sweets.map((sweet) => (
              <SweetCard
                key={sweet._id}
                sweet={sweet}
                isAdmin={isAdmin()}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onPurchase={handlePurchase}
                onRestock={handleRestock}
              />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <SweetModal
          sweet={editingSweet}
          onClose={handleModalClose}
        />
      )}
    </div>
  )
}

export default Dashboard

