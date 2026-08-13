const fs = require('fs')
const path = require('path')

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

const baseNames = [
  'Cà phê sữa đá', 'Cà phê phin', 'Cà phê đen', 'Bạc xỉu', 'Cappuccino', 'Latte',
  'Phở Bò', 'Phở Gà', 'Bún bò Huế', 'Bún riêu', 'Mì Quảng', 'Hủ tiếu',
  'Bánh mì', 'Bún chả', 'Cơm tấm', 'Cơm gà', 'Gỏi cuốn', 'Bánh xèo',
  'Bánh ngọt', 'Bánh flan', 'Chè', 'Kem',
  'Sinh tố trái cây', 'Trà sữa', 'Trà đá', 'Nước ép trái cây',
  'Gà rán', 'Khoai tây chiên', 'Nem nướng', 'Xúc xích'
]

const baseCategories = [
  'Đồ uống','Đồ uống','Đồ uống','Đồ uống','Đồ uống','Đồ uống',
  'Đồ ăn','Đồ ăn','Đồ ăn','Đồ ăn','Đồ ăn','Đồ ăn',
  'Đồ ăn','Đồ ăn','Đồ ăn','Đồ ăn','Đồ ăn','Đồ ăn',
  'Tráng miệng','Tráng miệng','Tráng miệng','Tráng miệng',
  'Đồ uống','Đồ uống','Đồ uống','Đồ uống',
  'Đồ ăn','Đồ ăn','Đồ ăn','Đồ ăn'
]

const modifiers = ['Hà Nội', 'Sài Gòn', 'Đà Nẵng', 'Huế', 'Cần Thơ']

function generateProducts() {
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

// Generate mockoon data
const mockoonData = {
  "source": "mockoon:1.17.0",
  "data": {
    "uuid": "env-root",
    "lastModification": 0,
    "name": "Product Showcase Mock",
    "endpointPrefix": "",
    "environments": [
      {
        "uuid": "env-1",
        "lastModification": 0,
        "name": "Local",
        "port": 3000,
        "routes": [
          {
            "uuid": "r-login",
            "method": "POST",
            "endpoint": "/api/login",
            "responses": [
              {
                "uuid": "resp-login",
                "statusCode": 200,
                "headers": [
                  { "key": "Content-Type", "value": "application/json" }
                ],
                "body": JSON.stringify({"accessToken":"mock-access-token","refreshToken":"mock-refresh-token"}),
                "latency": 200
              }
            ]
          },
          {
            "uuid": "r-logout",
            "method": "POST",
            "endpoint": "/api/logout",
            "responses": [
              {
                "uuid": "resp-logout",
                "statusCode": 200,
                "headers": [
                  { "key": "Content-Type", "value": "application/json" }
                ],
                "body": JSON.stringify({"ok":true}),
                "latency": 100
              }
            ]
          },
          {
            "uuid": "r-products",
            "method": "GET",
            "endpoint": "/api/product",
            "responses": [
              {
                "uuid": "resp-products",
                "statusCode": 200,
                "headers": [
                  { "key": "Content-Type", "value": "application/json" }
                ],
                "body": JSON.stringify(products),
                "latency": 300
              }
            ]
          },
          {
            "uuid": "r-product-detail",
            "method": "GET",
            "endpoint": "/api/product/:id",
            "responses": [
              {
                "uuid": "resp-product-detail",
                "statusCode": 200,
                "headers": [
                  { "key": "Content-Type", "value": "application/json" }
                ],
                "body": JSON.stringify((req) => {
                  const id = parseInt(req.params.id, 10)
                  if (id < 1 || id > 100) {
                    return { "error": "Product not found" }
                  }
                  return products[id - 1]
                }),
                "latency": 200
              }
            ]
          }
        ]
      }
    ]
  }
}

// Write mockoon data
fs.writeFileSync(
  path.join(__dirname, '..', 'mockoon-data.json'),
  JSON.stringify(mockoonData, null, 2),
  'utf-8'
)

console.log('Generated mockoon-data.json with 100 products and Unsplash food images')
