import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const AuthPage = () => {
  const [tab, setTab] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const { login, register, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    const res = tab === 'login'
      ? await login(form.email, form.password)
      : await register(form.name, form.email, form.password)
    if (res.success) {
      toast.success(tab === 'login' ? 'Welcome back! 🌿' : 'Account created! 🌿')
      navigate(from, { replace: true })
    } else {
      toast.error(res.message)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 to-amber-50 flex items-center justify-center px-4 pt-20'>
      <div className='bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden'>
        <div className='bg-gradient-to-r from-green-700 to-green-900 p-8 text-center'>
          <div className='text-4xl mb-2'>🌿</div>
          <h1 className='text-2xl font-bold text-white font-serif'>AyurCare</h1>
          <p className='text-green-200 text-sm mt-1'>Your Holistic Wellness Partner</p>
        </div>

        <div className='flex border-b'>
          {['login', 'register'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-4 text-sm font-semibold capitalize transition-all ${tab === t ? 'text-green-700 border-b-2 border-green-700' : 'text-gray-400 hover:text-gray-600'}`}>
              {t === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className='p-8 space-y-4'>
          {tab === 'register' && (
            <div>
              <label className='text-sm font-medium text-gray-700 block mb-1'>Full Name</label>
              <input name='name' value={form.name} onChange={handle} required placeholder='Arjun Sharma'
                className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all' />
            </div>
          )}
          <div>
            <label className='text-sm font-medium text-gray-700 block mb-1'>Email Address</label>
            <input name='email' type='email' value={form.email} onChange={handle} required placeholder='you@example.com'
              className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all' />
          </div>
          <div>
            <label className='text-sm font-medium text-gray-700 block mb-1'>Password</label>
            <input name='password' type='password' value={form.password} onChange={handle} required placeholder='••••••••'
              className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all' />
          </div>
          <button type='submit' disabled={loading}
            className='w-full bg-gradient-to-r from-green-600 to-green-800 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-60 disabled:cursor-not-allowed'>
            {loading ? '⏳ Please wait...' : tab === 'login' ? 'Sign In →' : 'Create Account →'}
          </button>
          <p className='text-center text-sm text-gray-500'>
            {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button type='button' onClick={() => setTab(tab === 'login' ? 'register' : 'login')}
              className='text-green-700 font-semibold hover:underline'>
              {tab === 'login' ? 'Register' : 'Sign In'}
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}

export default AuthPage
