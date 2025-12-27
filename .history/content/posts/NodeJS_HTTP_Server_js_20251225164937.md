---
title: "Node.js HTTP Server từ đầu: Tại sao cần hiểu module 'http' native?"
date: "2025-12-24"
draft: false
comments: true
tags: ["Node.js", "Backend", "HTTP", "Core Concepts", "No Framework"]
categories: ["Backend Development", "Deep Dive"]
description: "Bỏ qua Express hay NestJS một chút. Hôm nay chúng ta sẽ tự tay xây dựng HTTP Server bằng module 'http' có sẵn của Node.js để hiểu rõ bản chất của Streams, Buffers và Request/Response cycle."
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
