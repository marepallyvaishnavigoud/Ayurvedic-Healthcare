import React, { useState } from 'react'

const contactInfo = [
  { icon: '📍', title: 'Visit Us', detail: '42, Ayur Marg, Green Park, New Delhi - 110016', color: 'bg-green-50 border-green-200' },
  { icon: '📞', title: 'Call Us', detail: '+91 98765 43210\nMon–Sat, 9am–7pm', color: 'bg-blue-50 border-blue-200' },
  { icon: '✉️', title: 'Email Us', detail: 'care@ayurcare.in\nSupport 24/7', color: 'bg-amber-50 border-amber-200' },
]

const Contact = () => {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <div className='min-h-screen bg-gray-50'>

      {/* Banner */}
      <div className='page-banner pt-32 pb-16 text-center relative'>
        <div className='relative z-10'>
          <span className='inline-block bg-white/20 glass text-green-200 text-xs px-4 py-1.5 rounded-full mb-4 tracking-widest uppercase'>Get In Touch</span>
          <h1 className='text-5xl font-bold text-white mb-4'>Contact Us</h1>
          <p className='text-green-200 text-lg max-w-xl mx-auto'>We're here to guide you on your Ayurvedic wellness journey</p>
        </div>
      </div>

      <div className='max-w-6xl mx-auto px-6 py-20'>

        {/* Contact info cards */}
        <div className='grid md:grid-cols-3 gap-6 mb-16'>
          {contactInfo.map((c, i) => (
            <div key={i} className={`${c.color} border rounded-2xl p-6 text-center card-hover animate-fadeInUp`} style={{ animationDelay: `${i * 100}ms` }}>
              <div className='text-4xl mb-3'>{c.icon}</div>
              <h3 className='font-bold text-gray-900 text-lg mb-2'>{c.title}</h3>
              <p className='text-gray-600 text-sm whitespace-pre-line leading-relaxed'>{c.detail}</p>
            </div>
          ))}
        </div>

        <div className='grid md:grid-cols-2 gap-12 items-start'>

          {/* Form */}
          <div className='bg-white rounded-3xl shadow-xl p-8 animate-fadeInUp'>
            <h2 className='text-3xl font-bold text-green-900 mb-2'>Send a Message</h2>
            <p className='text-gray-500 text-sm mb-8'>Fill in the form and our team will get back to you within 24 hours.</p>

            {submitted && (
              <div className='bg-green-50 border border-green-200 text-green-800 rounded-xl px-5 py-4 mb-6 flex items-center gap-3 animate-fadeIn'>
                <span className='text-2xl'>✅</span>
                <div>
                  <div className='font-semibold'>Message Sent!</div>
                  <div className='text-sm text-green-600'>We'll get back to you within 24 hours.</div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className='space-y-5'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='text-sm font-medium text-gray-700 mb-1.5 block'>First Name</label>
                  <input type='text' placeholder='Arjun' required className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all' />
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-700 mb-1.5 block'>Last Name</label>
                  <input type='text' placeholder='Sharma' required className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all' />
                </div>
              </div>
              <div>
                <label className='text-sm font-medium text-gray-700 mb-1.5 block'>Email Address</label>
                <input type='email' placeholder='arjun@example.com' required className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all' />
              </div>
              <div>
                <label className='text-sm font-medium text-gray-700 mb-1.5 block'>Phone Number</label>
                <input type='tel' placeholder='+91 98765 43210' className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all' />
              </div>
              <div>
                <label className='text-sm font-medium text-gray-700 mb-1.5 block'>Subject</label>
                <select className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all text-gray-600'>
                  <option>Book a Consultation</option>
                  <option>Medicine Enquiry</option>
                  <option>Treatment Information</option>
                  <option>General Query</option>
                </select>
              </div>
              <div>
                <label className='text-sm font-medium text-gray-700 mb-1.5 block'>Message</label>
                <textarea rows={4} placeholder='Tell us about your health concerns...' required className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all resize-none' />
              </div>
              <button type='submit' className='w-full bg-gradient-to-r from-green-600 to-green-800 text-white py-4 rounded-xl font-semibold text-base hover:shadow-lg hover:scale-[1.02] transition-all'>
                Send Message 🌿
              </button>
            </form>
          </div>

          {/* Right side */}
          <div className='space-y-8 animate-fadeInUp delay-200'>
            {/* Map placeholder */}
            <div className='rounded-3xl overflow-hidden shadow-xl h-72 relative'>
              <img src='https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80' alt='location' className='w-full h-full object-cover' />
              <div className='absolute inset-0 bg-green-900/40 flex items-center justify-center'>
                <div className='bg-white rounded-2xl px-6 py-4 text-center shadow-xl'>
                  <div className='text-3xl mb-1'>📍</div>
                  <div className='font-bold text-green-900'>AyurCare Wellness Center</div>
                  <div className='text-gray-500 text-sm'>Green Park, New Delhi</div>
                </div>
              </div>
            </div>

            {/* Working hours */}
            <div className='bg-white rounded-3xl shadow-xl p-8'>
              <h3 className='text-xl font-bold text-green-900 mb-6 flex items-center gap-2'>🕐 Working Hours</h3>
              <div className='space-y-3'>
                {[
                  { day: 'Monday – Friday', time: '9:00 AM – 7:00 PM', open: true },
                  { day: 'Saturday', time: '9:00 AM – 5:00 PM', open: true },
                  { day: 'Sunday', time: 'Closed', open: false },
                ].map((h, i) => (
                  <div key={i} className='flex items-center justify-between py-2 border-b border-gray-100 last:border-0'>
                    <span className='text-gray-700 text-sm font-medium'>{h.day}</span>
                    <span className={`text-sm font-semibold ${h.open ? 'text-green-600' : 'text-red-400'}`}>{h.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social */}
            <div className='bg-gradient-to-br from-green-700 to-green-900 rounded-3xl p-8 text-white'>
              <h3 className='text-xl font-bold mb-4'>Follow Us</h3>
              <p className='text-green-200 text-sm mb-6'>Stay connected for daily Ayurvedic tips & wellness insights</p>
              <div className='flex gap-3'>
                {['📘 Facebook', '📸 Instagram', '🐦 Twitter', '▶️ YouTube'].map(s => (
                  <button key={s} className='bg-white/20 hover:bg-white/30 text-white text-xs px-3 py-2 rounded-xl transition-colors'>{s}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
