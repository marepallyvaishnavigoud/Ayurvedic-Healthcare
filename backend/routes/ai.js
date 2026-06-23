import express from 'express'
import OpenAI from 'openai'
import { protect } from '../middleware/auth.js'
import HealthAnalysis from '../models/HealthAnalysis.js'
import Medicine from '../models/Medicine.js'
import Treatment from '../models/Treatment.js'
import Doctor from '../models/Doctor.js'

const router = express.Router()

// Build the AI prompt from user data
const buildPrompt = (data) => `
You are an expert Ayurvedic doctor and health analyst. Analyze the following patient details and provide a comprehensive Ayurvedic health analysis.

PATIENT DETAILS:
- Name: ${data.personalDetails.name}
- Age: ${data.personalDetails.age}, Gender: ${data.personalDetails.gender}
- Height: ${data.personalDetails.height}, Weight: ${data.personalDetails.weight}

HEALTH DETAILS:
- Symptoms/Problems: ${data.healthDetails.symptoms}
- Existing Diseases: ${data.healthDetails.existingDiseases || 'None'}
- Allergies: ${data.healthDetails.allergies || 'None'}
- Current Medications: ${data.healthDetails.currentMedications || 'None'}
- Sleep Quality: ${data.healthDetails.sleepQuality}
- Stress Level: ${data.healthDetails.stressLevel}
- Food Habits: ${data.healthDetails.foodHabits}
- Water Intake: ${data.healthDetails.waterIntake}
- Physical Activity: ${data.healthDetails.activityLevel}
- Body Type (Prakriti): ${data.ayurvedaDetails.bodyType || 'Unknown'}
- Lifestyle Habits: ${data.ayurvedaDetails.lifestyleHabits || 'Not specified'}

Respond ONLY in this exact JSON format (no extra text):
{
  "problemAnalysis": "Detailed analysis of the health problem in 3-4 sentences",
  "ayurvedicExplanation": "Ayurvedic perspective on the condition including dosha imbalance in 3-4 sentences",
  "recommendedTreatments": ["Treatment 1", "Treatment 2", "Treatment 3", "Treatment 4"],
  "dietPlan": {
    "morningRoutine": "Specific morning routine with times",
    "breakfast": "Specific breakfast recommendations",
    "lunch": "Specific lunch recommendations",
    "evening": "Evening snack and routine",
    "dinner": "Specific dinner recommendations",
    "bedtime": "Bedtime routine and drinks",
    "herbalDrinks": "Specific herbal teas and drinks to consume",
    "foodsToAvoid": "List of foods to strictly avoid",
    "waterIntake": "Water intake recommendations"
  },
  "recommendedMedicines": ["Ashwagandha", "Triphala", "Brahmi"],
  "yogaRecommendations": ["Yoga pose 1 with benefit", "Yoga pose 2 with benefit", "Pranayama technique"],
  "dailyRoutine": ["6:00 AM - Wake up and drink warm water", "6:30 AM - Yoga and meditation", "Step 3", "Step 4", "Step 5"],
  "sleepRecommendations": "Specific sleep recommendations",
  "stressManagement": ["Tip 1", "Tip 2", "Tip 3"]
}
`

// Smart fallback when no OpenAI key — generates realistic Ayurvedic response
const generateFallbackResponse = (data) => {
  const symptoms = data.healthDetails.symptoms?.toLowerCase() || ''
  const stress = data.healthDetails.stressLevel?.toLowerCase() || ''
  const sleep = data.healthDetails.sleepQuality?.toLowerCase() || ''

  const hasStress = symptoms.includes('stress') || stress.includes('high') || stress.includes('severe')
  const hasSkin = symptoms.includes('skin') || symptoms.includes('acne') || symptoms.includes('rash')
  const hasDigestion = symptoms.includes('digest') || symptoms.includes('stomach') || symptoms.includes('acidity') || symptoms.includes('bloat')
  const hasJoint = symptoms.includes('joint') || symptoms.includes('back') || symptoms.includes('pain') || symptoms.includes('arthritis')
  const hasSleep = symptoms.includes('sleep') || sleep.includes('poor') || sleep.includes('bad')

  let treatments = ['Abhyanga (Oil Massage)', 'Shirodhara', 'Panchakarma', 'Yoga Therapy']
  let medicines = ['Ashwagandha', 'Triphala', 'Brahmi']
  let analysis = `Based on your symptoms of ${data.healthDetails.symptoms}, you appear to have an imbalance in your body's natural energies. Your lifestyle factors including ${data.healthDetails.stressLevel} stress levels and ${data.healthDetails.sleepQuality} sleep quality are contributing to your current health condition. A holistic Ayurvedic approach combining herbal medicines, dietary changes, and therapeutic treatments will help restore balance.`
  let ayurvedicExp = `According to Ayurveda, your symptoms indicate a Vata-Pitta imbalance. The irregular lifestyle, stress, and dietary habits have disturbed your Agni (digestive fire) leading to accumulation of Ama (toxins) in the body. Balancing these doshas through personalized Ayurvedic treatments, herbs, and lifestyle modifications will bring lasting relief.`

  if (hasStress || hasSleep) {
    treatments = ['Shirodhara', 'Abhyanga', 'Yoga Therapy', 'Nasya', 'Marma Therapy']
    medicines = ['Ashwagandha', 'Brahmi', 'Shatavari', 'Giloy Juice']
    analysis = `Your symptoms indicate significant stress and nervous system imbalance. The combination of high stress, poor sleep, and mental fatigue suggests a Vata-Pitta aggravation affecting your nervous system and mental health. Immediate intervention with calming Ayurvedic therapies and adaptogenic herbs is recommended.`
    ayurvedicExp = `In Ayurveda, your condition reflects a Vata imbalance in the Manovaha Srotas (mental channels). Excess Vata causes anxiety, insomnia, and mental restlessness. Shirodhara with medicated oils will calm the nervous system, while Ashwagandha and Brahmi will nourish the brain and reduce cortisol levels naturally.`
  } else if (hasSkin) {
    treatments = ['Raktamokshana', 'Panchakarma', 'Abhyanga', 'Udvartana']
    medicines = ['Neem Capsules', 'Turmeric Extract', 'Amla Powder', 'Triphala']
    analysis = `Your skin symptoms indicate blood impurities and Pitta dosha aggravation. Toxin accumulation in the blood (Rakta Dhatu) is manifesting as skin issues. A comprehensive blood purification program combined with anti-inflammatory herbs will address the root cause.`
    ayurvedicExp = `Ayurveda identifies your skin condition as Kushtha (skin disorder) caused by Pitta-Kapha imbalance and Ama accumulation in Rakta Dhatu. Raktamokshana (blood purification) and Neem-based formulations will cleanse the blood, while Turmeric's anti-inflammatory properties will heal the skin from within.`
  } else if (hasDigestion) {
    treatments = ['Basti', 'Panchakarma', 'Nasya', 'Yoga Therapy']
    medicines = ['Triphala', 'Haritaki Churna', 'Giloy Juice', 'Ashwagandha']
    analysis = `Your digestive symptoms indicate weakened Agni (digestive fire) and Vata-Pitta imbalance in the gastrointestinal tract. Irregular eating habits and stress have disrupted your digestive enzymes leading to incomplete digestion and toxin formation.`
    ayurvedicExp = `According to Ayurveda, your digestive issues stem from Mandagni (weak digestive fire) and Vata aggravation in the Pakwashaya (large intestine). Basti therapy will cleanse the colon, while Triphala will regulate bowel movements and restore digestive balance naturally.`
  } else if (hasJoint) {
    treatments = ['Kati Basti', 'Abhyanga', 'Pizhichil', 'Panchakarma']
    medicines = ['Ashwagandha', 'Shilajit Resin', 'Triphala', 'Turmeric Extract']
    analysis = `Your joint and pain symptoms indicate Vata aggravation and inflammation in the musculoskeletal system. Degeneration of joint tissues (Asthi Dhatu) combined with Ama accumulation is causing pain and stiffness.`
    ayurvedicExp = `In Ayurveda, joint disorders are classified as Sandhivata (osteoarthritis) or Amavata (rheumatoid arthritis) caused by Vata-Ama imbalance. Kati Basti with warm medicated oils will nourish the joints, while Shilajit and Ashwagandha will strengthen bones and reduce inflammation.`
  }

  return {
    problemAnalysis: analysis,
    ayurvedicExplanation: ayurvedicExp,
    recommendedTreatments: treatments,
    dietPlan: {
      morningRoutine: 'Wake up at 6:00 AM. Drink 2 glasses of warm water with lemon. Practice oil pulling with sesame oil for 10 minutes. Scrape tongue with copper tongue scraper.',
      breakfast: 'Warm oatmeal with dates and almonds, or moong dal khichdi. Avoid cold foods. Include ginger tea with honey. Fresh seasonal fruits (avoid citrus if Pitta is high).',
      lunch: 'Largest meal of the day between 12-1 PM. Include rice, dal, seasonal vegetables, and ghee. Add digestive spices like cumin, coriander, and turmeric. Include buttermilk (takra).',
      evening: '4-5 PM: Light snack of roasted seeds or fruits. Herbal tea with tulsi and ginger. Avoid heavy snacks and fried foods.',
      dinner: 'Light dinner before 7:30 PM. Warm soups, khichdi, or steamed vegetables. Avoid raw salads at night. Include warm milk with turmeric and ashwagandha before bed.',
      bedtime: 'Drink warm turmeric milk (golden milk) 30 minutes before sleep. Apply warm sesame oil on feet. Practice deep breathing for 5 minutes.',
      herbalDrinks: 'Morning: Warm water with lemon and honey. Mid-morning: Tulsi-ginger tea. Afternoon: Coriander-cumin-fennel tea. Evening: Ashwagandha milk. Night: Turmeric golden milk.',
      foodsToAvoid: 'Cold and refrigerated foods, processed and packaged foods, excessive spicy and oily foods, alcohol and caffeine, white sugar and refined flour, incompatible food combinations (milk with fish/meat).',
      waterIntake: 'Drink 8-10 glasses of warm or room temperature water daily. Avoid ice-cold water. Sip water throughout the day rather than drinking large amounts at once.',
    },
    recommendedMedicines: medicines,
    yogaRecommendations: [
      'Surya Namaskar (Sun Salutation) — 12 rounds daily for overall health and energy',
      'Balasana (Child\'s Pose) — 5 minutes for stress relief and back pain',
      'Bhujangasana (Cobra Pose) — strengthens spine and improves digestion',
      'Anulom Vilom Pranayama — 10 minutes daily for mental clarity and stress reduction',
      'Shavasana (Corpse Pose) — 10 minutes for deep relaxation and nervous system reset',
      'Nadi Shodhana — alternate nostril breathing for dosha balance',
    ],
    dailyRoutine: [
      '5:30-6:00 AM — Wake up (Brahma Muhurta). Drink warm water. Practice gratitude.',
      '6:00-6:30 AM — Oil pulling, tongue scraping, and face washing with herbal water.',
      '6:30-7:30 AM — Yoga, pranayama, and meditation session.',
      '8:00-8:30 AM — Nutritious Ayurvedic breakfast.',
      '12:00-1:00 PM — Largest meal of the day with digestive spices.',
      '2:00-2:30 PM — Short walk after lunch (Vajrasana for 10 minutes).',
      '4:00-5:00 PM — Light herbal tea and evening walk.',
      '7:00-7:30 PM — Light dinner.',
      '9:00-9:30 PM — Self-massage (Abhyanga) with warm oil.',
      '10:00 PM — Sleep. Ensure 7-8 hours of quality sleep.',
    ],
    sleepRecommendations: 'Maintain a consistent sleep schedule, going to bed by 10 PM and waking by 6 AM. Create a calming bedtime routine: warm bath, gentle massage with brahmi oil on scalp, and warm turmeric milk. Keep bedroom cool, dark, and quiet. Avoid screens 1 hour before bed. Practice Yoga Nidra for deep relaxation.',
    stressManagement: [
      'Practice Transcendental Meditation for 20 minutes twice daily',
      'Shirodhara therapy weekly for deep nervous system relaxation',
      'Ashwagandha supplement daily to reduce cortisol levels',
      'Spend time in nature — walk barefoot on grass (Earthing)',
      'Practice Pranayama: Bhramari (humming bee breath) for instant calm',
      'Journaling before bed to release mental tension',
    ],
  }
}

// POST /api/ai/analyze
router.post('/analyze', protect, async (req, res) => {
  try {
    const { personalDetails, healthDetails, ayurvedaDetails } = req.body

    let aiResponse

    // Try OpenAI if key is configured
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
      try {
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: buildPrompt(req.body) }],
          temperature: 0.7,
          max_tokens: 2000,
        })
        const raw = completion.choices[0].message.content
        aiResponse = JSON.parse(raw)
      } catch {
        aiResponse = generateFallbackResponse(req.body)
      }
    } else {
      // Use smart fallback
      aiResponse = generateFallbackResponse(req.body)
    }

    // Fetch matching medicines from DB
    const allMedicines = await Medicine.find()
    const matchedMedicines = allMedicines.filter(m =>
      aiResponse.recommendedMedicines?.some(name =>
        m.name.toLowerCase().includes(name.toLowerCase()) ||
        name.toLowerCase().includes(m.name.toLowerCase())
      )
    ).slice(0, 4)

    // Fetch matching treatments from DB
    const allTreatments = await Treatment.find()
    const matchedTreatments = allTreatments.filter(t =>
      aiResponse.recommendedTreatments?.some(name =>
        t.name.toLowerCase().includes(name.toLowerCase()) ||
        name.toLowerCase().includes(t.name.toLowerCase())
      )
    ).slice(0, 4)

    // Fetch recommended doctors
    const doctors = await Doctor.find().limit(3)

    // Save to MongoDB
    const analysis = await HealthAnalysis.create({
      user: req.user._id,
      personalDetails,
      healthDetails,
      ayurvedaDetails,
      aiResponse,
    })

    res.json({
      analysisId: analysis._id,
      aiResponse,
      matchedMedicines,
      matchedTreatments,
      recommendedDoctors: doctors,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/ai/history
router.get('/history', protect, async (req, res) => {
  try {
    const history = await HealthAnalysis.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json(history)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/ai/history/:id
router.get('/history/:id', protect, async (req, res) => {
  try {
    const analysis = await HealthAnalysis.findById(req.params.id)
    if (!analysis) return res.status(404).json({ message: 'Not found' })
    res.json(analysis)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
