# Product Showcase

Ứng dụng hiển thị danh sách 100+ sản phẩm đồ ăn / đồ uống của Việt Nam, có đăng nhập, xem danh sách và xem chi tiết sản phẩm.

## Công nghệ

- React 18 + TypeScript + Vite
- React Router v6
- Mock API: Node.js HTTP server (không cần cài thêm package)
- Docker: multi-stage Dockerfile + Mockoon CLI

## Chạy local

Mở 2 terminal:

```bash
# Terminal 1 — mock API (port 3000)
cd food-drink-showcase
npm install
node scripts/mock-server.cjs

# Terminal 2 — frontend (port 5173)
npm run dev
```

Mở trình duyệt: http://localhost:5173

Đăng nhập: nhập bất kỳ username / password (mock API chấp nhận tất cả)

## Chạy bằng Docker

```bash
cd food-drink-showcase
docker-compose up --build
```

Mở trình duyệt: http://localhost:5177

