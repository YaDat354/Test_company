export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000'

async function request(path: string, opts: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json().catch(() => null)
}

export const api = {
  login: (username: string, password: string) =>
    request('/api/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  logout: () => request('/api/logout', { method: 'POST' }),
  listProducts: async () => {
    const res = await request('/api/product').catch(() => null)
    if (res && Array.isArray(res)) return res
    // fallback: generate 100 products with deterministic color-based placeholder images
    
    const categoryColors: Record<string, string> = {
      'Đồ uống': '3498db',    // Blue for drinks
      'Đồ ăn': 'e67e22',      // Orange for food
      'Tráng miệng': 'e84393' // Pink for desserts
    }
    
    const getImage = (name: string, category: string) => {
      const color = categoryColors[category] || 'e67e22'
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${color}&color=fff&size=400&bold=true&format=png`
    }

    const baseNames = [
      'Cà phê sữa đá', 'Cà phê phin', 'Cà phê đen', 'Bạc xỉu', 'Cappuccino', 'Latte',
      'Phở Bò', 'Phở Gà', 'Bún bò Huế', 'Bún riêu', 'Mì Quảng', 'Hủ tiếu',
      'Bánh mì', 'Bún chả', 'Cơm tấm', 'Cơm gà', 'Gỏi cuốn', 'Bánh xèo',
      'Bánh ngọt', 'Bánh flan', 'Chè', 'Kem',
      'Sinh tố trái cây', 'Trà sữa', 'Trà đá', 'Nước ép trái cây',
      'Gà rán', 'Khoai tây chiên', 'Nem nướng', 'Xúc xích'
    ]
    const baseCategories = [
      /* coffees */ 'Đồ uống','Đồ uống','Đồ uống','Đồ uống','Đồ uống','Đồ uống',
      /* soups/noodles */ 'Đồ ăn','Đồ ăn','Đồ ăn','Đồ ăn','Đồ ăn','Đồ ăn',
      /* staples/snacks */ 'Đồ ăn','Đồ ăn','Đồ ăn','Đồ ăn','Đồ ăn','Đồ ăn',
      /* desserts */ 'Tráng miệng','Tráng miệng','Tráng miệng','Tráng miệng',
      /* drinks */ 'Đồ uống','Đồ uống','Đồ uống','Đồ uống',
      /* fast food/snacks */ 'Đồ ăn','Đồ ăn','Đồ ăn','Đồ ăn'
    ]
    const modifiers = ['Hà Nội', 'Sài Gòn', 'Đà Nẵng', 'Huế', 'Cần Thơ']
    const generated = Array.from({ length: 100 }, (_, i) => {
      const id = i + 1
      const baseIndex = i % baseNames.length
      const modifier = modifiers[Math.floor(i / baseNames.length) % modifiers.length]
      const name = `${baseNames[baseIndex]} ${modifier}`
      const category = baseCategories[baseIndex]
      const price = 20000 + ((i * 137) % 180000)
      const inStock = i % 3 !== 0
      const descriptions = [
        `Món ngon đặc trưng, chuẩn vị Việt Nam.`,
        `Hương vị tươi mới, làm từ nguyên liệu chất lượng.`,
        `Phục vụ nóng hổi và thơm ngon.`,
        `Công thức truyền thống, phù hợp mọi lứa tuổi.`,
      ]
      const description = `${descriptions[i % descriptions.length]} Phù hợp cho bữa ăn hàng ngày.`
      const image = getImage(name, category)

      return {
        id,
        name,
        image,
        description,
        category,
        price,
        inStock,
      }
    })
    return generated
  },
  getProduct: (id: string | number) => request(`/api/product/${id}`),
}

export function saveTokens({ accessToken, refreshToken }: { accessToken: string; refreshToken?: string }) {
  localStorage.setItem('accessToken', accessToken)
  if (refreshToken) localStorage.setItem('refreshToken', refreshToken)
  try {
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new Event('authChanged'))
    }
  } catch {
    // noop
  }
}

export function clearTokens() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  try {
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new Event('authChanged'))
    }
  } catch {
    // noop
  }
}

export function getAccessToken() {
  return localStorage.getItem('accessToken')
}

export default api
