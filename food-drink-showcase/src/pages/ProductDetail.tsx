import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../api'

type Product = {
  id: number | string
  name?: string
  image?: string
  category?: string
  price?: number
  description?: string
  inStock?: boolean
}

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (!id) return
    let mounted = true
    api
      .getProduct(id)
      .then((p) => {
        if (mounted && p) setProduct(p as Product)
      })
      .catch(async () => {
        // fallback: fetch full list and pick
        try {
          const list = (await api.listProducts()) || []
          const found = (list as Product[]).find((x) => String(x.id) === String(id))
          if (mounted) setProduct(found || null)
        } catch {
          if (mounted) setProduct(null)
        }
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [id])

  if (loading) return <div className="center">Loading...</div>
  if (!product) return <div className="center">Product not found</div>

  const fmt = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })

  return (
    <div className="page detail">
      <header className="topbar">
        <button className="btn ghost" onClick={() => navigate(-1)}>
          Back
        </button>
        <h2>{product.name}</h2>
      </header>
      <main className="detail-main">
        <img src={product.image || 'https://ui-avatars.com/api/?name=No+Image&background=random&size=256'} alt={product.name || 'Product image'} />
        <div className="detail-body">
          <h3>{product.name}</h3>
          <p className="muted">{product.category} — {typeof product.price === 'number' ? fmt.format(product.price) : '—'}</p>
          <p>{product.description}</p>
          <p className="muted">{product.inStock ? 'Còn hàng' : 'Hết hàng'}</p>
        </div>
      </main>
    </div>
  )
}
