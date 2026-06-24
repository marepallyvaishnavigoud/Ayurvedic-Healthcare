import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

const stats = [
  { value: '5000+', label: 'Happy Patients' },
  { value: '50+', label: 'Expert Doctors' },
  { value: '200+', label: 'Herbal Medicines' },
  { value: '30+', label: 'Treatments' },
]

const features = [
  { icon: '\uD83C\uDF3F', title: 'Pure & Natural', desc: 'All medicines sourced from certified organic farms with zero chemicals.' },
  { icon: '\uD83D\uDC68\u200D\u2695\uFE0F', title: 'Expert Doctors', desc: 'Consult with certified Ayurvedic practitioners with 10+ years experience.' },
  { icon: '\uD83E\uDDD8', title: 'Holistic Healing', desc: 'Mind, body and soul wellness through ancient Ayurvedic science.' },
  { icon: '\uD83D\uDE9A', title: 'Fast Delivery', desc: 'Medicines delivered to your doorstep within 2-3 business days.' },
]

const testimonials = [
  { name: 'Ananya Sharma', role: 'Yoga Instructor', text: 'AyurCare transformed my health completely. The Panchakarma treatment was life-changing!', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face' },
  { name: 'Rajesh Kumar', role: 'Software Engineer', text: 'I was skeptical at first, but the Ashwagandha and Brahmi combo cured my chronic stress.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face' },
  { name: 'Preethi Menon', role: 'Teacher', text: 'Dr. Priya Nair is exceptional. My skin issues of 5 years resolved in just 3 months!', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face' },
]

const blogs = [
  { title: 'The 3 Doshas: Vata, Pitta & Kapha', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop', tag: 'Ayurveda Basics' },
  { title: 'Morning Rituals for Optimal Health', img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop', tag: 'Lifestyle' },
  { title: 'Top 10 Herbs for Immunity Boost', img: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=600&h=400&fit=crop', tag: 'Herbs & Spices' },
]

function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible]
}

const ArrowRight = () => (
  <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2.5}>
    <path strokeLinecap='round' strokeLinejoin='round' d='M17 8l4 4m0 0l-4 4m4-4H3' />
  </svg>
)

const CheckIcon = () => (
  <svg className='w-3.5 h-3.5 text-green-400 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
    <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
  </svg>
)

const Home = () => {
  const [statsRef, statsVisible] = useInView()
  const [featRef, featVisible] = useInView()
  const [testRef, testVisible] = useInView()
  const [blogRef] = useInView()


  return (
    <div className='min-h-screen'>

      {/* HERO */}
      <section className='relative min-h-screen flex items-center justify-center overflow-hidden'>
        <img src='https://nrb.net.in/img/t2.jpg' alt='hero' className='absolute inset-0 w-full h-full object-cover' />
        <div className='hero-overlay absolute inset-0' />

        <div className='absolute top-24 left-10 text-5xl animate-float opacity-40'>&#127807;</div>
        <div className='absolute top-40 right-16 text-4xl animate-float opacity-30'>&#127811;</div>
        <div className='absolute bottom-32 left-20 text-3xl animate-float opacity-25'>&#127793;</div>
        <div className='absolute bottom-20 right-24 text-4xl animate-float opacity-35'>&#127806;</div>

        <div className='relative z-10 text-center px-6 max-w-5xl mx-auto'>

          <div className='inline-flex items-center gap-2 bg-white/15 glass text-green-200 text-sm px-5 py-2 rounded-full mb-6 animate-fadeIn'>
            <span className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></span>
            Ancient Wisdom &middot; Modern Wellness
          </div>

          <h1 className='text-5xl md:text-7xl font-bold text-white leading-tight mb-6 animate-fadeInUp'>
            Heal Naturally with<br />
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-yellow-200 to-green-300'>
              Ayurvedic Care
            </span>
          </h1>

          <p className='text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto animate-fadeInUp'>
            Discover 5,000 years of healing wisdom. Connect with expert Ayurvedic doctors,
            explore natural medicines, and experience transformative treatments.
          </p>

          {/* BUTTONS */}
          <div className='animate-fadeInUp'>

            <div className='flex flex-col sm:flex-row items-center justify-center gap-3 mb-6'>

              {/* PRIMARY — solid white, green text */}
              <Link
                to='/doctors'
                className='group inline-flex items-center gap-2 bg-white text-green-800 font-bold text-base px-8 py-3.5 rounded-full shadow-xl hover:shadow-2xl hover:bg-green-50 hover:-translate-y-0.5 transition-all duration-200 active:scale-95 whitespace-nowrap'
              >
                Book a Doctor
                <span className='group-hover:translate-x-0.5 transition-transform duration-200'>
                  <ArrowRight />
                </span>
              </Link>

              {/* SECONDARY — green outline */}
              <Link
                to='/ai-health-analysis'
                className='group inline-flex items-center gap-2 border-2 border-white/60 text-white font-bold text-base px-8 py-3.5 rounded-full hover:bg-white hover:text-green-800 hover:border-white hover:-translate-y-0.5 transition-all duration-200 active:scale-95 whitespace-nowrap'
              >
                AI Health Analysis
                <span className='inline-block bg-white/25 group-hover:bg-green-100 group-hover:text-green-700 text-white text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full transition-colors'>
                  NEW
                </span>
              </Link>

              {/* TERTIARY — text link */}
              <Link
                to='/treatments'
                className='inline-flex items-center gap-1.5 text-white/75 font-semibold text-base hover:text-white transition-colors duration-200 whitespace-nowrap px-2'
              >
                Explore Treatments
                <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M9 5l7 7-7 7' />
                </svg>
              </Link>

            </div>

            {/* Trust strip */}
            <div className='flex flex-wrap items-center justify-center gap-x-5 gap-y-2'>
              {['5,000+ Patients Healed', '100% Secure & Private', 'Instant AI Results', 'Certified Experts'].map((t, i) => (
                <span key={i} className='flex items-center gap-1.5 text-white/45 text-xs font-medium'>
                  <CheckIcon />
                  {t}
                </span>
              ))}
            </div>

          </div>
        </div>

        <div className='absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/60 animate-bounce'>
          <span className='text-xs tracking-widest'>SCROLL</span>
          <div className='w-px h-8 bg-white/40'></div>
        </div>
      </section>

      {/* STATS */}
      <section ref={statsRef} className='bg-gradient-to-r from-green-800 to-green-900 py-16'>
        <div className='max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center'>
          {stats.map((s, i) => (
            <div key={i} className={`transition-all duration-700 ${statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${i * 120}ms` }}>
              <div className='text-4xl md:text-5xl font-bold text-white mb-1'>{s.value}</div>
              <div className='text-green-300 text-sm tracking-wide uppercase'>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT AYURVEDA */}
      <section className='py-24 bg-amber-50 leaf-bg'>
        <div className='max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center'>
          <div>
            <span className='text-green-600 font-semibold text-sm tracking-widest uppercase'>About Ayurveda</span>
            <h2 className='text-4xl md:text-5xl font-bold text-green-900 mt-3 mb-6 leading-tight'>
              The Science of Life &amp; Longevity
            </h2>
            <p className='text-gray-600 text-lg leading-relaxed mb-5'>
              Ayurveda, meaning <em>"Science of Life"</em>, is a 5,000-year-old holistic healing system from ancient India.
              It focuses on balancing the three doshas — <strong>Vata, Pitta, and Kapha</strong> — to achieve perfect health.
            </p>
            <p className='text-gray-600 leading-relaxed mb-8'>
              Unlike modern medicine that treats symptoms, Ayurveda addresses the root cause of disease through
              personalized diet, herbal medicines, yoga, meditation, and therapeutic treatments.
            </p>
            <div className='flex flex-wrap gap-3'>
              {['Vata Dosha', 'Pitta Dosha', 'Kapha Dosha', 'Prakriti', 'Dinacharya'].map(tag => (
                <span key={tag} className='bg-green-100 text-green-800 px-4 py-1.5 rounded-full text-sm font-medium'>{tag}</span>
              ))}
            </div>
          </div>
          <div className='relative'>
            <img src='https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=700&q=80' alt='Ayurveda' className='rounded-3xl shadow-2xl w-full object-cover h-96' />
            <div className='absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-5 flex items-center gap-4'>
              <div className='w-14 h-14 bg-green-100 rounded-full flex items-center justify-center text-2xl'>&#127942;</div>
              <div>
                <div className='font-bold text-green-900 text-lg'>5000+ Years</div>
                <div className='text-gray-500 text-sm'>of Healing Wisdom</div>
              </div>
            </div>
            <div className='absolute -top-6 -right-6 bg-green-700 rounded-2xl shadow-xl p-5 text-white text-center'>
              <div className='text-3xl font-bold'>98%</div>
              <div className='text-green-200 text-xs'>Patient Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section ref={featRef} className='py-24 bg-white'>
        <div className='max-w-6xl mx-auto px-6'>
          <div className='text-center mb-16'>
            <span className='text-green-600 font-semibold text-sm tracking-widest uppercase'>Why Choose Us</span>
            <h2 className='text-4xl font-bold text-green-900 mt-3'>Your Wellness, Our Priority</h2>
          </div>
          <div className='grid md:grid-cols-4 gap-8'>
            {features.map((f, i) => (
              <div key={i} className={`text-center p-8 rounded-2xl bg-gradient-to-b from-green-50 to-white border border-green-100 card-hover transition-all duration-700 ${featVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${i * 100}ms` }}>
                <div className='text-5xl mb-5'>{f.icon}</div>
                <h3 className='text-xl font-bold text-green-900 mb-3'>{f.title}</h3>
                <p className='text-gray-500 text-sm leading-relaxed'>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUICK LINKS */}
      <section className='py-20 bg-gray-50'>
        <div className='max-w-6xl mx-auto px-6'>
          <div className='text-center mb-12'>
            <span className='text-green-600 font-semibold text-sm tracking-widest uppercase'>Our Services</span>
            <h2 className='text-4xl font-bold text-green-900 mt-3'>Begin Your Healing Journey</h2>
            <p className='text-gray-500 mt-3 text-lg'>Explore our comprehensive Ayurvedic services</p>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {[
              {
                to: '/doctors',
                img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&h=400&fit=crop&q=80',
                badge: 'Consultation',
                badgeColor: 'bg-green-100 text-green-700',
                title: 'Find Doctors',
                desc: 'Book consultations with certified Ayurvedic experts',
                cta: 'Book Now',
                accent: 'group-hover:text-green-600',
              },
              {
                to: '/medicines',
                img: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&h=400&fit=crop&q=80',
                badge: '200+ Products',
                badgeColor: 'bg-amber-100 text-amber-700',
                title: 'Shop Medicines',
                desc: 'Browse authentic herbal formulations & supplements',
                cta: 'Shop Now',
                accent: 'group-hover:text-amber-600',
              },
              {
                to: '/treatments',
                img: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&h=400&fit=crop&q=80',
                badge: 'Therapies',
                badgeColor: 'bg-teal-100 text-teal-700',
                title: 'Book Treatments',
                desc: 'Experience traditional Panchakarma & Ayurvedic therapies',
                cta: 'Explore',
                accent: 'group-hover:text-teal-600',
              },
              {
                to: '/ai-health-analysis',
                img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop&q=80',
                badge: 'AI Powered',
                badgeColor: 'bg-purple-100 text-purple-700',
                title: 'AI Health Analysis',
                desc: 'Get personalised Ayurvedic insights powered by AI',
                cta: 'Try Free',
                accent: 'group-hover:text-purple-600',
              },
            ].map((item, i) => (
              <Link
                key={i}
                to={item.to}
                className='group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col'
              >
                {/* Image */}
                <div className='relative h-48 overflow-hidden'>
                  <img
                    src={item.img}
                    alt={item.title}
                    className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                  />
                  <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>
                {/* Content */}
                <div className='p-5 flex flex-col flex-1'>
                  <h3 className={`text-lg font-bold text-gray-900 mb-1.5 transition-colors duration-200 ${item.accent}`}>
                    {item.title}
                  </h3>
                  <p className='text-gray-500 text-sm leading-relaxed flex-1'>{item.desc}</p>
                  <div className='mt-4 flex items-center gap-1 text-sm font-semibold text-green-700'>
                    {item.cta}
                    <svg className='w-4 h-4 group-hover:translate-x-1 transition-transform duration-200' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2.5}>
                      <path strokeLinecap='round' strokeLinejoin='round' d='M17 8l4 4m0 0l-4 4m4-4H3' />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section ref={testRef} className='py-24 bg-amber-50 leaf-bg'>
        <div className='max-w-6xl mx-auto px-6'>
          <div className='text-center mb-16'>
            <span className='text-green-600 font-semibold text-sm tracking-widest uppercase'>Testimonials</span>
            <h2 className='text-4xl font-bold text-green-900 mt-3'>What Our Patients Say</h2>
          </div>
          <div className='grid md:grid-cols-3 gap-8'>
            {testimonials.map((t, i) => (
              <div key={i} className={`bg-white rounded-2xl p-8 shadow-lg card-hover transition-all duration-700 ${testVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${i * 150}ms` }}>
                <div className='text-yellow-400 text-xl mb-4'>&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                <p className='text-gray-600 leading-relaxed mb-6 italic'>"{t.text}"</p>
                <div className='flex items-center gap-3'>
                  <img src={t.avatar} alt={t.name} className='w-12 h-12 rounded-full object-cover ring-2 ring-green-200' />
                  <div>
                    <div className='font-bold text-green-900'>{t.name}</div>
                    <div className='text-gray-400 text-sm'>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG */}
      <section ref={blogRef} className='py-24 bg-white'>
        <div className='max-w-6xl mx-auto px-6'>
          <div className='text-center mb-16'>
            <span className='text-green-600 font-semibold text-sm tracking-widest uppercase'>Knowledge Hub</span>
            <h2 className='text-4xl font-bold text-green-900 mt-3'>Ayurvedic Insights</h2>
          </div>
          <div className='grid md:grid-cols-3 gap-8'>
            {blogs.map((b, i) => (
              <div key={i} className={`rounded-2xl overflow-hidden shadow-lg card-hover transition-all duration-700 ${blogRef ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: `${i * 150}ms` }}>
                <div className='relative overflow-hidden h-52'>
                  <img src={b.img} alt={b.title} className='w-full h-full object-cover hover:scale-110 transition-transform duration-500' />
                  <span className='absolute top-4 left-4 bg-green-700 text-white text-xs px-3 py-1 rounded-full'>{b.tag}</span>
                </div>
                <div className='p-6 bg-white'>
                  <h3 className='text-xl font-bold text-green-900 mb-3'>{b.title}</h3>
                  <button className='text-green-600 font-semibold text-sm hover:text-green-800 transition-colors'>Read More &#8594;</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className='py-20 bg-gradient-to-r from-green-700 to-green-900 text-center'>
        <div className='max-w-3xl mx-auto px-6'>
          <div className='text-5xl mb-4'>&#127807;</div>
          <h2 className='text-4xl font-bold text-white mb-4'>Ready to Start Your Wellness Journey?</h2>
          <p className='text-green-200 text-lg mb-8'>Book a free consultation with our Ayurvedic experts today.</p>
          <Link to='/contact' className='inline-block bg-white text-green-800 font-bold px-10 py-4 rounded-full text-lg shadow-2xl hover:scale-105 transition-all'>
            Get Free Consultation
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className='bg-green-950 text-white py-12'>
        <div className='max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-8'>
          <div>
            <div className='flex items-center gap-2 mb-4'>
              <span className='text-2xl'>&#127807;</span>
              <span className='text-xl font-bold font-serif'>AyurCare</span>
            </div>
            <p className='text-green-300 text-sm leading-relaxed'>Ancient Ayurvedic wisdom meets modern healthcare for your complete wellness.</p>
          </div>
          {[
            { title: 'Services', links: ['Doctors', 'Medicines', 'Treatments', 'Yoga Therapy'] },
            { title: 'Company', links: ['About Us', 'Blog', 'Careers', 'Press'] },
            { title: 'Support', links: ['Contact', 'FAQ', 'Privacy Policy', 'Terms'] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className='font-bold text-white mb-4 tracking-wide'>{col.title}</h4>
              <ul className='space-y-2'>
                {col.links.map(l => <li key={l}><button className='text-green-300 text-sm hover:text-white transition-colors bg-transparent border-none cursor-pointer p-0'>{l}</button></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className='max-w-6xl mx-auto px-6 mt-10 pt-6 border-t border-green-800 text-center text-green-400 text-sm'>
          &copy; 2024 AyurCare. All rights reserved. Made with &#128154; for holistic wellness.
        </div>
      </footer>

    </div>
  )
}

export default Home
