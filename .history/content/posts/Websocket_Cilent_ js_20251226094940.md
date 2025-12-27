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

<div class="max-w-3xl mx-auto px-4 md:px-0 animate-fade-in">

  <p class="text-sm text-gray-500 mb-2">
    <strong>Chủ đề:</strong> Frontend Development, Real-time Communication, Native Web API
  </p>

  <hr class="my-6 border-gray-200">

  <!-- 1. Giới thiệu -->
  <h2 class="mt-8 mb-3 text-2xl md:text-3xl font-bold tracking-tight">
    1. Lời mở đầu
  </h2>

  <p class="mb-4 leading-relaxed text-gray-800" style="text-align: justify;">
    Khi nhắc đến Real-time trên trình duyệt (Browser), cái tên đầu tiên bật ra trong đầu đa số lập trình viên là <strong>Socket.io</strong>. Không phủ nhận Socket.io rất tuyệt, nhưng nó giống như việc bạn dùng một chiếc xe tăng để đi chợ vậy. Đôi khi, nó quá "dư thừa" cho những nhu cầu cơ bản.
  </p>

  <p class="mb-4 leading-relaxed text-gray-800" style="text-align: justify;">
    Trình duyệt của bạn (Chrome, Firefox, Safari...) thực ra đã tích hợp sẵn một "vũ khí" rất mạnh: <strong>Native WebSocket API</strong>. Nó nhẹ, nhanh và không cần cài thêm bất kỳ gói <code>npm</code> nào.
  </p>

  <p class="mb-4 leading-relaxed text-gray-800" style="text-align: justify;">
    Hôm nay, mình sẽ hướng dẫn các bạn xây dựng một <strong>Chat Client</strong> hoàn chỉnh chỉ bằng Vanilla JavaScript (JS thuần), giúp bạn hiểu sâu sắc cách dữ liệu "chảy" giữa Client và Server.
  </p>

  <!-- 2. WebSocket Client là gì? -->
  <h2 class="mt-10 mb-3 text-2xl md:text-3xl font-bold tracking-tight">
    2. WebSocket Client là gì và nó khác HTTP thế nào?
  </h2>

  <p class="mb-4 leading-relaxed text-gray-800" style="text-align: justify;">
    Trước khi code, hãy chỉnh lại tư duy một chút. Với HTTP truyền thống, Client là kẻ chủ động duy nhất. Muốn lấy tin nhắn mới? Client phải hỏi Server. Với WebSocket, Client và Server bình đẳng. Sau cú bắt tay ban đầu, đường truyền được giữ thông suốt.
  </p>

  <p class="mb-4 leading-relaxed text-gray-800" style="text-align: justify;">
    Hãy nhìn hình ảnh so sánh dưới đây để thấy sự khác biệt về "gánh nặng" (overhead) đường truyền:
  </p>

  <div class="flex flex-col items-center my-6" style="text-align: center;">
    <img
      src="https://copilot.microsoft.com/th/id/BCO.b871779a-61d1-4863-89df-4a3d1befd58c.png"
      alt="So sánh HTTP vs WebSocket"
      class="max-w-full h-auto rounded shadow-md transition-transform duration-500 ease-out hover:scale-[1.01]"
    >
    <p class="text-sm text-gray-500 mt-2" style="font-style: italic; font-weight: 600;">
      Hình 1: HTTP (trái) phải gửi kèm Header cồng kềnh mỗi lần request. WebSocket (phải) chỉ gửi đúng phần dữ liệu qua một "đường ống" đã mở sẵn
    </p>
  </div>

  <h3 class="mt-6 mb-2 text-xl font-semibold">
    2.1. Lợi ích cốt lõi của WebSocket
  </h3>

  <ul class="list-disc list-inside space-y-2 mb-6 text-gray-800" style="text-align: justify;">
    <li>
      <strong>Siêu nhẹ:</strong> Không tốn băng thông gửi Headers lặp đi lặp lại
    </li>
    <li>
      <strong>Thời gian thực:</strong> Tin nhắn từ người khác sẽ "bắn" thẳng vào màn hình của bạn ngay lập tức (Server Push)
    </li>
    <li>
      <strong>Kết nối liên tục:</strong> Không cần thiết lập lại kết nối cho mỗi tin nhắn
    </li>
    <li>
      <strong>Tích hợp sẵn:</strong> Không cần cài đặt thư viện bên ngoài
    </li>
  </ul>

  <!-- 3. Vòng đời kết nối -->
  <h2 class="mt-10 mb-3 text-2xl md:text-3xl font-bold tracking-tight">
    3. Vòng đời của một kết nối WebSocket
  </h2>

  <p class="mb-4 leading-relaxed text-gray-800" style="text-align: justify;">
    Làm việc với WebSocket Client thực chất là quản lý các <strong>Sự kiện (Events)</strong>. Một kết nối sẽ trải qua 4 trạng thái chính mà bạn cần lắng nghe:
  </p>

  <ol class="list-decimal list-inside space-y-2 mb-6 text-gray-800" style="text-align: justify;">
    <li><strong>Open:</strong> Kết nối đã thiết lập thành công</li>
    <li><strong>Message:</strong> Có tin nhắn mới từ Server gửi về</li>
    <li><strong>Error:</strong> Có lỗi xảy ra</li>
    <li><strong>Close:</strong> Kết nối bị đóng (do mạng rớt hoặc server tắt)</li>
  </ol>

  <div class="flex flex-col items-center my-6" style="text-align: center;">
    <img
      src="https://copilot.microsoft.com/th/id/BCO.f13e3301-cfce-4f5a-84f0-7fac6e796da8.png"
      alt="WebSocket Event Flow"
      class="max-w-full h-auto rounded shadow-md transition-opacity duration-700 ease-out"
    >
    <p class="text-sm text-gray-500 mt-2" style="font-style: italic; font-weight: 600;">
      Hình 2: Luồng sự kiện (Event Flow). Bạn không thể gửi tin nhắn nếu trạng thái chưa phải là OPEN
    </p>
  </div>

  <!-- 4. Thực chiến -->
  <h2 class="mt-10 mb-3 text-2xl md:text-3xl font-bold tracking-tight">
    4. Thực chiến: Xây dựng Chat Client
  </h2>

  <p class="mb-4 leading-relaxed text-gray-800" style="text-align: justify;">
    Chúng ta sẽ làm một ứng dụng chat đơn giản: Nhập tên, gửi tin nhắn, và hiển thị tin nhắn của mọi người.
  </p>

  <h3 class="mt-6 mb-2 text-xl font-semibold">
    4.1. Chuẩn bị HTML (Giao diện)
  </h3>

  <p class="mb-4 leading-relaxed text-gray-800" style="text-align: justify;">
    Tạo file <code>index.html</code>. Giữ nó đơn giản nhất có thể:
  </p>

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

  <h3 class="mt-6 mb-2 text-xl font-semibold"> 
    4.2. JavaScript Client (Phần lõi) 
  </h3>

  <p class="mb-4 leading-relaxed text-gray-800" style="text-align: justify;"> 
    Tạo file <code>client.js</code>. Đây là nơi ma thuật diễn ra. Chúng ta sẽ sử dụng đối tượng <code>WebSocket</code> có sẵn của trình duyệt. Lưu ý giao thức là <code>ws://</code> (hoặc <code>wss://</code> nếu có SSL). 
  </p>

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

  <!-- 5. Cạm bẫy và Expert Tips -->
  <h2 class="mt-10 mb-3 text-2xl md:text-3xl font-bold tracking-tight"> 
    5. Những cạm bẫy cần lưu ý (Expert Tips) 
  </h2>

  <p class="mb-4 leading-relaxed text-gray-800" style="text-align: justify;"> 
    Khi làm việc với WebSocket Client trong thực tế, code trên mới chỉ là bề nổi. Dưới đây là những vấn đề bạn sẽ gặp phải và cách xử lý: 
  </p>

  <h3 class="mt-6 mb-2 text-xl font-semibold"> 
    5.1. Vấn đề "Kết nối ma" (Ghost Connection) 
  </h3>

  <p class="mb-4 leading-relaxed text-gray-800" style="text-align: justify;"> 
    Đôi khi mạng rớt nhưng trình duyệt không nhận ra ngay lập tức, trạng thái vẫn là OPEN nhưng gửi tin không đi. Giải pháp: Implement cơ chế <strong>Heartbeat (Ping/Pong)</strong>. 
  </p>

  <ul class="list-disc list-inside space-y-2 mb-6 text-gray-800" style="text-align: justify;">
    <li>Client định kỳ gửi <code>ping</code> lên Server</li>
    <li>Nếu Server không trả lời <code>pong</code> trong X giây → Coi như mất mạng và chủ động reconnect</li>
  </ul>

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

  <h3 class="mt-6 mb-2 text-xl font-semibold"> 
    5.2. Dữ liệu không phải lúc nào cũng là JSON 
  </h3>

  <p class="mb-4 leading-relaxed text-gray-800" style="text-align: justify;"> 
    WebSocket hỗ trợ gửi cả dữ liệu nhị phân (Binary) như ảnh, âm thanh (Blob hoặc ArrayBuffer). Nếu bạn định làm tính năng gửi ảnh, hãy chú ý thuộc tính <code>socket.binaryType</code>. 
  </p>

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

  <h3 class="mt-6 mb-2 text-xl font-semibold"> 
    5.3. Bảo mật (WSS) 
  </h3>

  <p class="mb-4 leading-relaxed text-gray-800" style="text-align: justify;"> 
    Tuyệt đối không dùng <code>ws://</code> khi ứng dụng đã deploy lên HTTPS. 
  </p>

  <ul class="list-disc list-inside space-y-2 mb-6 text-gray-800" style="text-align: justify;">
    <li>Trang web là <code>https://...</code> thì WebSocket bắt buộc phải là <code>wss://...</code> (WebSocket Secure)</li>
    <li>Nếu không, trình duyệt sẽ chặn kết nối do lỗi "Mixed Content"</li>
  </ul>
  
```javascript
// Tự động chọn protocol dựa trên trang hiện tại
const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const wsUrl = `${protocol}//${window.location.host}/chat`;
socket = new WebSocket(wsUrl);
```

  <!-- 6. WebSocket ReadyState -->
  <h2 class="mt-10 mb-3 text-2xl md:text-3xl font-bold tracking-tight"> 
    6. Hiểu về WebSocket ReadyState 
  </h2>

  <p class="mb-4 leading-relaxed text-gray-800" style="text-align: justify;"> 
    Thuộc tính <code>socket.readyState</code> cho biết trạng thái hiện tại của kết nối: 
  </p>

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

  <!-- 7. Best Practices -->
  <h2 class="mt-10 mb-3 text-2xl md:text-3xl font-bold tracking-tight"> 
    7. Best Practices 
  </h2>

  <ul class="list-disc list-inside space-y-2 mb-6 text-gray-800" style="text-align: justify;">
    <li> <strong>Luôn kiểm tra readyState:</strong> Trước khi gửi dữ liệu, đảm bảo kết nối đang OPEN </li> 
    <li> <strong>Implement Auto-Reconnect:</strong> Tự động kết nối lại khi mất kết nối </li> 
    <li> <strong>Sử dụng Heartbeat:</strong> Phát hiện "ghost connection" và giữ kết nối sống </li> 
    <li> <strong>Xử lý lỗi gracefully:</strong> Thông báo cho user khi có vấn đề </li> 
    <li> <strong>Clean up resources:</strong> Đóng kết nối khi user rời khỏi trang </li> 
    <li> <strong>Sử dụng WSS trên production:</strong> Bảo mật dữ liệu với TLS/SSL </li> 
  </ul>

```javascript
// Clean up khi user rời trang
window.addEventListener("beforeunload", () => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.close(1000, "User leaving page");
  }
});
```

  <!-- 8. Kết luận -->
  <h2 class="mt-10 mb-3 text-2xl md:text-3xl font-bold tracking-tight"> 
    8. Kết luận 
  </h2> 
  
  <p class="mb-4 leading-relaxed text-gray-800" style="text-align: justify;"> 
    Việc tự viết WebSocket Client bằng Native API giúp bạn kiểm soát hoàn toàn luồng dữ liệu và hiểu rõ bản chất vấn đề, đồng thời giảm dung lượng tải trang đáng kể so với việc gánh thêm cả một thư viện lớn. 
  </p> 
  <p class="mb-6 leading-relaxed text-gray-800" style="text-align: justify;"> 
    Tất nhiên, với các ứng dụng enterprise phức tạp cần fallback sang HTTP Long-polling khi mạng chập chờn (như mạng 3G yếu), lúc đó hãy cân nhắc dùng thư viện như Socket.io. Còn với nhu cầu học tập và ứng dụng vừa phải, Native WebSocket là quá đủ. 
  </p> 
  <p class="mb-6 leading-relaxed text-gray-800" style="text-align: justify;"> 
    WebSocket không chỉ là công nghệ - nó là cầu nối cho những trải nghiệm real-time mượt mà, nơi mà dữ liệu chảy tự nhiên như dòng nước, không bị gián đoạn bởi những lần request/response rời rạc. Khi hiểu rõ Native API, bạn sẽ biết được khi nào nên dùng thư viện và khi nào nên tự build, từ đó tạo ra những ứng dụng tối ưu nhất cho nhu cầu của mình. 
  </p> 
  <p class="mb-6 leading-relaxed text-gray-800" style="text-align: justify;"> 
    Chúc các bạn code vui vẻ và có những ứng dụng chat thật "mượt"! 
  </p> 
</div>
