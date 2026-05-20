import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Doctor from './models/Doctor.js'
import Medicine from './models/Medicine.js'
import Treatment from './models/Treatment.js'

dotenv.config()

await mongoose.connect(process.env.MONGO_URI)
console.log('✅ Connected to MongoDB')

// ── DOCTORS ── Indian doctor portraits
await Doctor.deleteMany()
await Doctor.insertMany([
  {
    name: 'Dr. Arjun Sharma', specialty: 'Skin & Dermatology', experience: '15 yrs', rating: 4.9, patients: '2.1k', fee: 600,
    img: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?w=500&h=500&fit=crop&crop=faces&auto=format&q=80',
    about: 'Dr. Arjun Sharma is a renowned Ayurvedic dermatologist with 15 years of experience treating chronic skin conditions using classical Ayurvedic formulations.',
    education: 'BAMS, MD (Ayurveda) - BHU Varanasi', languages: ['Hindi', 'English'],
    timings: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM']
  },
  {
    name: 'Dr. Priya Nair', specialty: 'Panchakarma Specialist', experience: '12 yrs', rating: 4.8, patients: '1.8k', fee: 700,
    img: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=500&h=500&fit=crop&crop=faces&auto=format&q=80',
    about: 'Dr. Priya Nair specializes in Panchakarma detox therapies and has helped thousands of patients achieve complete body rejuvenation.',
    education: 'BAMS, MD Panchakarma - Kerala Ayurveda University', languages: ['Malayalam', 'English', 'Hindi'],
    timings: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM']
  },
  {
    name: 'Dr. Ramesh Gupta', specialty: 'Digestive Disorders', experience: '18 yrs', rating: 4.9, patients: '3.2k', fee: 500,
    img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&h=500&fit=crop&crop=faces&auto=format&q=80',
    about: 'Dr. Ramesh Gupta is an expert in treating IBS, acidity, and chronic digestive issues through Ayurvedic diet and herbal medicine.',
    education: 'BAMS, MD (Kayachikitsa) - Gujarat Ayurved University', languages: ['Hindi', 'Gujarati', 'English'],
    timings: ['10:00 AM', '11:00 AM', '12:00 PM', '3:00 PM', '4:00 PM', '5:00 PM']
  },
  {
    name: 'Dr. Sunita Verma', specialty: "Women's Health", experience: '10 yrs', rating: 4.7, patients: '1.5k', fee: 550,
    img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&h=500&fit=crop&crop=faces&auto=format&q=80',
    about: "Dr. Sunita Verma focuses on women's reproductive health, PCOS, and hormonal balance using Ayurvedic treatments.",
    education: 'BAMS, MD (Prasuti Tantra) - Rajasthan Ayurved University', languages: ['Hindi', 'English'],
    timings: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM']
  },
  {
    name: 'Dr. Vikram Patel', specialty: 'Orthopedics & Joints', experience: '20 yrs', rating: 5.0, patients: '4.0k', fee: 800,
    img: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=500&h=500&fit=crop&crop=faces&auto=format&q=80',
    about: 'Dr. Vikram Patel is a senior Ayurvedic orthopedic specialist treating arthritis, back pain, and joint disorders.',
    education: 'BAMS, MD (Shalya Tantra) - Pune University', languages: ['Marathi', 'Hindi', 'English'],
    timings: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM']
  },
  {
    name: 'Dr. Meena Iyer', specialty: 'Respiratory & Lungs', experience: '9 yrs', rating: 4.8, patients: '1.2k', fee: 500,
    img: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=500&h=500&fit=crop&crop=faces&auto=format&q=80',
    about: 'Dr. Meena Iyer treats asthma, bronchitis, and chronic respiratory conditions using classical Ayurvedic Rasayana therapies.',
    education: 'BAMS, MD (Kayachikitsa) - Manipal University', languages: ['Kannada', 'Tamil', 'English'],
    timings: ['10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM']
  },
  {
    name: 'Dr. Suresh Pillai', specialty: 'Neurological Disorders', experience: '22 yrs', rating: 4.9, patients: '3.8k', fee: 900,
    img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&h=500&fit=crop&crop=faces&auto=format&q=80',
    about: 'Dr. Suresh Pillai is a leading Ayurvedic neurologist treating migraine, paralysis, and stress disorders.',
    education: 'BAMS, MD (Manas Roga) - Kerala University', languages: ['Malayalam', 'Tamil', 'English'],
    timings: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM']
  },
  {
    name: 'Dr. Kavitha Rao', specialty: 'Pediatric Ayurveda', experience: '8 yrs', rating: 4.7, patients: '900', fee: 450,
    img: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=500&h=500&fit=crop&crop=faces&auto=format&q=80',
    about: "Dr. Kavitha Rao specializes in children's health, treating immunity issues and growth disorders.",
    education: 'BAMS, MD (Kaumarabhritya) - Bangalore University', languages: ['Kannada', 'Telugu', 'English'],
    timings: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM']
  },
  {
    name: 'Dr. Anand Mishra', specialty: 'Diabetes & Metabolism', experience: '14 yrs', rating: 4.8, patients: '2.5k', fee: 600,
    img: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=500&h=500&fit=crop&crop=faces&auto=format&q=80',
    about: 'Dr. Anand Mishra is an expert in managing Type 2 diabetes and metabolic disorders through Ayurvedic diet and herbs.',
    education: 'BAMS, MD (Kayachikitsa) - BHU Varanasi', languages: ['Hindi', 'English'],
    timings: ['10:00 AM', '11:00 AM', '12:00 PM', '3:00 PM', '4:00 PM']
  },
  {
    name: 'Dr. Lakshmi Devi', specialty: 'Mental Wellness & Yoga', experience: '11 yrs', rating: 4.9, patients: '2.0k', fee: 550,
    img: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=500&h=500&fit=crop&crop=faces&auto=format&q=80',
    about: 'Dr. Lakshmi Devi combines Ayurvedic psychiatry with yoga therapy to treat anxiety, depression, and insomnia.',
    education: 'BAMS, MD (Manas Roga), Yoga Certification - SVYASA', languages: ['Telugu', 'Hindi', 'English'],
    timings: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM']
  },
  {
    name: 'Dr. Harish Tiwari', specialty: 'Cardiac & Hypertension', experience: '17 yrs', rating: 4.8, patients: '2.9k', fee: 750,
    img: 'https://images.unsplash.com/photo-1612531386530-97286d97c2d2?w=500&h=500&fit=crop&crop=faces&auto=format&q=80',
    about: 'Dr. Harish Tiwari manages hypertension and heart disease using Ayurvedic Rasayana formulations.',
    education: 'BAMS, MD (Kayachikitsa) - Lucknow University', languages: ['Hindi', 'English'],
    timings: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM']
  },
  {
    name: 'Dr. Deepa Krishnan', specialty: 'Eye & ENT Care', experience: '13 yrs', rating: 4.7, patients: '1.7k', fee: 500,
    img: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=500&h=500&fit=crop&crop=faces&auto=format&q=80',
    about: 'Dr. Deepa Krishnan treats eye disorders, sinusitis, and ear conditions using Netra Tarpana and Nasya therapies.',
    education: 'BAMS, MD (Shalakya Tantra) - Chennai University', languages: ['Tamil', 'Telugu', 'English'],
    timings: ['10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM']
  },
])
console.log('✅ 12 Doctors seeded')

// ── MEDICINES ── guaranteed working Unsplash images, perfectly matched
await Medicine.deleteMany()
await Medicine.insertMany([
  {
    name: 'Ashwagandha', desc: 'Stress Relief & Immunity Booster', price: 499, original: 699, tag: 'Best Seller', category: 'Immunity',
    img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&h=400&fit=crop&auto=format&q=80'
  },
  {
    name: 'Triphala', desc: 'Digestive Health & Detox', price: 349, original: 450, tag: 'Popular', category: 'Digestion',
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=400&fit=crop&auto=format&q=80'
  },
  {
    name: 'Brahmi', desc: 'Memory & Brain Function', price: 399, original: 520, tag: 'New', category: 'Brain & Memory',
    img: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=500&h=400&fit=crop&auto=format&q=80'
  },
  {
    name: 'Neem Capsules', desc: 'Blood Purifier & Skin Care', price: 299, original: 399, tag: null, category: 'Skin Care',
    img: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=500&h=400&fit=crop&auto=format&q=80'
  },
  {
    name: 'Turmeric Extract', desc: 'Anti-inflammatory & Antioxidant', price: 449, original: 599, tag: 'Best Seller', category: 'Immunity',
    img: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=500&h=400&fit=crop&auto=format&q=80'
  },
  {
    name: 'Shatavari', desc: "Women's Hormonal Balance", price: 549, original: 699, tag: 'Popular', category: "Women's Health",
    img: 'https://images.unsplash.com/photo-1444930694458-01babf71870c?w=500&h=400&fit=crop&auto=format&q=80'
  },
  {
    name: 'Giloy Juice', desc: 'Immunity & Fever Relief', price: 279, original: 350, tag: null, category: 'Immunity',
    img: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=500&h=400&fit=crop&auto=format&q=80'
  },
  {
    name: 'Amla Powder', desc: 'Vitamin C & Hair Growth', price: 199, original: 280, tag: null, category: 'Skin Care',
    img: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=500&h=400&fit=crop&auto=format&q=80'
  },
  {
    name: 'Moringa Tablets', desc: 'Nutrition & Energy Booster', price: 379, original: 499, tag: 'New', category: 'Energy & Stamina',
    img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=400&fit=crop&auto=format&q=80'
  },
  {
    name: 'Chyawanprash', desc: 'Immunity & Respiratory Health', price: 599, original: 799, tag: 'Best Seller', category: 'Immunity',
    img: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&h=400&fit=crop&auto=format&q=80'
  },
  {
    name: 'Shilajit Resin', desc: 'Stamina & Vitality', price: 899, original: 1199, tag: 'Premium', category: 'Energy & Stamina',
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=400&fit=crop&auto=format&q=80'
  },
  {
    name: 'Haritaki Churna', desc: 'Colon Cleanse & Digestion', price: 249, original: 320, tag: null, category: 'Digestion',
    img: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=500&h=400&fit=crop&auto=format&q=80'
  },
])
console.log('✅ 12 Medicines seeded')

// ── TREATMENTS ── each image directly matches the therapy name
await Treatment.deleteMany()
await Treatment.insertMany([
  {
    name: 'Panchakarma', desc: 'Full body detoxification & rejuvenation therapy', duration: '7-21 days', benefit: 'Detox', price: 15000,
    // Ayurvedic full body treatment / herbal steam therapy
    img: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&h=400&fit=crop&auto=format&q=80',
    benefits: ['Complete body detox', 'Boosts immunity', 'Rejuvenates cells', 'Improves digestion', 'Reduces stress'],
    procedure: ['Initial consultation & Prakriti analysis', 'Purvakarma (preparatory procedures)', 'Pradhanakarma (main procedures)', 'Paschatkarma (post-treatment care)', 'Diet & lifestyle guidance'],
    faqs: [{ question: 'How long does Panchakarma take?', answer: 'A complete Panchakarma program typically takes 7 to 21 days depending on your health condition.' }, { question: 'Is Panchakarma safe?', answer: 'Yes, when performed by certified Ayurvedic practitioners, Panchakarma is completely safe.' }]
  },
  {
    name: 'Abhyanga', desc: 'Warm oil full-body massage for deep relaxation', duration: '60 min', benefit: 'Relaxation', price: 2000,
    // Full body oil massage — hands massaging back with oil
    img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=400&fit=crop&auto=format&q=80',
    benefits: ['Deep muscle relaxation', 'Improves circulation', 'Nourishes skin', 'Reduces fatigue', 'Calms nervous system'],
    procedure: ['Selection of medicated oil based on Prakriti', 'Warm oil application on full body', 'Rhythmic massage strokes', 'Steam therapy (optional)', 'Warm shower'],
    faqs: [{ question: 'How often should I get Abhyanga?', answer: 'Weekly sessions are recommended for general wellness.' }]
  },
  {
    name: 'Shirodhara', desc: 'Continuous warm oil flow on forehead for stress relief', duration: '45 min', benefit: 'Stress Relief', price: 2500,
    // Oil being poured on forehead — the signature shirodhara image
    img: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=600&h=400&fit=crop&auto=format&q=80',
    benefits: ['Relieves stress & anxiety', 'Improves sleep quality', 'Treats migraines', 'Enhances mental clarity', 'Balances nervous system'],
    procedure: ['Patient lies comfortably', 'Warm medicated oil poured in continuous stream on forehead', 'Duration: 30-45 minutes', 'Gentle head massage follows', 'Rest period'],
    faqs: [{ question: 'What conditions does Shirodhara treat?', answer: 'Shirodhara is highly effective for insomnia, anxiety, depression, migraines, and hypertension.' }]
  },
  {
    name: 'Nasya', desc: 'Nasal therapy for sinus & respiratory issues', duration: '30 min', benefit: 'Respiratory', price: 1200,
    // Nasal drops / face steam therapy
    img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&h=400&fit=crop&auto=format&q=80',
    benefits: ['Clears nasal passages', 'Treats sinusitis', 'Improves breathing', 'Enhances brain function', 'Treats headaches'],
    procedure: ['Face & neck massage with warm oil', 'Steam inhalation', 'Medicated oil drops instilled in nostrils', 'Gentle massage of sinus points', 'Gargling with herbal decoction'],
    faqs: [{ question: 'Is Nasya painful?', answer: 'No, Nasya is a gentle and comfortable procedure.' }]
  },
  {
    name: 'Kati Basti', desc: 'Warm medicated oil treatment for lower back pain', duration: '45 min', benefit: 'Pain Relief', price: 1800,
    // Back massage / lower back therapy
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&auto=format&q=80',
    benefits: ['Relieves lower back pain', 'Treats disc problems', 'Strengthens spine', 'Reduces inflammation', 'Improves flexibility'],
    procedure: ['Patient lies face down', 'Dough ring placed on lower back', 'Warm medicated oil poured inside ring', 'Oil maintained at therapeutic temperature', 'Gentle massage after treatment'],
    faqs: [{ question: 'How many sessions are needed?', answer: 'Typically 7-14 sessions are recommended for chronic back pain.' }]
  },
  {
    name: 'Udvartana', desc: 'Herbal powder massage for weight management', duration: '60 min', benefit: 'Weight Loss', price: 2200,
    // Herbal scrub / body powder massage
    img: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&h=400&fit=crop&auto=format&q=80',
    benefits: ['Reduces body fat', 'Improves skin texture', 'Detoxifies body', 'Reduces cellulite', 'Boosts metabolism'],
    procedure: ['Herbal powder preparation', 'Dry powder massage in upward strokes', 'Herbal paste application', 'Steam therapy', 'Warm shower'],
    faqs: [{ question: 'How many sessions for weight loss?', answer: 'A minimum of 14-21 sessions combined with diet changes shows significant results.' }]
  },
  {
    name: 'Netra Tarpana', desc: 'Eye rejuvenation therapy with medicated ghee', duration: '30 min', benefit: 'Eye Care', price: 1500,
    // Eye treatment / eye care close-up
    img: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&h=400&fit=crop&auto=format&q=80',
    benefits: ['Improves eyesight', 'Reduces eye strain', 'Treats dry eyes', 'Prevents eye diseases', 'Relaxes eye muscles'],
    procedure: ['Dough rings placed around eyes', 'Warm medicated ghee poured', 'Eyes opened and closed in ghee', 'Duration: 15-20 minutes', 'Gentle eye massage'],
    faqs: [{ question: 'Is Netra Tarpana safe for contact lens users?', answer: 'Contact lenses must be removed before the procedure.' }]
  },
  {
    name: 'Basti', desc: 'Medicated enema for deep colon cleansing', duration: '3-7 days', benefit: 'Colon Health', price: 3000,
    // Herbal decoction / ayurvedic treatment room
    img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=400&fit=crop&auto=format&q=80',
    benefits: ['Deep colon cleanse', 'Treats constipation', 'Balances Vata dosha', 'Improves absorption', 'Treats neurological issues'],
    procedure: ['Preparatory oil massage', 'Herbal decoction or oil enema', 'Retention for specified time', 'Elimination', 'Rest and light diet'],
    faqs: [{ question: 'Is Basti uncomfortable?', answer: 'Basti is performed gently by trained therapists. Most patients find it comfortable.' }]
  },
  {
    name: 'Pizhichil', desc: 'Royal oil bath for neuromuscular disorders', duration: '60-90 min', benefit: 'Neuro Care', price: 4000,
    // Warm oil being poured over body — royal oil bath
    img: 'https://images.unsplash.com/photo-1552693673-1bf958298935?w=600&h=400&fit=crop&auto=format&q=80',
    benefits: ['Treats paralysis', 'Relieves muscle spasms', 'Nourishes nervous system', 'Anti-aging benefits', 'Improves joint mobility'],
    procedure: ['Patient lies on wooden Droni', 'Warm medicated oil poured continuously', 'Two therapists perform synchronized massage', 'Duration: 60-90 minutes', 'Rest and light diet after'],
    faqs: [{ question: 'What is Pizhichil best for?', answer: 'Pizhichil is the best treatment for hemiplegia, paraplegia, and rheumatic diseases.' }]
  },
  {
    name: 'Yoga Therapy', desc: 'Customized yoga sessions for healing & wellness', duration: '60 min', benefit: 'Holistic', price: 1000,
    // Person doing yoga / meditation pose
    img: 'https://images.unsplash.com/photo-1506126279646-a697353d3166?w=600&h=400&fit=crop&auto=format&q=80',
    benefits: ['Improves flexibility', 'Reduces stress', 'Strengthens immunity', 'Balances hormones', 'Enhances mental clarity'],
    procedure: ['Initial health assessment', 'Customized asana sequence', 'Pranayama breathing exercises', 'Meditation session', 'Lifestyle guidance'],
    faqs: [{ question: 'Do I need prior yoga experience?', answer: 'No prior experience needed. Sessions are customized to your fitness level.' }]
  },
  {
    name: 'Marma Therapy', desc: 'Vital energy point stimulation for deep healing', duration: '45 min', benefit: 'Energy Flow', price: 2000,
    // Acupressure / energy point massage on body
    img: 'https://images.unsplash.com/photo-1591343395082-e120087004b4?w=600&h=400&fit=crop&auto=format&q=80',
    benefits: ['Unblocks energy channels', 'Relieves chronic pain', 'Boosts immunity', 'Improves organ function', 'Reduces inflammation'],
    procedure: ['Identification of affected Marma points', 'Gentle pressure and stimulation', 'Medicated oil application', 'Energy balancing techniques', 'Relaxation period'],
    faqs: [{ question: 'How many Marma points are there?', answer: 'There are 107 Marma points in the human body.' }]
  },
  {
    name: 'Raktamokshana', desc: 'Blood purification therapy for skin disorders', duration: '30 min', benefit: 'Blood Purify', price: 2500,
    // Herbal blood purification / leech therapy setup
    img: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop&auto=format&q=80',
    benefits: ['Purifies blood', 'Treats skin diseases', 'Reduces inflammation', 'Treats gout', 'Improves liver function'],
    procedure: ['Diagnosis and selection of method', 'Preparatory procedures', 'Leech therapy or venesection', 'Post-procedure care', 'Dietary guidelines'],
    faqs: [{ question: 'Is Raktamokshana painful?', answer: 'Leech therapy is virtually painless as leeches secrete a natural anesthetic.' }]
  },
])
console.log('✅ 12 Treatments seeded')

await mongoose.disconnect()
console.log('✅ All data seeded successfully! Database disconnected.')
process.exit(0)
