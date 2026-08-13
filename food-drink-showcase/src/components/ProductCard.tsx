import { Link } from 'react-router-dom'

type Product = {
  id: number
  name: string
  image: string
  description: string
  category: string
  price: number
  inStock?: boolean
}

export default function ProductCard({ product }: { product: Product }) {
  const fmt = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
  return (
    <article className="product-card vertical">
      <div className="media">
        <img
          src={product.image}
          alt={product.name}
          onError={(e) => { const t = e.currentTarget as HTMLImageElement; t.onerror = null; t.src = `https://picsum.photos/600/400?random=${product.id}` }}
        />
        <div className="badges">
          <span className={`badge ${product.inStock ? 'in' : 'out'}`}>{product.inStock ? 'Còn hàng' : 'Hết hàng'}</span>
          <span className="price">{fmt.format(product.price)}</span>
        </div>
      </div>
      <div className="product-body">
        <h3>{product.name}</h3>
        <p className="muted category">{product.category}</p>
        <p className="desc">{product.description}</p>
        <div className="actions">
          <Link to={`/products/${product.id}`} className="btn">Xem chi tiết</Link>
        </div>
      </div>
    </article>
  )
}
