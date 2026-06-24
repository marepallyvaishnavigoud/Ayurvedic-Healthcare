import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useGoogleLogin } from '@react-oauth/google'

const inp = 'w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all'
const btn = 'w-full bg-gradient-to-r from-green-600 to-green-800 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-60 disabled:cursor-not-allowed'

// Official Google SVG icon
const GoogleIcon = () => (
  <svg width='20' height='20' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
    <path d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z' fill='#4285F4' />
    <path d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z' fill='#34A853' />
    <path d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z' fill='#FBBC05' />
    <path d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z' fill='#EA4335' />
  </svg>
)

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
  const [googleLoading, setGoogleLoading] = useState(false)
  const { login, register, loginWithGoogle, loading, API } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'

  // Forgot password state
  const [forgotStep, setForgotStep] = useState(0)
  const [fpEmail, setFpEmail] = useState('')
  const [fpOtp, setFpOtp] = useState('')
  const [fpOtpDisplay, setFpOtpDisplay] = useState('')
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

  // useGoogleLogin gives full control over the button UI
  const triggerGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true)
      try {
        // Fetch Google profile using the access token
        const { data: profile } = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
        )
        // Send profile to our backend to create/login user & get JWT
        const res = await loginWithGoogle(profile)
        if (!res.success) return toast.error(res.message || 'Google login failed')
        toast.success('Signed in with Google! 🌿')
        navigate(from, { replace: true })
      } catch {
        toast.error('Google sign-in failed. Please try again.')
      } finally {
        setGoogleLoading(false)
      }
    },
    onError: () => toast.error('Google sign-in was cancelled'),
  })

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

  const verifyOtp = (e) => {
    e.preventDefault()
    if (fpOtp !== fpOtpDisplay) return toast.error('Invalid OTP. Please check and try again.')
    setForgotStep(2)
    toast.success('OTP verified!')
  }

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

  // Professional Google button — same style as Practo / Apollo 24x7
  const GoogleButton = () => (
    <button
      type='button'
      onClick={() => triggerGoogleLogin()}
      disabled={googleLoading || loading}
      className='w-full flex items-center justify-center gap-3 border border-gray-300 bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-700 font-medium py-3 px-4 rounded-xl transition-all duration-200 hover:shadow-md hover:border-gray-400 disabled:opacity-60 disabled:cursor-not-allowed'
    >
      {googleLoading ? (
        <>
          <svg className='animate-spin w-5 h-5 text-gray-500' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
            <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
            <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z' />
          </svg>
          <span className='text-sm'>Signing in...</span>
        </>
      ) : (
        <>
          <GoogleIcon />
          <span className='text-sm'>Continue with Google</span>
        </>
      )}
    </button>
  )

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

            {forgotStep === 1 && (
              <form onSubmit={verifyOtp} className='space-y-4'>
                <div className='text-center mb-2'>
                  <div className='text-3xl mb-2'>🔐</div>
                  <h2 className='text-lg font-bold text-gray-800'>Enter OTP</h2>
                  <p className='text-gray-500 text-sm mt-1'>OTP sent to <span className='font-semibold text-green-700'>{fpEmail}</span></p>
                </div>
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

            <div className='p-8 space-y-4'>
              {/* Google Button — shown at top for prominence */}
              {process.env.REACT_APP_GOOGLE_CLIENT_ID ? (
                <GoogleButton />
              ) : (
                <div className='w-full flex items-center justify-center gap-3 border border-dashed border-gray-300 bg-gray-50 text-gray-400 text-xs py-3 px-4 rounded-xl'>
                  <GoogleIcon />
                  Google sign-in not configured
                </div>
              )}

              <div className='relative flex items-center justify-center'>
                <span className='absolute inset-x-0 top-1/2 border-t border-gray-200' />
                <span className='relative bg-white px-3 text-xs text-gray-400'>OR</span>
              </div>

              <form onSubmit={submit} className='space-y-4'>
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

                <button type='submit' disabled={loading || googleLoading} className={btn}>
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
          </>
        )}
      </div>
    </div>
  )
}

export default AuthPage
