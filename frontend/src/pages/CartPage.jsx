import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const CartPage = () => {
  const { cart, removeFromCart, updateQty, cartTotal } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  if (cart.length === 0) return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center pt-20'>
      <div className='text-center'>
        <div className='text-8xl mb-6'>🛒</div>
        <h2 className='text-2xl font-bold text-gray-800 mb-2'>Your cart is empty</h2>
        <p className='text-gray-500 mb-6'>Add some Ayurvedic medicines to get started</p>
        <Link to='/medicines' className='bg-green-700 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-800 transition-colors'>
          Browse Medicines
        </Link>
      </div>
    </div>
  )

  const delivery = cartTotal > 999 ? 0 : 99
  const total = cartTotal + delivery

  return (
    <div className='min-h-screen bg-gray-50 pt-24 pb-16'>
      <div className='max-w-5xl mx-auto px-6'>
        <h1 className='text-3xl font-bold text-green-900 mb-8'>🛒 Your Cart ({cart.length} items)</h1>

        <div className='grid md:grid-cols-3 gap-8'>
          {/* Cart Items */}
          <div className='md:col-span-2 space-y-4'>
            {cart.map(item => (
              <div key={item._id} className='bg-white rounded-2xl shadow-md p-5 flex gap-4 items-center'>
                <img src={item.img} alt={item.name} className='w-20 h-20 rounded-xl object-cover flex-shrink-0' />
                <div className='flex-1'>
                  <h3 className='font-bold text-gray-900'>{item.name}</h3>
                  <p className='text-gray-500 text-sm'>{item.desc}</p>
                  <div className='flex items-center gap-3 mt-2'>
                    <span className='text-green-700 font-bold text-lg'>₹{item.price}</span>
                    {item.tag && <span className='bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full'>{item.tag}</span>}
                  </div>
                </div>
                <div className='flex flex-col items-end gap-3'>
                  <button onClick={() => removeFromCart(item._id)} className='text-red-400 hover:text-red-600 text-sm transition-colors'>✕ Remove</button>
                  <div className='flex items-center gap-2 bg-gray-100 rounded-xl p-1'>
                    <button onClick={() => updateQty(item._id, item.qty - 1)} className='w-8 h-8 bg-white rounded-lg shadow text-gray-700 font-bold hover:bg-green-50 transition-colors'>−</button>
                    <span className='w-8 text-center font-bold text-gray-800'>{item.qty}</span>
                    <button onClick={() => updateQty(item._id, item.qty + 1)} className='w-8 h-8 bg-white rounded-lg shadow text-gray-700 font-bold hover:bg-green-50 transition-colors'>+</button>
                  </div>
                  <span className='font-bold text-gray-800'>₹{item.price * item.qty}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <div className='bg-white rounded-2xl shadow-md p-6 sticky top-24'>
              <h2 className='text-xl font-bold text-green-900 mb-4'>Order Summary</h2>
              <div className='space-y-3 text-sm'>
                <div className='flex justify-between text-gray-600'>
                  <span>Subtotal ({cart.reduce((s, i) => s + i.qty, 0)} items)</span>
                  <span>₹{cartTotal}</span>
                </div>
                <div className='flex justify-between text-gray-600'>
                  <span>Delivery</span>
                  <span className={delivery === 0 ? 'text-green-600 font-medium' : ''}>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span>
                </div>
                {delivery > 0 && <p className='text-xs text-green-600 bg-green-50 rounded-lg p-2'>Add ₹{1000 - cartTotal} more for free delivery</p>}
                <div className='border-t pt-3 flex justify-between font-bold text-lg text-gray-900'>
                  <span>Total</span>
                  <span className='text-green-700'>₹{total}</span>
                </div>
              </div>
              <button onClick={() => { if (!user) navigate('/auth', { state: { from: '/checkout' } }); else navigate('/checkout') }}
                className='w-full bg-gradient-to-r from-green-600 to-green-800 text-white py-4 rounded-xl font-semibold mt-6 hover:shadow-lg hover:scale-[1.02] transition-all'>
                Proceed to Checkout →
              </button>
              <Link to='/medicines' className='block text-center text-green-600 text-sm mt-3 hover:underline'>Continue Shopping</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
