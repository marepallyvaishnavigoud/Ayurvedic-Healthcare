import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const OrderSuccess = () => {
  const { state } = useLocation()
  const order = state?.order

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center pt-20 px-4'>
      <div className='bg-white rounded-3xl shadow-2xl max-w-lg w-full p-10 text-center'>
        <div className='w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6'>
          <span className='text-5xl'>✅</span>
        </div>
        <h1 className='text-3xl font-bold text-green-900 mb-2'>Order Placed!</h1>
        <p className='text-gray-500 mb-6'>Your Ayurvedic medicines are on their way 🌿</p>

        {order && (
          <div className='bg-gray-50 rounded-2xl p-5 text-left mb-6 space-y-2'>
            <div className='flex justify-between text-sm'>
              <span className='text-gray-500'>Order ID</span>
              <span className='font-mono font-bold text-gray-800'>#{order._id?.slice(-8).toUpperCase()}</span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-gray-500'>Items</span>
              <span className='font-medium text-gray-800'>{order.items?.length} medicine(s)</span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-gray-500'>Total Paid</span>
              <span className='font-bold text-green-700 text-lg'>₹{order.total}</span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-gray-500'>Payment</span>
              <span className='font-medium text-gray-800'>{order.paymentMethod}</span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-gray-500'>Status</span>
              <span className='bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-bold'>{order.status}</span>
            </div>
          </div>
        )}

        <div className='flex gap-3'>
          <Link to='/my-orders' className='flex-1 bg-green-700 text-white py-3 rounded-xl font-semibold hover:bg-green-800 transition-colors'>
            View Orders
          </Link>
          <Link to='/medicines' className='flex-1 border-2 border-green-200 text-green-700 py-3 rounded-xl font-semibold hover:bg-green-50 transition-colors'>
            Shop More
          </Link>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccess
