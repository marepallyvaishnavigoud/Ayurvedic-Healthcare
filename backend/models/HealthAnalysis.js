import mongoose from 'mongoose'

const healthAnalysisSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  personalDetails: {
    name: String, age: String, gender: String, height: String, weight: String,
  },
  healthDetails: {
    symptoms: String,
    existingDiseases: String,
    allergies: String,
    currentMedications: String,
    sleepQuality: String,
    stressLevel: String,
    foodHabits: String,
    waterIntake: String,
    activityLevel: String,
  },
  ayurvedaDetails: {
    bodyType: String,
    lifestyleHabits: String,
  },
  aiResponse: {
    problemAnalysis: String,
    ayurvedicExplanation: String,
    recommendedTreatments: [String],
    dietPlan: {
      morningRoutine: String,
      breakfast: String,
      lunch: String,
      evening: String,
      dinner: String,
      bedtime: String,
      herbalDrinks: String,
      foodsToAvoid: String,
      waterIntake: String,
    },
    recommendedMedicines: [String],
    yogaRecommendations: [String],
    dailyRoutine: [String],
    sleepRecommendations: String,
    stressManagement: [String],
  },
}, { timestamps: true })

export default mongoose.model('HealthAnalysis', healthAnalysisSchema)
