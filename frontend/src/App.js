import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Medicines from './pages/Medicines'
import Treatments from './pages/Treatments'
import Contact from './pages/Contact'
import AuthPage from './pages/AuthPage'
import DoctorDetails from './pages/DoctorDetails'
import TreatmentDetails from './pages/TreatmentDetails'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderSuccess from './pages/OrderSuccess'
import MyAppointments from './pages/MyAppointments'
import MyOrders from './pages/MyOrders'
import MyTreatmentBookings from './pages/MyTreatmentBookings'
import AIHealthAnalysis from './pages/AIHealthAnalysis'
import AIAnalysisHistory from './pages/AIAnalysisHistory'

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth()
  return user ? children : <Navigate to='/auth' replace />
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/doctors' element={<Doctors />} />
        <Route path='/doctors/:id' element={<DoctorDetails />} />
        <Route path='/medicines' element={<Medicines />} />
        <Route path='/treatments' element={<Treatments />} />
        <Route path='/treatments/:id' element={<TreatmentDetails />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/auth' element={<AuthPage />} />
        <Route path='/cart' element={<CartPage />} />
        <Route path='/checkout' element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path='/order-success' element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
        <Route path='/my-appointments' element={<ProtectedRoute><MyAppointments /></ProtectedRoute>} />
        <Route path='/my-orders' element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
        <Route path='/my-treatment-bookings' element={<ProtectedRoute><MyTreatmentBookings /></ProtectedRoute>} />
        <Route path='/ai-health-analysis' element={<ProtectedRoute><AIHealthAnalysis /></ProtectedRoute>} />
        <Route path='/ai-analysis-history' element={<ProtectedRoute><AIAnalysisHistory /></ProtectedRoute>} />
        <Route path='/ai-analysis-history/:id' element={<ProtectedRoute><AIAnalysisHistory detailOnly /></ProtectedRoute>} />

      </Routes>
      <Toaster position='top-right' toastOptions={{ style: { borderRadius: '12px', fontFamily: 'Inter, sans-serif', fontSize: '14px' }, success: { iconTheme: { primary: '#15803d', secondary: '#fff' } } }} />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
