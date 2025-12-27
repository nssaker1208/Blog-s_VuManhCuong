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

![Node.js HTTP Server Architecture](https://sspark.genspark.ai/cfimages?u1=Zy7Ja%2B%2FKLLxN1%2FmVjZAQoFI4DJX7dSFBDvxGXoafm9WMs0nc51XD0ii%2BV7IEJEMhrhc1Glb%2Fnkx1poEksE6ipVpPCU4Nf7%2BFar56HruuMUyTHSgjCiZl&u2=rj9Nsj%2BvZwI%2B2ZZO&width=2560)
