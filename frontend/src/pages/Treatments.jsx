import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const steps = [
  { icon: '📋', title: 'Consultation', desc: 'Discuss your health concerns with our expert' },
  { icon: '🔬', title: 'Diagnosis', desc: 'Prakriti analysis & dosha assessment' },
  { icon: '🌿', title: 'Treatment Plan', desc: 'Personalized Ayurvedic therapy plan' },
  { icon: '✨', title: 'Healing', desc: 'Experience transformation & wellness' },
]

// Local treatment images — perfectly matched
const treatmentImages = {
  'Panchakarma':    '/treatments/panchakarma.jpg',
  'Abhyanga':       '/treatments/abhyanga.jpg',
  'Shirodhara':     '/treatments/shirodhara.jpg',
  'Nasya':          '/treatments/nasya.jpg',
  'Kati Basti':     '/treatments/kati-basti.jpg',
  'Udvartana':      '/treatments/udvartana.jpg',
  'Netra Tarpana':  '/treatments/netra-tarpana.jpg',
  'Basti':          '/treatments/basti.jpg',
  'Pizhichil':      '/treatments/pizhichil.jpg',
  'Yoga Therapy':   '/treatments/yoga-therapy.jpg',
  'Marma Therapy':  '/treatments/marma-therapy.jpg',
  'Raktamokshana':  '/treatments/raktamokshana.jpg',
}

function AnimatedCard({ t, index }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  const [imgSrc, setImgSrc] = useState(treatmentImages[t.name] || t.img)
  const navigate = useNavigate()

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} className={`bg-white rounded-2xl overflow-hidden shadow-md card-hover transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${(index % 4) * 100}ms` }}>
      <div className='relative overflow-hidden'>
        <img src={imgSrc} alt={t.name} onError={() => setImgSrc(t.img)} className='w-full h-48 object-cover hover:scale-110 transition-transform duration-500' />
        <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent' />
        <span className='absolute bottom-3 left-3 bg-green-600/90 text-white text-xs font-bold px-3 py-1 rounded-full'>{t.benefit}</span>
        <span className='absolute bottom-3 right-3 bg-black/50 text-white text-xs px-3 py-1 rounded-full'>⏱ {t.duration}</span>
      </div>
      <div className='p-5'>
        <h2 className='text-lg font-bold text-gray-900'>{t.name}</h2>
        <p className='text-gray-500 text-sm mt-1 leading-relaxed'>{t.desc}</p>
        <div className='flex items-center justify-between mt-2'>
          <span className='text-green-700 font-bold text-lg'>₹{t.price}</span>
        </div>
        <div className='flex gap-2 mt-4'>
          <button onClick={() => navigate(`/treatments/${t._id}`)}
            className='flex-1 bg-green-700 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-green-800 transition-colors'>
            Book Treatment
          </button>
          <button onClick={() => navigate(`/treatments/${t._id}`)}
            className='px-4 py-2.5 border-2 border-green-200 text-green-700 rounded-xl text-sm font-semibold hover:bg-green-50 transition-colors'>
            Learn More
          </button>
        </div>
      </div>
    </div>
  )
}

const Treatments = () => {
  const { API } = useAuth()
  const [treatments, setTreatments] = useState([])
  const [filtered, setFiltered] = useState([])
  const [activeFilter, setActiveFilter] = useState('All')
  const [loading, setLoading] = useState(true)

  const filters = ['All', 'Detox', 'Relaxation', 'Pain Relief', 'Skin Care', 'Weight Loss', 'Eye Care']

  useEffect(() => {
    axios.get(`${API}/treatments`)
      .then(r => { setTreatments(r.data); setFiltered(r.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (activeFilter === 'All') return setFiltered(treatments)
    setFiltered(treatments.filter(t => t.benefit.toLowerCase().includes(activeFilter.toLowerCase()) || t.name.toLowerCase().includes(activeFilter.toLowerCase())))
  }, [activeFilter, treatments])

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='page-banner pt-32 pb-16 text-center relative'>
        <div className='relative z-10'>
          <span className='inline-block bg-white/20 glass text-green-200 text-xs px-4 py-1.5 rounded-full mb-4 tracking-widest uppercase'>Healing Therapies</span>
          <h1 className='text-5xl font-bold text-white mb-4'>Ayurvedic Treatments</h1>
          <p className='text-green-200 text-lg max-w-xl mx-auto'>Time-tested therapies for complete physical, mental and spiritual well-being</p>
        </div>
      </div>

      <div className='bg-amber-50 py-16'>
        <div className='max-w-5xl mx-auto px-6'>
          <h2 className='text-3xl font-bold text-green-900 text-center mb-12'>How It Works</h2>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
            {steps.map((s, i) => (
              <div key={i} className='text-center relative'>
                {i < steps.length - 1 && <div className='hidden md:block absolute top-8 left-3/4 w-1/2 h-0.5 bg-green-200 z-0' />}
                <div className='relative z-10 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center text-3xl mx-auto mb-4 border-2 border-green-100'>{s.icon}</div>
                <h3 className='font-bold text-green-900 mb-1'>{s.title}</h3>
                <p className='text-gray-500 text-xs leading-relaxed'>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-6 py-10 flex flex-wrap gap-3 justify-center'>
        {filters.map(cat => (
          <button key={cat} onClick={() => setActiveFilter(cat)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeFilter === cat ? 'bg-green-700 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-green-400 hover:text-green-700'}`}>
            {cat}
          </button>
        ))}
      </div>

      <div className='max-w-7xl mx-auto px-6 pb-20'>
        {loading ? (
          <div className='flex justify-center py-20'>
            <div className='w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin'></div>
          </div>
        ) : (
          <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {filtered.map((t, i) => <AnimatedCard key={t._id} t={t} index={i} />)}
          </div>
        )}
      </div>
    </div>
  )
}

export default Treatments
