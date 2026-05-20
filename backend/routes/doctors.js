import express from 'express'
import Doctor from '../models/Doctor.js'

const router = express.Router()

// GET /api/doctors
router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find()
    res.json(doctors)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/doctors/:id
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' })
    res.json(doctor)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/doctors/seed  (run once to populate DB)
router.post('/seed', async (req, res) => {
  try {
    await Doctor.deleteMany()
    const data = [
      { name: 'Dr. Arjun Sharma', specialty: 'Skin & Dermatology', experience: '15 yrs', rating: 4.9, patients: '2.1k', fee: 600, img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face', about: 'Dr. Arjun Sharma is a renowned Ayurvedic dermatologist with 15 years of experience treating chronic skin conditions using classical Ayurvedic formulations.', education: 'BAMS, MD (Ayurveda) - BHU Varanasi', languages: ['Hindi', 'English'], timings: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'] },
      { name: 'Dr. Priya Nair', specialty: 'Panchakarma Specialist', experience: '12 yrs', rating: 4.8, patients: '1.8k', fee: 700, img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face', about: 'Dr. Priya Nair specializes in Panchakarma detox therapies and has helped thousands of patients achieve complete body rejuvenation.', education: 'BAMS, MD Panchakarma - Kerala Ayurveda University', languages: ['Malayalam', 'English', 'Hindi'], timings: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM'] },
      { name: 'Dr. Ramesh Gupta', specialty: 'Digestive Disorders', experience: '18 yrs', rating: 4.9, patients: '3.2k', fee: 500, img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=face', about: 'Dr. Ramesh Gupta is an expert in treating IBS, acidity, and chronic digestive issues through Ayurvedic diet and herbal medicine.', education: 'BAMS, MD (Kayachikitsa) - Gujarat Ayurved University', languages: ['Hindi', 'Gujarati', 'English'], timings: ['10:00 AM', '11:00 AM', '12:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'] },
      { name: 'Dr. Sunita Verma', specialty: "Women's Health", experience: '10 yrs', rating: 4.7, patients: '1.5k', fee: 550, img: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face', about: "Dr. Sunita Verma focuses on women's reproductive health, PCOS, and hormonal balance using Ayurvedic treatments.", education: 'BAMS, MD (Prasuti Tantra) - Rajasthan Ayurved University', languages: ['Hindi', 'English'], timings: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM'] },
      { name: 'Dr. Vikram Patel', specialty: 'Orthopedics & Joints', experience: '20 yrs', rating: 5.0, patients: '4.0k', fee: 800, img: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop&crop=face', about: 'Dr. Vikram Patel is a senior Ayurvedic orthopedic specialist treating arthritis, back pain, and joint disorders with Panchakarma and herbal therapies.', education: 'BAMS, MD (Shalya Tantra) - Pune University', languages: ['Marathi', 'Hindi', 'English'], timings: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'] },
      { name: 'Dr. Meena Iyer', specialty: 'Respiratory & Lungs', experience: '9 yrs', rating: 4.8, patients: '1.2k', fee: 500, img: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&h=400&fit=crop&crop=face', about: 'Dr. Meena Iyer treats asthma, bronchitis, and chronic respiratory conditions using classical Ayurvedic Rasayana therapies.', education: 'BAMS, MD (Kayachikitsa) - Manipal University', languages: ['Kannada', 'Tamil', 'English'], timings: ['10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'] },
      { name: 'Dr. Suresh Pillai', specialty: 'Neurological Disorders', experience: '22 yrs', rating: 4.9, patients: '3.8k', fee: 900, img: 'https://images.unsplash.com/photo-1612531386530-97286d97c2d2?w=400&h=400&fit=crop&crop=face', about: 'Dr. Suresh Pillai is a leading Ayurvedic neurologist treating migraine, paralysis, and stress disorders with Shirodhara and Nasya therapies.', education: 'BAMS, MD (Manas Roga) - Kerala University', languages: ['Malayalam', 'Tamil', 'English'], timings: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM'] },
      { name: 'Dr. Kavitha Rao', specialty: 'Pediatric Ayurveda', experience: '8 yrs', rating: 4.7, patients: '900', fee: 450, img: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400&h=400&fit=crop&crop=face', about: "Dr. Kavitha Rao specializes in children's health, treating immunity issues, growth disorders, and childhood diseases with gentle Ayurvedic remedies.", education: 'BAMS, MD (Kaumarabhritya) - Bangalore University', languages: ['Kannada', 'Telugu', 'English'], timings: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM'] },
      { name: 'Dr. Anand Mishra', specialty: 'Diabetes & Metabolism', experience: '14 yrs', rating: 4.8, patients: '2.5k', fee: 600, img: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face', about: 'Dr. Anand Mishra is an expert in managing Type 2 diabetes, obesity, and metabolic disorders through Ayurvedic diet, herbs, and lifestyle changes.', education: 'BAMS, MD (Kayachikitsa) - BHU Varanasi', languages: ['Hindi', 'English'], timings: ['10:00 AM', '11:00 AM', '12:00 PM', '3:00 PM', '4:00 PM'] },
      { name: 'Dr. Lakshmi Devi', specialty: 'Mental Wellness & Yoga', experience: '11 yrs', rating: 4.9, patients: '2.0k', fee: 550, img: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&h=400&fit=crop&crop=face', about: 'Dr. Lakshmi Devi combines Ayurvedic psychiatry with yoga therapy to treat anxiety, depression, insomnia, and stress-related disorders.', education: 'BAMS, MD (Manas Roga), Yoga Certification - SVYASA', languages: ['Telugu', 'Hindi', 'English'], timings: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'] },
      { name: 'Dr. Harish Tiwari', specialty: 'Cardiac & Hypertension', experience: '17 yrs', rating: 4.8, patients: '2.9k', fee: 750, img: 'https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=400&h=400&fit=crop&crop=face', about: 'Dr. Harish Tiwari manages hypertension, heart disease, and cholesterol using Ayurvedic Rasayana and Hridaya (cardiac) formulations.', education: 'BAMS, MD (Kayachikitsa) - Lucknow University', languages: ['Hindi', 'English'], timings: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM'] },
      { name: 'Dr. Deepa Krishnan', specialty: 'Eye & ENT Care', experience: '13 yrs', rating: 4.7, patients: '1.7k', fee: 500, img: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=400&fit=crop&crop=face', about: 'Dr. Deepa Krishnan treats eye disorders, sinusitis, and ear conditions using Netra Tarpana, Nasya, and Karnapurana therapies.', education: 'BAMS, MD (Shalakya Tantra) - Chennai University', languages: ['Tamil', 'Telugu', 'English'], timings: ['10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'] },
    ]
    const doctors = await Doctor.insertMany(data)
    res.json({ message: `${doctors.length} doctors seeded`, doctors })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
