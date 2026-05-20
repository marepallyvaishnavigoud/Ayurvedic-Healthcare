import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'

function Card({ children, className = '' }) {
  return (
    <div className={`rounded-3xl bg-white shadow-md border border-gray-100 p-6 ${className}`}>
      {children}
    </div>
  )
}

function DietCard({ title, text }) {
  return (
    <div className='bg-gray-50 rounded-2xl border border-gray-100 p-4'>
      <div className='font-bold text-gray-900 text-sm mb-1'>{title}</div>
      <div className='text-gray-600 text-sm leading-relaxed whitespace-pre-wrap'>{text || '—'}</div>
    </div>
  )
}

function ListCard({ title, items }) {
  const safe = Array.isArray(items) ? items : []
  return (
    <div className='bg-gray-50 rounded-2xl border border-gray-100 p-4'>
      <div className='font-bold text-gray-900 text-sm mb-2'>{title}</div>
      {safe.length === 0 ? (
        <div className='text-gray-400 text-sm'>—</div>
      ) : (
        <ul className='space-y-1'>
          {safe.map((it, i) => (
            <li key={i} className='text-gray-600 text-sm'>• {it}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

function DetailView({ record, onBack }) {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const ai = record.aiResponse || {}

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-4'>
        <button onClick={onBack} className='flex items-center gap-2 text-green-700 font-semibold hover:underline'>
          ← Back to History
        </button>
        <span className='text-gray-400 text-sm'>
          {new Date(record.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
        </span>
      </div>

      {/* Header */}
      <Card>
        <div className='flex items-start justify-between gap-4 flex-wrap'>
          <div>
            <div className='inline-flex items-center gap-2 bg-green-50 border border-green-100 px-3 py-1 rounded-full mb-3'>
              <span className='text-green-700 text-xs font-semibold'>AI Analysis Report</span>
            </div>
            <h2 className='text-2xl font-bold text-green-950'>
              {record.personalDetails?.name}'s Health Analysis
            </h2>
            <p className='text-gray-500 text-sm mt-1'>
              {record.personalDetails?.age} yrs · {record.personalDetails?.gender} ·{' '}
              {record.personalDetails?.height} cm · {record.personalDetails?.weight} kg
            </p>
          </div>
        </div>

        <div className='mt-5 grid md:grid-cols-2 gap-4'>
          <div className='bg-green-50 rounded-2xl p-4'>
            <div className='font-bold text-green-900 mb-2'>Disease / Problem Analysis</div>
            <p className='text-gray-700 text-sm leading-relaxed'>{ai.problemAnalysis || '—'}</p>
          </div>
          <div className='bg-amber-50 rounded-2xl p-4'>
            <div className='font-bold text-amber-900 mb-2'>Ayurvedic Explanation</div>
            <p className='text-gray-700 text-sm leading-relaxed'>{ai.ayurvedicExplanation || '—'}</p>
          </div>
        </div>
      </Card>

      {/* Diet Plan */}
      <Card>
        <h3 className='text-lg font-bold text-green-950 mb-4'>🥗 Personalized Diet Plan</h3>
        <div className='grid md:grid-cols-2 gap-3'>
          <DietCard title='Morning Routine' text={ai.dietPlan?.morningRoutine} />
          <DietCard title='Breakfast' text={ai.dietPlan?.breakfast} />
          <DietCard title='Lunch' text={ai.dietPlan?.lunch} />
          <DietCard title='Evening' text={ai.dietPlan?.evening} />
          <DietCard title='Dinner' text={ai.dietPlan?.dinner} />
          <DietCard title='Bedtime' text={ai.dietPlan?.bedtime} />
          <DietCard title='Herbal Drinks' text={ai.dietPlan?.herbalDrinks} />
          <DietCard title='Foods to Avoid' text={ai.dietPlan?.foodsToAvoid} />
          <DietCard title='Water Intake' text={ai.dietPlan?.waterIntake} />
        </div>
      </Card>

      {/* Yoga & Routine */}
      <Card>
        <h3 className='text-lg font-bold text-green-950 mb-4'>🧘 Yoga, Routine & Wellness</h3>
        <div className='grid md:grid-cols-2 gap-3'>
          <ListCard title='Yoga Recommendations' items={ai.yogaRecommendations} />
          <ListCard title='Daily Routine' items={ai.dailyRoutine} />
          <div className='bg-gray-50 rounded-2xl border border-gray-100 p-4'>
            <div className='font-bold text-gray-900 text-sm mb-1'>Sleep Recommendations</div>
            <p className='text-gray-600 text-sm leading-relaxed'>{ai.sleepRecommendations || '—'}</p>
          </div>
          <ListCard title='Stress Management' items={ai.stressManagement} />
        </div>
      </Card>

      {/* Symptoms summary */}
      <Card>
        <h3 className='text-lg font-bold text-green-950 mb-3'>📋 Health Details Submitted</h3>
        <div className='grid md:grid-cols-2 gap-2 text-sm text-gray-700'>
          {[
            ['Symptoms', record.healthDetails?.symptoms],
            ['Existing Diseases', record.healthDetails?.existingDiseases],
            ['Allergies', record.healthDetails?.allergies],
            ['Medications', record.healthDetails?.currentMedications],
            ['Sleep Quality', record.healthDetails?.sleepQuality],
            ['Stress Level', record.healthDetails?.stressLevel],
            ['Food Habits', record.healthDetails?.foodHabits],
            ['Water Intake', record.healthDetails?.waterIntake],
            ['Activity Level', record.healthDetails?.activityLevel],
            ['Body Type', record.ayurvedaDetails?.bodyType],
          ].map(([label, val]) => val ? (
            <div key={label} className='bg-gray-50 rounded-xl px-3 py-2'>
              <span className='font-semibold text-gray-800'>{label}: </span>{val}
            </div>
          ) : null)}
        </div>
      </Card>

      <div className='flex gap-3 justify-end'>
        <Link
          to='/ai-health-analysis'
          className='px-5 py-3 rounded-2xl bg-green-700 text-white font-semibold hover:bg-green-800 transition-colors'
        >
          New Analysis
        </Link>
      </div>
    </div>
  )
}

export default function AIAnalysisHistory() {
  const { authHeader, API } = useAuth()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    axios.get(`${API}/ai/history`, authHeader())
      .then(r => setHistory(r.data))
      .catch(() => toast.error('Failed to load history'))
      .finally(() => setLoading(false))
  }, []) // eslint-disable-line

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-b from-green-50 to-white pt-24 flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4' />
          <p className='text-gray-500'>Loading your analysis history...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-green-50 via-white to-gray-50 pt-24 pb-16'>
      <div className='max-w-5xl mx-auto px-6'>

        {selected ? (
          <DetailView record={selected} onBack={() => setSelected(null)} />
        ) : (
          <>
            {/* Header */}
            <div className='mb-8'>
              <div className='inline-flex items-center gap-2 bg-white border border-gray-100 px-4 py-2 rounded-full shadow-sm mb-4'>
                <span className='text-xl'>📋</span>
                <span className='text-sm font-semibold text-green-800'>Analysis History</span>
              </div>
              <h1 className='text-3xl md:text-4xl font-bold text-green-950'>Your AI Health Reports</h1>
              <p className='text-gray-500 mt-2'>All your past Ayurvedic health analyses in one place.</p>
            </div>

            {history.length === 0 ? (
              <Card className='text-center py-16'>
                <div className='text-5xl mb-4'>🌿</div>
                <h2 className='text-xl font-bold text-green-900 mb-2'>No analyses yet</h2>
                <p className='text-gray-500 mb-6'>Start your first AI-powered Ayurvedic health analysis.</p>
                <Link
                  to='/ai-health-analysis'
                  className='inline-block bg-green-700 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-green-800 transition-colors'
                >
                  Start Analysis →
                </Link>
              </Card>
            ) : (
              <div className='space-y-4'>
                {history.map((record) => (
                  <button
                    key={record._id}
                    onClick={() => setSelected(record)}
                    className='w-full text-left'
                  >
                    <Card className='hover:shadow-lg hover:border-green-200 transition-all cursor-pointer'>
                      <div className='flex items-start justify-between gap-4 flex-wrap'>
                        <div className='flex items-center gap-4'>
                          <div className='w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0'>
                            🧠
                          </div>
                          <div>
                            <div className='font-bold text-gray-900'>
                              {record.personalDetails?.name}'s Analysis
                            </div>
                            <div className='text-sm text-gray-500 mt-0.5'>
                              {record.personalDetails?.age} yrs · {record.personalDetails?.gender} ·{' '}
                              Symptoms: {record.healthDetails?.symptoms?.slice(0, 60)}
                              {record.healthDetails?.symptoms?.length > 60 ? '...' : ''}
                            </div>
                          </div>
                        </div>
                        <div className='flex items-center gap-3 flex-shrink-0'>
                          <span className='text-xs text-gray-400'>
                            {new Date(record.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric', month: 'short', year: 'numeric',
                            })}
                          </span>
                          <span className='bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 rounded-full border border-green-100'>
                            View Report →
                          </span>
                        </div>
                      </div>

                      {/* Quick preview tags */}
                      <div className='mt-3 flex flex-wrap gap-2'>
                        {record.healthDetails?.stressLevel && (
                          <span className='bg-amber-50 text-amber-700 text-xs px-2 py-1 rounded-full'>
                            Stress: {record.healthDetails.stressLevel}
                          </span>
                        )}
                        {record.healthDetails?.sleepQuality && (
                          <span className='bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full'>
                            Sleep: {record.healthDetails.sleepQuality}
                          </span>
                        )}
                        {record.ayurvedaDetails?.bodyType && (
                          <span className='bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full'>
                            {record.ayurvedaDetails.bodyType} Prakriti
                          </span>
                        )}
                        {record.healthDetails?.activityLevel && (
                          <span className='bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded-full'>
                            {record.healthDetails.activityLevel}
                          </span>
                        )}
                      </div>
                    </Card>
                  </button>
                ))}

                <div className='text-center pt-4'>
                  <Link
                    to='/ai-health-analysis'
                    className='inline-block bg-green-700 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-green-800 transition-colors'
                  >
                    + New Analysis
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
