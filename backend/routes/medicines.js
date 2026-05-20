import express from 'express'
import Medicine from '../models/Medicine.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    res.json(await Medicine.find())
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const med = await Medicine.findById(req.params.id)
    if (!med) return res.status(404).json({ message: 'Not found' })
    res.json(med)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/seed', async (req, res) => {
  try {
    await Medicine.deleteMany()
    const data = [
      { name: 'Ashwagandha', desc: 'Stress Relief & Immunity Booster', price: 499, original: 699, tag: 'Best Seller', img: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400&h=300&fit=crop', category: 'Immunity' },
      { name: 'Triphala', desc: 'Digestive Health & Detox', price: 349, original: 450, tag: 'Popular', img: 'https://images.unsplash.com/photo-1611241893603-3c359704e0ee?w=400&h=300&fit=crop', category: 'Digestion' },
      { name: 'Brahmi', desc: 'Memory & Brain Function', price: 399, original: 520, tag: 'New', img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop', category: 'Brain & Memory' },
      { name: 'Neem Capsules', desc: 'Blood Purifier & Skin Care', price: 299, original: 399, tag: null, img: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=300&fit=crop', category: 'Skin Care' },
      { name: 'Turmeric Extract', desc: 'Anti-inflammatory & Antioxidant', price: 449, original: 599, tag: 'Best Seller', img: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&h=300&fit=crop', category: 'Immunity' },
      { name: 'Shatavari', desc: "Women's Hormonal Balance", price: 549, original: 699, tag: 'Popular', img: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=400&h=300&fit=crop', category: "Women's Health" },
      { name: 'Giloy Juice', desc: 'Immunity & Fever Relief', price: 279, original: 350, tag: null, img: 'https://images.unsplash.com/photo-1622597467836-f3e6707a1e91?w=400&h=300&fit=crop', category: 'Immunity' },
      { name: 'Amla Powder', desc: 'Vitamin C & Hair Growth', price: 199, original: 280, tag: null, img: 'https://images.unsplash.com/photo-1563746924237-f81d2a3d3c8b?w=400&h=300&fit=crop', category: 'Skin Care' },
      { name: 'Moringa Tablets', desc: 'Nutrition & Energy Booster', price: 379, original: 499, tag: 'New', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop', category: 'Energy & Stamina' },
      { name: 'Chyawanprash', desc: 'Immunity & Respiratory Health', price: 599, original: 799, tag: 'Best Seller', img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=300&fit=crop', category: 'Immunity' },
      { name: 'Shilajit Resin', desc: 'Stamina & Vitality', price: 899, original: 1199, tag: 'Premium', img: 'https://images.unsplash.com/photo-1559181567-c3190bfbf4f4?w=400&h=300&fit=crop', category: 'Energy & Stamina' },
      { name: 'Haritaki Churna', desc: 'Colon Cleanse & Digestion', price: 249, original: 320, tag: null, img: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=400&h=300&fit=crop', category: 'Digestion' },
    ]
    const meds = await Medicine.insertMany(data)
    res.json({ message: `${meds.length} medicines seeded` })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
