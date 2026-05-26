import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

const statusColors = { Confirmed: 'bg-green-100 text-green-700', Pending: 'bg-yellow-100 text-yellow-700', Cancelled: 'bg-red-100 text-red-600' }

const MyTreatmentBookings = () => {
  const { authHeader, API } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchBookings = () => {
    axios.get(`${API}/treatment-bookings/mine`, authHeader())
      .then(r => setBookings(r.data))
      .catch(() => toast.error('Failed to load bookings'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchBookings() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const cancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return
    try {
      await axios.delete(`${API}/treatment-bookings/${id}`, authHeader())
      toast.success('Booking cancelled')
      fetchBookings()
    } catch { toast.error('Failed to cancel') }
  }

  if (loading) return (
    <div className='min-h-screen flex items-center justify-center pt-20'>
      <div className='w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin'></div>
    </div>
  )

  return (
    <div className='min-h-screen bg-gray-50 pt-24 pb-16'>
      <div className='max-w-4xl mx-auto px-6'>
        <div className='flex items-center justify-between mb-8'>
          <h1 className='text-3xl font-bold text-green-900'>My Treatment Bookings</h1>
          <Link to='/treatments' className='bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-800 transition-colors'>+ Book New</Link>
        </div>

        {bookings.length === 0 ? (
          <div className='text-center py-20'>
            <div className='text-7xl mb-4'>🧘</div>
            <h2 className='text-xl font-bold text-gray-700 mb-2'>No treatment bookings yet</h2>
            <p className='text-gray-400 mb-6'>Explore our Ayurvedic treatments and book a session</p>
            <Link to='/treatments' className='bg-green-700 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-800 transition-colors'>Explore Treatments</Link>
          </div>
        ) : (
          <div className='space-y-4'>
            {bookings.map(b => (
              <div key={b._id} className='bg-white rounded-2xl shadow-md p-6 flex flex-col md:flex-row gap-4 items-start md:items-center'>
                <img src={b.treatment?.img} alt={b.treatment?.name} className='w-20 h-20 rounded-xl object-cover flex-shrink-0' />
                <div className='flex-1'>
                  <div className='flex items-center gap-3 flex-wrap'>
                    <h3 className='font-bold text-gray-900 text-lg'>{b.treatment?.name}</h3>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusColors[b.status]}`}>{b.status}</span>
                  </div>
                  <p className='text-green-600 text-sm font-medium'>⏱ {b.treatment?.duration}</p>
                  <div className='flex flex-wrap gap-4 mt-2 text-sm text-gray-500'>
                    <span>📅 {b.date}</span>
                    <span>🕐 {b.timeSlot}</span>
                    <span>📍 {b.center}</span>
                    <span>💰 ₹{b.price}</span>
                  </div>
                </div>
                {b.status !== 'Cancelled' && (
                  <button onClick={() => cancel(b._id)}
                    className='text-red-500 border border-red-200 px-4 py-2 rounded-xl text-sm hover:bg-red-50 transition-colors flex-shrink-0'>
                    Cancel
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyTreatmentBookings
