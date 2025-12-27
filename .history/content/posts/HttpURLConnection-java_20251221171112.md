---
title: "HTTP Request/Response với Java HttpURLConnection"
date: "2025-12-21"
draft: false
comments: true
tags: ["Java", "HTTP", "API", "HttpURLConnection", "REST", "JSON"]
categories: ["Java Programming", "Web Development", "API Development"]
description: "Hướng dẫn chi tiết về cách gửi GET/POST request, xử lý JSON response từ API với Java HttpURLConnection"
---

<div class="max-w-3xl mx-auto px-4 md:px-0 animate-fade-in">

  <p class="text-sm text-gray-500 mb-2">
    <strong>Chủ đề:</strong> Lập trình mạng, Java Core, Web Development
  </p>

  <hr class="my-6 border-gray-200">

  <!-- 1. Giới thiệu -->
  <h2 class="mt-8 mb-3 text-2xl md:text-3xl font-bold tracking-tight">
    1. Giới thiệu
  </h2>

  <p class="mb-4 leading-relaxed text-gray-800" style="text-align: justify;">
    Trong thế giới số hóa ngày nay, việc giao tiếp giữa các ứng dụng qua mạng Internet đã trở thành một phần không thể thiếu. HTTP (HyperText Transfer Protocol) là giao thức nền tảng của World Wide Web, hoạt động theo mô hình request-response. Java cung cấp <code>HttpURLConnection</code> - một class mạnh mẽ để thực hiện các HTTP request mà không cần thêm thư viện ngoài.
  </p>

  <!-- 2. Hiểu về giao thức HTTP -->
  <h2 class="mt-10 mb-3 text-2xl md:text-3xl font-bold tracking-tight">
    2. Hiểu về giao thức HTTP
  </h2>

  <p class="mb-4 leading-relaxed text-gray-800" style="text-align: justify;">
    HTTP hoạt động theo mô hình client-server, giống như một cuộc đối thoại: client gửi yêu cầu (request), server xử lý và trả về kết quả (response). Mỗi lần bạn truy cập một trang web, tải file, hoặc gửi dữ liệu lên server, tất cả đều thông qua HTTP.
  </p>

  <div class="flex flex-col items-center my-6" style="text-align: center;">
    <img
      src="https://media.geeksforgeeks.org/wp-content/uploads/20250705152348042640/Request-and-Response-Cycle.webp"
      alt="HTTP Request-Response Cycle"
      class="max-w-full h-auto rounded shadow-md transition-transform duration-500 ease-out hover:scale-[1.01]"
    >
    <p class="text-sm text-gray-500 mt-2" style="font-style: italic; font-weight: 600;">
      Hình 1: Chu trình Request-Response trong giao thức HTTP
    </p>
  </div>

  <h3 class="mt-6 mb-2 text-xl font-semibold">
    2.1. Các thành phần của HTTP Request
  </h3>

  <ul class="list-disc list-inside mb-4 text-gray-800" style="text-align: justify;">
    <li><strong>Method:</strong> Loại hành động (GET, POST, PUT, DELETE...)</li>
    <li><strong>URL:</strong> Địa chỉ tài nguyên cần truy cập</li>
    <li><strong>Headers:</strong> Thông tin bổ sung về request</li>
    <li><strong>Body:</strong> Dữ liệu gửi kèm (chủ yếu với POST/PUT)</li>
  </ul>

  <h3 class="mt-4 mb-2 text-xl font-semibold">
    2.2. Các thành phần của HTTP Response
  </h3>

  <ul class="list-disc list-inside mb-6 text-gray-800" style="text-align: justify;">
    <li><strong>Status Code:</strong> Mã trạng thái (200 OK, 404 Not Found, 500 Internal Server Error...)</li>
    <li><strong>Headers:</strong> Thông tin về response</li>
    <li><strong>Body:</strong> Dữ liệu trả về (HTML, JSON, XML...)</li>
  </ul>

  <!-- 3. Java HttpURLConnection -->
  <h2 class="mt-10 mb-3 text-2xl md:text-3xl font-bold tracking-tight">
    3. Java HttpURLConnection
  </h2>

  <p class="mb-4 leading-relaxed text-gray-800" style="text-align: justify;">
    <code>HttpURLConnection</code> là một class trong package <code>java.net</code>, cung cấp các phương thức để thực hiện HTTP request. Đây là phần của Java Standard Edition, có sẵn mà không cần thêm dependency.
  </p>

  <div class="flex flex-col items-center my-6" style="text-align: center;">
    <img
      src="https://sspark.genspark.ai/cfimages?u1=Q8G82RIXhkM0Snmhi0cLsHSIv3I3DBnslkTo0jBVBRM2HOCqVK1V1NPcnFZztgUT%2FwWc%2BFrO4SzvI5uHK3NXharRuYCTS%2B0KQgZn1vB4fAyMaFlGIK7m1nO3L0VaJPFzF1Qq4l0%3D&u2=PGJmuvHzVpmTYkkn&width=2560"
      alt="HttpURLConnection Overview"
      class="max-w-full h-auto rounded shadow-md transition-opacity duration-700 ease-out"
    >
    <p class="text-sm text-gray-500 mt-2" style="font-style: italic; font-weight: 600;">
      Hình 2: HttpURLConnection - công cụ mạnh mẽ của Java để thực hiện HTTP request
    </p>
  </div>

  <p class="mb-3 font-semibold text-gray-900" style="text-align: justify;">
    Đặc điểm nổi bật:
  </p>

  <ul class="list-disc list-inside space-y-1 mb-6 text-gray-800" style="text-align: justify;">
    <li><strong>Tích hợp sẵn:</strong> Không cần thêm thư viện ngoài</li>
    <li><strong>Linh hoạt:</strong> Hỗ trợ tất cả HTTP methods (GET, POST, PUT, DELETE...)</li>
    <li><strong>Hiệu quả:</strong> Quản lý connection tốt với timeout và retry</li>
    <li><strong>Bảo mật:</strong> Hỗ trợ HTTPS một cách tự nhiên</li>
  </ul>

  <!-- 4. Gửi GET Request -->
  <h2 class="mt-10 mb-3 text-2xl md:text-3xl font-bold tracking-tight">
    4. Gửi GET Request
  </h2>

  <p class="mb-4 leading-relaxed text-gray-800" style="text-align: justify;">
    GET request được sử dụng để lấy thông tin từ server mà không làm thay đổi dữ liệu. Đây là phương thức đơn giản và phổ biến nhất trong HTTP.
  </p>

  <h3 class="mt-6 mb-2 text-xl font-semibold">
    4.1. Ví dụ code GET Request
  </h3>

```java
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class HttpGetExample {

    /**
     * Thực hiện GET request đến một URL và trả về response dạng String
     * @param urlString URL cần gọi
     * @return Response body dạng String
     * @throws IOException Nếu có lỗi kết nối
     */
    public static String sendGetRequest(String urlString) throws IOException {
        // Tạo URL object từ string
        URL url = new URL(urlString);

        // Mở kết nối và cast thành HttpURLConnection
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();

        try {
            // Thiết lập method là GET (mặc định)
            connection.setRequestMethod("GET");

            // Thiết lập headers cần thiết
            connection.setRequestProperty("Accept", "application/json");
            connection.setRequestProperty("User-Agent", "Java HTTP Client");

            // Thiết lập timeout (10 giây)
            connection.setConnectTimeout(10000);
            connection.setReadTimeout(10000);

            // Lấy response code
            int responseCode = connection.getResponseCode();
            System.out.println("Response Code: " + responseCode);

        // Đọc response
            BufferedReader reader;
            if (responseCode >= 200 && responseCode < 300) {
                // Success response
                reader = new BufferedReader(
                    new InputStreamReader(connection.getInputStream())
                );
            } else {
                // Error response
                reader = new BufferedReader(
                    new InputStreamReader(connection.getErrorStream())
                );
            }

            // Đọc từng dòng và ghép lại
            String line;
            StringBuilder response = new StringBuilder();
            while ((line = reader.readLine()) != null) {
                response.append(line);
            }
            reader.close();

            return response.toString();

        } finally {
            // Đảm bảo đóng connection
            connection.disconnect();
        }
    }

    // Ví dụ sử dụng
    public static void main(String[] args) {
        try {
            String apiUrl = "https://jsonplaceholder.typicode.com/posts/1";
            String result = sendGetRequest(apiUrl);
            System.out.println("Response: " + result);
        } catch (IOException e) {
            System.err.println("Lỗi khi gửi GET request: " + e.getMessage());
        }
    }
}
```

<h3 class="mt-6 mb-2 text-xl font-semibold">
4.2. Giải thích các bước quan trọng
</h3>

<ol class="list-decimal list-inside space-y-1 mb-6 text-gray-800" style="text-align: justify;">
<li><strong>URL Creation:</strong> Tạo object URL từ string</li>
<li><strong>Connection Setup:</strong> Mở kết nối và thiết lập các thuộc tính</li>
<li><strong>Headers:</strong> Thêm các header cần thiết như Accept và User-Agent</li>
<li><strong>Timeout:</strong> Thiết lập thời gian chờ để tránh treo ứng dụng</li>
<li><strong>Response Handling:</strong> Xử lý response khác nhau tùy theo status code</li>
<li><strong>Resource Management:</strong> Đảm bảo đóng connection và stream</li>
</ol>

<!-- 5. Gửi POST Request -->
<h2 class="mt-10 mb-3 text-2xl md:text-3xl font-bold tracking-tight">
5. Gửi POST Request
</h2>

<p class="mb-4 leading-relaxed text-gray-800" style="text-align: justify;">
POST request phức tạp hơn GET vì nó gửi dữ liệu lên server. Phương thức này thường được sử dụng để tạo mới dữ liệu, gửi form, hoặc upload file.
</p>

<div class="flex flex-col items-center my-6" style="text-align: center;">
<img
  src="https://sspark.genspark.ai/cfimages?u1=nPyzLZgsOpj3Pqd%2BcyvuLJlMj53u%2BFTuWxOia1rOI1hpEEcJhudeoK%2FfZ0D1iNXXy%2FQQLH0HbeTp78LXOjdkGs9BXsc7qe62LCJaTddNhpuD&u2=gerRMxSuIIJgMJLr&width=2560"
  alt="GET vs POST Request"
  class="max-w-full h-auto rounded shadow-md"
>
<p class="text-sm text-gray-500 mt-2" style="font-style: italic; font-weight: 600;">
  Hình 3: Sự khác biệt giữa GET và POST request
</p>
</div>

<h3 class="mt-6 mb-2 text-xl font-semibold">
5.1. Ví dụ code POST Request với JSON
</h3>

```java
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

public class HttpPostExample {

    /**
     * Thực hiện POST request với JSON data
     * @param urlString URL endpoint
     * @param jsonData Dữ liệu JSON để gửi
     * @return Response body dạng String
     * @throws IOException Nếu có lỗi kết nối
     */
    public static String sendPostRequest(String urlString, String jsonData) throws IOException {
        URL url = new URL(urlString);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();

        try {
            // Thiết lập method là POST
            connection.setRequestMethod("POST");

            // Thiết lập headers cho JSON
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setRequestProperty("Accept", "application/json");
            connection.setRequestProperty("User-Agent", "Java HTTP Client");

            // Cho phép gửi output (dữ liệu)
            connection.setDoOutput(true);

            // Thiết lập timeout
            connection.setConnectTimeout(10000);
            connection.setReadTimeout(10000);

            // Gửi dữ liệu JSON
            if (jsonData != null && !jsonData.isEmpty()) {
                byte[] jsonBytes = jsonData.getBytes(StandardCharsets.UTF_8);
                connection.setRequestProperty("Content-Length", String.valueOf(jsonBytes.length));

                try (OutputStream outputStream = connection.getOutputStream()) {
                    outputStream.write(jsonBytes);
                    outputStream.flush();
                }
            }

            // Lấy response code
            int responseCode = connection.getResponseCode();
            System.out.println("Response Code: " + responseCode);

            // Đọc response
            BufferedReader reader;
            InputStream inputStream;

            if (responseCode >= 200 && responseCode < 300) {
                inputStream = connection.getInputStream();
            } else {
                inputStream = connection.getErrorStream();
            }

            if (inputStream != null) {
                reader = new BufferedReader(
                    new InputStreamReader(inputStream, StandardCharsets.UTF_8)
                );

                StringBuilder response = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    response.append(line);
                }
                reader.close();

                return response.toString();
            }

            return "";

        } finally {
            connection.disconnect();
        }
    }

    // Ví dụ sử dụng
    public static void main(String[] args) {
        try {
            String apiUrl = "https://jsonplaceholder.typicode.com/posts";

            // Dữ liệu JSON để gửi
            String jsonData = "{\n" +
                "  \"title\": \"Bài viết mới\",\n" +
                "  \"body\": \"Nội dung bài viết thú vị\",\n" +
                "  \"userId\": 1\n" +
                "}";

            String result = sendPostRequest(apiUrl, jsonData);
            System.out.println("Response: " + result);

        } catch (IOException e) {
            System.err.println("Lỗi khi gửi POST request: " + e.getMessage());
        }
    }
}
```

<h3 class="mt-6 mb-2 text-xl font-semibold">
5.2. Điểm khác biệt chính của POST Request
</h3>

<ul class="list-disc list-inside mb-6 text-gray-800" style="text-align: justify;">
<li><strong>setDoOutput(true):</strong> Cho phép gửi dữ liệu ra ngoài</li>
<li><strong>Content-Type Header:</strong> Chỉ định kiểu dữ liệu gửi đi (application/json)</li>
<li><strong>OutputStream:</strong> Sử dụng để ghi dữ liệu vào request body</li>
<li><strong>Content-Length:</strong> Chỉ định độ dài của dữ liệu</li>
</ul>

<!-- 6. Xử lý JSON Response -->
<h2 class="mt-10 mb-3 text-2xl md:text-3xl font-bold tracking-tight">
6. Xử lý JSON Response
</h2>

<p class="mb-4 leading-relaxed text-gray-800" style="text-align: justify;">
JSON (JavaScript Object Notation) là định dạng dữ liệu phổ biến nhất trong các REST API. Để xử lý JSON response, chúng ta cần parse chuỗi JSON thành các object Java.
</p>

<h3 class="mt-6 mb-2 text-xl font-semibold">
6.1. Sử dụng thư viện Gson
</h3>

```java
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import java.io.IOException;

public class JsonResponseHandler {

    // Class để mapping JSON response
    public static class Post {
        private int userId;
        private int id;
        private String title;
        private String body;

        // Constructors, getters, setters
        public Post() {}

        public int getUserId() { return userId; }
        public void setUserId(int userId) { this.userId = userId; }

        public int getId() { return id; }
        public void setId(int id) { this.id = id; }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getBody() { return body; }
        public void setBody(String body) { this.body = body; }

        @Override
        public String toString() {
            return "Post{" +
                   "userId=" + userId +
                   ", id=" + id +
                   ", title='" + title + '\'' +
                   ", body='" + body + '\'' +
                   '}';
        }
    }

    // Hàm parse JSON string thành đối tượng Post
    public static Post parseJsonToPost(String jsonResponse) {
        Gson gson = new Gson();
        return gson.fromJson(jsonResponse, Post.class);
    }

    // Hàm parse JSON string thành JsonObject (nếu muốn thao tác trực tiếp)
    public static JsonObject parseJsonObject(String jsonResponse) {
        return JsonParser.parseString(jsonResponse).getAsJsonObject();
    }

    // Ví dụ sử dụng
    public static void main(String[] args) throws IOException {
        // Ví dụ response JSON giả định (thường lấy từ HttpURLConnection)
        String jsonResponse = "{\n" +
                "  \"userId\": 1,\n" +
                "  \"id\": 101,\n" +
                "  \"title\": \"Bài viết mới\",\n" +
                "  \"body\": \"Nội dung bài viết thú vị\"\n" +
                "}";

        // Parse thành đối tượng Post
        Post post = parseJsonToPost(jsonResponse);
        System.out.println("Mapping thành đối tượng Post:");
        System.out.println(post);

        // Parse thành JsonObject để thao tác trực tiếp
        JsonObject jsonObject = parseJsonObject(jsonResponse);
        System.out.println("\nTruy cập trực tiếp JsonObject:");
        System.out.println("Title: " + jsonObject.get("title").getAsString());
        System.out.println("Body: " + jsonObject.get("body").getAsString());
    }
}
```

<!-- 7. Xác thực API với Token -->
<h2 class="mt-10 mb-3 text-2xl md:text-3xl font-bold tracking-tight">
7. Xác thực API với Token
</h2>

<p class="mb-4 leading-relaxed text-gray-800" style="text-align: justify;">
Trong thực tế, hầu hết các API đều yêu cầu xác thực người dùng thông qua Token (JWT - JSON Web Token) hoặc API Key. Việc này được thực hiện thông qua header <code>Authorization</code>.
</p>

```java
public static String sendAuthenticatedRequest(String urlString, String token) throws IOException {
    URL url = new URL(urlString);
    HttpURLConnection connection = (HttpURLConnection) url.openConnection();

    try {
        connection.setRequestMethod("GET");
        connection.setRequestProperty("Accept", "application/json");

        // QUAN TRỌNG: Thêm header xác thực
        // Format chuẩn: "Bearer <token>"
        connection.setRequestProperty("Authorization", "Bearer " + token);

        int responseCode = connection.getResponseCode();

        // Xử lý response như bình thường...
        // (Code đọc stream tương tự phần trên)

        if (responseCode == 401) {
            throw new IOException("Lỗi xác thực: Token không hợp lệ hoặc đã hết hạn.");
        }

        // ... return result
        return "Success"; // Demo return
    } finally {
        connection.disconnect();
    }
}
```

<blockquote class="border-l-4 border-blue-500 pl-4 italic text-gray-700 mb-6" style="text-align: justify;">
<strong>Lưu ý:</strong> Không bao giờ hard-code Token hoặc API Key trong code. Hãy sử dụng biến môi trường (Environment Variables) hoặc file config để bảo mật.
</blockquote>

<!-- 8. Xử lý lỗi -->
<h2 class="mt-10 mb-3 text-2xl md:text-3xl font-bold tracking-tight">
8. Xử lý lỗi nâng cao
</h2>

<p class="mb-4 leading-relaxed text-gray-800" style="text-align: justify;">
Một ứng dụng tốt không chỉ chạy mượt khi mọi thứ hoàn hảo, mà còn phải xử lý tốt các trường hợp lỗi. <code>HttpURLConnection</code> ném ra <code>IOException</code> cho các lỗi mạng, nhưng với các lỗi logic từ server (4xx, 5xx), chúng ta cần xử lý <code>ErrorStream</code>.
</p>

<p class="mb-3 font-semibold text-gray-900" style="text-align: justify;">
Phân loại Status Code:
</p>

<ul class="list-disc list-inside space-y-1 mb-6 text-gray-800" style="text-align: justify;">
<li><strong>2xx:</strong> Thành công (200 OK, 201 Created)</li>
<li><strong>4xx:</strong> Lỗi do client (400 Bad Request, 401 Unauthorized, 404 Not Found)</li>
<li><strong>5xx:</strong> Lỗi do server (500 Internal Server Error, 503 Service Unavailable)</li>
</ul>

```java
// Đoạn code xử lý luồng input/error stream tối ưu
InputStream stream;
if (status > 299) {
    stream = connection.getErrorStream();
    if (stream == null) {
        // Trường hợp server trả về lỗi nhưng không có body
        throw new IOException("Request failed with HTTP code: " + status);
    }
} else {
    stream = connection.getInputStream();
}

// Đọc stream và parse JSON lỗi để hiển thị thông báo thân thiện cho user
```

<!-- 9. Best Practices -->
<h2 class="mt-10 mb-3 text-2xl md:text-3xl font-bold tracking-tight">
9. Best Practices
</h2>

<ul class="list-disc list-inside space-y-2 mb-6 text-gray-800" style="text-align: justify;">
<li>
  <strong>Sử dụng try-with-resources:</strong>
  Đảm bảo các stream và connection được đóng tự động
</li>
<li>
  <strong>Thiết lập timeout:</strong>
  Tránh ứng dụng bị treo khi server không phản hồi
</li>
<li>
  <strong>Xử lý lỗi đầy đủ:</strong>
  Kiểm tra status code và đọc error stream khi có lỗi
</li>
<li>
  <strong>Tạo utility class:</strong>
  Đóng gói logic HTTP request vào class riêng để tái sử dụng
</li>
<li>
  <strong>Bảo mật thông tin:</strong>
  Không hard-code token, API key trong source code
</li>
</ul>

<!-- 10. Java 11 HttpClient -->
<h2 class="mt-10 mb-3 text-2xl md:text-3xl font-bold tracking-tight">
10. Nhìn về tương lai: Java 11 HttpClient
</h2>

<p class="mb-4 leading-relaxed text-gray-800" style="text-align: justify;">
Mặc dù <code>HttpURLConnection</code> vẫn hoạt động tốt, nhưng từ Java 11, Oracle đã giới thiệu <code>java.net.http.HttpClient</code> - một API hiện đại hơn, hỗ trợ Asynchronous và HTTP/2.
</p>

```java
// Ví dụ với Java 11 HttpClient
HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder()
      .uri(URI.create("https://jsonplaceholder.typicode.com/posts/1"))
      .build();

// Code cực kỳ ngắn gọn và dễ đọc
HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
System.out.println(response.body());
```

<p class="mb-3 leading-relaxed font-bold text-gray-800" style="text-align: justify;">
So sánh nhanh:
</p>

| Đặc điểm           | HttpURLConnection  | Java 11 HttpClient   |
| ------------------ | ------------------ | -------------------- |
| **Phiên bản Java** | Java 1.1+          | Java 11+             |
| **Cú pháp**        | Dài dòng, phức tạp | Ngắn gọn, Fluent API |
| **HTTP/2**         | Không hỗ trợ       | Hỗ trợ               |
| **Async**          | Không              | Có                   |
| **Use case**       | Legacy projects    | Modern applications  |

<!-- 11. Kết luận -->
<h2 class="mt-10 mb-3 text-2xl md:text-3xl font-bold tracking-tight">
11. Kết luận
</h2>

<p class="mb-6 leading-relaxed text-gray-800" style="text-align: justify;">
<code>HttpURLConnection</code> là công cụ cơ bản nhưng mạnh mẽ để thực hiện HTTP request trong Java. Việc nắm vững cách sử dụng nó không chỉ giúp bạn hiểu sâu về cách HTTP hoạt động mà còn giúp làm việc với các hệ thống legacy một cách dễ dàng. Tuy nhiên, trong các dự án mới, hãy cân nhắc sử dụng các thư viện hiện đại như <strong>OkHttp</strong>, <strong>Apache HttpClient</strong> hoặc <strong>Java 11 HttpClient</strong> để tăng năng suất và hiệu năng.
</p>

</div>
