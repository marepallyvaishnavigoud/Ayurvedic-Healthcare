import express from 'express'
import Treatment from '../models/Treatment.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    res.json(await Treatment.find())
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const t = await Treatment.findById(req.params.id)
    if (!t) return res.status(404).json({ message: 'Not found' })
    res.json(t)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/seed', async (req, res) => {
  try {
    await Treatment.deleteMany()
    const data = [
      { name: 'Panchakarma', desc: 'Full body detoxification & rejuvenation therapy', duration: '7-21 days', benefit: 'Detox', price: 15000, img: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&h=300&fit=crop', benefits: ['Complete body detox', 'Boosts immunity', 'Rejuvenates cells', 'Improves digestion', 'Reduces stress'], procedure: ['Initial consultation & Prakriti analysis', 'Purvakarma (preparatory procedures)', 'Pradhanakarma (main procedures)', 'Paschatkarma (post-treatment care)', 'Diet & lifestyle guidance'], faqs: [{ question: 'How long does Panchakarma take?', answer: 'A complete Panchakarma program typically takes 7 to 21 days depending on your health condition.' }, { question: 'Is Panchakarma safe?', answer: 'Yes, when performed by certified Ayurvedic practitioners, Panchakarma is completely safe.' }] },
      { name: 'Abhyanga', desc: 'Warm oil full-body massage for deep relaxation', duration: '60 min', benefit: 'Relaxation', price: 2000, img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop', benefits: ['Deep muscle relaxation', 'Improves circulation', 'Nourishes skin', 'Reduces fatigue', 'Calms nervous system'], procedure: ['Selection of medicated oil based on Prakriti', 'Warm oil application on full body', 'Rhythmic massage strokes', 'Steam therapy (optional)', 'Warm shower'], faqs: [{ question: 'How often should I get Abhyanga?', answer: 'Weekly sessions are recommended for general wellness. Daily self-massage is also beneficial.' }] },
      { name: 'Shirodhara', desc: 'Continuous warm oil flow on forehead for stress relief', duration: '45 min', benefit: 'Stress Relief', price: 2500, img: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=400&h=300&fit=crop', benefits: ['Relieves stress & anxiety', 'Improves sleep quality', 'Treats migraines', 'Enhances mental clarity', 'Balances nervous system'], procedure: ['Patient lies comfortably', 'Warm medicated oil poured in continuous stream on forehead', 'Duration: 30-45 minutes', 'Gentle head massage follows', 'Rest period'], faqs: [{ question: 'What conditions does Shirodhara treat?', answer: 'Shirodhara is highly effective for insomnia, anxiety, depression, migraines, and hypertension.' }] },
      { name: 'Nasya', desc: 'Nasal therapy for sinus & respiratory issues', duration: '30 min', benefit: 'Respiratory', price: 1200, img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop', benefits: ['Clears nasal passages', 'Treats sinusitis', 'Improves breathing', 'Enhances brain function', 'Treats headaches'], procedure: ['Face & neck massage with warm oil', 'Steam inhalation', 'Medicated oil drops instilled in nostrils', 'Gentle massage of sinus points', 'Gargling with herbal decoction'], faqs: [{ question: 'Is Nasya painful?', answer: 'No, Nasya is a gentle and comfortable procedure. You may feel mild warmth in the nasal passages.' }] },
      { name: 'Kati Basti', desc: 'Warm medicated oil treatment for lower back pain', duration: '45 min', benefit: 'Pain Relief', price: 1800, img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop', benefits: ['Relieves lower back pain', 'Treats disc problems', 'Strengthens spine', 'Reduces inflammation', 'Improves flexibility'], procedure: ['Patient lies face down', 'Dough ring placed on lower back', 'Warm medicated oil poured inside ring', 'Oil maintained at therapeutic temperature', 'Gentle massage after treatment'], faqs: [{ question: 'How many sessions are needed?', answer: 'Typically 7-14 sessions are recommended for chronic back pain conditions.' }] },
      { name: 'Udvartana', desc: 'Herbal powder massage for weight management', duration: '60 min', benefit: 'Weight Loss', price: 2200, img: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400&h=300&fit=crop', benefits: ['Reduces body fat', 'Improves skin texture', 'Detoxifies body', 'Reduces cellulite', 'Boosts metabolism'], procedure: ['Herbal powder preparation', 'Dry powder massage in upward strokes', 'Herbal paste application', 'Steam therapy', 'Warm shower'], faqs: [{ question: 'How many sessions for weight loss?', answer: 'A minimum of 14-21 sessions combined with diet changes shows significant results.' }] },
      { name: 'Netra Tarpana', desc: 'Eye rejuvenation therapy with medicated ghee', duration: '30 min', benefit: 'Eye Care', price: 1500, img: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=300&fit=crop', benefits: ['Improves eyesight', 'Reduces eye strain', 'Treats dry eyes', 'Prevents eye diseases', 'Relaxes eye muscles'], procedure: ['Dough rings placed around eyes', 'Warm medicated ghee poured', 'Eyes opened and closed in ghee', 'Duration: 15-20 minutes', 'Gentle eye massage'], faqs: [{ question: 'Is Netra Tarpana safe for contact lens users?', answer: 'Contact lenses must be removed before the procedure. It is completely safe for lens users.' }] },
      { name: 'Basti', desc: 'Medicated enema for deep colon cleansing', duration: '3-7 days', benefit: 'Colon Health', price: 3000, img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop', benefits: ['Deep colon cleanse', 'Treats constipation', 'Balances Vata dosha', 'Improves absorption', 'Treats neurological issues'], procedure: ['Preparatory oil massage', 'Herbal decoction or oil enema', 'Retention for specified time', 'Elimination', 'Rest and light diet'], faqs: [{ question: 'Is Basti uncomfortable?', answer: 'Basti is performed gently by trained therapists. Most patients find it comfortable and relieving.' }] },
      { name: 'Pizhichil', desc: 'Royal oil bath for neuromuscular disorders', duration: '60-90 min', benefit: 'Neuro Care', price: 4000, img: 'https://images.unsplash.com/photo-1552693673-1bf958298935?w=400&h=300&fit=crop', benefits: ['Treats paralysis', 'Relieves muscle spasms', 'Nourishes nervous system', 'Anti-aging benefits', 'Improves joint mobility'], procedure: ['Patient lies on wooden Droni', 'Warm medicated oil poured continuously', 'Two therapists perform synchronized massage', 'Duration: 60-90 minutes', 'Rest and light diet after'], faqs: [{ question: 'What is Pizhichil best for?', answer: 'Pizhichil is the best treatment for hemiplegia, paraplegia, rheumatic diseases, and nervous disorders.' }] },
      { name: 'Yoga Therapy', desc: 'Customized yoga sessions for healing & wellness', duration: '60 min', benefit: 'Holistic', price: 1000, img: 'https://images.unsplash.com/photo-1506126279646-a697353d3166?w=400&h=300&fit=crop', benefits: ['Improves flexibility', 'Reduces stress', 'Strengthens immunity', 'Balances hormones', 'Enhances mental clarity'], procedure: ['Initial health assessment', 'Customized asana sequence', 'Pranayama breathing exercises', 'Meditation session', 'Lifestyle guidance'], faqs: [{ question: 'Do I need prior yoga experience?', answer: 'No prior experience needed. Sessions are customized to your fitness level and health condition.' }] },
      { name: 'Marma Therapy', desc: 'Vital energy point stimulation for deep healing', duration: '45 min', benefit: 'Energy Flow', price: 2000, img: 'https://images.unsplash.com/photo-1591343395082-e120087004b4?w=400&h=300&fit=crop', benefits: ['Unblocks energy channels', 'Relieves chronic pain', 'Boosts immunity', 'Improves organ function', 'Reduces inflammation'], procedure: ['Identification of affected Marma points', 'Gentle pressure and stimulation', 'Medicated oil application', 'Energy balancing techniques', 'Relaxation period'], faqs: [{ question: 'How many Marma points are there?', answer: 'There are 107 Marma points in the human body, each connected to specific organs and systems.' }] },
      { name: 'Raktamokshana', desc: 'Blood purification therapy for skin disorders', duration: '30 min', benefit: 'Blood Purify', price: 2500, img: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop', benefits: ['Purifies blood', 'Treats skin diseases', 'Reduces inflammation', 'Treats gout', 'Improves liver function'], procedure: ['Diagnosis and selection of method', 'Preparatory procedures', 'Leech therapy or venesection', 'Post-procedure care', 'Dietary guidelines'], faqs: [{ question: 'Is Raktamokshana painful?', answer: 'Leech therapy is virtually painless as leeches secrete a natural anesthetic. Venesection is done under local anesthesia.' }] },
    ]
    const treatments = await Treatment.insertMany(data)
    res.json({ message: `${treatments.length} treatments seeded` })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
