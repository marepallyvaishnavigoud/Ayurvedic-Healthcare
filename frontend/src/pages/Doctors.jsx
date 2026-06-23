import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

function AnimatedCard({ doc, index }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth() // eslint-disable-line no-unused-vars

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} className={`bg-white rounded-2xl overflow-hidden shadow-md card-hover transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${(index % 4) * 100}ms` }}>
      <div className='relative overflow-hidden'>
        <img
          src={doc?.img || doc?.image || 'https://placehold.co/300x300/16a34a/white?text=Dr'}
          alt={doc?.name || 'Doctor'}
          onError={(e) => {
            e.currentTarget.onerror = null
            e.currentTarget.src = 'https://placehold.co/300x300/16a34a/white?text=Dr'
          }}
          className='w-full h-60 object-cover object-top hover:scale-105 transition-transform duration-500'
          referrerPolicy='no-referrer'
          loading='lazy'
        />
        <div className='absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-green-700 text-xs font-bold px-3 py-1 rounded-full shadow'>
          ⭐ {doc.rating}
        </div>
        <div className='absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent' />
      </div>
      <div className='p-5'>
        <h2 className='text-lg font-bold text-gray-900'>{doc.name}</h2>
        <p className='text-green-600 text-sm font-medium mt-0.5'>{doc.specialty || doc.specialization}</p>
        <div className='flex items-center gap-4 mt-3 text-xs text-gray-500'>
          <span>🩺 {doc.experience} exp</span>
          <span>👥 {doc.patients} patients</span>
        </div>
        <div className='flex items-center justify-between mt-2'>
          <span className='text-green-700 font-bold'>₹{doc.fee} <span className='text-gray-400 font-normal text-xs'>consult fee</span></span>
        </div>
        <div className='flex gap-2 mt-4'>
          <button onClick={() => navigate(`/doctors/${doc._id}`)}
            className='flex-1 bg-green-700 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-green-800 transition-colors'>
            Book Now
          </button>
          <button onClick={() => navigate(`/doctors/${doc._id}`)}
            className='px-4 py-2.5 border-2 border-green-200 text-green-700 rounded-xl text-sm font-semibold hover:bg-green-50 transition-colors'>
            Profile
          </button>
        </div>
      </div>
    </div>
  )
}

const Doctors = () => {
  const { API } = useAuth()
  const [doctors, setDoctors] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [loading, setLoading] = useState(true)

  const filters = ['All', 'Skin Care', 'Digestive', "Women's Health", 'Orthopedics', 'Mental Wellness', 'Cardiac']

  useEffect(() => {
    axios.get(`${API}/doctors`)
      .then(r => {
        setDoctors(r.data)
        setFiltered(r.data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    let result = doctors
    if (search) {
      result = result.filter(d => {
        const name = d.name || ''
        const specialty = d.specialty || d.specialization || ''
        return name.toLowerCase().includes(search.toLowerCase()) || specialty.toLowerCase().includes(search.toLowerCase())
      })
    }

    if (activeFilter !== 'All') {
      result = result.filter(d => {
        const specialty = d.specialty || d.specialization || ''
        return specialty.toLowerCase().includes(activeFilter.toLowerCase())
      })
    }

    setFiltered(result)
  }, [search, activeFilter, doctors])

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='page-banner pt-32 pb-16 text-center relative'>
        <div className='relative z-10'>
          <span className='inline-block bg-white/20 glass text-green-200 text-xs px-4 py-1.5 rounded-full mb-4 tracking-widest uppercase'>Our Specialists</span>
          <h1 className='text-5xl font-bold text-white mb-4'>Ayurvedic Doctors</h1>
          <p className='text-green-200 text-lg max-w-xl mx-auto'>Consult with India's finest certified Ayurvedic practitioners</p>
        </div>
      </div>

      <div className='max-w-2xl mx-auto px-6 -mt-6 relative z-10 mb-12'>
        <div className='bg-white rounded-2xl shadow-xl p-2 flex gap-2'>
          <input type='text' value={search} onChange={e => setSearch(e.target.value)} placeholder='Search by name or specialty...'
            className='flex-1 px-4 py-3 text-sm outline-none text-gray-700 rounded-xl' />
          <button className='bg-green-700 text-white px-6 py-3 rounded-xl text-sm font-semibold'>Search</button>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-6 mb-10 flex flex-wrap gap-3 justify-center'>
        {filters.map(tag => (
          <button key={tag} onClick={() => setActiveFilter(tag)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeFilter === tag ? 'bg-green-700 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-green-400 hover:text-green-700'}`}>
            {tag}
          </button>
        ))}
      </div>

      <div className='max-w-7xl mx-auto px-6 pb-20'>
        {loading ? (
          <div className='flex justify-center py-20'>
            <div className='w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin'></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className='py-16 text-center'>
            <div className='text-5xl mb-3'>🩺</div>
            <h2 className='text-xl font-bold text-gray-800'>No doctors found</h2>
            <p className='text-gray-500 mt-1'>Try clearing filters or check your internet connection.</p>
          </div>
        ) : (
          <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {filtered.map((doc, i) => <AnimatedCard key={doc._id} doc={doc} index={i} />)}
          </div>
        )}
      </div>
    </div>
  )
}

export default Doctors
