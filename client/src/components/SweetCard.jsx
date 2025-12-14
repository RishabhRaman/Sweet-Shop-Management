import { useState } from 'react'

const SweetCard = ({ sweet, isAdmin, onEdit, onDelete, onPurchase, onRestock }) => {
  const [purchaseQty, setPurchaseQty] = useState(1)
  const [restockQty, setRestockQty] = useState(10)
  const [showRestock, setShowRestock] = useState(false)

  const handlePurchase = () => {
    if (purchaseQty > 0 && purchaseQty <= sweet.quantity) {
      onPurchase(sweet._id, purchaseQty)
      setPurchaseQty(1)
    }
  }

  const handleRestock = () => {
    if (restockQty > 0) {
      onRestock(sweet._id, restockQty)
      setRestockQty(10)
      setShowRestock(false)
    }
  }

  const isOutOfStock = sweet.quantity === 0

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{sweet.name}</h3>
          <p className="text-sm text-gray-500">{sweet.category}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-pink-600">${sweet.price.toFixed(2)}</p>
          <p className={`text-sm ${isOutOfStock ? 'text-red-600' : 'text-gray-600'}`}>
            Qty: {sweet.quantity}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {!isAdmin && (
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              max={sweet.quantity}
              value={purchaseQty}
              onChange={(e) => setPurchaseQty(parseInt(e.target.value) || 1)}
              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
              disabled={isOutOfStock}
            />
            <button
              onClick={handlePurchase}
              disabled={isOutOfStock || purchaseQty < 1 || purchaseQty > sweet.quantity}
              className="flex-1 px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isOutOfStock ? 'Out of Stock' : 'Purchase'}
            </button>
          </div>
        )}

        {isAdmin && (
          <div className="space-y-2">
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(sweet)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(sweet._id)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
              >
                Delete
              </button>
            </div>
            
            {!showRestock ? (
              <button
                onClick={() => setShowRestock(true)}
                className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
              >
                Restock
              </button>
            ) : (
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  value={restockQty}
                  onChange={(e) => setRestockQty(parseInt(e.target.value) || 1)}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                />
                <button
                  onClick={handleRestock}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                >
                  Add Stock
                </button>
                <button
                  onClick={() => {
                    setShowRestock(false)
                    setRestockQty(10)
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-sm"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SweetCard

