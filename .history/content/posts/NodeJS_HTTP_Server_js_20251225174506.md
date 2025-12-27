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

## Lời mở đầu

Chào các bạn developers!

Hãy thú thật đi, lần cuối cùng bạn viết một server Node.js mà **không** gõ dòng lệnh `npm install express` là khi nào? Chắc là đã rất lâu rồi, hoặc chưa bao giờ đúng không?

Các Framework như Express, Fastify hay NestJS là những công cụ tuyệt vời. Chúng giúp ta tiết kiệm thời gian, xử lý routing (định tuyến) và middleware cực mượt. Nhưng bạn có bao giờ tự hỏi: _"Bên dưới lớp vỏ hào nhoáng đó, Node.js thực sự xử lý một request như thế nào?"_

Hôm nay, hãy cùng mình "tay không bắt giặc", xây dựng một HTTP Server hoàn chỉnh chỉ bằng những gì Node.js cung cấp sẵn. Tin mình đi, hiểu được cái này, level debug của bạn sẽ tăng lên đáng kể đấy.

## 1. Bản chất của HTTP Server trong Node.js

Node.js được sinh ra cho mạng (networking). Module `http` là một trong những module cốt lõi nhất, được viết bằng C++ và Javascript để tương tác trực tiếp với các luồng dữ liệu mạng.

Khi bạn khởi tạo một server, thực chất bạn đang tạo ra một quy trình lắng nghe (listener) các sự kiện. Mô hình hoạt động của nó dựa trên **Event Loop** (Vòng lặp sự kiện).

Khác với các server đa luồng truyền thống (như Apache + PHP ngày xưa), Node.js server đơn luồng (single-threaded) nhưng xử lý bất đồng bộ. Mỗi request đến không tạo ra một thread mới, mà kích hoạt một sự kiện `request`.

### Kiến trúc HTTP Module trong Node.js

![Node.js HTTP Server Architecture](https://sspark.genspark.ai/cfimages?u1=Zy7Ja%2B%2FKLLxN1%2FmVjZAQoFI4DJX7dSFBDvxGXoafm9WMs0nc51XD0ii%2BV7IEJEMhrhc1Glb%2Fnkx1poEksE6ipVpPCU4Nf7%2BFar56HruuMUyTHSgjCiZl&u2=rj9Nsj%2BvZwI%2B2ZZO&width=2560)
_Hình 1: Vòng đời của một HTTP Request. Client gửi yêu cầu -> Node.js nhận vào Event Loop -> Xử lý (Non-blocking) -> Trả về Response._

Node.js HTTP module được xây dựng trên các thành phần core sau:

### Các thành phần chính:

1. **http.Server**: Class chính để tạo HTTP server
2. **http.IncomingMessage**: Đại diện cho request từ client
3. **http.ServerResponse**: Đại diện cho response gửi về client
4. **Event Emitters**: Xử lý các sự kiện HTTP như 'request', 'connection', 'close'

### Lý do nên học cách xây dựng HTTP server không dùng framework:

1. **Hiểu sâu về cơ chế hoạt động**: Giúp bạn nắm vững cách thức HTTP hoạt động
2. **Kiểm soát hoàn toàn**: Bạn có toàn quyền kiểm soát từng chi tiết
3. **Hiệu suất tối ưu**: Không có overhead từ các framework nặng
4. **Kỹ năng debugging tốt hơn**: Khi hiểu cơ chế bên dưới, việc debug sẽ dễ dàng hơn
5. **Flexibility cao**: Tự do tùy chỉnh theo nhu cầu cụ thể

## Chu trình Request-Response trong HTTP

![HTTP Request-Response Cycle](https://sspark.genspark.ai/cfimages?u1=%2BLA7vRFhBxHqIgxjq7cGEw%2BfMpSyN%2BSTb1KFoWwVf6Anz2Al4Rgi7chBiriWq2d3pcPAcQiaBHMZP3mnOK%2FZNoXREP5t4rE0VU8VV2IZsfmXlpxjVcDVMsdQ99BxhrOYLouyf95evUjE4QgTgqkTWyYBLbWKxCI%3D&u2=m%2Fc7zQK%2FRi5A4dNu&width=2560)
_Hình 2: Chu trình Request-Response trong HTTP._

Chu trình Request-Response trong Node.js HTTP server hoạt động theo các bước:

1. **Client gửi HTTP Request**: Browser hoặc application gửi request
2. **Node.js nhận request**: HTTP module parse request thành IncomingMessage object
3. **Event 'request' được emit**: Server emit event và gọi callback function
4. **Xử lý logic**: Developer code xử lý request và chuẩn bị response
5. **Gửi HTTP Response**: Server gửi response về client thông qua ServerResponse object
6. **Connection được quản lý**: Keep-alive hoặc đóng connection

## 2/ Xây dựng HTTP Server cơ bản từng bước

### Bước 1: Tạo server đơn giản nhất

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
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
```

Chạy thử bằng <code>node server.js</code> và truy cập trình duyệt. Bạn thấy đấy, không cần một thư viện ngoài nào cả!

### Bước 2: Thêm xử lý lỗi và logging

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

### Xử lý các HTTP Methods khác nhau

![HTTP Request-Response Cycle](https://sspark.genspark.ai/cfimages?u1=BKEheUXclJNZnc%2BdfghThtIrsl0pbLK1YJ%2Bb4Z9BNrBeb%2F5pdecOHxOji6urcBrVyjB5prJOu6N6x4dThktq7F6mR%2FOLx8xi0yREHxYzLGusy5V1Kqqre5Srja9t7uIs7vd4W1iKxFZy4XxIhyzbf290Mnxli2Rq7A8enWGAjoMAkn4fC3JPqnzrmzfgia1fB%2BT75PSCL7W4PKfC%2FPnZj8vJjHs3NpUqdGoManWO%2FbHUGvkaYcty5Bq4CxsX3GZG7vlGfRxO525Jx7A%2BE4RLkxOavi7mhIhuqHYxbxFlxbybtFrLsdudEsxr4Bs%3D&u2=lMGbrGbjm5u2FxFy&width=2560)
_Hình 3: Xử lý GET, POST, PUT, DELETE._

## 3. Xử lý Routing thủ công (Nỗi đau khi không có Framework)

Trong Express, bạn viết <code>app.get('/about', ...)</code> rất nhàn. Nhưng với native http, bạn phải tự phân tích URL.

Đây là lúc bạn sẽ thấm thía giá trị của framework. Nhưng hãy xem cách làm thủ công để hiểu logic:

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

**Nhận xét**: Bạn thấy đấy, nếu ứng dụng có 100 API, khối if-else này sẽ trở thành cơn ác mộng. Đó là lý do Express sinh ra khái niệm Router.

### 4. Xử lý dữ liệu Body: Stream và Buffer (Phần khó nhất)

Đây là phần quan trọng nhất bài viết này.

Khi client gửi một cục dữ liệu lớn (ví dụ: upload file, hoặc một JSON body dài) qua phương thức POST, Node.js **KHÔNG** nhận toàn bộ dữ liệu ngay lập tức.

Nó nhận dữ liệu dưới dạng **Stream** (Dòng chảy) chia nhỏ thành các **Chunk** (Mẩu tin).

Nếu bạn dùng Express, body-parser đã làm thay bạn việc này. Nhưng làm thủ công thì phải thế này:

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
      res.end(JSON.stringify({ status: "Success", received: data }));
    });
  }
});
```

**Bài học rút ra**: Node.js xử lý I/O rất hiệu quả nhờ cơ chế Stream này. Nó không đợi tải hết file 1GB vào RAM rồi mới xử lý, mà có thể xử lý từng phần.

## 5. So sánh: Native Module vs Framework (Express)

Để chốt lại vấn đề, hãy nhìn vào hình ảnh so sánh dưới đây để thấy Framework đã "gánh" giúp ta những gì.

![HTTP Request-Response Cycle](https://copilot.microsoft.com/th/id/BCO.08d76a96-3852-4eaf-89cf-c5e85cc0895d.png)
_Hình 4: Native Module là nền móng vững chắc nhưng thô sơ. Express/Framework là những lớp tiện ích xây đắp lên trên (Middleware, Routing, Error Handling)._

| Đặc điểm             | Native Node.js HTTP           | Express/NestJS Framework         |
| -------------------- | ----------------------------- | -------------------------------- |
| **Độ phức tạp code** | Cao (Phải tự viết nhiều)      | Thấp (Cú pháp gọn gàng)          |
| **Routing**          | Thủ công (Switch/Case, Regex) | Mạnh mẽ, hỗ trợ params           |
| **Xử lý Body**       | Thủ công (Stream & Buffer)    | Tự động (qua Middleware)         |
| **Hiệu suất**        | Cao nhất (Không có overhead)  | Thấp hơn xíu (Do lớp trừu tượng) |
| **Mục đích sử dụng** | Học tập, Microservice cực nhỏ | Ứng dụng thực tế, API lớn        |

## Lời kết

Việc biết cách viết một HTTP Server từ con số 0 giúp bạn:

1. Hiểu rõ **Request/Response Lifecycle**.

2. Hiểu **Stream** và **Buffer** - trái tim của Node.js I/O.

3. Trân trọng những gì Frameworks đã làm giúp mình.

Lần tới khi gặp lỗi <code>Can't read property of undefined</code> liên quan đến <code>req.body</code> trong Express, bạn sẽ nhớ ngay: _"À, chắc là chưa cấu hình middleware để gom Stream thành Buffer đây mà!"_.

Hẹn gặp lại các bạn trong bài viết sau!
