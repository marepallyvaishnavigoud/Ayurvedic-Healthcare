import React, { useMemo, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useNavigate, Link } from 'react-router-dom'

const medicineImages = {
  'Ashwagandha':      '/medicines/ashwagandha.jpg',
  'Triphala':         '/medicines/triphala.jpg',
  'Brahmi':           '/medicines/brahmi.jpg',
  'Neem Capsules':    '/medicines/neem.jpg',
  'Turmeric Extract': '/medicines/turmeric.jpg',
  'Shatavari':        '/medicines/shatavari.jpg',
  'Giloy Juice':      '/medicines/giloy.jpg',
  'Amla Powder':      '/medicines/amla.jpg',
  'Moringa Tablets':  '/medicines/moringa.jpg',
  'Chyawanprash':     '/medicines/chyawanprash.jpg',
  'Shilajit Resin':   '/medicines/shilajit.jpg',
  'Haritaki Churna':  '/medicines/haritaki.jpg',
}

const fallbackMedImg = '/medicines/ashwagandha.jpg'

function getMedImg(med) {
  return medicineImages[med.name] || med.img || fallbackMedImg
}

const treatmentImages = {
  'Panchakarma':   '/treatments/panchakarma.jpg',
  'Abhyanga':      '/treatments/abhyanga.jpg',
  'Shirodhara':    '/treatments/shirodhara.jpg',
  'Nasya':         '/treatments/nasya.jpg',
  'Kati Basti':    '/treatments/kati-basti.jpg',
  'Udvartana':     '/treatments/udvartana.jpg',
  'Netra Tarpana': '/treatments/netra-tarpana.jpg',
  'Basti':         '/treatments/basti.jpg',
  'Pizhichil':     '/treatments/pizhichil.jpg',
  'Yoga Therapy':  '/treatments/yoga-therapy.jpg',
  'Marma Therapy': '/treatments/marma-therapy.jpg',
  'Raktamokshana': '/treatments/raktamokshana.jpg',
}

// eslint-disable-next-line no-unused-vars
function getTreatmentImg(t) {
  return treatmentImages[t.name] || t.img || t.image || t.thumbnail || ''
}

const steps = [
  { key: 'personal', title: 'Personal' },
  { key: 'health', title: 'Health' },
  { key: 'ayurveda', title: 'Ayurveda' },
  { key: 'optional', title: 'Optional' },
  { key: 'analyze', title: 'Analyze' },
]

const initialForm = {
  personalDetails: {
    name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
  },
  healthDetails: {
    symptoms: '',
    existingDiseases: '',
    allergies: '',
    currentMedications: '',
    sleepQuality: '',
    stressLevel: '',
    foodHabits: '',
    waterIntake: '',
    activityLevel: '',
  },
  ayurvedaDetails: {
    bodyType: '',
    lifestyleHabits: '',
  },
}

function Card({ children, className = '' }) {
  return (
    <div
      className={`rounded-3xl bg-white/80 backdrop-blur-md shadow-lg border border-white/60 p-6 ${className}`}
    >
      {children}
    </div>
  )
}

function Field({ label, name, value, onChange, placeholder = '' }) {
  return (
    <label className='block'>
      <div className='text-sm font-semibold text-gray-800 mb-1'>{label}</div>
      <input
        className='w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-green-300 focus:ring-2 focus:ring-green-100'
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </label>
  )
}

function FieldArea({ label, name, value, onChange, placeholder = '' }) {
  return (
    <label className='block'>
      <div className='text-sm font-semibold text-gray-800 mb-1'>{label}</div>
      <textarea
        className='w-full min-h-[120px] rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-green-300 focus:ring-2 focus:ring-green-100'
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </label>
  )
}

function SelectField({ label, name, value, onChange, options = [] }) {
  return (
    <label className='block'>
      <div className='text-sm font-semibold text-gray-800 mb-1'>{label}</div>
      <select
        className='w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-green-300 focus:ring-2 focus:ring-green-100'
        name={name}
        value={value}
        onChange={onChange}
      >
        <option value=''>Select</option>
        {options.map(o => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  )
}

function DietCard({ title, text }) {
  return (
    <div className='bg-white rounded-2xl border border-gray-100 p-4'>
      <div className='font-bold text-gray-900 mb-2'>{title}</div>
      <div className='text-gray-700 text-sm leading-relaxed whitespace-pre-wrap'>{text || '—'}</div>
    </div>
  )
}

function ListCard({ title, items }) {
  const safeItems = Array.isArray(items) ? items : []
  return (
    <div className='bg-white rounded-2xl border border-gray-100 p-4'>
      <div className='font-bold text-gray-900 mb-2'>{title}</div>
      {safeItems.length === 0 ? (
        <div className='text-gray-500 text-sm'>—</div>
      ) : (
        <ul className='space-y-2'>
          {safeItems.map((it, idx) => (
            <li key={idx} className='text-gray-700 text-sm leading-relaxed'>
              • {it}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

const AIHealthAnalysis = () => {
  const navigate = useNavigate()
  const { user, authHeader, API } = useAuth()
  const { addToCart } = useCart()

  const [stepIndex, setStepIndex] = useState(0)
  const step = steps[stepIndex]

  const [form, setForm] = useState(initialForm)
  const [files, setFiles] = useState({ report: null, upload: null })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const canNext = useMemo(() => {
    if (loading) return false

    if (step.key === 'personal') {
      const p = form.personalDetails
      return !!(p.name && p.age && p.gender && p.height && p.weight)
    }

    if (step.key === 'health') {
      const h = form.healthDetails
      return !!h.symptoms
    }

    return true
  }, [form, loading, step.key])

  const updatePersonal = (e) => {
    const { name, value } = e.target
    setForm(s => ({ ...s, personalDetails: { ...s.personalDetails, [name]: value } }))
  }

  const updateHealth = (e) => {
    const { name, value } = e.target
    setForm(s => ({ ...s, healthDetails: { ...s.healthDetails, [name]: value } }))
  }

  const updateAyurveda = (e) => {
    const { name, value } = e.target
    setForm(s => ({ ...s, ayurvedaDetails: { ...s.ayurvedaDetails, [name]: value } }))
  }

  const onNext = () => {
    if (!canNext) {
      toast.error('Please fill required fields to continue')
      return
    }
    setStepIndex(i => Math.min(i + 1, steps.length - 1))
  }

  const onBack = () => setStepIndex(i => Math.max(i - 1, 0))

  const analyze = async (e) => {
    e.preventDefault()

    if (!user) {
      toast.error('Please sign in to analyze your health')
      navigate('/auth')
      return
    }

    setLoading(true)
    setResult(null)

    try {
      // NOTE: current backend only accepts JSON.
      // Keep uploads in UI, but send metadata only to avoid breaking existing APIs.
      const payload = {
        ...form,
        optionalUploads: {
          hasReport: !!files.report,
          hasUpload: !!files.upload,
        },
      }

      const { data } = await axios.post(`${API}/ai/analyze`, payload, authHeader())
      setResult(data)
      toast.success('Analysis generated successfully ✅')
      setStepIndex(steps.length - 1)
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI analysis failed')
    } finally {
      setLoading(false)
    }
  }

  const progress = ((stepIndex + 1) / steps.length) * 100

  return (
    <div className='min-h-screen bg-gradient-to-b from-green-50 via-white to-gray-50 pt-24 pb-16'>
      <div className='max-w-6xl mx-auto px-6'>
        <div className='mb-10'>
          <div className='inline-flex items-center gap-2 bg-white/70 border border-white/60 px-4 py-2 rounded-full shadow-sm'>
            <span className='text-2xl'>🧠</span>
            <span className='text-sm font-semibold text-green-800'>AI Health Analysis</span>
            <span className='text-xs text-gray-500'>Premium Ayurvedic Insights</span>
          </div>
          <h1 className='text-4xl md:text-5xl font-bold text-green-950 mt-4'>
            Understand your body with AI-powered Ayurveda
          </h1>
          <p className='text-gray-600 mt-3 max-w-2xl'>
            Fill in your health details and get personalized Ayurvedic recommendations including diet, treatments,
            medicines, yoga and routine.
          </p>
        </div>

        <div className='grid lg:grid-cols-3 gap-8 items-start'>
          <div className='lg:col-span-1'>
            <Card>
              <div className='flex items-center justify-between mb-4'>
                <h2 className='font-bold text-green-900 text-lg'>Progress</h2>
                <span className='text-sm font-semibold text-green-700'>
                  {stepIndex + 1}/{steps.length}
                </span>
              </div>

              <div className='w-full h-3 bg-green-100 rounded-full overflow-hidden mb-5'>
                <div
                  className='h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full'
                  style={{ width: `${progress}%`, transition: 'width 300ms ease' }}
                />
              </div>

              <div className='space-y-3'>
                {steps.map((s, idx) => (
                  <button
                    key={s.key}
                    type='button'
                    onClick={() => setStepIndex(idx)}
                    className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all ${
                      idx === stepIndex
                        ? 'border-green-300 bg-green-50'
                        : 'border-white/70 hover:border-green-200 bg-white/60'
                    }`}
                  >
                    <span
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${
                        idx === stepIndex ? 'bg-green-700 text-white' : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div>
                      <div className='font-semibold text-gray-800'>{s.title}</div>
                      <div className='text-xs text-gray-500'>Step {idx + 1}</div>
                    </div>
                  </button>
                ))}
              </div>

              <div className='mt-6 text-sm text-gray-600'>
                <div className='flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-2xl p-4'>
                  <div className='text-xl'>🩺</div>
                  <div>
                    <div className='font-semibold text-amber-800'>Note</div>
                    <div className='text-amber-800/80'>This is AI-assisted guidance and not a medical diagnosis.</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className='lg:col-span-2'>
            {result ? (
              <div className='space-y-6'>
                <Card>
                  <div className='flex items-start justify-between gap-4'>
                    <div>
                      <h2 className='text-2xl font-bold text-green-950'>Your Ayurvedic Analysis</h2>
                      <p className='text-gray-600 mt-2'>Generated based on your inputs.</p>
                    </div>
                    <Link to='/ai-analysis-history' className='text-green-700 font-semibold hover:underline'>
                      View History →
                    </Link>
                  </div>

                  <div className='mt-6 grid md:grid-cols-2 gap-4'>
                    <div className='bg-white rounded-2xl border border-gray-100 p-4'>
                      <div className='font-bold text-gray-900 mb-2'>Disease/Problem Analysis</div>
                      <div className='text-gray-700 text-sm leading-relaxed'>
                        {result.aiResponse?.problemAnalysis}
                      </div>
                    </div>
                    <div className='bg-white rounded-2xl border border-gray-100 p-4'>
                      <div className='font-bold text-gray-900 mb-2'>Ayurvedic Explanation</div>
                      <div className='text-gray-700 text-sm leading-relaxed'>
                        {result.aiResponse?.ayurvedicExplanation}
                      </div>
                    </div>
                  </div>
                </Card>

                <Card>
                  <div className='flex items-center gap-3 mb-4'>
                    <span className='text-2xl'>✨</span>
                    <h2 className='text-xl font-bold text-green-950'>Recommended Treatments</h2>
                  </div>
                  <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                    {(result.matchedTreatments || []).map(t => (
                      <div key={t._id} className='bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm'>
                        <img src={getTreatmentImg(t)} alt={t.name} className='w-full h-32 object-cover' />
                        <div className='p-4'>
                          <div className='font-bold text-gray-900'>{t.name}</div>
                          <div className='text-xs text-gray-500 mt-1'>Duration: {t.duration}</div>
                          <button
                            onClick={() => navigate(`/treatments/${t._id}`)}
                            className='mt-3 w-full bg-green-700 text-white py-2 rounded-xl text-sm font-semibold hover:bg-green-800 transition-colors'
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    ))}
                    {(!result.matchedTreatments || result.matchedTreatments.length === 0) && (
                      <div className='text-gray-500 col-span-full'>No matched treatments found in database.</div>
                    )}
                  </div>
                </Card>

                <Card>
                  <h2 className='text-xl font-bold text-green-950 mb-4'>Personalized Diet Plan</h2>
                  <div className='grid md:grid-cols-2 gap-4'>
                    <DietCard title='Morning Routine' text={result.aiResponse?.dietPlan?.morningRoutine} />
                    <DietCard title='Breakfast' text={result.aiResponse?.dietPlan?.breakfast} />
                    <DietCard title='Lunch' text={result.aiResponse?.dietPlan?.lunch} />
                    <DietCard title='Evening' text={result.aiResponse?.dietPlan?.evening} />
                    <DietCard title='Dinner' text={result.aiResponse?.dietPlan?.dinner} />
                    <DietCard title='Bedtime' text={result.aiResponse?.dietPlan?.bedtime} />
                    <DietCard title='Herbal Drinks' text={result.aiResponse?.dietPlan?.herbalDrinks} />
                    <DietCard title='Foods to Avoid' text={result.aiResponse?.dietPlan?.foodsToAvoid} />
                    <DietCard title='Water Intake' text={result.aiResponse?.dietPlan?.waterIntake} />
                  </div>
                </Card>

                <Card>
                  <h2 className='text-xl font-bold text-green-950 mb-4'>Recommended Medicines</h2>
                  <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {(result.matchedMedicines || []).map(m => (
                      <div key={m._id} className='bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm'>
                        <img src={getMedImg(m)} alt={m.name} className='w-full h-28 object-cover' />
                        <div className='p-4'>
                          <div className='font-bold text-gray-900'>{m.name}</div>
                          <div className='text-sm text-gray-600 mt-1'>₹{m.price}</div>
                          <button
                            onClick={() => {
                              addToCart({ ...m, img: getMedImg(m) })
                              toast.success(`${m.name} added to cart ✅`)
                            }}
                            className='mt-3 w-full bg-green-700 text-white py-2 rounded-xl text-sm font-semibold hover:bg-green-800 transition-colors'
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    ))}
                    {(!result.matchedMedicines || result.matchedMedicines.length === 0) && (
                      <div className='text-gray-500 col-span-full'>No matched medicines found in database.</div>
                    )}
                  </div>
                </Card>

                <Card>
                  <h2 className='text-xl font-bold text-green-950 mb-4'>Yoga, Routine, Sleep & Stress Tips</h2>
                  <div className='grid md:grid-cols-2 gap-4'>
                    <ListCard title='Yoga Recommendations' items={result.aiResponse?.yogaRecommendations} />
                    <ListCard title='Daily Routine Suggestions' items={result.aiResponse?.dailyRoutine} />
                    <div className='bg-white rounded-2xl border border-gray-100 p-4'>
                      <div className='font-bold text-gray-900 mb-2'>Sleep Recommendations</div>
                      <div className='text-gray-700 text-sm leading-relaxed'>
                        {result.aiResponse?.sleepRecommendations}
                      </div>
                    </div>
                    <ListCard title='Stress Management Tips' items={result.aiResponse?.stressManagement} />
                  </div>
                </Card>

                <Card>
                  <h2 className='text-xl font-bold text-green-950 mb-4'>Nearby Ayurvedic Doctors</h2>
                  <div className='grid md:grid-cols-3 gap-4'>
                    {(result.recommendedDoctors || []).map(d => (
                      <div key={d._id} className='bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm'>
                        <img src={d.img} alt={d.name} className='w-full h-28 object-cover' />
                        <div className='p-4'>
                          <div className='font-bold text-gray-900'>{d.name}</div>
                          <div className='text-sm text-gray-600 mt-1'>{d.specialty}</div>
                          <button
                            onClick={() => navigate(`/doctors/${d._id}`)}
                            className='mt-3 w-full bg-green-700 text-white py-2 rounded-xl text-sm font-semibold hover:bg-green-800 transition-colors'
                          >
                            Book Appointment
                          </button>
                        </div>
                      </div>
                    ))}
                    {(!result.recommendedDoctors || result.recommendedDoctors.length === 0) && (
                      <div className='text-gray-500 col-span-full'>No doctors found.</div>
                    )}
                  </div>
                </Card>

                <div className='flex gap-3 justify-end'>
                  <button
                    onClick={() => {
                      setResult(null)
                      setStepIndex(0)
                      setFiles({ report: null, upload: null })
                      setForm(initialForm)
                    }}
                    className='px-5 py-3 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 font-semibold text-gray-800'
                  >
                    Start New Analysis
                  </button>
                </div>
              </div>
            ) : (
              <Card>
                <form onSubmit={analyze} className='space-y-6'>
                  <div className='flex items-center justify-between gap-4'>
                    <div>
                      <div className='text-sm font-semibold text-green-700'>
                        Step {stepIndex + 1} of {steps.length}
                      </div>
                      <h2 className='text-2xl font-bold text-green-950 mt-1'>{step.title}</h2>
                    </div>
                    <div className='text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full'>AI-ready form</div>
                  </div>

                  {step.key === 'personal' && (
                    <div className='grid md:grid-cols-2 gap-4'>
                      <Field
                        label='Full Name *'
                        name='name'
                        value={form.personalDetails.name}
                        onChange={updatePersonal}
                        placeholder='e.g. Ananya Sharma'
                      />
                      <Field
                        label='Age *'
                        name='age'
                        value={form.personalDetails.age}
                        onChange={updatePersonal}
                        placeholder='e.g. 28'
                      />
                      <SelectField
                        label='Gender *'
                        name='gender'
                        value={form.personalDetails.gender}
                        onChange={updatePersonal}
                        options={['Male', 'Female', 'Other']}
                      />
                      <Field
                        label='Height * (cm)'
                        name='height'
                        value={form.personalDetails.height}
                        onChange={updatePersonal}
                        placeholder='e.g. 165'
                      />
                      <Field
                        label='Weight * (kg)'
                        name='weight'
                        value={form.personalDetails.weight}
                        onChange={updatePersonal}
                        placeholder='e.g. 60'
                      />
                    </div>
                  )}

                  {step.key === 'health' && (
                    <div className='space-y-4'>
                      <FieldArea
                        label='Symptoms/Problems *'
                        name='symptoms'
                        value={form.healthDetails.symptoms}
                        onChange={updateHealth}
                        placeholder='e.g. acidity, stress, insomnia, skin issues...'
                      />
                      <div className='grid md:grid-cols-2 gap-4'>
                        <Field
                          label='Existing Diseases'
                          name='existingDiseases'
                          value={form.healthDetails.existingDiseases}
                          onChange={updateHealth}
                          placeholder='e.g. diabetes, hypertension'
                        />
                        <Field
                          label='Allergies'
                          name='allergies'
                          value={form.healthDetails.allergies}
                          onChange={updateHealth}
                          placeholder='e.g. pollen, dairy'
                        />
                        <Field
                          label='Current Medications'
                          name='currentMedications'
                          value={form.healthDetails.currentMedications}
                          onChange={updateHealth}
                          placeholder='e.g. metformin, aspirin'
                        />
                        <SelectField
                          label='Sleep Quality'
                          name='sleepQuality'
                          value={form.healthDetails.sleepQuality}
                          onChange={updateHealth}
                          options={['Poor', 'Average', 'Good', 'Excellent']}
                        />
                        <SelectField
                          label='Stress Level'
                          name='stressLevel'
                          value={form.healthDetails.stressLevel}
                          onChange={updateHealth}
                          options={['Low', 'Moderate', 'High', 'Very High']}
                        />
                        <SelectField
                          label='Food Habits'
                          name='foodHabits'
                          value={form.healthDetails.foodHabits}
                          onChange={updateHealth}
                          options={['Vegetarian', 'Non-Vegetarian', 'Vegan']}
                        />
                        <SelectField
                          label='Water Intake'
                          name='waterIntake'
                          value={form.healthDetails.waterIntake}
                          onChange={updateHealth}
                          options={['Less than 1L', '1-2L', '2-3L', 'More than 3L']}
                        />
                        <SelectField
                          label='Activity Level'
                          name='activityLevel'
                          value={form.healthDetails.activityLevel}
                          onChange={updateHealth}
                          options={['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active']}
                        />
                      </div>
                    </div>
                  )}

                  {step.key === 'ayurveda' && (
                    <div className='space-y-4'>
                      <SelectField
                        label='Body Type (Prakriti)'
                        name='bodyType'
                        value={form.ayurvedaDetails.bodyType}
                        onChange={updateAyurveda}
                        options={['Vata', 'Pitta', 'Kapha', 'Vata-Pitta', 'Pitta-Kapha', 'Vata-Kapha', 'Tridosha', "Don't Know"]}
                      />
                      <FieldArea
                        label='Lifestyle Habits'
                        name='lifestyleHabits'
                        value={form.ayurvedaDetails.lifestyleHabits}
                        onChange={updateAyurveda}
                        placeholder='e.g. late nights, irregular meals, screen time...'
                      />
                    </div>
                  )}

                  {step.key === 'optional' && (
                    <div className='space-y-4'>
                      <div>
                        <div className='text-sm font-semibold text-gray-800 mb-1'>Upload Medical Report (optional)</div>
                        <input
                          type='file'
                          accept='.pdf,.jpg,.jpeg,.png'
                          onChange={e => setFiles(f => ({ ...f, report: e.target.files[0] }))}
                          className='w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900'
                        />
                        {files.report && <div className='text-xs text-green-700 mt-1'>Selected: {files.report.name}</div>}
                      </div>
                      <div>
                        <div className='text-sm font-semibold text-gray-800 mb-1'>Upload Additional File (optional)</div>
                        <input
                          type='file'
                          accept='.pdf,.jpg,.jpeg,.png'
                          onChange={e => setFiles(f => ({ ...f, upload: e.target.files[0] }))}
                          className='w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900'
                        />
                        {files.upload && <div className='text-xs text-green-700 mt-1'>Selected: {files.upload.name}</div>}
                      </div>
                    </div>
                  )}

                  {step.key === 'analyze' && (
                    <div className='space-y-4'>
                      <div className='bg-green-50 border border-green-100 rounded-2xl p-5'>
                        <h3 className='font-bold text-green-900 mb-3'>Review Your Details</h3>
                        <div className='grid md:grid-cols-2 gap-3 text-sm text-gray-700'>
                          <div><span className='font-semibold'>Name:</span> {form.personalDetails.name}</div>
                          <div><span className='font-semibold'>Age:</span> {form.personalDetails.age}</div>
                          <div><span className='font-semibold'>Gender:</span> {form.personalDetails.gender}</div>
                          <div><span className='font-semibold'>Height:</span> {form.personalDetails.height} cm</div>
                          <div><span className='font-semibold'>Weight:</span> {form.personalDetails.weight} kg</div>
                          <div><span className='font-semibold'>Symptoms:</span> {form.healthDetails.symptoms}</div>
                        </div>
                      </div>
                      <p className='text-sm text-gray-500'>Click "Analyze" to get your personalized Ayurvedic health report.</p>
                    </div>
                  )}

                  <div className='flex items-center justify-between pt-2'>
                    <button
                      type='button'
                      onClick={onBack}
                      disabled={stepIndex === 0}
                      className='px-5 py-3 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 font-semibold text-gray-800 disabled:opacity-40'
                    >
                      ← Back
                    </button>

                    {step.key !== 'analyze' ? (
                      <button
                        type='button'
                        onClick={onNext}
                        disabled={!canNext}
                        className='px-6 py-3 rounded-2xl bg-green-700 text-white font-semibold hover:bg-green-800 transition-colors disabled:opacity-40'
                      >
                        Next →
                      </button>
                    ) : (
                      <button
                        type='submit'
                        disabled={loading}
                        className='px-6 py-3 rounded-2xl bg-green-700 text-white font-semibold hover:bg-green-800 transition-colors disabled:opacity-60'
                      >
                        {loading ? 'Analyzing...' : '🧠 Analyze'}
                      </button>
                    )}
                  </div>
                </form>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIHealthAnalysis
