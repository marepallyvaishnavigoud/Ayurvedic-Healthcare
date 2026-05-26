import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

const statusColors = { Processing: 'bg-blue-100 text-blue-700', Shipped: 'bg-amber-100 text-amber-700', Delivered: 'bg-green-100 text-green-700', Cancelled: 'bg-red-100 text-red-600' }
const statusIcons = { Processing: '⏳', Shipped: '🚚', Delivered: '✅', Cancelled: '❌' }

const MyOrders = () => {
  const { authHeader, API } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`${API}/orders/mine`, authHeader())
      .then(r => setOrders(r.data))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) return (
    <div className='min-h-screen flex items-center justify-center pt-20'>
      <div className='w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin'></div>
    </div>
  )

  return (
    <div className='min-h-screen bg-gray-50 pt-24 pb-16'>
      <div className='max-w-4xl mx-auto px-6'>
        <div className='flex items-center justify-between mb-8'>
          <h1 className='text-3xl font-bold text-green-900'>My Orders</h1>
          <Link to='/medicines' className='bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-800 transition-colors'>+ Shop More</Link>
        </div>

        {orders.length === 0 ? (
          <div className='text-center py-20'>
            <div className='text-7xl mb-4'>📦</div>
            <h2 className='text-xl font-bold text-gray-700 mb-2'>No orders yet</h2>
            <p className='text-gray-400 mb-6'>Start shopping for Ayurvedic medicines</p>
            <Link to='/medicines' className='bg-green-700 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-800 transition-colors'>Browse Medicines</Link>
          </div>
        ) : (
          <div className='space-y-6'>
            {orders.map(order => (
              <div key={order._id} className='bg-white rounded-2xl shadow-md overflow-hidden'>
                <div className='flex items-center justify-between px-6 py-4 bg-gray-50 border-b'>
                  <div>
                    <span className='text-xs text-gray-400'>Order ID</span>
                    <p className='font-mono font-bold text-gray-800'>#{order._id?.slice(-8).toUpperCase()}</p>
                  </div>
                  <div className='text-right'>
                    <span className='text-xs text-gray-400'>Placed on</span>
                    <p className='text-sm font-medium text-gray-700'>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${statusColors[order.status]}`}>
                    {statusIcons[order.status]} {order.status}
                  </span>
                </div>
                <div className='p-6'>
                  <div className='flex flex-wrap gap-3 mb-4'>
                    {order.items?.map((item, i) => (
                      <div key={i} className='flex items-center gap-2 bg-gray-50 rounded-xl p-2'>
                        <img src={item.img} alt={item.name} className='w-10 h-10 rounded-lg object-cover' />
                        <div>
                          <p className='text-xs font-medium text-gray-800'>{item.name}</p>
                          <p className='text-xs text-gray-400'>Qty: {item.qty} · ₹{item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className='flex items-center justify-between text-sm'>
                    <span className='text-gray-500'>📍 {order.address}</span>
                    <span className='font-bold text-green-700 text-lg'>₹{order.total}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyOrders
