const http = require('http')
const { URL } = require('url')

// Category → Color mapping (deterministic, no external dependencies)
const categoryColors = {
  'Đồ uống': '3498db',    // Blue for drinks
  'Đồ ăn': 'e67e22',      // Orange for food
  'Tráng miệng': 'e84393' // Pink for desserts
}

function getImageForProduct(name, category) {
  const color = categoryColors[category] || 'e67e22'
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${color}&color=fff&size=400&bold=true&format=png`
}

function generateProducts() {
  const categories = ['Đồ ăn', 'Đồ uống', 'Đồ ăn vặt', 'Tráng miệng', 'Thiết bị']
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

  const modifiers = ['Hà Nội', 'Sài Gòn', 'Đà Nẵng', 'Huế', 'Cần Thơ', 'Hải Phòng', 'Nha Trang', 'Vũng Tàu', 'Buôn Ma Thuột', 'Hội An']

  return Array.from({ length: 100 }, (_, i) => {
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
      `Công thức truyền thống, phù hợp mọi lứa tuổi.`
    ]
    const description = `${descriptions[i % descriptions.length]} Phù hợp cho bữa ăn hàng ngày.`
    const image = getImageForProduct(name, category)

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
}

const products = generateProducts()

function sendJson(res, status, body) {
  const data = JSON.stringify(body)
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  })
  res.end(data)
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`)
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    })
    return res.end()
  }

  if (req.method === 'POST' && url.pathname === '/api/login') {
    let body = ''
    req.on('data', (chunk) => (body += chunk))
    req.on('end', () => {
      return sendJson(res, 200, { accessToken: 'mock-access-token', refreshToken: 'mock-refresh-token' })
    })
    return
  }

  if (req.method === 'POST' && url.pathname === '/api/logout') {
    return sendJson(res, 200, { ok: true })
  }

  if (req.method === 'GET' && url.pathname === '/api/product') {
    return sendJson(res, 200, products)
  }

  const match = url.pathname.match(/^\/api\/product\/(\d+)$/)
  if (req.method === 'GET' && match) {
    const id = Number(match[1])
    const p = products.find((x) => x.id === id)
    if (!p) return sendJson(res, 404, { error: 'Not found' })
    return sendJson(res, 200, p)
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' })
  res.end('Not found')
})

const port = process.env.PORT || 3000
server.listen(port, () => console.log(`Mock server listening on http://localhost:${port}`))
