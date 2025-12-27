---
title: "CORS Là Gì? Vì Sao Frontend Hay Bị Lỗi CORS?"
date: "2025-12-26"
draft: false
comments: true
tags:
  [
    "CORS",
    "Frontend",
    "Web Security",
    "HTTP",
    "Troubleshooting",
    "Same-Origin Policy",
  ]
categories: ["Web Development", "Security", "Frontend Development"]
description: "Tại sao API chạy ngon trên Postman nhưng lại lỗi trên trình duyệt? Tìm hiểu về Same-Origin Policy, cơ chế Preflight và cách xử lý lỗi CORS đúng chuẩn"
slug: "cors-explained-for-frontend-devs"
---

# CORS Là Gì? Vì Sao Frontend Hay Bị Lỗi CORS?

**Chủ đề:** Web Security, CORS, Same-Origin Policy, Frontend Development

## 1. Lời mở đầu

Hãy thú thật đi, đã bao nhiêu lần bạn nhìn thấy dòng lỗi đỏ lòm này và chỉ muốn đập bàn phím?

> _Access to fetch at 'https://api.backend.com/data' from origin 'http://localhost:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource._

Nhiều bạn mới (và cả mình ngày xưa) thường nghĩ: _"Chắc code mình sai chỗ nào rồi"_. Sau đó, bạn google và tìm đủ mọi cách để sửa code Frontend.

Nhưng sự thật phũ phàng là: **Bạn không thể sửa lỗi CORS bằng code Frontend (JavaScript) thuần túy.**

Để hiểu tại sao, chúng ta phải quay lại cội nguồn của vấn đề: **SOP**.

## 2. Nguồn gốc: Chính sách cùng nguồn (Same-Origin Policy)

Trước khi trách CORS, hãy cảm ơn nó. Trình duyệt được sinh ra với một sứ mệnh bảo mật cao cả: **Không tin tưởng bất kỳ ai.**

Mặc định, trình duyệt áp dụng chính sách **Same-Origin Policy (SOP)**. Chính sách này quy định rằng: Một trang web chỉ được phép gọi API (fetch/xhr) tới server nếu server đó có **CÙNG NGUỒN (Same Origin)** với trang web.

### 2.1. Vậy thế nào là "Cùng Nguồn"?

Hai URL được coi là cùng nguồn khi chúng giống hệt nhau ở 3 điểm:

1. **Giao thức (Protocol):** http vs https
2. **Tên miền (Domain):** google.com vs facebook.com
3. **Cổng (Port):** 80 vs 3000

### 2.2. Tại sao cần SOP?

Hãy tưởng tượng bạn vừa đăng nhập vào `facebook.com`. Trình duyệt lưu cookie đăng nhập của bạn. Sau đó, bạn lỡ bấm vào một trang web đen `evil.com`. Nếu không có SOP, trang `evil.com` có thể âm thầm gửi request đến `facebook.com` bằng cookie của bạn và đọc tin nhắn trộm. SOP ngăn chặn điều này bằng cách chặn `evil.com` gọi API sang `facebook.com`.

## 3. CORS: "Tấm hộ chiếu" thông hành

SOP rất an toàn, nhưng quá cứng nhắc. Trong thế giới hiện đại, Frontend (React/Vue chạy ở `localhost:3000`) thường gọi API tới Backend (Node/Java chạy ở `localhost:8080` hoặc domain khác). Theo luật SOP, việc này bị cấm.

Đó là lúc **CORS (Cross-Origin Resource Sharing)** ra đời.

CORS không phải là một lỗi. **CORS là một cơ chế nới lỏng bảo mật**, cho phép Server "cấp visa" cho những Domain lạ được phép truy cập vào tài nguyên của mình.

## 4. Nguyên lý hoạt động: Câu chuyện về "Preflight Request"

Đây là phần khiến nhiều bạn bối rối nhất. Đôi khi bạn thấy trong Network tab có 2 requests giống hệt nhau, cái đầu tiên là `OPTIONS`. Đó chính là **Preflight Request**.

Trình duyệt chia các request thành 2 loại:

### 4.1. Simple Request (Yêu cầu đơn giản)

Với các request đơn giản (GET, POST không có header lạ), trình duyệt gửi thẳng request đi.

- **Server:** Trả về dữ liệu kèm header `Access-Control-Allow-Origin: *`
- **Trình duyệt:** Kiểm tra header đó. Nếu khớp, cho phép Frontend đọc. Nếu không, báo lỗi đỏ

```javascript
// Simple Request Example
fetch("https://api.example.com/data")
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("CORS Error:", error));
```

### 4.2. Preflighted Request (Yêu cầu cần kiểm tra trước)

Nếu bạn gửi request phức tạp (dùng `PUT`, `DELETE`, hoặc gửi `Content-Type: application/json`, gửi kèm Token...), trình duyệt cực kỳ cẩn thận.

1. **Bước 1 (Hỏi đường):** Trình duyệt tự động gửi một request rỗng với method **OPTIONS**
   - _"Này Server, lát nữa thằng Frontend định gửi method PUT kèm header Authorization đấy, anh có cho phép không?"_
2. **Bước 2 (Trả lời):** Server phản hồi
   - _"Ok, tôi cho phép domain đó, method đó."_ (Status 200 hoặc 204)
3. **Bước 3 (Gửi thật):** Lúc này trình duyệt mới dám gửi request `PUT` thật sự đi

```javascript
// Preflighted Request Example
fetch("https://api.example.com/users", {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer token123",
  },
  body: JSON.stringify({ name: "John" }),
})
  .then((response) => response.json())
  .then((data) => console.log(data));

// Trình duyệt sẽ tự động gửi OPTIONS request trước:
// OPTIONS https://api.example.com/users
// Access-Control-Request-Method: PUT
// Access-Control-Request-Headers: Content-Type, Authorization
```

## 5. Tại sao Postman chạy được mà Browser thì không?

Đây là câu hỏi kinh điển.

- **Postman:** Là một công cụ dành cho Developer. Nó **không phải là trình duyệt**. Nó không quan tâm đến bảo mật người dùng, không có cookie session của ngân hàng hay Facebook. Do đó, nó **bỏ qua SOP/CORS** và gửi request thẳng tuột
- **Trình duyệt:** Phải bảo vệ người dùng bình thường khỏi các trang web độc hại. Nó bắt buộc phải tuân thủ luật chơi này

## 6. Cách xử lý lỗi CORS (Đúng và Sai)

Khi gặp lỗi này, đừng vội cài extension để bypass (đó chỉ là tự lừa dối bản thân thôi).

### 6.1. Cách 1: Cấu hình lại Server (Giải pháp triệt để)

Lỗi CORS là do Server chưa cho phép Domain của bạn truy cập. Hãy bảo Backend Developer thêm các Header sau vào response:

```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

**Node.js (Express):**

Dùng gói `cors`:

```javascript
// Cách 1: Allow tất cả origins (Không khuyến khích cho production)
app.use(cors());

// Cách 2: Chỉ định cụ thể origins (Khuyến khích)
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // Nếu cần gửi cookies
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/api/data", (req, res) => {
  res.json({ message: "CORS enabled!" });
});
```

**Java (Spring Boot):**

Thêm annotation `@CrossOrigin`:

```java
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class ApiController {
    @GetMapping("/api/data")
    public ResponseEntity<String> getData() {
        return ResponseEntity.ok("CORS enabled!");
    }
    // Hoặc cấu hình global
    @Configuration
    public class CorsConfig {
        @Bean
        public WebMvcConfigurer corsConfigurer() {
            return new WebMvcConfigurer() {
            @Override
                public void addCorsMappings(CorsRegistry registry) {
                    registry.addMapping("/**")
                            .allowedOrigins("http://localhost:3000")
                            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                            .allowedHeaders("*")
                            .allowCredentials(true);
                }
            };
        }
    }
}
```

### 6.2. Cách 2: Dùng Proxy (Giải pháp cho Frontend Dev khi code)

Nếu Backend không chịu sửa (hoặc đó là API của bên thứ 3), bạn có thể lừa trình duyệt bằng cách dùng Proxy.

Nguyên lý: `Browser` → `Proxy Server (Cùng nguồn)` → `Real API`. Vì Server gọi Server thì không bị dính SOP!

**Trong React/Vite:**

Cấu hình file `vite.config.js` hoặc `setupProxy.js`:

```javascript
// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "https://api.backend.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});

// setupProxy.js (Create React App)
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://api.backend.com",
      changeOrigin: true,
      pathRewrite: {
        "^/api": "",
      },
    })
  );
};
```

Lúc này Frontend sẽ gọi `http://localhost:3000/api/...` Trình duyệt thấy cùng là `localhost:3000` nên vui vẻ cho qua.

### 6.3. Cách KHÔNG nên làm

- **Cài extension "CORS Unblock":** Chỉ hoạt động trên máy bạn, không giải quyết được vấn đề khi deploy
- **Disable web security:** `chrome --disable-web-security` - Nguy hiểm và không practical
- **Set `Access-Control-Allow-Origin` từ Frontend:** Không có tác dụng gì, header này phải từ Server

## 7. Best Practices

- **Không dùng wildcard (\*) trong production:** Chỉ định cụ thể origins được phép
- **Xử lý OPTIONS request:** Đảm bảo server trả về status 200/204 cho preflight
- **Cache preflight response:** Sử dụng `Access-Control-Max-Age` để giảm số lần preflight
- **Kiểm tra credentials:** Nếu dùng `credentials: true`, không được dùng wildcard origin

```javascript
// Backend Example với Best Practices
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = ["https://myapp.com", "https://staging.myapp.com"];
      // Allow requests with no origin (mobile apps, Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(new Error("CORS not allowed"), false);
      }
      return callback(null, true);
    },
    credentials: true,
    maxAge: 86400, // Cache preflight 24 hours
  })
);
```

## 8. Tổng kết

CORS không phải là kẻ thù, nó là vệ sĩ bảo vệ người dùng của bạn.

**Tóm tắt lại:**

1. Lỗi CORS xảy ra tại **Trình duyệt**, do trình duyệt chặn lại
2. Frontend **không thể fix** lỗi này bằng code JS thuần
3. Cách fix chuẩn nhất là **Cấu hình tại Server**
4. Cách fix tạm thời khi dev là dùng **Proxy**

Hy vọng bài viết này giúp bạn bớt "cay cú" mỗi khi nhìn thấy dòng chữ đỏ ấy. Lần sau gặp lỗi, hãy tự tin nhắn tin cho team Backend: "Anh ơi, enable CORS cho em với, nhớ handle cả method OPTIONS nhé!"
