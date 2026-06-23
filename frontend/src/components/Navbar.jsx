import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { cartCount } = useCart()
  const userMenuRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handler = (e) => { if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const solidPages = ['/cart', '/checkout', '/order-success', '/my-appointments', '/my-orders', '/my-treatment-bookings', '/auth', '/ai-health-analysis', '/ai-analysis-history']
  const isSolid = scrolled || solidPages.some(p => location.pathname.startsWith(p))

  const links = [
    { to: '/', label: 'Home' },
    { to: '/doctors', label: 'Doctors' },
    { to: '/medicines', label: 'Medicines' },
    { to: '/treatments', label: 'Treatments' },
    { to: '/ai-health-analysis', label: '🧠 AI Analysis' },
    { to: '/contact', label: 'Contact' },
  ]

  const handleLogout = () => { logout(); setUserMenuOpen(false); navigate('/') }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isSolid ? 'bg-white/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5'}`}>
      <div className='max-w-7xl mx-auto px-6 flex items-center justify-between'>

        {/* Logo */}
        <Link to='/' className='flex items-center gap-2 group'>
          <div className='w-10 h-10 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform'>
            <span className='text-white text-lg'>🌿</span>
          </div>
          <div>
            <span className={`text-2xl font-bold font-serif tracking-wide transition-colors ${isSolid ? 'text-green-800' : 'text-white'}`}>AyurCare</span>
            <div className={`text-xs tracking-widest transition-colors ${isSolid ? 'text-green-600' : 'text-green-200'}`}>HOLISTIC WELLNESS</div>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className='hidden md:flex items-center gap-1'>
          {links.map(link => (
            <Link key={link.to} to={link.to}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${location.pathname === link.to ? 'bg-green-700 text-white shadow-md' : isSolid ? 'text-gray-700 hover:bg-green-50 hover:text-green-700' : 'text-white/90 hover:bg-white/20 hover:text-white'}`}>
              {link.label}
            </Link>
          ))}

          {/* Cart */}
          <Link to='/cart' className='relative ml-2 p-2 rounded-full hover:bg-white/20 transition-colors'>
            <span className={`text-xl ${isSolid ? 'text-gray-700' : 'text-white'}`}>🛒</span>
            {cartCount > 0 && (
              <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold'>{cartCount}</span>
            )}
          </Link>

          {/* User */}
          {user ? (
            <div className='relative ml-2' ref={userMenuRef}>
              <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${isSolid ? 'text-gray-700 hover:bg-green-50' : 'text-white hover:bg-white/20'}`}>
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    className='w-7 h-7 rounded-full object-cover'
                  />
                ) : (
                  <div className='w-7 h-7 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold'>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                {user.name?.split(' ')[0]}
                <span className='text-xs'>▾</span>
              </button>
              {userMenuOpen && (
                <div className='absolute right-0 top-12 bg-white rounded-2xl shadow-2xl w-52 py-2 border border-gray-100 animate-fadeIn'>
                  <div className='px-4 py-3 border-b border-gray-100'>
                    <p className='font-semibold text-gray-800 text-sm'>{user.name}</p>
                    <p className='text-gray-400 text-xs'>{user.email}</p>
                  </div>
                  {[
                    { to: '/my-appointments', icon: '🩺', label: 'My Appointments' },
                    { to: '/my-orders', icon: '📦', label: 'My Orders' },
                    { to: '/my-treatment-bookings', icon: '🧘', label: 'My Bookings' },
                    { to: '/ai-analysis-history', icon: '🧠', label: 'AI History' },
                    { to: '/cart', icon: '🛒', label: 'My Cart' },
                  ].map(item => (
                    <Link key={item.to} to={item.to} onClick={() => setUserMenuOpen(false)}
                      className='flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors'>
                      <span>{item.icon}</span>{item.label}
                    </Link>
                  ))}
                  <div className='border-t border-gray-100 mt-1 pt-1'>
                    <button onClick={handleLogout} className='w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors'>
                      <span>🚪</span> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to='/auth' className='ml-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all'>
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile */}
        <div className='md:hidden flex items-center gap-3'>
          <Link to='/cart' className='relative'>
            <span className={`text-xl ${isSolid ? 'text-gray-700' : 'text-white'}`}>🛒</span>
            {cartCount > 0 && <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold'>{cartCount}</span>}
          </Link>
          <button className={`text-2xl ${isSolid ? 'text-green-800' : 'text-white'}`} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className='md:hidden bg-white/95 backdrop-blur-md shadow-xl mx-4 mt-2 rounded-2xl p-4 animate-fadeIn'>
          {links.map(link => (
            <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)}
              className={`block px-4 py-3 rounded-xl text-sm font-medium mb-1 transition-all ${location.pathname === link.to ? 'bg-green-700 text-white' : 'text-gray-700 hover:bg-green-50'}`}>
              {link.label}
            </Link>
          ))}
          <div className='border-t border-gray-100 mt-2 pt-2'>
            {user ? (
              <>
                <Link to='/my-appointments' onClick={() => setMenuOpen(false)} className='block px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 rounded-xl'>🩺 My Appointments</Link>
                <Link to='/my-orders' onClick={() => setMenuOpen(false)} className='block px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 rounded-xl'>📦 My Orders</Link>
                <Link to='/my-treatment-bookings' onClick={() => setMenuOpen(false)} className='block px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 rounded-xl'>🧘 My Bookings</Link>
                <Link to='/ai-health-analysis' onClick={() => setMenuOpen(false)} className='block px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 rounded-xl'>🧠 AI Analysis</Link>
                <button onClick={() => { handleLogout(); setMenuOpen(false) }} className='w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl'>🚪 Sign Out</button>
              </>
            ) : (
              <Link to='/auth' onClick={() => setMenuOpen(false)} className='block bg-green-700 text-white text-center py-3 rounded-xl font-semibold'>Sign In</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
