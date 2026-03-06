import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Activity from './pages/Activity'
import Masterlist from './pages/Masterlist'
import WOC from './pages/WOC'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/" element={<Navigate to="/activity" replace />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/activity" element={<Activity />} />
                <Route path="/masterlist" element={<Masterlist />} />
                <Route path="/woc" element={<WOC />} />
                <Route path="*" element={<Navigate to="/activity" replace />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}

