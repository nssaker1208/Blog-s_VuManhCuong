---
title: "Node.js HTTP Server từ đầu - Không dùng Framework"
date: "2025-12-25"
draft: false
comments: true
tags: ["Node.js", "Backend", "HTTP", "Core Concepts", "No Framework", "Streams"]
categories: ["Backend Development", "Deep Dive", "Node.js Tutorial"]
description: "Tự tay xây dựng HTTP Server bằng module 'http' native của Node.js để hiểu rõ bản chất của Streams, Buffers và Request/Response cycle"
slug: "nodejs-http-server-from-scratch"
---

# Node.js HTTP Server từ đầu - Không dùng Framework

**Chủ đề:** Backend Development, Node.js Core, HTTP Protocol

## 1. Lời mở đầu

Hãy thú thật đi, lần cuối cùng bạn viết một server Node.js mà **không** gõ dòng lệnh `npm install express` là khi nào? Chắc là đã rất lâu rồi, hoặc chưa bao giờ đúng không?

Các Framework như Express, Fastify hay NestJS là những công cụ tuyệt vời. Chúng giúp ta tiết kiệm thời gian, xử lý routing (định tuyến) và middleware cực mượt. Nhưng bạn có bao giờ tự hỏi: _"Bên dưới lớp vỏ hào nhoáng đó, Node.js thực sự xử lý một request như thế nào?"_

Hôm nay, hãy cùng mình "tay không bắt giặc", xây dựng một HTTP Server hoàn chỉnh chỉ bằng những gì Node.js cung cấp sẵn. Tin mình đi, hiểu được cái này, level debug của bạn sẽ tăng lên đáng kể đấy.

## 2. Bản chất của HTTP Server trong Node.js

Node.js được sinh ra cho mạng (networking). Module `http` là một trong những module cốt lõi nhất, được viết bằng C++ và Javascript để tương tác trực tiếp với các luồng dữ liệu mạng.

Khi bạn khởi tạo một server, thực chất bạn đang tạo ra một quy trình lắng nghe (listener) các sự kiện. Mô hình hoạt động của nó dựa trên **Event Loop** (Vòng lặp sự kiện). Khác với các server đa luồng truyền thống (như Apache + PHP ngày xưa), Node.js server đơn luồng (single-threaded) nhưng xử lý bất đồng bộ. Mỗi request đến không tạo ra một thread mới, mà kích hoạt một sự kiện `request`.

### 2.1. Các thành phần chính của HTTP Module

- **http.Server:** Class chính để tạo HTTP server
- **http.IncomingMessage:** Đại diện cho request từ client
- **http.ServerResponse:** Đại diện cho response gửi về client
- **Event Emitters:** Xử lý các sự kiện HTTP như 'request', 'connection', 'close'

### 2.2. Lý do nên học cách xây dựng HTTP server không dùng framework

- **Hiểu sâu về cơ chế hoạt động:** Giúp bạn nắm vững cách thức HTTP hoạt động
- **Kiểm soát hoàn toàn:** Bạn có toàn quyền kiểm soát từng chi tiết
- **Hiệu suất tối ưu:** Không có overhead từ các framework nặng
- **Kỹ năng debugging tốt hơn:** Khi hiểu cơ chế bên dưới, việc debug sẽ dễ dàng hơn
- **Flexibility cao:** Tự do tùy chỉnh theo nhu cầu cụ thể

## 3. Chu trình Request-Response trong HTTP

Chu trình Request-Response trong Node.js HTTP server hoạt động theo các bước sau:

1. **Client gửi HTTP Request:** Browser hoặc application gửi request
2. **Node.js nhận request:** HTTP module parse request thành IncomingMessage object
3. **Event 'request' được emit:** Server emit event và gọi callback function
4. **Xử lý logic:** Developer code xử lý request và chuẩn bị response
5. **Gửi HTTP Response:** Server gửi response về client thông qua ServerResponse object
6. **Connection được quản lý:** Keep-alive hoặc đóng connection

## 4. Xây dựng HTTP Server cơ bản từng bước

### 4.1. Bước 1: Tạo server đơn giản nhất

Hãy bắt đầu với đoạn code đơn giản nhất. Tạo file `server.js`:

```javascript
const http = require("http");

// Khởi tạo server
// req: IncomingMessage (Đại diện cho yêu cầu từ Client gửi lên)
// res: ServerResponse (Đại diện cho câu trả lời Server gửi về)
const server = http.createServer((req, res) => {
  // 1. Ghi log để biết có request đến
  console.log(`Request received from: ${req.url}`);

  // 2. Thiết lập Header trả về
  res.writeHead(200, { "Content-Type": "text/plain" });

  // 3. Gửi nội dung và kết thúc kết nối
  res.end("Hello! Đây là server Node.js nguyên bản.");
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server đang chạy tại 'http://localhost:${PORT}'`);
});
```

Chạy thử bằng `node server.js` và truy cập trình duyệt. Bạn thấy đấy, không cần một thư viện ngoài nào cả!

### 4.2. Bước 2: Thêm xử lý lỗi và logging

```javascript
const http = require("http");
const url = require("url");

const server = http.createServer((req, res) => {
  // Log mọi request
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);

  try {
    // Parse URL
    const parsedUrl = url.parse(req.url, true);
    res.writeHead(200, {
      "Content-Type": "application/json; charset=utf-8",
    });

    res.end(
      JSON.stringify(
        {
          message: "Server hoạt động tốt",
          method: req.method,
          path: parsedUrl.pathname,
          query: parsedUrl.query,
          timestamp: new Date().toISOString(),
        },
        null,
        2
      )
    );
  } catch (error) {
    console.error("Lỗi xử lý request:", error);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal Server Error");
  }
});

// Xử lý lỗi server
server.on("error", (err) => {
  console.error("Server error:", err);
});

// Xử lý khi server đóng
server.on("close", () => {
  console.log("Server đã đóng");
});

server.listen(3000, () => {
  console.log("Server đang chạy trên port 3000");
});
```

### 4.3. Xử lý các HTTP Methods khác nhau

(Xem file gốc)

## 5. Xử lý Routing thủ công

Trong Express, bạn viết `app.get('/about', ...)` rất nhàn. Nhưng với native http, bạn phải tự phân tích URL. Đây là lúc bạn sẽ thấm thía giá trị của framework. Nhưng hãy xem cách làm thủ công để hiểu logic:

```javascript
const http = require("http");

const server = http.createServer((req, res) => {
  // Lấy đường dẫn và method
  const { url, method } = req;

  // Routing thủ công bằng If-Else hoặc Switch
  if (url === "/" && method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Trang chủ" }));
  } else if (url === "/about" && method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Về chúng tôi" }));
  } else {
    // Xử lý 404 Not Found
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Không tìm thấy trang" }));
  }
});

server.listen(3000);
```

> **Nhận xét:** Bạn thấy đấy, nếu ứng dụng có 100 API, khối if-else này sẽ trở thành cơn ác mộng. Đó là lý do Express sinh ra khái niệm Router.

## 6. Xử lý dữ liệu Body: Stream và Buffer

Đây là phần quan trọng nhất của bài viết này. Khi client gửi một cục dữ liệu lớn (ví dụ: upload file, hoặc một JSON body dài) qua phương thức POST, Node.js **KHÔNG** nhận toàn bộ dữ liệu ngay lập tức.

Nó nhận dữ liệu dưới dạng **Stream** (Dòng chảy) chia nhỏ thành các **Chunk** (Mẩu tin). Nếu bạn dùng Express, body-parser đã làm thay bạn việc này. Nhưng làm thủ công thì phải thế này:

```javascript
const http = require("http");

const server = http.createServer((req, res) => {
  if (req.url === "/upload" && req.method === "POST") {
    const bodyChunks = [];
    // Lắng nghe sự kiện 'data': Mỗi khi có một mẩu tin đến
    req.on("data", (chunk) => {
      console.log("Đã nhận một chunk...", chunk);
      bodyChunks.push(chunk);
    });

    // Lắng nghe sự kiện 'end': Khi dữ liệu đã truyền xong
    req.on("end", () => {
      // Ghép các mảnh lại thành Buffer rồi chuyển sang String
      const bodyText = Buffer.concat(bodyChunks).toString();

      // Parse JSON (nếu gửi JSON)
      const data = JSON.parse(bodyText);

      console.log("Dữ liệu hoàn chỉnh:", data);

      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          status: "Success",
          received: data,
        })
      );
    });

    // Xử lý lỗi khi stream bị lỗi
    req.on("error", (err) => {
      console.error("Stream error:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal Server Error" }));
    });
  }
});

server.listen(3000);
```

> **Bài học rút ra:** Node.js xử lý I/O rất hiệu quả nhờ cơ chế Stream này. Nó không đợi tải hết file 1GB vào RAM rồi mới xử lý, mà có thể xử lý từng phần.

## 7. So sánh: Native Module vs Framework

Để chốt lại vấn đề, hãy nhìn vào bảng so sánh dưới đây để thấy Framework đã "gánh" giúp ta những gì.

| Đặc điểm             | Native Node.js HTTP           | Express/NestJS Framework         |
| -------------------- | ----------------------------- | -------------------------------- |
| **Độ phức tạp code** | Cao (Phải tự viết nhiều)      | Thấp (Cú pháp gọn gàng)          |
| **Routing**          | Thủ công (Switch/Case, Regex) | Mạnh mẽ, hỗ trợ params           |
| **Xử lý Body**       | Thủ công (Stream & Buffer)    | Tự động (qua Middleware)         |
| **Hiệu suất**        | Cao nhất (Không có overhead)  | Thấp hơn xíu (Do lớp trừu tượng) |
| **Mục đích sử dụng** | Học tập, Microservice cực nhỏ | Ứng dụng thực tế, API lớn        |

## 8. Lời kết

Việc biết cách viết một HTTP Server từ con số 0 giúp bạn:

1. Hiểu rõ **Request/Response Lifecycle**
2. Hiểu **Stream** và **Buffer** - trái tim của Node.js I/O
3. Trân trọng những gì Frameworks đã làm giúp mình
4. Có nền tảng vững chắc để debug các vấn đề phức tạp
5. Biết khi nào nên dùng framework và khi nào nên tự build

Lần tới khi gặp lỗi `Can't read property of undefined` liên quan đến `req.body` trong Express, bạn sẽ nhớ ngay: _"À, chắc là chưa cấu hình middleware để gom Stream thành Buffer đây mà!"_. Đó chính là giá trị của việc hiểu bản chất.

Node.js HTTP module là nền tảng vững chắc mà mọi framework đều được xây dựng trên đó. Khi bạn hiểu rõ cách nó hoạt động, bạn không chỉ trở thành một developer tốt hơn, mà còn có khả năng tối ưu hóa và debug các vấn đề một cách chuyên sâu. Framework là công cụ tuyệt vời, nhưng hiểu biết về core modules mới là sức mạnh thực sự.
