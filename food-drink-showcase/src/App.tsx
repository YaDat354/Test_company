import './App.css'
import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import ProductList from './pages/ProductList'
import ProductDetail from './pages/ProductDetail'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('accessToken'))

  useEffect(() => {
    const onAuth = () => setIsAuthenticated(!!localStorage.getItem('accessToken'))
    window.addEventListener('authChanged', onAuth)
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'accessToken') onAuth()
    }
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener('authChanged', onAuth)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/products"
          element={isAuthenticated ? <ProductList /> : <Navigate to="/login" />}
        />
        <Route
          path="/products/:id"
          element={isAuthenticated ? <ProductDetail /> : <Navigate to="/login" />}
        />
        <Route path="/" element={<Navigate to={isAuthenticated ? '/products' : '/login'} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
