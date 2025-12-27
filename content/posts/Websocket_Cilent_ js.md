---
title: "WebSocket Client với JavaScript - Xây dựng Chat App không cần thư viện"
date: "2025-12-26"
draft: false
comments: true
tags:
  ["JavaScript", "WebSocket", "Frontend", "Real-time", "Chat App", "Native API"]
categories: ["Frontend Development", "Web API", "Real-time Applications"]
description: "Hướng dẫn chi tiết cách sử dụng Native WebSocket API trong trình duyệt để xây dựng ứng dụng Chat Real-time, xử lý kết nối, gửi nhận tin nhắn và tự động kết nối lại"
slug: "websocket-client-javascript-chat"
---

# WebSocket Client với JavaScript - Xây dựng Chat App không cần thư viện

**Chủ đề:** Frontend Development, Real-time Communication, Native Web API

## 1. Lời mở đầu

Khi nhắc đến Real-time trên trình duyệt (Browser), cái tên đầu tiên bật ra trong đầu đa số lập trình viên là **Socket.io**. Không phủ nhận Socket.io rất tuyệt, nhưng nó giống như việc bạn dùng một chiếc xe tăng để đi chợ vậy. Đôi khi, nó quá "dư thừa" cho những nhu cầu cơ bản.

Trình duyệt của bạn (Chrome, Firefox, Safari...) thực ra đã tích hợp sẵn một "vũ khí" rất mạnh: **Native WebSocket API**. Nó nhẹ, nhanh và không cần cài thêm bất kỳ gói `npm` nào.

Hôm nay, mình sẽ hướng dẫn các bạn xây dựng một **Chat Client** hoàn chỉnh chỉ bằng Vanilla JavaScript (JS thuần), giúp bạn hiểu sâu sắc cách dữ liệu "chảy" giữa Client và Server.

## 2. WebSocket Client là gì và nó khác HTTP thế nào?

Trước khi code, hãy chỉnh lại tư duy một chút. Với HTTP truyền thống, Client là kẻ chủ động duy nhất. Muốn lấy tin nhắn mới? Client phải hỏi Server. Với WebSocket, Client và Server bình đẳng. Sau cú bắt tay ban đầu, đường truyền được giữ thông suốt.

### 2.1. Lợi ích cốt lõi của WebSocket

- **Siêu nhẹ:** Không tốn băng thông gửi Headers lặp đi lặp lại
- **Thời gian thực:** Tin nhắn từ người khác sẽ "bắn" thẳng vào màn hình của bạn ngay lập tức (Server Push)
- **Kết nối liên tục:** Không cần thiết lập lại kết nối cho mỗi tin nhắn
- **Tích hợp sẵn:** Không cần cài đặt thư viện bên ngoài

## 3. Vòng đời của một kết nối WebSocket

Làm việc với WebSocket Client thực chất là quản lý các **Sự kiện (Events)**. Một kết nối sẽ trải qua 4 trạng thái chính mà bạn cần lắng nghe:

1. **Open:** Kết nối đã thiết lập thành công
2. **Message:** Có tin nhắn mới từ Server gửi về
3. **Error:** Có lỗi xảy ra
4. **Close:** Kết nối bị đóng (do mạng rớt hoặc server tắt)

## 4. Thực chiến: Xây dựng Chat Client

Chúng ta sẽ làm một ứng dụng chat đơn giản: Nhập tên, gửi tin nhắn, và hiển thị tin nhắn của mọi người.

### 4.1. Chuẩn bị HTML (Giao diện)

Tạo file `index.html`. Giữ nó đơn giản nhất có thể:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Native WebSocket Chat</title>
    <style>
      /* CSS trang trí một chút cho dễ nhìn */
      #chat-box {
        width: 100%;
        height: 300px;
        border: 1px solid #ccc;
        overflow-y: scroll;
        margin-bottom: 10px;
        padding: 10px;
      }
      .message {
        margin: 5px 0;
      }
      .my-msg {
        color: blue;
        text-align: right;
      }
      .other-msg {
        color: green;
      }
      .system-msg {
        color: gray;
        font-style: italic;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <h2>Phòng Chat Real-time</h2>
    <div id="status">
      Trạng thái: <span style="color:red">Chưa kết nối</span>
    </div>

    <div id="chat-box"></div>

    <input type="text" id="username" placeholder="Tên của bạn" value="Guest" />
    <input type="text" id="messageInput" placeholder="Nhập tin nhắn..." />
    <button onclick="sendMessage()">Gửi</button>
    <button onclick="connectSocket()">Kết nối</button>

    <script src="client.js"></script>
  </body>
</html>
```

### 4.2. JavaScript Client (Phần lõi)

Tạo file `client.js`. Đây là nơi ma thuật diễn ra. Chúng ta sẽ sử dụng đối tượng `WebSocket` có sẵn của trình duyệt. Lưu ý giao thức là `ws://` (hoặc `wss://` nếu có SSL).

```javascript
let socket = null;
const chatBox = document.getElementById("chat-box");
const statusSpan = document.querySelector("#status span");

function connectSocket() {
  // 1. Khởi tạo kết nối đến Server (Giả sử server chạy ở port 8080)
  // Lưu ý: Thay đổi URL này cho khớp với Server của bạn
  socket = new WebSocket("ws://localhost:8080/chat");

  // 2. Lắng nghe sự kiện: Mở kết nối
  socket.onopen = function (event) {
    statusSpan.innerText = "Đã kết nối!";
    statusSpan.style.color = "green";
    logToChat("Hệ thống", "Đã tham gia phòng chat.", "system-msg");
  };

  // 3. Lắng nghe sự kiện: Nhận tin nhắn
  socket.onmessage = function (event) {
    // Dữ liệu nhận về thường là dạng chuỗi JSON
    try {
      const data = JSON.parse(event.data);

      // Xử lý hiển thị ra giao diện
      logToChat(data.sender, data.content, "other-msg");
    } catch (e) {
      console.error("Lỗi parse JSON:", e);
    }
  };

  // 4. Lắng nghe sự kiện: Đóng kết nối
  socket.onclose = function (event) {
    statusSpan.innerText = "Đã ngắt kết nối";
    statusSpan.style.color = "red";
    logToChat("Hệ thống", "Mất kết nối tới server.", "system-msg");

    // MẸO: Thử kết nối lại sau 5 giây (Auto Reconnect)
    setTimeout(connectSocket, 5000);
  };

  // 5. Lắng nghe sự kiện: Lỗi
  socket.onerror = function (error) {
    console.error("WebSocket Error:", error);
  };
}

function sendMessage() {
  const input = document.getElementById("messageInput");
  const username = document.getElementById("username").value;
  const content = input.value;

  if (content && socket && socket.readyState === WebSocket.OPEN) {
    // Tạo object tin nhắn
    const message = {
      sender: username,
      content: content,
      type: "CHAT",
    };

    // Gửi dữ liệu đi (Phải chuyển sang chuỗi JSON)
    socket.send(JSON.stringify(message));

    // Hiển thị tin nhắn của chính mình lên màn hình ngay lập tức
    logToChat("Tôi", content, "my-msg");

    input.value = ""; // Xóa ô nhập
  } else {
    alert("Chưa kết nối tới Server!");
  }
}

// Hàm phụ trợ để render HTML
function logToChat(sender, message, cssClass) {
  const div = document.createElement("div");
  div.className = `message ${cssClass}`;
  div.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight; // Tự cuộn xuống dưới cùng
}

// Tự động kết nối khi tải trang
connectSocket();
```

## 5. Những cạm bẫy cần lưu ý (Expert Tips)

Khi làm việc với WebSocket Client trong thực tế, code trên mới chỉ là bề nổi. Dưới đây là những vấn đề bạn sẽ gặp phải và cách xử lý:

### 5.1. Vấn đề "Kết nối ma" (Ghost Connection)

Đôi khi mạng rớt nhưng trình duyệt không nhận ra ngay lập tức, trạng thái vẫn là OPEN nhưng gửi tin không đi. Giải pháp: Implement cơ chế **Heartbeat (Ping/Pong)**.

- Client định kỳ gửi `ping` lên Server
- Nếu Server không trả lời `pong` trong X giây → Coi như mất mạng và chủ động reconnect

```javascript
// Ví dụ implement Heartbeat
let heartbeatInterval;

socket.onopen = function (event) {
  // Gửi ping mỗi 30 giây
  heartbeatInterval = setInterval(() => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "PING" }));
    }
  }, 30000);
};

socket.onclose = function (event) {
  clearInterval(heartbeatInterval);
};
```

### 5.2. Dữ liệu không phải lúc nào cũng là JSON

WebSocket hỗ trợ gửi cả dữ liệu nhị phân (Binary) như ảnh, âm thanh (Blob hoặc ArrayBuffer). Nếu bạn định làm tính năng gửi ảnh, hãy chú ý thuộc tính `socket.binaryType`.

```javascript
socket.binaryType = "arraybuffer"; // Hoặc 'blob'

socket.onmessage = function (event) {
  if (event.data instanceof ArrayBuffer) {
    // Xử lý dữ liệu ảnh...
    const blob = new Blob([event.data], { type: "image/png" });
    const imageUrl = URL.createObjectURL(blob);

    // Hiển thị ảnh
    const img = document.createElement("img");
    img.src = imageUrl;
    chatBox.appendChild(img);
  } else {
    // Xử lý dữ liệu text/JSON
    const data = JSON.parse(event.data);
    logToChat(data.sender, data.content, "other-msg");
  }
};
```

### 5.3. Bảo mật (WSS)

Tuyệt đối không dùng `ws://` khi ứng dụng đã deploy lên HTTPS.

- Trang web là `https://...` thì WebSocket bắt buộc phải là `wss://...` (WebSocket Secure)
- Nếu không, trình duyệt sẽ chặn kết nối do lỗi "Mixed Content"

```javascript
// Tự động chọn protocol dựa trên trang hiện tại
const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
const wsUrl = `${protocol}//${window.location.host}/chat`;
socket = new WebSocket(wsUrl);
```

## 6. Hiểu về WebSocket ReadyState

Thuộc tính `socket.readyState` cho biết trạng thái hiện tại của kết nối:

| Constant             | Value | Mô tả                                  |
| -------------------- | ----- | -------------------------------------- |
| WebSocket.CONNECTING | 0     | Đang thiết lập kết nối                 |
| WebSocket.OPEN       | 1     | Kết nối đã mở, có thể gửi/nhận dữ liệu |
| WebSocket.CLOSING    | 2     | Đang đóng kết nối                      |
| WebSocket.CLOSED     | 3     | Kết nối đã đóng hoàn toàn              |

```javascript
// Kiểm tra trước khi gửi tin nhắn
function safeSend(data) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(data));
    return true;
  } else {
    console.warn("WebSocket chưa sẵn sàng. State:", socket?.readyState);
    return false;
  }
}
```

## 7. Best Practices

- **Luôn kiểm tra readyState:** Trước khi gửi dữ liệu, đảm bảo kết nối đang OPEN
- **Implement Auto-Reconnect:** Tự động kết nối lại khi mất kết nối
- **Sử dụng Heartbeat:** Phát hiện "ghost connection" và giữ kết nối sống
- **Xử lý lỗi gracefully:** Thông báo cho user khi có vấn đề
- **Clean up resources:** Đóng kết nối khi user rời khỏi trang
- **Sử dụng WSS trên production:** Bảo mật dữ liệu với TLS/SSL

```javascript
// Clean up khi user rời trang
window.addEventListener("beforeunload", () => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.close(1000, "User leaving page");
  }
});
```

## 8. Kết luận

Việc tự viết WebSocket Client bằng Native API giúp bạn kiểm soát hoàn toàn luồng dữ liệu và hiểu rõ bản chất vấn đề, đồng thời giảm dung lượng tải trang đáng kể so với việc gánh thêm cả một thư viện lớn.

Tất nhiên, với các ứng dụng enterprise phức tạp cần fallback sang HTTP Long-polling khi mạng chập chờn (như mạng 3G yếu), lúc đó hãy cân nhắc dùng thư viện như Socket.io. Còn với nhu cầu học tập và ứng dụng vừa phải, Native WebSocket là quá đủ.

WebSocket không chỉ là công nghệ - nó là cầu nối cho những trải nghiệm real-time mượt mà, nơi mà dữ liệu chảy tự nhiên như dòng nước, không bị gián đoạn bởi những lần request/response rời rạc. Khi hiểu rõ Native API, bạn sẽ biết được khi nào nên dùng thư viện và khi nào nên tự build, từ đó tạo ra những ứng dụng tối ưu nhất cho nhu cầu của mình.

Chúc các bạn code vui vẻ và có những ứng dụng chat thật "mượt"!
