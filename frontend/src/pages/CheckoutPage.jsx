import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const CheckoutPage = () => {
  const { cart, cartTotal, clearCart } = useCart()
  const { user, API } = useAuth()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [payment, setPayment] = useState('COD')
  const [form, setForm] = useState({ name: user?.name || '', phone: '', address: '', city: '', pincode: '' })

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value })
  const delivery = cartTotal > 999 ? 0 : 99
  const total = cartTotal + delivery

  const placeOrder = async (e) => {
    e.preventDefault()
    // Guard: ensure user is still logged in with a valid token
    const saved = localStorage.getItem('ayurUser')
    if (!saved) {
      toast.error('Please sign in to place your order')
      navigate('/auth', { state: { from: '/checkout' } })
      return
    }
    const freshUser = JSON.parse(saved)
    if (!freshUser?.token) {
      toast.error('Session expired. Please sign in again.')
      navigate('/auth', { state: { from: '/checkout' } })
      return
    }
    setSubmitting(true)
    try {
      const items = cart.map(i => ({ medicine: i._id, name: i.name, img: i.img, price: i.price, qty: i.qty }))
      const address = `${form.name}, ${form.address}, ${form.city} - ${form.pincode}`
      const { data } = await axios.post(
        `${API}/orders`,
        { items, address, phone: form.phone, total, paymentMethod: payment },
        { headers: { Authorization: `Bearer ${freshUser.token}` } }
      )
      clearCart()
      toast.success('Order placed successfully! 🎉')
      navigate('/order-success', { state: { order: data } })
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error('Session expired. Please sign in again.')
        navigate('/auth', { state: { from: '/checkout' } })
      } else {
        toast.error(err.response?.data?.message || 'Order failed. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (cart.length === 0) { navigate('/cart'); return null }

  return (
    <div className='min-h-screen bg-gray-50 pt-24 pb-16'>
      <div className='max-w-5xl mx-auto px-6'>
        <h1 className='text-3xl font-bold text-green-900 mb-8'>Checkout</h1>

        <form onSubmit={placeOrder}>
          <div className='grid md:grid-cols-3 gap-8'>
            <div className='md:col-span-2 space-y-6'>

              {/* Delivery Address */}
              <div className='bg-white rounded-2xl shadow-md p-6'>
                <h2 className='text-xl font-bold text-green-900 mb-4'>📍 Delivery Address</h2>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='col-span-2'>
                    <label className='text-sm font-medium text-gray-700 block mb-1'>Full Name *</label>
                    <input name='name' value={form.name} onChange={handle} required placeholder='Arjun Sharma'
                      className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100' />
                  </div>
                  <div className='col-span-2'>
                    <label className='text-sm font-medium text-gray-700 block mb-1'>Phone Number *</label>
                    <input name='phone' value={form.phone} onChange={handle} required placeholder='+91 98765 43210'
                      className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100' />
                  </div>
                  <div className='col-span-2'>
                    <label className='text-sm font-medium text-gray-700 block mb-1'>Address *</label>
                    <textarea name='address' value={form.address} onChange={handle} required rows={2} placeholder='House No, Street, Area'
                      className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 resize-none' />
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-700 block mb-1'>City *</label>
                    <input name='city' value={form.city} onChange={handle} required placeholder='New Delhi'
                      className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100' />
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-700 block mb-1'>Pincode *</label>
                    <input name='pincode' value={form.pincode} onChange={handle} required placeholder='110001'
                      className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100' />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className='bg-white rounded-2xl shadow-md p-6'>
                <h2 className='text-xl font-bold text-green-900 mb-4'>💳 Payment Method</h2>
                <div className='space-y-3'>
                  {[{ id: 'COD', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when your order arrives' },
                    { id: 'UPI', label: 'UPI Payment', icon: '📱', desc: 'Pay via GPay, PhonePe, Paytm' },
                    { id: 'Card', label: 'Credit / Debit Card', icon: '💳', desc: 'Visa, Mastercard, RuPay' }
                  ].map(p => (
                    <label key={p.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${payment === p.id ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}>
                      <input type='radio' name='payment' value={p.id} checked={payment === p.id} onChange={() => setPayment(p.id)} className='accent-green-600' />
                      <span className='text-2xl'>{p.icon}</span>
                      <div>
                        <div className='font-semibold text-gray-800'>{p.label}</div>
                        <div className='text-gray-400 text-xs'>{p.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className='bg-white rounded-2xl shadow-md p-6 sticky top-24'>
                <h2 className='text-xl font-bold text-green-900 mb-4'>Order Summary</h2>
                <div className='space-y-3 mb-4'>
                  {cart.map(item => (
                    <div key={item._id} className='flex items-center gap-3'>
                      <img src={item.img} alt={item.name} className='w-12 h-12 rounded-lg object-cover' />
                      <div className='flex-1'>
                        <p className='text-sm font-medium text-gray-800'>{item.name}</p>
                        <p className='text-xs text-gray-400'>Qty: {item.qty}</p>
                      </div>
                      <span className='text-sm font-bold text-gray-800'>₹{item.price * item.qty}</span>
                    </div>
                  ))}
                </div>
                <div className='border-t pt-3 space-y-2 text-sm'>
                  <div className='flex justify-between text-gray-600'><span>Subtotal</span><span>₹{cartTotal}</span></div>
                  <div className='flex justify-between text-gray-600'><span>Delivery</span><span className={delivery === 0 ? 'text-green-600' : ''}>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span></div>
                  <div className='flex justify-between font-bold text-lg text-gray-900 border-t pt-2'><span>Total</span><span className='text-green-700'>₹{total}</span></div>
                </div>
                <button type='submit' disabled={submitting}
                  className='w-full bg-gradient-to-r from-green-600 to-green-800 text-white py-4 rounded-xl font-semibold mt-4 hover:shadow-lg transition-all disabled:opacity-60'>
                  {submitting ? '⏳ Placing Order...' : `Place Order · ₹${total}`}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CheckoutPage
