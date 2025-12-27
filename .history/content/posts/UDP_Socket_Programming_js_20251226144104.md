---
title: "UDP Socket Programming - Gửi và nhận Datagram"
date: "2025-12-26"
draft: false
comments: true
tags: ["Java", "Network Programming", "UDP", "Socket", "IoT", "Datagram"]
categories: ["Backend Development", "Networking", "Java Programming"]
description: "Tại sao game online lại dùng UDP thay vì TCP? Hướng dẫn lập trình gửi/nhận Datagram bằng Java và so sánh chi tiết hai giao thức huyền thoại này"
slug: "udp-socket-programming-java"
---

<div class="max-w-3xl mx-auto px-4 md:px-0 animate-fade-in">

  <p class="text-sm text-gray-500 mb-2">
    <strong>Chủ đề:</strong> Network Programming, UDP Protocol, Java Socket
  </p>

  <hr class="my-6 border-gray-200">

  <!-- 1. Giới thiệu -->
  <h2 class="mt-8 mb-3 text-2xl md:text-3xl font-bold tracking-tight">
    1. Lời mở đầu
  </h2>

  <p class="mb-4 leading-relaxed text-gray-800" style="text-align: justify;">
    Khi mới học lập trình mạng, chúng ta thường bắt đầu với <strong>TCP</strong> (Transmission Control Protocol). Nó an toàn, tin cậy, đảm bảo dữ liệu "đi đến nơi về đến chốn". Nhưng trong thế giới thực, đôi khi "nhanh" quan trọng hơn "chính xác tuyệt đối".
  </p>

  <p class="mb-4 leading-relaxed text-gray-800" style="text-align: justify;">
    Hãy tưởng tượng bạn đang gọi video call. Nếu mạng lag, bạn thà bị mất hình một tích tắc (glitch) rồi video chạy tiếp mượt mà, hay bạn muốn video dừng hẳn lại 3 giây để chờ tải lại cái khung hình bị mất đó? Chắc chắn là phương án đầu tiên rồi. Đó chính là đất diễn của <strong>UDP</strong>.
  </p>

  <p class="mb-4 leading-relaxed text-gray-800" style="text-align: justify;">
    Hôm nay, chúng ta sẽ đi sâu vào UDP Socket Programming để hiểu cách các gói tin (Datagram) bay lượn trong mạng như thế nào.
  </p>

  <!-- 2. UDP là gì? -->
  <h2 class="mt-10 mb-3 text-2xl md:text-3xl font-bold tracking-tight">
    2. UDP là gì? (Và tại sao nó lại... cẩu thả?)
  </h2>

  <p class="mb-4 leading-relaxed text-gray-800" style="text-align: justify;">
    <strong>UDP (User Datagram Protocol)</strong> là một giao thức không kết nối (connectionless). Khác với TCP - anh chàng thủ thư khó tính, luôn bắt bạn phải đăng ký, điểm danh (Handshake) rồi mới cho mượn sách - UDP giống như một anh shipper ném báo vào sân nhà bạn. Anh ta ném xong là đi, không cần biết bạn có nhặt được báo hay không, hay con chó nhà bạn có xé tan tờ báo đó không.
  </p>

  <h3 class="mt-6 mb-2 text-xl font-semibold">
    2.1. Đặc điểm cốt lõi của UDP
  </h3>

  <ul class="list-disc list-inside space-y-2 mb-6 text-gray-800" style="text-align: justify;">
    <li>
      <strong>Không kết nối:</strong> Client không cần kết nối với Server trước khi gửi. Cứ biết IP và Port là gửi thôi
    </li>
    <li>
      <strong>Không đảm bảo:</strong> Gói tin có thể bị mất, bị trùng, hoặc đến sai thứ tự
    </li>
    <li>
      <strong>Tốc độ cao:</strong> Vì bỏ qua các bước kiểm tra, xác nhận (ACK), UDP nhanh hơn TCP rất nhiều
    </li>
    <li>
      <strong>Theo gói (Datagram):</strong> Dữ liệu được đóng gói thành các <code>DatagramPacket</code> độc lập
    </li>
  </ul>

  <div class="flex flex-col items-center my-6" style="text-align: center;">
    <img
      src="https://miro.medium.com/v2/resize:fit:1400/1*DbRGqB3NrGTNp1ybss8KeQ.jpeg"
      alt="TCP vs UDP Header Comparison"
      class="max-w-full h-auto rounded shadow-md transition-transform duration-500 ease-out hover:scale-[1.01]"
    >
    <p class="text-sm text-gray-500 mt-2" style="font-style: italic; font-weight: 600;">
      Hình 1: So sánh Header giữa TCP và UDP
    </p>
  </div>

  <!-- 3. Nguyên lý hoạt động -->
  <h2 class="mt-10 mb-3 text-2xl md:text-3xl font-bold tracking-tight">
    3. Nguyên lý hoạt động: Mô hình Datagram
  </h2>

  <p class="mb-4 leading-relaxed text-gray-800" style="text-align: justify;">
    Trong Java (và hầu hết các ngôn ngữ khác), để làm việc với UDP, chúng ta dùng hai lớp chính:
  </p>

  <ul class="list-disc list-inside space-y-2 mb-6 text-gray-800" style="text-align: justify;">
    <li>
      <strong>DatagramSocket:</strong> Cánh cổng để gửi/nhận dữ liệu (Giống cái hòm thư)
    </li>
    <li>
      <strong>DatagramPacket:</strong> Gói hàng chứa dữ liệu, địa chỉ IP và Port người nhận (Giống cái phong bì thư)
    </li>
  </ul>

  <h3 class="mt-6 mb-2 text-xl font-semibold">
    3.1. Quy trình gửi/nhận
  </h3>

  <ol class="list-decimal list-inside space-y-2 mb-6 text-gray-800" style="text-align: justify;">
    <li>
      <strong>Sender (Người gửi):</strong> Đóng gói dữ liệu vào <code>DatagramPacket</code> → Ghi rõ địa chỉ người nhận → Đẩy ra <code>DatagramSocket</code>
    </li>
    <li>
      <strong>Receiver (Người nhận):</strong> Mở <code>DatagramSocket</code> tại một Port cụ thể → Tạo một <code>DatagramPacket</code> rỗng (như cái rổ) để hứng dữ liệu → Chờ đợi
    </li>
  </ol>

  <div class="flex flex-col items-center my-6" style="text-align: center;">
    <img
      src="https://thietbimanggiare.com/wp-content/uploads/2024/02/Vi-du-ve-Flag-trong-quy-trinh-bat-tay-3-buoc-TCP.jpg"
      alt="UDP Flow Diagram"
      class="max-w-full h-auto rounded shadow-md transition-opacity duration-700 ease-out"
    >
    <p class="text-sm text-gray-500 mt-2" style="font-style: italic; font-weight: 600;">
      Hình 2: Luồng đi của UDP. Không có bước "Establish Connection" (bắt tay 3 bước) như TCP
    </p>
  </div>

  <!-- 4. Thực hành -->
  <h2 class="mt-10 mb-3 text-2xl md:text-3xl font-bold tracking-tight">
    4. Thực hành: Xây dựng ứng dụng Gửi/Nhận tin nhắn
  </h2>

  <p class="mb-4 leading-relaxed text-gray-800" style="text-align: justify;">
    Chúng ta sẽ viết một chương trình đơn giản:
  </p>

  <ul class="list-disc list-inside space-y-1 mb-6 text-gray-800" style="text-align: justify;">
    <li><strong>Server:</strong> Chạy ở cổng 9876, chờ nhận tin nhắn và in ra màn hình</li>
    <li><strong>Client:</strong> Cho phép người dùng nhập tin nhắn và gửi tới Server</li>
  </ul>

  <h3 class="mt-6 mb-2 text-xl font-semibold">
    4.1. UDPServer.java (Người nhận)
  </h3>

```javascript
import java.net.*;

public class UDPServer {
    public static void main(String[] args) {
        try {
            // 1. Mở cổng 9876 để lắng nghe
            DatagramSocket serverSocket = new DatagramSocket(9876);
            System.out.println("Server đang chạy tại port 9876...");
            // Tạo bộ đệm để chứa dữ liệu nhận về (1KB)
            byte[] receiveData = new byte;

            while (true) {
                // 2. Tạo gói tin rỗng để hứng dữ liệu
                DatagramPacket receivePacket = new DatagramPacket(receiveData, receiveData.length);

                // 3. Chờ nhận dữ liệu (Hàm này sẽ BLOCK cho đến khi có tin nhắn đến)
                serverSocket.receive(receivePacket);

                // 4. Xử lý dữ liệu nhận được
                String sentence = new String(receivePacket.getData(), 0, receivePacket.getLength());
                InetAddress IPAddress = receivePacket.getAddress();
                int port = receivePacket.getPort();
                System.out.println("Đã nhận từ " + IPAddress + ":" + port + " -> " + sentence);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```
