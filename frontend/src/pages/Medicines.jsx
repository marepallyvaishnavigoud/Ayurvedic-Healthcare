import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const tagColors = { 'Best Seller': 'bg-amber-500', 'Popular': 'bg-blue-500', 'New': 'bg-green-500', 'Premium': 'bg-purple-600' }

// Local images served from public/medicines/ — always loads, perfectly matched
const medicineImages = {
  'ashwagandha':     '/medicines/ashwagandha.jpg',
  'triphala':        '/medicines/triphala.jpg',
  'brahmi':          '/medicines/brahmi.jpg',
  'neem capsules':   '/medicines/neem.jpg',
  'turmeric extract':'/medicines/turmeric.jpg',
  'shatavari':       '/medicines/shatavari.jpg',
  'giloy juice':     '/medicines/giloy.jpg',
  'amla powder':     '/medicines/amla.jpg',
  'moringa tablets': '/medicines/moringa.jpg',
  'chyawanprash':    '/medicines/chyawanprash.jpg',
  'shilajit resin':  '/medicines/shilajit.jpg',
  'haritaki churna': '/medicines/haritaki.jpg',
}

const fallbackImg = '/medicines/ashwagandha.jpg'

function normalizeName(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9\s]/g, ' ') // remove punctuation
    .replace(/\s+/g, ' ')
    .trim()
}

function getMedicineImg(med) {
  const normalized = normalizeName(med?.name)

  // Try direct match
  if (medicineImages[normalized]) return medicineImages[normalized]

  // Try token/partial matches (handles cases like "Neem Capsules" vs "neem")
  const normalizedNoSpaces = normalized.replace(/\s+/g, ' ').trim()
  const keys = Object.keys(medicineImages)
  const hit = keys.find(k => normalizedNoSpaces.includes(k) || k.includes(normalizedNoSpaces))
  if (hit) return medicineImages[hit]

  // Backend sometimes returns img field
  return med?.img || fallbackImg
}

function AnimatedCard({ med, index }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)
  const [imgSrc, setImgSrc] = useState(getMedicineImg(med))

  const { addToCart } = useCart()

  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const handleAddToCart = () => {
    // Ensure cart image matches the exact image shown on this card
    addToCart({
      ...med,
      img: imgSrc
    })
    toast.success(`${med.name} added to cart! 🛒`)
  }


  const handleBuyNow = () => {
    if (!user) return navigate('/auth', { state: { from: '/checkout' } })
    addToCart(med)
    navigate('/cart')
  }

  const discount = med.original && med.original > med.price
    ? Math.round((1 - med.price / med.original) * 100)
    : 0

  return (
    <div ref={ref} className={`bg-white rounded-2xl overflow-hidden shadow-md card-hover transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${(index % 4) * 100}ms` }}>
      <div className='relative overflow-hidden bg-green-50'>
        <img
          src={imgSrc}
          alt={med.name}
          onError={() => setImgSrc(fallbackImg)}
          className='w-full h-52 object-cover hover:scale-110 transition-transform duration-500'
        />
        {med.tag && <span className={`absolute top-3 left-3 ${tagColors[med.tag]} text-white text-xs font-bold px-3 py-1 rounded-full shadow`}>{med.tag}</span>}
        <button onClick={() => setWishlisted(!wishlisted)} className='absolute top-3 right-3 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow hover:scale-110 transition-transform'>
          <span className='text-base'>{wishlisted ? '❤️' : '🤍'}</span>
        </button>
        <div className='absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-black/20 to-transparent' />
      </div>
      <div className='p-5'>
  <h2 className='text-lg font-bold text-gray-900'>{med.name}</h2>
        <p className='text-gray-500 text-sm mt-1 leading-relaxed'>{med.desc || med.description || ''}</p>
        <div className='flex items-center gap-2 mt-3'>
          <span className='text-green-700 font-bold text-xl'>₹{med.price}</span>
          <span className='text-gray-400 text-sm line-through'>₹{med.original}</span>
          <span className='text-xs text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full font-semibold ml-auto'>{discount}% off</span>
        </div>
        <div className='flex gap-2 mt-4'>
          <button onClick={handleAddToCart} className='flex-1 bg-green-700 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-green-800 transition-colors'>
            🛒 Add to Cart
          </button>
          <button onClick={handleBuyNow} className='px-4 py-2.5 border-2 border-green-200 text-green-700 rounded-xl text-sm font-semibold hover:bg-green-50 transition-colors'>
            Buy Now
          </button>
        </div>
      </div>
    </div>
  )
}

const Medicines = () => {
  const { API } = useAuth()
  const [medicines, setMedicines] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [loading, setLoading] = useState(true)

  const categories = ['All', 'Immunity', 'Digestion', 'Skin Care', "Women's Health", 'Brain & Memory', 'Energy & Stamina']

  useEffect(() => {
    axios.get(`${API}/medicines`)
      .then(r => { setMedicines(r.data); setFiltered(r.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    let result = medicines
    if (search) result = result.filter(m => m.name.toLowerCase().includes(search.toLowerCase()))
    if (activeCategory !== 'All') {
      result = result.filter(m => {
        const category = m.category || m.cat || m.type || ''
        return category === activeCategory
      })
    }
    setFiltered(result)
  }, [search, activeCategory, medicines])

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='page-banner pt-32 pb-16 text-center relative'>
        <div className='relative z-10'>
          <span className='inline-block bg-white/20 glass text-green-200 text-xs px-4 py-1.5 rounded-full mb-4 tracking-widest uppercase'>Herbal Store</span>
          <h1 className='text-5xl font-bold text-white mb-4'>Ayurvedic Medicines</h1>
          <p className='text-green-200 text-lg max-w-xl mx-auto'>Pure, natural herbal formulations crafted from ancient Ayurvedic recipes</p>
        </div>
      </div>

      <div className='max-w-2xl mx-auto px-6 -mt-6 relative z-10 mb-12'>
        <div className='bg-white rounded-2xl shadow-xl p-2 flex gap-2'>
          <input type='text' value={search} onChange={e => setSearch(e.target.value)} placeholder='Search medicines, herbs...'
            className='flex-1 px-4 py-3 text-sm outline-none text-gray-700 rounded-xl' />
          <button className='bg-green-700 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-green-800 transition-colors'>Search</button>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-6 mb-10 flex flex-wrap gap-3 justify-center'>
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat ? 'bg-green-700 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-green-400 hover:text-green-700'}`}>
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
            {filtered.map((med, i) => <AnimatedCard key={med._id} med={med} index={i} />)}
          </div>
        )}
      </div>
    </div>
  )
}

export default Medicines
