---
title: "WebSocket với Java Spring Boot"
date: "2025-12-23"
draft: false
comments: true
tags:
  [
    "WebSocket",
    "Spring Boot",
    "Java",
    "Real-time",
    "STOMP",
    "Notification System",
  ]
categories: ["Java Programming", "Web Development", "Real-time Applications"]
description: "Hướng dẫn chi tiết xây dựng hệ thống thông báo thời gian thực với WebSocket, STOMP và Spring Boot"
---

# WebSocket với Java Spring Boot

**Chủ đề:** Web Development, Real-time Communication, Java Spring Boot

## 1. Giới thiệu

Trong kỷ nguyên số hiện đại, người dùng mong đợi sự phản hồi tức thì. Việc phải nhấn nút "Refresh" (F5) để xem có thông báo mới hay không đã trở nên lỗi thời và gây trải nghiệm tồi tệ. Hãy tưởng tượng Facebook, Shopee hay ứng dụng ngân hàng của bạn không tự động hiện thông báo mới mà bạn phải tự tải lại trang?

Đây là lúc công nghệ **Real-time (thời gian thực)** phát huy tác dụng. Và trong thế giới Java, sự kết hợp giữa **Spring Boot** và **WebSocket** là một giải pháp mạnh mẽ, chuẩn mực để giải quyết vấn đề này. Bài viết này sẽ hướng dẫn bạn từ lý thuyết nền tảng đến thực hành xây dựng một hệ thống thông báo thời gian thực.

## 2. WebSocket là gì?

WebSocket không chỉ đơn thuần là một giao thức mạng - nó là một cuộc cách mạng trong cách chúng ta tư duy về giao tiếp giữa client và server. Nếu như HTTP truyền thống giống như việc gửi thư qua bưu điện - bạn gửi một lá thư (request) và chờ đợi hồi âm (response), thì WebSocket giống như một cuộc gọi điện thoại - kết nối liên tục, hai chiều, và tức thì.

### 2.1. Đặc điểm nổi bật

- **Kết nối liên tục (Persistent Connection):** Một khi đã kết nối, nó tồn tại cho đến khi có lý do để đóng.
- **Giao tiếp hai chiều (Full-duplex Communication):** Server có thể chủ động gửi tin nhắn đến client mà không cần client yêu cầu.
- **Overhead thấp:** Không cần phải "bắt tay" lại mỗi lần giao tiếp như HTTP, WebSocket tiết kiệm băng thông đáng kể.
- **Real-time:** Độ trễ cực thấp, phù hợp cho chat, game, trading, monitoring.

## 3. Nguyên lý hoạt động

### 3.1. Quá trình thiết lập kết nối (WebSocket Handshake)

Việc thiết lập kết nối WebSocket bắt đầu bằng HTTP handshake - cái bắt tay định mệnh giữa client và server.

**Client gửi HTTP Upgrade Request:**

```
GET /chat HTTP/1.1
Host: localhost:8080
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13
```

**Server trả về 101 Switching Protocols:**

```
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
```

Kể từ thời điểm đó, kết nối TCP bên dưới được giữ nguyên, nhưng giao thức HTTP được thay thế bằng giao thức WebSocket. Cánh cổng giao tiếp hai chiều đã mở.

### 3.2. Vòng đời của kết nối

Mỗi kết nối WebSocket có vòng đời riêng với các trạng thái:

- **CONNECTING:** Đang thiết lập kết nối
- **OPEN:** Kết nối thành công, sẵn sàng giao tiếp
- **CLOSING:** Đang đóng kết nối
- **CLOSED:** Kết nối đã đóng hoàn toàn

## 4. So sánh WebSocket với HTTP Polling

Trước khi có WebSocket, để mô phỏng thời gian thực, chúng ta thường dùng kỹ thuật **Polling** (thăm dò). Client cứ mỗi vài giây lại hỏi Server: "Có gì mới không?".

| Tiêu chí         | HTTP Polling                   | WebSocket                   |
| ---------------- | ------------------------------ | --------------------------- |
| **Kiểu kết nối** | Gián đoạn (request/response)   | Liên tục (persistent)       |
| **Overhead**     | Cao (headers lặp lại)          | Thấp (chỉ data)             |
| **Real-time**    | Giả real-time (delay 1-5s)     | Thực sự real-time (<100ms)  |
| **Server Push**  | Không hỗ trợ                   | Hỗ trợ hoàn toàn            |
| **Băng thông**   | Lãng phí (nhiều request trống) | Tiết kiệm (chỉ gửi khi cần) |
| **Độ phức tạp**  | Đơn giản                       | Phức tạp hơn                |

## 5. STOMP Protocol - Lớp trừu tượng trên WebSocket

**STOMP (Simple Text Oriented Messaging Protocol)** là một giao thức con chạy trên WebSocket, giúp định nghĩa cấu trúc tin nhắn rõ ràng (ví dụ: gửi đến đâu, ai nhận) thay vì chỉ gửi chuỗi dữ liệu thô. Spring Boot hỗ trợ rất tốt STOMP.

**Các khái niệm quan trọng trong STOMP:**

- **/topic:** Destination cho các tin nhắn broadcast (pub/sub model) - nhiều subscriber nhận cùng một message
- **/app:** Prefix cho các message mà client gửi lên server
- **Subscribe:** Client đăng ký nhận tin từ một destination cụ thể
- **Send:** Client/Server gửi tin nhắn đến một destination

## 6. Xây dựng hệ thống thông báo Real-time

Chúng ta sẽ xây dựng một ứng dụng đơn giản: Server có một endpoint để admin gửi thông báo, và tất cả các client đang kết nối sẽ nhận được thông báo đó ngay lập tức trên giao diện web.

### 6.1. Bước 1: Thêm Dependencies

Thêm dependency vào file `pom.xml`:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-websocket</artifactId>
</dependency>
```

### 6.2. Bước 2: Cấu hình WebSocket

Tạo class cấu hình để kích hoạt WebSocket và định nghĩa nơi gửi/nhận tin nhắn:

```java
package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Định nghĩa endpoint để client kết nối (Handshake)
        // SockJS fallback cho trình duyệt không hỗ trợ WebSocket
        registry.addEndpoint("/ws-notification").withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // /topic: Prefix cho các destination mà client SUBSCRIBE
        registry.enableSimpleBroker("/topic");

        // /app: Prefix cho các destination mà client GỬI tin lên server
        registry.setApplicationDestinationPrefixes("/app");
    }
}
```

### 6.3. Bước 3: Tạo Model cho Thông báo

```java
package com.example.demo.model;

public class NotificationMessage {
    private String content;
    private String timestamp;

    public NotificationMessage() {}

    public NotificationMessage(String content, String timestamp) {
        this.content = content;
        this.timestamp = timestamp;
    }

    // Getters and Setters
    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
}
```

### 6.4. Bước 4: Tạo Controller để gửi thông báo

Sử dụng `SimpMessagingTemplate` để server chủ động push tin nhắn đến client:

```java
package com.example.demo.controller;

import com.example.demo.model.NotificationMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
public class AdminNotificationController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @PostMapping("/api/admin/send-notification")
    public ResponseEntity<String> sendNotification(@RequestBody String messageContent) {

        // Tạo thông báo với timestamp
        String time = LocalDateTime.now()
            .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        NotificationMessage notification =
            new NotificationMessage(messageContent, time);

        // Push tin nhắn đến tất cả client đang subscribe "/topic/global-notifications"
        messagingTemplate.convertAndSend(
            "/topic/global-notifications",
            notification
        );

        return ResponseEntity.ok("Notification sent successfully!");
    }
}
```

### 6.5. Bước 5: Tạo Client (Frontend)

Tạo file `src/main/resources/static/index.html` sử dụng SockJS và Stomp.js:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Real-time Notifications</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/sockjs-client/1.5.1/sockjs.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/stomp.js/2.3.3/stomp.min.js"></script>
    <style>
      body {
        font-family: Arial, sans-serif;
        max-width: 800px;
        margin: 50px auto;
        padding: 20px;
      }
      #notifications-area {
        border: 1px solid #ccc;
        height: 400px;
        overflow-y: scroll;
        padding: 15px;
        background: #f9f9f9;
        border-radius: 8px;
      }
      .notify-item {
        margin-bottom: 15px;
        padding: 10px;
        background: #e3f2fd;
        border-left: 4px solid #2196f3;
        border-radius: 4px;
        animation: slideIn 0.3s ease-out;
      }
      @keyframes slideIn {
        from {
          transform: translateX(-20px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      .time {
        font-size: 0.85em;
        color: #666;
        margin-top: 5px;
      }
      .status {
        padding: 10px;
        margin-bottom: 15px;
        border-radius: 4px;
        text-align: center;
        font-weight: bold;
      }
      .connected {
        background: #c8e6c9;
        color: #2e7d32;
      }
      .disconnected {
        background: #ffcdd2;
        color: #c62828;
      }
    </style>
  </head>
  <body>
    <h2>Hệ thống thông báo Real-time</h2>
    <div id="status" class="status disconnected">Đang kết nối...</div>
    <div id="notifications-area"></div>

    <script>
      var stompClient = null;

      function connect() {
        // Kết nối đến WebSocket endpoint
        var socket = new SockJS("/ws-notification");
        stompClient = Stomp.over(socket);

        stompClient.connect(
          {},
          function (frame) {
            console.log("Connected: " + frame);

            // Cập nhật trạng thái
            document.getElementById("status").textContent =
              "Đã kết nối! Sẵn sàng nhận thông báo.";
            document.getElementById("status").className = "status connected";

            // Subscribe để nhận tin từ "/topic/global-notifications"
            stompClient.subscribe(
              "/topic/global-notifications",
              function (notification) {
                showNotification(JSON.parse(notification.body));
              }
            );
          },
          function (error) {
            console.error("Connection error:", error);
            document.getElementById("status").textContent =
              "Lỗi kết nối. Đang thử lại...";
            setTimeout(connect, 5000); // Retry sau 5s
          }
        );
      }

      function showNotification(message) {
        var notificationsArea = document.getElementById("notifications-area");
        var newItem = document.createElement("div");
        newItem.className = "notify-item";
        newItem.innerHTML = `
                <strong>Thông báo mới:</strong><br/>
                ${message.content}
                <div class="time">Lúc: ${message.timestamp}</div>
            `;

        // Thêm thông báo mới lên đầu
        notificationsArea.insertBefore(newItem, notificationsArea.firstChild);
      }

      // Tự động kết nối khi tải trang
      connect();
    </script>
  </body>
</html>
```

## 7. Test hệ thống

Sau khi hoàn thành code, thực hiện các bước sau để test:

1. Chạy ứng dụng Spring Boot (cổng mặc định 8080)
2. Mở trình duyệt, truy cập `http://localhost:8080`
3. Mở thêm 1-2 tab nữa để thấy hiệu ứng broadcast
4. Sử dụng Postman hoặc curl để gửi notification:
   - **URL:** `http://localhost:8080/api/admin/send-notification`
   - **Method:** POST
   - **Body (raw/text):** "Chào mừng đợt giảm giá Black Friday!"
5. Quan sát: Tất cả các tab trình duyệt sẽ nhận được thông báo ngay lập tức!

## 8. Ứng dụng thực tế của WebSocket

- **Hệ thống Chat:** Messenger, Zalo, Telegram - gửi/nhận tin nhắn tức thì
- **Trading Platform:** Cập nhật giá cổ phiếu, crypto real-time
- **Multiplayer Games:** Đồng bộ trạng thái game giữa nhiều người chơi
- **Collaboration Tools:** Google Docs, Figma - nhiều người edit cùng lúc
- **IoT Monitoring:** Dashboard theo dõi sensor, thiết bị thông minh
- **Live Streaming:** Comments, reactions real-time trong livestream

## 9. Best Practices

- **Xử lý reconnect:** Client nên tự động kết nối lại khi mất kết nối
- **Authentication:** Bảo vệ WebSocket endpoint bằng JWT hoặc session
- **Message validation:** Validate dữ liệu trước khi gửi/nhận
- **Heartbeat/Ping-Pong:** Gửi ping định kỳ để giữ kết nối sống
- **Error handling:** Xử lý lỗi gracefully, thông báo cho user
- **Scale với Message Broker:** Dùng RabbitMQ, Redis Pub/Sub cho hệ thống lớn

## 10. Kết luận

WebSocket kết hợp với Spring Boot và STOMP cung cấp một giải pháp mạnh mẽ và dễ triển khai cho các ứng dụng real-time. Bạn đã học được cách thiết lập kết nối WebSocket, cấu hình STOMP, và xây dựng một hệ thống thông báo hoàn chỉnh. Điểm mạnh của WebSocket là khả năng server push chủ động, giúp giảm overhead so với HTTP Polling và mang lại trải nghiệm người dùng mượt mà, tức thì.

Từ đây, bạn có thể mở rộng ứng dụng với các tính năng như authentication, private messaging (dùng `/queue`), hoặc tích hợp message broker như RabbitMQ để scale hệ thống lên mức enterprise. WebSocket không chỉ là công nghệ - nó là cầu nối cho những trải nghiệm số tương tác, sống động và kết nối con người với nhau trong thời đại 4.0.
