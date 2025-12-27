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

<div class="max-w-3xl px-4 mx-auto md:px-0 animate-fade-in">

  <p class="mb-2 text-sm text-gray-500">
    <strong>Chủ đề:</strong> Backend Development, Node.js Core, HTTP Protocol
  </p>

  <hr class="my-6 border-gray-200">

  <!-- 1. Giới thiệu -->
  <h2 class="mt-8 mb-3 text-2xl font-bold tracking-tight md:text-3xl">
    1. Lời mở đầu
  </h2>

  <p class="mb-4 leading-relaxed text-gray-800" style="text-align: justify;">
    Hãy thú thật đi, lần cuối cùng bạn viết một server Node.js mà <strong>không</strong> gõ dòng lệnh <code>npm install express</code> là khi nào? Chắc là đã rất lâu rồi, hoặc chưa bao giờ đúng không?
  </p>

  <p class="mb-4 leading-relaxed text-gray-800" style="text-align: justify;">
    Các Framework như Express, Fastify hay NestJS là những công cụ tuyệt vời. Chúng giúp ta tiết kiệm thời gian, xử lý routing (định tuyến) và middleware cực mượt. Nhưng bạn có bao giờ tự hỏi: <em>"Bên dưới lớp vỏ hào nhoáng đó, Node.js thực sự xử lý một request như thế nào?"</em>
  </p>

  <p class="mb-4 leading-relaxed text-gray-800" style="text-align: justify;">
    Hôm nay, hãy cùng mình "tay không bắt giặc", xây dựng một HTTP Server hoàn chỉnh chỉ bằng những gì Node.js cung cấp sẵn. Tin mình đi, hiểu được cái này, level debug của bạn sẽ tăng lên đáng kể đấy.
  </p>

  <!-- 2. Bản chất của HTTP Server -->
  <h2 class="mt-10 mb-3 text-2xl font-bold tracking-tight md:text-3xl">
    2. Bản chất của HTTP Server trong Node.js
  </h2>

  <p class="mb-4 leading-relaxed text-gray-800" style="text-align: justify;">
    Node.js được sinh ra cho mạng (networking). Module <code>http</code> là một trong những module cốt lõi nhất, được viết bằng C++ và Javascript để tương tác trực tiếp với các luồng dữ liệu mạng.
  </p>

  <p class="mb-4 leading-relaxed text-gray-800" style="text-align: justify;">
    Khi bạn khởi tạo một server, thực chất bạn đang tạo ra một quy trình lắng nghe (listener) các sự kiện. Mô hình hoạt động của nó dựa trên <strong>Event Loop</strong> (Vòng lặp sự kiện). Khác với các server đa luồng truyền thống (như Apache + PHP ngày xưa), Node.js server đơn luồng (single-threaded) nhưng xử lý bất đồng bộ. Mỗi request đến không tạo ra một thread mới, mà kích hoạt một sự kiện <code>request</code>.
  </p>

  <div class="flex flex-col items-center my-6" style="text-align: center;">
    <img
      src="https://sspark.genspark.ai/cfimages?u1=Zy7Ja%2B%2FKLLxN1%2FmVjZAQoFI4DJX7dSFBDvxGXoafm9WMs0nc51XD0ii%2BV7IEJEMhrhc1Glb%2Fnkx1poEksE6ipVpPCU4Nf7%2BFar56HruuMUyTHSgjCiZl&u2=rj9Nsj%2BvZwI%2B2ZZO&width=2560"
      alt="Node.js HTTP Server Architecture"
      class="max-w-full h-auto rounded shadow-md transition-transform duration-500 ease-out hover:scale-[1.01]"
    >
    <p class="mt-2 text-sm text-gray-500" style="font-style: italic; font-weight: 600;">
      Hình 1: Vòng đời của một HTTP Request trong Node.js
    </p>
  </div>

  <h3 class="mt-6 mb-2 text-xl font-semibold">
    2.1. Các thành phần chính của HTTP Module
  </h3>

  <ul class="mb-6 space-y-2 text-gray-800 list-disc list-inside" style="text-align: justify;">
    <li>
      <strong>http.Server:</strong> Class chính để tạo HTTP server
    </li>
    <li>
      <strong>http.IncomingMessage:</strong> Đại diện cho request từ client
    </li>
    <li>
      <strong>http.ServerResponse:</strong> Đại diện cho response gửi về client
    </li>
    <li>
      <strong>Event Emitters:</strong> Xử lý các sự kiện HTTP như 'request', 'connection', 'close'
    </li>
  </ul>

  <h3 class="mt-6 mb-2 text-xl font-semibold">
    2.2. Lý do nên học cách xây dựng HTTP server không dùng framework
  </h3>

  <ul class="mb-6 space-y-2 text-gray-800 list-disc list-inside" style="text-align: justify;">
    <li>
      <strong>Hiểu sâu về cơ chế hoạt động:</strong> Giúp bạn nắm vững cách thức HTTP hoạt động
    </li>
    <li>
      <strong>Kiểm soát hoàn toàn:</strong> Bạn có toàn quyền kiểm soát từng chi tiết
    </li>
    <li>
      <strong>Hiệu suất tối ưu:</strong> Không có overhead từ các framework nặng
    </li>
    <li>
      <strong>Kỹ năng debugging tốt hơn:</strong> Khi hiểu cơ chế bên dưới, việc debug sẽ dễ dàng hơn
    </li>
    <li>
      <strong>Flexibility cao:</strong> Tự do tùy chỉnh theo nhu cầu cụ thể
    </li>
  </ul>

  <!-- 3. Chu trình Request-Response -->
  <h2 class="mt-10 mb-3 text-2xl font-bold tracking-tight md:text-3xl">
    3. Chu trình Request-Response trong HTTP
  </h2>

  <div class="flex flex-col items-center my-6" style="text-align: center;">
    <img
      src="https://sspark.genspark.ai/cfimages?u1=%2BLA7vRFhBxHqIgxjq7cGEw%2BfMpSyN%2BSTb1KFoWwVf6Anz2Al4Rgi7chBiriWq2d3pcPAcQiaBHMZP3mnOK%2FZNoXREP5t4rE0VU8VV2IZsfmXlpxjVcDVMsdQ99BxhrOYLouyf95evUjE4QgTgqkTWyYBLbWKxCI%3D&u2=m%2Fc7zQK%2FRi5A4dNu&width=2560"
      alt="HTTP Request-Response Cycle"
      class="h-auto max-w-full transition-opacity duration-700 ease-out rounded shadow-md"
    >
    <p class="mt-2 text-sm text-gray-500" style="font-style: italic; font-weight: 600;">
      Hình 2: Chu trình Request-Response trong HTTP
    </p>
  </div>

  <p class="mb-4 leading-relaxed text-gray-800" style="text-align: justify;">
    Chu trình Request-Response trong Node.js HTTP server hoạt động theo các bước sau:
  </p>

  <ol class="mb-6 space-y-2 text-gray-800 list-decimal list-inside" style="text-align: justify;">
    <li>
      <strong>Client gửi HTTP Request:</strong> Browser hoặc application gửi request
    </li>
    <li>
      <strong>Node.js nhận request:</strong> HTTP module parse request thành IncomingMessage object
    </li>
    <li>
      <strong>Event 'request' được emit:</strong> Server emit event và gọi callback function
    </li>
    <li>
      <strong>Xử lý logic:</strong> Developer code xử lý request và chuẩn bị response
    </li>
    <li>
      <strong>Gửi HTTP Response:</strong> Server gửi response về client thông qua ServerResponse object
    </li>
    <li>
      <strong>Connection được quản lý:</strong> Keep-alive hoặc đóng connection
    </li>
  </ol>

  <!-- 4. Xây dựng HTTP Server -->
  <h2 class="mt-10 mb-3 text-2xl font-bold tracking-tight md:text-3xl">
    4. Xây dựng HTTP Server cơ bản từng bước
  </h2>

  <h3 class="mt-6 mb-2 text-xl font-semibold">
    4.1. Bước 1: Tạo server đơn giản nhất
  </h3>

  <p class="mb-4 leading-relaxed text-gray-800" style="text-align: justify;">
    Hãy bắt đầu với đoạn code đơn giản nhất. Tạo file <code>server.js</code>:
  </p>

```javascript
const http = require('http');

// Khởi tạo server
// req: IncomingMessage (Đại diện cho yêu cầu từ Client gửi lên)
// res: ServerResponse (Đại diện cho câu trả lời Server gửi về)
const server = http.createServer((req, res) => {
    // 1. Ghi log để biết có request đến
    console.log(Request received from: ${req.url});

    // 2. Thiết lập Header trả về
    res.writeHead(200, { 'Content-Type': 'text/plain' });

    // 3. Gửi nội dung và kết thúc kết nối
    res.end('Hello! Đây là server Node.js nguyên bản.');
});

const PORT = 3000;
server.listen(PORT, () => {
console.log(Server đang chạy tại 'http://localhost:${PORT}');
});
```

  <p class="mt-4 mb-4 leading-relaxed text-gray-800" style="text-align: justify;">
    Chạy thử bằng <code>node server.js</code> và truy cập trình duyệt. Bạn thấy đấy, không cần một thư viện ngoài nào cả!
  </p>

  <h3 class="mt-6 mb-2 text-xl font-semibold">
    4.2. Bước 2: Thêm xử lý lỗi và logging
  </h3>

```javascript
const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
    // Log mọi request
    console.log(${new Date().toISOString()} - ${req.method} ${req.url});

    try {
        // Parse URL
        const parsedUrl = url.parse(req.url, true);
        res.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8'
        });

        res.end(JSON.stringify({
            message: 'Server hoạt động tốt',
            method: req.method,
            path: parsedUrl.pathname,
            query: parsedUrl.query,
            timestamp: new Date().toISOString()
        }, null, 2));
    } catch (error) {
        console.error('Lỗi xử lý request:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    }
});

// Xử lý lỗi server
server.on('error', (err) => {
console.error('Server error:', err);
});

// Xử lý khi server đóng
server.on('close', () => {
console.log('Server đã đóng');
});

server.listen(3000, () => {
console.log('Server đang chạy trên port 3000');
});
```
