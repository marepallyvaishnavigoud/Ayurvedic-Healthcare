import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

const statusColors = { Confirmed: 'bg-green-100 text-green-700', Pending: 'bg-yellow-100 text-yellow-700', Cancelled: 'bg-red-100 text-red-600' }

const MyAppointments = () => {
  const { authHeader, API } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAppointments = () => {
    axios.get(`${API}/appointments/mine`, authHeader())
      .then(r => setAppointments(r.data))
      .catch(() => toast.error('Failed to load appointments'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchAppointments() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const cancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return
    try {
      await axios.delete(`${API}/appointments/${id}`, authHeader())
      toast.success('Appointment cancelled')
      fetchAppointments()
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
          <h1 className='text-3xl font-bold text-green-900'>My Appointments</h1>
          <Link to='/doctors' className='bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-800 transition-colors'>+ Book New</Link>
        </div>

        {appointments.length === 0 ? (
          <div className='text-center py-20'>
            <div className='text-7xl mb-4'>🩺</div>
            <h2 className='text-xl font-bold text-gray-700 mb-2'>No appointments yet</h2>
            <p className='text-gray-400 mb-6'>Book a consultation with our Ayurvedic doctors</p>
            <Link to='/doctors' className='bg-green-700 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-800 transition-colors'>Find Doctors</Link>
          </div>
        ) : (
          <div className='space-y-4'>
            {appointments.map(appt => (
              <div key={appt._id} className='bg-white rounded-2xl shadow-md p-6 flex flex-col md:flex-row gap-4 items-start md:items-center'>
                <img src={appt.doctor?.img} alt={appt.doctor?.name} className='w-16 h-16 rounded-xl object-cover flex-shrink-0' />
                <div className='flex-1'>
                  <div className='flex items-center gap-3 flex-wrap'>
                    <h3 className='font-bold text-gray-900 text-lg'>{appt.doctor?.name}</h3>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusColors[appt.status]}`}>{appt.status}</span>
                  </div>
                  <p className='text-green-600 text-sm font-medium'>{appt.doctor?.specialty}</p>
                  <div className='flex flex-wrap gap-4 mt-2 text-sm text-gray-500'>
                    <span>📅 {appt.date}</span>
                    <span>🕐 {appt.timeSlot}</span>
                    <span>👤 {appt.patientName}</span>
                    <span>💰 ₹{appt.fee}</span>
                  </div>
                </div>
                {appt.status !== 'Cancelled' && (
                  <button onClick={() => cancel(appt._id)}
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

export default MyAppointments
