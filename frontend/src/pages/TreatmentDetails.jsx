import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

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

const centers = ['AyurCare Main Center - New Delhi', 'AyurCare Wellness Hub - Mumbai', 'AyurCare Healing Center - Bangalore', 'AyurCare Spa - Chennai']
const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM']

const TreatmentDetails = () => {
  const { id } = useParams()
  const { user, authHeader, API } = useAuth()
  const navigate = useNavigate()
  const [treatment, setTreatment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showBooking, setShowBooking] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)
  const [form, setForm] = useState({ date: '', timeSlot: '', patientName: '', patientPhone: '', center: centers[0] })

  useEffect(() => {
    axios.get(`${API}/treatments/${id}`)
      .then(r => setTreatment(r.data))
      .catch(() => toast.error('Treatment not found'))
      .finally(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value })

  const bookTreatment = async (e) => {
    e.preventDefault()
    if (!user) return navigate('/auth', { state: { from: `/treatments/${id}` } })
    setSubmitting(true)
    try {
      // Keep selected treatment image consistent on booking page
      await axios.post(`${API}/treatment-bookings`, { ...form, treatment: id, price: treatment.price, treatmentImg: treatment.img }, authHeader())
      toast.success('Treatment booked successfully! 🎉')

      setShowBooking(false)
      navigate('/my-treatment-bookings')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed')
    } finally {
      setSubmitting(false)
    }
  }

  const today = new Date().toISOString().split('T')[0]

  if (loading) return (
    <div className='min-h-screen flex items-center justify-center pt-20'>
      <div className='w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto'></div>
    </div>
  )

  if (!treatment) return <div className='min-h-screen flex items-center justify-center pt-20'><p>Treatment not found</p></div>

  return (
    <div className='min-h-screen bg-gray-50 pt-24 pb-16'>
      <div className='max-w-5xl mx-auto px-6'>

        {/* Hero */}
        <div className='relative rounded-3xl overflow-hidden h-72 mb-8 shadow-xl'>
          <img src={treatmentImages[treatment.name] || treatment.img} alt={treatment.name} className='w-full h-full object-cover' />
          <div className='absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-end p-8'>
            <div>
              <span className='bg-green-600 text-white text-xs px-3 py-1 rounded-full mb-3 inline-block'>{treatment.benefit}</span>
              <h1 className='text-4xl font-bold text-white'>{treatment.name}</h1>
              <p className='text-white/80 mt-2 max-w-lg'>{treatment.desc}</p>
              <div className='flex gap-4 mt-3 text-sm text-white/70'>
                <span>⏱ {treatment.duration}</span>
                <span>💰 ₹{treatment.price}</span>
              </div>
            </div>
          </div>
        </div>

        <div className='grid md:grid-cols-3 gap-8'>
          <div className='md:col-span-2 space-y-6'>

            {/* Benefits */}
            <div className='bg-white rounded-2xl shadow-md p-6'>
              <h2 className='text-xl font-bold text-green-900 mb-4'>Key Benefits</h2>
              <div className='grid grid-cols-2 gap-3'>
                {treatment.benefits?.map((b, i) => (
                  <div key={i} className='flex items-center gap-2 bg-green-50 rounded-xl p-3'>
                    <span className='text-green-600 text-lg'>✅</span>
                    <span className='text-gray-700 text-sm font-medium'>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Procedure */}
            <div className='bg-white rounded-2xl shadow-md p-6'>
              <h2 className='text-xl font-bold text-green-900 mb-4'>Treatment Procedure</h2>
              <div className='space-y-3'>
                {treatment.procedure?.map((step, i) => (
                  <div key={i} className='flex gap-4 items-start'>
                    <div className='w-8 h-8 bg-green-700 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0'>{i + 1}</div>
                    <p className='text-gray-600 pt-1'>{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQs */}
            <div className='bg-white rounded-2xl shadow-md p-6'>
              <h2 className='text-xl font-bold text-green-900 mb-4'>Frequently Asked Questions</h2>
              {treatment.faqs?.map((faq, i) => (
                <div key={i} className='border border-gray-100 rounded-xl mb-3 overflow-hidden'>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className='w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors'>
                    <span className='font-medium text-gray-800'>{faq.question}</span>
                    <span className='text-green-600 text-xl'>{openFaq === i ? '−' : '+'}</span>
                  </button>
                  {openFaq === i && <div className='px-4 pb-4 text-gray-500 text-sm leading-relaxed'>{faq.answer}</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Booking Sidebar */}
          <div>
            <div className='bg-white rounded-2xl shadow-md p-6 sticky top-24'>
              <h2 className='text-xl font-bold text-green-900 mb-1'>Book This Treatment</h2>
              <div className='text-3xl font-bold text-green-700 mb-1'>₹{treatment.price}</div>
              <p className='text-gray-400 text-sm mb-4'>Duration: {treatment.duration}</p>
              <button onClick={() => { if (!user) navigate('/auth', { state: { from: `/treatments/${id}` } }); else setShowBooking(true) }}
                className='w-full bg-gradient-to-r from-green-600 to-green-800 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all'>
                Book Now
              </button>
              <div className='mt-4 space-y-2'>
                <p className='text-green-800 text-xs font-medium bg-green-50 rounded-lg px-3 py-2'>✅ Certified Ayurvedic Therapists</p>
                <p className='text-green-800 text-xs font-medium bg-green-50 rounded-lg px-3 py-2'>✅ 100% Natural Ingredients</p>
                <p className='text-green-800 text-xs font-medium bg-green-50 rounded-lg px-3 py-2'>✅ Free Cancellation</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBooking && (
        <div className='fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4' onClick={() => setShowBooking(false)}>
          <div className='bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto' onClick={e => e.stopPropagation()}>
            <div className='bg-gradient-to-r from-green-700 to-green-900 p-6 rounded-t-3xl flex items-center justify-between'>
              <div>
                <h2 className='text-xl font-bold text-white'>Book Treatment</h2>
                <p className='text-green-200 text-sm'>{treatment.name}</p>
              </div>
              <button onClick={() => setShowBooking(false)} className='text-white/70 hover:text-white text-2xl'>✕</button>
            </div>
            <form onSubmit={bookTreatment} className='p-6 space-y-4'>
              <div>
                <label className='text-sm font-medium text-gray-700 block mb-1'>Patient Name *</label>
                <input name='patientName' value={form.patientName} onChange={handle} required placeholder='Full name'
                  className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100' />
              </div>
              <div>
                <label className='text-sm font-medium text-gray-700 block mb-1'>Phone Number *</label>
                <input name='patientPhone' value={form.patientPhone} onChange={handle} required placeholder='+91 98765 43210'
                  className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100' />
              </div>
              <div>
                <label className='text-sm font-medium text-gray-700 block mb-1'>Preferred Date *</label>
                <input name='date' type='date' value={form.date} onChange={handle} required min={today}
                  className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100' />
              </div>
              <div>
                <label className='text-sm font-medium text-gray-700 block mb-1'>Time Slot *</label>
                <select name='timeSlot' value={form.timeSlot} onChange={handle} required
                  className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100'>
                  <option value=''>Select time slot</option>
                  {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className='text-sm font-medium text-gray-700 block mb-1'>Center *</label>
                <select name='center' value={form.center} onChange={handle}
                  className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100'>
                  {centers.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className='bg-green-50 rounded-xl p-4 flex items-center justify-between'>
                <span className='text-gray-600 font-medium'>Treatment Fee</span>
                <span className='text-green-700 font-bold text-xl'>₹{treatment.price}</span>
              </div>
              <button type='submit' disabled={submitting}
                className='w-full bg-gradient-to-r from-green-600 to-green-800 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-60'>
                {submitting ? '⏳ Booking...' : 'Confirm Booking ✅'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default TreatmentDetails
