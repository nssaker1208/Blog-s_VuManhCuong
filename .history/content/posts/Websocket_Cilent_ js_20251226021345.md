---
title: "WebSocket Client với JavaScript: Xây dựng Chat App không cần thư viện ngoài"
date: "2025-12-25"
draft: false
tags: ["JavaScript", "WebSocket", "Frontend", "Real-time", "Chat App"]
categories: ["Frontend Development", "Web API"]
description: "Hướng dẫn chi tiết cách sử dụng Native WebSocket API trong trình duyệt để xây dựng ứng dụng Chat Real-time. Xử lý kết nối, gửi nhận tin nhắn và tự động kết nối lại."
slug: "websocket-client-javascript-chat"
---

Chào các bạn,

Khi nhắc đến Real-time trên trình duyệt (Browser), cái tên đầu tiên bật ra trong đầu đa số lập trình viên là **Socket.io**. Không phủ nhận Socket.io rất tuyệt, nhưng nó giống như việc bạn dùng một chiếc xe tăng để đi chợ vậy. Đôi khi, nó quá "dư thừa" cho những nhu cầu cơ bản.

Trình duyệt của bạn (Chrome, Firefox, Safari...) thực ra đã tích hợp sẵn một "vũ khí" rất mạnh: **Native WebSocket API**. Nó nhẹ, nhanh và không cần cài thêm bất kỳ gói `npm` nào.

Hôm nay, mình sẽ hướng dẫn các bạn xây dựng một **Chat Client** hoàn chỉnh chỉ bằng Vanilla JavaScript (JS thuần), giúp bạn hiểu sâu sắc cách dữ liệu "chảy" giữa Client và Server.

## 1. WebSocket Client là gì và nó khác HTTP thế nào?

Trước khi code, hãy chỉnh lại tư duy một chút.

Với HTTP truyền thống, Client là kẻ chủ động duy nhất. Muốn lấy tin nhắn mới? Client phải hỏi Server.
Với WebSocket, Client và Server bình đẳng. Sau cú bắt tay ban đầu, đường truyền được giữ thông suốt.

Hãy nhìn hình ảnh so sánh dưới đây để thấy sự khác biệt về "gánh nặng" (overhead) đường truyền:

![So sánh lưu lượng mạng giữa HTTP và WebSocket](https://copilot.microsoft.com/th/id/BCO.b871779a-61d1-4863-89df-4a3d1befd58c.png)
_Hình 1: HTTP (trái) phải gửi kèm Header cồng kềnh mỗi lần request. WebSocket (phải) chỉ gửi đúng phần dữ liệu (payload) qua một "đường ống" đã mở sẵn._

**Lợi ích cốt lõi:**

1.  **Siêu nhẹ:** Không tốn băng thông gửi Headers lặp đi lặp lại.
2.  **Thời gian thực:** Tin nhắn từ người khác sẽ "bắn" thẳng vào màn hình của bạn ngay lập tức (Server Push).

## 2. Vòng đời của một kết nối WebSocket

Làm việc với WebSocket Client thực chất là quản lý các **Sự kiện (Events)**. Một kết nối sẽ trải qua 4 trạng thái chính mà bạn cần lắng nghe:

1.  **Open:** Kết nối đã thiết lập thành công.
2.  **Message:** Có tin nhắn mới từ Server gửi về.
3.  **Error:** Có lỗi xảy ra.
4.  **Close:** Kết nối bị đóng (do mạng rớt hoặc server tắt).

![So sánh lưu lượng mạng giữa HTTP và WebSocket](https://sspark.genspark.ai/cfimages?u1=Zy7Ja%2B%2FKLLxN1%2FmVjZAQoFI4DJX7dSFBDvxGXoafm9WMs0nc51XD0ii%2BV7IEJEMhrhc1Glb%2Fnkx1poEksE6ipVpPCU4Nf7%2BFar56HruuMUyTHSgjCiZl&u2=rj9Nsj%2BvZwI%2B2ZZO&width=2560)
_Hình 2: Luồng sự kiện (Event Flow). Bạn không thể gửi tin nhắn nếu trạng thái chưa phải là OPEN._

## 3. Thực chiến: Xây dựng Chat Client

Chúng ta sẽ làm một ứng dụng chat đơn giản: Nhập tên, gửi tin nhắn, và hiển thị tin nhắn của mọi người.

### 3.1. Chuẩn bị HTML (Giao diện)

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

### 3.2. JavaScript Client (Phần lõi)

Tạo file <code>client.js</code>. Đây là nơi ma thuật diễn ra.

Chúng ta sẽ sử dụng đối tượng <code>WebSocket</code> có sẵn của trình duyệt. Lưu ý giao thức là <code>ws://</code> (hoặc <code>wss:///<code> nếu có SSL).

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

## 4. Những cạm bẫy cần lưu ý (Expert Tips)

Khi làm việc với WebSocket Client trong thực tế, code trên mới chỉ là bề nổi. Dưới đây là những vấn đề bạn sẽ gặp phải và cách xử lý:

### A. Vấn đề "Kết nối ma" (Ghost Connection)

Đôi khi mạng rớt nhưng trình duyệt không nhận ra ngay lập tức, trạng thái vẫn là OPEN nhưng gửi tin không đi. Giải pháp: Implement cơ chế Heartbeat **(Ping/Pong)**.

- Client định kỳ gửi <code>ping</code> lên Server.

- Nếu Server không trả lời <code>pong</code> trong X giây -> Coi như mất mạng và chủ động reconnect.

### Dữ liệu không phải lúc nào cũng là JSON

WebSocket hỗ trợ gửi cả dữ liệu nhị phân (Binary) như ảnh, âm thanh (Blob hoặc ArrayBuffer). Nếu bạn định làm tính năng gửi ảnh, hãy chú ý thuộc tính <code>socket.binaryType</code>.

```javascript
socket.binaryType = "arraybuffer"; // Hoặc "blob"
socket.onmessage = function (event) {
  if (event.data instanceof ArrayBuffer) {
    // Xử lý dữ liệu ảnh...
  }
};
```

### C. Bảo mật (WSS)

Tuyệt đối không dùng <code>ws://</code> khi ứng dụng đã deploy lên HTTPS.

- Trang web là <code>https://...</code> thì WebSocket bắt buộc phải là <code>wss://...</code> (WebSocket Secure).

- Nếu không, trình duyệt sẽ chặn kết nối do lỗi "Mixed Content".

## 5. Kết luận

Việc tự viết WebSocket Client bằng Native API giúp bạn kiểm soát hoàn toàn luồng dữ liệu và hiểu rõ bản chất vấn đề, đồng thời giảm dung lượng tải trang đáng kể so với việc gánh thêm cả một thư viện lớn.

Tất nhiên, với các ứng dụng enterprise phức tạp cần fallback sang HTTP Long-polling khi mạng chập chờn (như mạng 3G yếu), lúc đó hãy cân nhắc dùng thư viện. Còn với nhu cầu học tập và ứng dụng vừa phải, Native WebSocket là quá đủ.

Chúc các bạn code vui vẻ và có những ứng dụng chat thật "mượt"!
