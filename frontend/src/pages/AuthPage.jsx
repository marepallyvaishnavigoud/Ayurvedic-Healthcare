import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import toast from 'react-hot-toast'

// ── Shared input style ──
const inp = 'w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all'
const btn = 'w-full bg-gradient-to-r from-green-600 to-green-800 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-60 disabled:cursor-not-allowed'

// ── Step indicator for forgot password ──
function Steps({ current }) {
  const steps = ['Enter Email', 'Verify OTP', 'New Password']
  return (
    <div className='flex items-center justify-center gap-2 mb-6'>
      {steps.map((s, i) => (
        <React.Fragment key={s}>
          <div className='flex flex-col items-center gap-1'>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i <= current ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-400'}`}>
              {i < current ? '✓' : i + 1}
            </div>
            <span className={`text-[10px] font-medium ${i <= current ? 'text-green-700' : 'text-gray-400'}`}>{s}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`h-px w-8 mb-4 transition-all ${i < current ? 'bg-green-600' : 'bg-gray-200'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

const AuthPage = () => {
  const [tab, setTab] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const { login, register, loading, API } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'

  // Forgot password state
  const [forgotStep, setForgotStep] = useState(0) // 0=email, 1=otp, 2=newpass
  const [fpEmail, setFpEmail] = useState('')
  const [fpOtp, setFpOtp] = useState('')
  const [fpOtpDisplay, setFpOtpDisplay] = useState('') // shown to user (no email service)
  const [fpNewPass, setFpNewPass] = useState('')
  const [fpConfirmPass, setFpConfirmPass] = useState('')
  const [fpLoading, setFpLoading] = useState(false)
  const [showNewPass, setShowNewPass] = useState(false)

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

  // Step 1 — send OTP
  const sendOtp = async (e) => {
    e.preventDefault()
    if (!fpEmail) return toast.error('Please enter your email')
    setFpLoading(true)
    try {
      const { data } = await axios.post(`${API}/auth/forgot-password`, { email: fpEmail })
      setFpOtpDisplay(data.otp)
      setForgotStep(1)
      toast.success('OTP generated!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Email not found')
    } finally {
      setFpLoading(false)
    }
  }

  // Step 2 — verify OTP
  const verifyOtp = (e) => {
    e.preventDefault()
    if (fpOtp !== fpOtpDisplay) return toast.error('Invalid OTP. Please check and try again.')
    setForgotStep(2)
    toast.success('OTP verified!')
  }

  // Step 3 — reset password
  const resetPassword = async (e) => {
    e.preventDefault()
    if (fpNewPass.length < 6) return toast.error('Password must be at least 6 characters')
    if (fpNewPass !== fpConfirmPass) return toast.error('Passwords do not match')
    setFpLoading(true)
    try {
      await axios.post(`${API}/auth/reset-password`, {
        email: fpEmail,
        otp: fpOtpDisplay,
        newPassword: fpNewPass,
      })
      toast.success('Password reset successfully! Please sign in.')
      setTab('login')
      setForgotStep(0)
      setFpEmail(''); setFpOtp(''); setFpOtpDisplay(''); setFpNewPass(''); setFpConfirmPass('')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed')
    } finally {
      setFpLoading(false)
    }
  }

  const resetForgot = () => {
    setTab('login')
    setForgotStep(0)
    setFpEmail(''); setFpOtp(''); setFpOtpDisplay(''); setFpNewPass(''); setFpConfirmPass('')
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 to-amber-50 flex items-center justify-center px-4 pt-20 pb-10'>
      <div className='bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden'>

        {/* Header */}
        <div className='bg-gradient-to-r from-green-700 to-green-900 p-8 text-center'>
          <div className='text-4xl mb-2'>🌿</div>
          <h1 className='text-2xl font-bold text-white font-serif'>AyurCare</h1>
          <p className='text-green-200 text-sm mt-1'>
            {tab === 'forgot' ? 'Reset Your Password' : 'Your Holistic Wellness Partner'}
          </p>
        </div>

        {/* ── FORGOT PASSWORD FLOW ── */}
        {tab === 'forgot' ? (
          <div className='p-8'>
            <Steps current={forgotStep} />

            {/* Step 0 — Enter Email */}
            {forgotStep === 0 && (
              <form onSubmit={sendOtp} className='space-y-4'>
                <div className='text-center mb-2'>
                  <div className='text-3xl mb-2'>📧</div>
                  <h2 className='text-lg font-bold text-gray-800'>Forgot your password?</h2>
                  <p className='text-gray-500 text-sm mt-1'>Enter your registered email to receive an OTP</p>
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-700 block mb-1'>Email Address</label>
                  <input
                    type='email' value={fpEmail} onChange={e => setFpEmail(e.target.value)}
                    required placeholder='you@example.com' className={inp}
                  />
                </div>
                <button type='submit' disabled={fpLoading} className={btn}>
                  {fpLoading ? '⏳ Sending...' : 'Send OTP →'}
                </button>
                <button type='button' onClick={resetForgot} className='w-full text-center text-sm text-gray-500 hover:text-green-700 transition-colors'>
                  ← Back to Sign In
                </button>
              </form>
            )}

            {/* Step 1 — Enter OTP */}
            {forgotStep === 1 && (
              <form onSubmit={verifyOtp} className='space-y-4'>
                <div className='text-center mb-2'>
                  <div className='text-3xl mb-2'>🔐</div>
                  <h2 className='text-lg font-bold text-gray-800'>Enter OTP</h2>
                  <p className='text-gray-500 text-sm mt-1'>OTP sent to <span className='font-semibold text-green-700'>{fpEmail}</span></p>
                </div>

                {/* OTP display box — shown since no email service */}
                <div className='bg-green-50 border border-green-200 rounded-2xl p-4 text-center'>
                  <p className='text-xs text-green-700 font-medium mb-1'>Your OTP Code</p>
                  <p className='text-3xl font-black text-green-800 tracking-[0.3em]'>{fpOtpDisplay}</p>
                  <p className='text-xs text-gray-400 mt-1'>Valid for 15 minutes</p>
                </div>

                <div>
                  <label className='text-sm font-medium text-gray-700 block mb-1'>Enter OTP</label>
                  <input
                    type='text' value={fpOtp} onChange={e => setFpOtp(e.target.value)}
                    required placeholder='Enter 6-digit OTP' maxLength={6}
                    className={`${inp} text-center text-xl font-bold tracking-widest`}
                  />
                </div>
                <button type='submit' className={btn}>Verify OTP →</button>
                <button type='button' onClick={() => setForgotStep(0)} className='w-full text-center text-sm text-gray-500 hover:text-green-700 transition-colors'>
                  ← Resend OTP
                </button>
              </form>
            )}

            {/* Step 2 — New Password */}
            {forgotStep === 2 && (
              <form onSubmit={resetPassword} className='space-y-4'>
                <div className='text-center mb-2'>
                  <div className='text-3xl mb-2'>🔑</div>
                  <h2 className='text-lg font-bold text-gray-800'>Set New Password</h2>
                  <p className='text-gray-500 text-sm mt-1'>Choose a strong password for your account</p>
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-700 block mb-1'>New Password</label>
                  <div className='relative'>
                    <input
                      type={showNewPass ? 'text' : 'password'} value={fpNewPass}
                      onChange={e => setFpNewPass(e.target.value)}
                      required placeholder='Min. 6 characters' className={inp}
                    />
                    <button type='button' onClick={() => setShowNewPass(!showNewPass)}
                      className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm'>
                      {showNewPass ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-700 block mb-1'>Confirm Password</label>
                  <input
                    type='password' value={fpConfirmPass}
                    onChange={e => setFpConfirmPass(e.target.value)}
                    required placeholder='Re-enter password' className={inp}
                  />
                  {fpConfirmPass && fpNewPass !== fpConfirmPass && (
                    <p className='text-red-500 text-xs mt-1'>Passwords do not match</p>
                  )}
                  {fpConfirmPass && fpNewPass === fpConfirmPass && (
                    <p className='text-green-600 text-xs mt-1'>✓ Passwords match</p>
                  )}
                </div>
                <button type='submit' disabled={fpLoading} className={btn}>
                  {fpLoading ? '⏳ Resetting...' : 'Reset Password ✅'}
                </button>
              </form>
            )}
          </div>
        ) : (
          <>
            {/* ── LOGIN / REGISTER TABS ── */}
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
                  <input name='name' value={form.name} onChange={handle} required placeholder='Arjun Sharma' className={inp} />
                </div>
              )}

              <div>
                <label className='text-sm font-medium text-gray-700 block mb-1'>Email Address</label>
                <input name='email' type='email' value={form.email} onChange={handle} required placeholder='you@example.com' className={inp} />
              </div>

              <div>
                <div className='flex items-center justify-between mb-1'>
                  <label className='text-sm font-medium text-gray-700'>Password</label>
                  {tab === 'login' && (
                    <button type='button' onClick={() => { setTab('forgot'); setFpEmail(form.email) }}
                      className='text-xs text-green-700 font-semibold hover:underline'>
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className='relative'>
                  <input
                    name='password' type={showPassword ? 'text' : 'password'}
                    value={form.password} onChange={handle} required placeholder='••••••••' className={inp}
                  />
                  <button type='button' onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm'>
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <button type='submit' disabled={loading} className={btn}>
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
          </>
        )}
      </div>
    </div>
  )
}

export default AuthPage
