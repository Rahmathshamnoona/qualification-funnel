import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Funnel from './Funnel'
import { Ops } from './screens/Ops'
import { Privacy, Terms } from './screens/Legal'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/ops" element={<Ops />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/privacy-policy" element={<Navigate to="/privacy" replace />} />
        <Route path="/*" element={<Funnel />} />
      </Routes>
    </BrowserRouter>
  )
}
