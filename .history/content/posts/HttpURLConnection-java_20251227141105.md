---
title: "HTTP Request/Response với Java HttpURLConnection"
date: "2025-12-21"
draft: false
comments: true
tags: ["Java", "HTTP", "API", "HttpURLConnection", "REST", "JSON"]
categories: ["Java Programming", "Web Development", "API Development"]
description: "Hướng dẫn chi tiết về cách gửi GET/POST request, xử lý JSON response từ API với Java HttpURLConnection"
---

# HTTP Request/Response với Java HttpURLConnection

**Chủ đề:** Lập trình mạng, Java Core, Web Development

## 1. Giới thiệu

Trong thế giới số hóa ngày nay, việc giao tiếp giữa các ứng dụng qua mạng Internet đã trở thành một phần không thể thiếu. HTTP (HyperText Transfer Protocol) là giao thức nền tảng của World Wide Web, hoạt động theo mô hình request-response. Java cung cấp `HttpURLConnection` - một class mạnh mẽ để thực hiện các HTTP request mà không cần thêm thư viện ngoài.

## 2. Hiểu về giao thức HTTP

HTTP hoạt động theo mô hình client-server, giống như một cuộc đối thoại: client gửi yêu cầu (request), server xử lý và trả về kết quả (response). Mỗi lần bạn truy cập một trang web, tải file, hoặc gửi dữ liệu lên server, tất cả đều thông qua HTTP.

### 2.1. Các thành phần của HTTP Request

- **Method:** Loại hành động (GET, POST, PUT, DELETE...)
- **URL:** Địa chỉ tài nguyên cần truy cập
- **Headers:** Thông tin bổ sung về request
- **Body:** Dữ liệu gửi kèm (chủ yếu với POST/PUT)

### 2.2. Các thành phần của HTTP Response

- **Status Code:** Mã trạng thái (200 OK, 404 Not Found, 500 Internal Server Error...)
- **Headers:** Thông tin về response
- **Body:** Dữ liệu trả về (HTML, JSON, XML...)

## 3. Java HttpURLConnection

`HttpURLConnection` là một class trong package `java.net`, cung cấp các phương thức để thực hiện HTTP request. Đây là phần của Java Standard Edition, có sẵn mà không cần thêm dependency.

**Đặc điểm nổi bật:**

- **Tích hợp sẵn:** Không cần thêm thư viện ngoài
- **Linh hoạt:** Hỗ trợ tất cả HTTP methods (GET, POST, PUT, DELETE...)
- **Hiệu quả:** Quản lý connection tốt với timeout và retry
- **Bảo mật:** Hỗ trợ HTTPS một cách tự nhiên

## 4. Gửi GET Request

GET request được sử dụng để lấy thông tin từ server mà không làm thay đổi dữ liệu. Đây là phương thức đơn giản và phổ biến nhất trong HTTP.

### 4.1. Ví dụ code GET Request

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

### 4.2. Giải thích các bước quan trọng

1. **URL Creation:** Tạo object URL từ string
2. **Connection Setup:** Mở kết nối và thiết lập các thuộc tính
3. **Headers:** Thêm các header cần thiết như Accept và User-Agent
4. **Timeout:** Thiết lập thời gian chờ để tránh treo ứng dụng
5. **Response Handling:** Xử lý response khác nhau tùy theo status code
6. **Resource Management:** Đảm bảo đóng connection và stream

## 5. Gửi POST Request

POST request phức tạp hơn GET vì nó gửi dữ liệu lên server. Phương thức này thường được sử dụng để tạo mới dữ liệu, gửi form, hoặc upload file.

### 5.1. Ví dụ code POST Request với JSON

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

### 5.2. Điểm khác biệt chính của POST Request

- **setDoOutput(true):** Cho phép gửi dữ liệu ra ngoài
- **Content-Type Header:** Chỉ định kiểu dữ liệu gửi đi (application/json)
- **OutputStream:** Sử dụng để ghi dữ liệu vào request body
- **Content-Length:** Chỉ định độ dài của dữ liệu

## 6. Xử lý JSON Response

JSON (JavaScript Object Notation) là định dạng dữ liệu phổ biến nhất trong các REST API. Để xử lý JSON response, chúng ta cần parse chuỗi JSON thành các object Java.

### 6.1. Sử dụng thư viện Gson

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

## 7. Xác thực API với Token

Trong thực tế, hầu hết các API đều yêu cầu xác thực người dùng thông qua Token (JWT - JSON Web Token) hoặc API Key. Việc này được thực hiện thông qua header `Authorization`.

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

> **Lưu ý:** Không bao giờ hard-code Token hoặc API Key trong code. Hãy sử dụng biến môi trường (Environment Variables) hoặc file config để bảo mật.

## 8. Xử lý lỗi nâng cao

Một ứng dụng tốt không chỉ chạy mượt khi mọi thứ hoàn hảo, mà còn phải xử lý tốt các trường hợp lỗi. `HttpURLConnection` ném ra `IOException` cho các lỗi mạng, nhưng với các lỗi logic từ server (4xx, 5xx), chúng ta cần xử lý `ErrorStream`.

**Phân loại Status Code:**

- **2xx:** Thành công (200 OK, 201 Created)
- **4xx:** Lỗi do client (400 Bad Request, 401 Unauthorized, 404 Not Found)
- **5xx:** Lỗi do server (500 Internal Server Error, 503 Service Unavailable)

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

## 9. Best Practices

- **Sử dụng try-with-resources:** Đảm bảo các stream và connection được đóng tự động
- **Thiết lập timeout:** Tránh ứng dụng bị treo khi server không phản hồi
- **Xử lý lỗi đầy đủ:** Kiểm tra status code và đọc error stream khi có lỗi
- **Tạo utility class:** Đóng gói logic HTTP request vào class riêng để tái sử dụng
- **Bảo mật thông tin:** Không hard-code token, API key trong source code

## 10. Nhìn về tương lai: Java 11 HttpClient

Mặc dù `HttpURLConnection` vẫn hoạt động tốt, nhưng từ Java 11, Oracle đã giới thiệu `java.net.http.HttpClient` - một API hiện đại hơn, hỗ trợ Asynchronous và HTTP/2.

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

**So sánh nhanh:**

| Đặc điểm           | HttpURLConnection  | Java 11 HttpClient   |
| ------------------ | ------------------ | -------------------- |
| **Phiên bản Java** | Java 1.1+          | Java 11+             |
| **Cú pháp**        | Dài dòng, phức tạp | Ngắn gọn, Fluent API |
| **HTTP/2**         | Không hỗ trợ       | Hỗ trợ               |
| **Async**          | Không              | Có                   |
| **Use case**       | Legacy projects    | Modern applications  |

## 11. Kết luận

`HttpURLConnection` là công cụ cơ bản nhưng mạnh mẽ để thực hiện HTTP request trong Java. Việc nắm vững cách sử dụng nó không chỉ giúp bạn hiểu sâu về cách HTTP hoạt động mà còn giúp làm việc với các hệ thống legacy một cách dễ dàng. Tuy nhiên, trong các dự án mới, hãy cân nhắc sử dụng các thư viện hiện đại như **OkHttp**, **Apache HttpClient** hoặc **Java 11 HttpClient** để tăng năng suất và hiệu năng.
