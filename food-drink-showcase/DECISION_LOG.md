# DECISION LOG
- Dữ liệu mock API: chọn tiếng Việt cho tên sản phẩm và mô tả để phù hợp yêu cầu và UX địa phương.

- Hình ảnh: ban đầu thử Unsplash Source theo từ khóa (ảnh liên quan nhưng không cố định), sau đó chuyển sang `picsum.photos` seeded để hình ảnh ổn định theo `product{id}`.

- Mockoon: xuất file `mockoon-data.json` và gán vào `mockoon/cli` trong `docker-compose.yml` để dễ chạy trong container. Tuy nhiên trong quá trình làm có một số phiên bản trùng lặp của `docker-compose.yml` — đã hợp nhất và sửa.

- Số lượng sản phẩm: tạo 100 mục (nhiều tên gốc + modifiers) để đảm bảo yêu cầu >=100 sản phẩm.

- API base cho frontend: sử dụng biến môi trường `VITE_API_BASE`; trong `docker-compose.yml` đặt `http://mock-api:3000` để frontend giao tiếp với mock-api container.

- Containerization: frontend được build bằng Node và phục vụ bằng nginx (multi-stage Dockerfile). `docker-compose.yml` khởi động `mock-api` (mockoon/cli) và `frontend`.

- Fallback: frontend giữ generator mềm trong `src/api.ts` để dev không bị chặn khi mock-api không sẵn sàng.

---

Khởi tạo dự án
- Tạo Vite + React + TypeScript, cấu trúc cơ bản, pages: Login/ProductList/ProductDetail.

Mock data
- Sinh 100 sản phẩm bằng script và xuất `mockoon-data.json`.

Ảnh sản phẩm
- Thử Unsplash Source để lấy ảnh theo tên -> ảnh liên quan nhưng không cố định (thay đổi giữa tải).
- Quyết định cuối: dùng `picsum.photos/seed/product{id}/...` để ảnh ổn định và phù hợp yêu cầu demo.

 Containerization
- Thêm `Dockerfile` multi-stage (build bằng node, serve bằng nginx).
- Viết `docker-compose.yml` để khởi tạo `mock-api` và `frontend` cùng lúc.

Hoàn thiện API client
- `src/api.ts` sử dụng `VITE_API_BASE`, có fallback generator nếu mock-api không trả dữ liệu.

---

## Dùng AI

- **Quyết định**: Kết hợp approach tự sinh dữ liệu + mockoon export; chọn ảnh deterministic (picsum seed) để tránh bất ngờ trong demo.

- **Prompt đã dùng **: "Generate 100 Vietnamese food product items with fields id,name,image,description,category,price,inStock; image should be deterministic seed per product id"

- **Đánh giá**: Kết quả ban đầu cần hiệu chỉnh (tránh trùng lặp tên, ảnh không liên quan). Đã chỉnh generator và mock server để đáp ứng yêu cầu.


