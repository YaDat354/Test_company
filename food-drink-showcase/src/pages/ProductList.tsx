import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { api, clearTokens } from '../api'

type Product = {
  id: number
  name: string
  image: string
  description: string
  category: string
  price: number
  inStock?: boolean
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true
    api.listProducts().then((data) => {
      if (mounted) {
        setProducts(data || [])
        setLoading(false)
      }
    }).catch(() => setLoading(false))
    return () => { mounted = false }
  }, [])

  const categories = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.category))).sort()
  }, [products])

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
      if (category !== 'all' && p.category !== category) return false
      return true
    })
  }, [products, search, category])

  function logout() {
    clearTokens()
    api.logout().finally(() => navigate('/login'))
  }

  return (
    <div className="page">
      <header className="topbar">
        <h2>Danh mục sản phẩm</h2>
        <div className="top-actions">
          <input placeholder="Tìm kiếm theo tên sản phẩm" value={search} onChange={(e) => setSearch(e.target.value)} />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">Tất cả danh mục</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <button className="btn ghost" onClick={() => { setSearch(''); setCategory('all') }}>Đặt lại</button>
          <button className="btn" onClick={logout}>Đăng xuất</button>
        </div>
      </header>

      <main>
        {loading ? <div className="center">Đang tải sản phẩm...</div> : (
          <div className="grid">
            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </main>
    </div>
  )
}
