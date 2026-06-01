import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

const DoctorDetails = () => {
  const { id } = useParams()
  const { user, authHeader, API } = useAuth()
  const navigate = useNavigate()
  const [doctor, setDoctor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showBooking, setShowBooking] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ date: '', timeSlot: '', patientName: '', patientAge: '', patientPhone: '', concern: '' })

  useEffect(() => {
    axios.get(`${API}/doctors/${id}`)
      .then(r => setDoctor(r.data))
      .catch(() => toast.error('Doctor not found'))
      .finally(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value })

  const bookAppointment = async (e) => {
    e.preventDefault()
    if (!user) return navigate('/auth', { state: { from: `/doctors/${id}` } })
    setSubmitting(true)
    try {
      await axios.post(`${API}/appointments`, { ...form, doctor: id, fee: doctor.fee }, authHeader())
      toast.success('Appointment booked successfully!')
      setShowBooking(false)
      navigate('/my-appointments')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed')
    } finally {
      setSubmitting(false)
    }
  }

  const today = new Date().toISOString().split('T')[0]

  // resolve image — DB field is "img"
  const docImg = doctor?.img || doctor?.image || ''

  if (loading) return (
    <div className='min-h-screen flex items-center justify-center pt-20'>
      <div className='text-center'>
        <div className='w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
        <p className='text-gray-500'>Loading doctor profile...</p>
      </div>
    </div>
  )

  if (!doctor) return (
    <div className='min-h-screen flex items-center justify-center pt-20'>
      <p className='text-gray-500'>Doctor not found</p>
    </div>
  )

  return (
    <div className='min-h-screen bg-gray-50 pt-24 pb-16'>
      <div className='max-w-5xl mx-auto px-6'>

        {/* Profile Card */}
        <div className='bg-white rounded-3xl shadow-xl overflow-hidden mb-8'>
          <div className='bg-gradient-to-r from-green-700 to-green-900 h-32'></div>
          <div className='px-8 pb-8 -mt-16'>
            <div className='flex flex-col md:flex-row gap-6 items-start'>
              <img
                src={docImg}
                alt={doctor.name}
                onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://placehold.co/300x300/16a34a/white?text=Dr' }}
                className='w-32 h-32 rounded-2xl object-cover object-top border-4 border-white shadow-xl'
              />
              <div className='flex-1 pt-4 md:pt-16'>
                <div className='flex flex-wrap items-start justify-between gap-4'>
                  <div>
                    <h1 className='text-3xl font-bold text-gray-900'>{doctor.name}</h1>
                    <p className='text-green-600 font-semibold text-lg mt-1'>{doctor.specialty}</p>
                    <p className='text-gray-500 text-sm mt-1'>{doctor.education}</p>
                  </div>
                  <div className='text-right'>
                    <div className='text-3xl font-bold text-green-700'>&#8377;{doctor.fee}</div>
                    <div className='text-gray-400 text-sm'>Consultation Fee</div>
                  </div>
                </div>
                <div className='flex flex-wrap gap-3 mt-4 text-sm'>
                  <span className='bg-green-50 text-green-700 px-3 py-1.5 rounded-full font-medium'>&#11088; {doctor.rating} Rating</span>
                  <span className='bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full font-medium'>&#128314; {doctor.experience} Experience</span>
                  <span className='bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full font-medium'>&#128101; {doctor.patients} Patients</span>
                  {doctor.languages?.map(l => (
                    <span key={l} className='bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full font-medium'>{l}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='grid md:grid-cols-3 gap-8'>
          <div className='md:col-span-2 space-y-6'>

            {/* About */}
            <div className='bg-white rounded-2xl shadow-md p-6'>
              <h2 className='text-xl font-bold text-green-900 mb-3'>About Doctor</h2>
              <p className='text-gray-600 leading-relaxed'>{doctor.about}</p>
            </div>

            {/* Timings */}
            <div className='bg-white rounded-2xl shadow-md p-6'>
              <h2 className='text-xl font-bold text-green-900 mb-4'>Available Time Slots</h2>
              <div className='flex flex-wrap gap-3'>
                {doctor.timings?.map(t => (
                  <span key={t} className='bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-xl text-sm font-medium'>
                    &#128336; {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className='bg-white rounded-2xl shadow-md p-6'>
              <h2 className='text-xl font-bold text-green-900 mb-4'>Patient Reviews</h2>
              {doctor.reviews?.length > 0 ? doctor.reviews.map((r, i) => (
                <div key={i} className='border-b border-gray-100 pb-4 mb-4 last:border-0'>
                  <div className='flex items-center gap-2 mb-1'>
                    <span className='font-semibold text-gray-800'>{r.name}</span>
                    <span className='text-yellow-400'>{'★'.repeat(r.rating)}</span>
                  </div>
                  <p className='text-gray-500 text-sm'>{r.comment}</p>
                </div>
              )) : (
                <div className='text-center py-8 text-gray-400'>
                  <div className='text-4xl mb-2'>&#128172;</div>
                  <p>No reviews yet. Be the first to review!</p>
                </div>
              )}
            </div>
          </div>

          {/* Booking Sidebar */}
          <div>
            <div className='bg-white rounded-2xl shadow-md p-6 sticky top-24'>

              {/* Doctor image + name in sidebar */}
              <div className='flex items-center gap-3 mb-5 pb-5 border-b border-gray-100'>
                <img
                  src={docImg}
                  alt={doctor.name}
                  onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://placehold.co/300x300/16a34a/white?text=Dr' }}
                  className='w-16 h-16 rounded-xl object-cover object-top flex-shrink-0'
                />
                <div>
                  <div className='font-bold text-gray-900 text-sm'>{doctor.name}</div>
                  <div className='text-green-600 text-xs font-medium mt-0.5'>{doctor.specialty}</div>
                  <div className='text-green-700 font-bold text-sm mt-1'>&#8377;{doctor.fee} <span className='text-gray-400 font-normal text-xs'>consult fee</span></div>
                </div>
              </div>

              <button
                onClick={() => { if (!user) navigate('/auth', { state: { from: `/doctors/${id}` } }); else setShowBooking(true) }}
                className='w-full bg-gradient-to-r from-green-600 to-green-800 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all'
              >
                Book Appointment
              </button>
              <div className='mt-4 p-4 bg-green-50 rounded-xl space-y-1'>
                <p className='text-green-800 text-xs font-medium'>&#9989; Instant Confirmation</p>
                <p className='text-green-800 text-xs font-medium'>&#9989; Free Cancellation</p>
                <p className='text-green-800 text-xs font-medium'>&#9989; Certified Practitioner</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBooking && (
        <div className='fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4' onClick={() => setShowBooking(false)}>
          <div className='bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto' onClick={e => e.stopPropagation()}>

            {/* Modal header with doctor image */}
            <div className='bg-gradient-to-r from-green-700 to-green-900 p-6 rounded-t-3xl'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                  <img
                    src={docImg}
                    alt={doctor.name}
                    onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://placehold.co/300x300/16a34a/white?text=Dr' }}
                    className='w-14 h-14 rounded-xl object-cover object-top border-2 border-white/40 flex-shrink-0'
                  />
                  <div>
                    <h2 className='text-lg font-bold text-white'>{doctor.name}</h2>
                    <p className='text-green-200 text-sm'>{doctor.specialty} &middot; &#8377;{doctor.fee}</p>
                  </div>
                </div>
                <button onClick={() => setShowBooking(false)} className='text-white/70 hover:text-white text-2xl leading-none'>&#10005;</button>
              </div>
            </div>

            <form onSubmit={bookAppointment} className='p-6 space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='text-sm font-medium text-gray-700 block mb-1'>Patient Name *</label>
                  <input name='patientName' value={form.patientName} onChange={handle} required placeholder='Full name'
                    className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100' />
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-700 block mb-1'>Age *</label>
                  <input name='patientAge' value={form.patientAge} onChange={handle} required placeholder='e.g. 32'
                    className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100' />
                </div>
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
                  <option value=''>Select a time slot</option>
                  {doctor.timings?.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className='text-sm font-medium text-gray-700 block mb-1'>Health Concern</label>
                <textarea name='concern' value={form.concern} onChange={handle} rows={3} placeholder='Describe your health concern...'
                  className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 resize-none' />
              </div>
              <div className='bg-green-50 rounded-xl p-4 flex items-center justify-between'>
                <span className='text-gray-600 font-medium'>Consultation Fee</span>
                <span className='text-green-700 font-bold text-xl'>&#8377;{doctor.fee}</span>
              </div>
              <button type='submit' disabled={submitting}
                className='w-full bg-gradient-to-r from-green-600 to-green-800 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-60'>
                {submitting ? 'Booking...' : 'Confirm Appointment'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default DoctorDetails
