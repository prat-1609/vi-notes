import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import EditorPage from './pages/EditorPage'
import ReportPage from './pages/ReportPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/editor" element={<EditorPage />} />
      <Route path="/report" element={<ReportPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}