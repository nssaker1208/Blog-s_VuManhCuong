---
title: "HTTP Request/Response với Java HttpURLConnection"
date: "2025-12-21"
draft: false
comments: true
tags: ["Java", "HTTP", "API", "HttpURLConnection", "REST", "JSON"]
categories: ["Java Programming", "Web Development", "API Development"]
description: "Cách gửi GET/POST request, xử lý JSON response từ API"
cover:
  image: "images/posts/HttpURLConnection-java.png"
  alt: "Http URL Connection"
  caption: ""
  relative: true
---

# 1. HTTP Request/Response với Java HttpURLConnection: Nghệ Thuật Giao Tiếp Mạng

Trong thế giới số hóa ngày nay, việc giao tiếp giữa các ứng dụng qua mạng Internet đã trở thành một phần không thể thiếu. Giống như cách chúng ta trò chuyện bằng ngôn ngữ tự nhiên, các máy tính cũng cần một "ngôn ngữ chung" để hiểu nhau - và HTTP (HyperText Transfer Protocol) chính là ngôn ngữ ấy.

Hãy tưởng tượng bạn đang ngồi trong một quán cà phê, muốn gọi một ly cappuccino. Bạn sẽ gọi người phục vụ (request), họ sẽ ghi lại yêu cầu của bạn, chuẩn bị đồ uống và mang đến cho bạn (response). HTTP hoạt động theo cách tương tự - client gửi yêu cầu, server xử lý và trả về kết quả.

## Hiểu Về Giao Thức HTTP: Cuộc Đối Thoại Giữa Client và Server

HTTP là giao thức nền tảng của World Wide Web, hoạt động theo mô hình request-response. Mỗi lần bạn truy cập một trang web, tải một file, hoặc gửi dữ liệu lên server, tất cả đều thông qua HTTP.

![HTTP Request-Response Cycle](https://media.geeksforgeeks.org/wp-content/uploads/20250705152348042640/Request-and-Response-Cycle.webp)

_Chu trình Request-Response trong giao thức HTTP - một cuộc đối thoại liền mạch giữa client và server_

### Các Thành Phần Chính Của HTTP Request:

- **Method**: Loại hành động (GET, POST, PUT, DELETE...)
- **URL**: Địa chỉ tài nguyên cần truy cập
- **Headers**: Thông tin bổ sung về request
- **Body**: Dữ liệu gửi kèm (chủ yếu với POST/PUT)

### Các Thành Phần Chính Của HTTP Response:

- **Status Code**: Mã trạng thái (200, 404, 500...)
- **Headers**: Thông tin về response
- **Body**: Dữ liệu trả về (HTML, JSON, XML...)

## Java HttpURLConnection: Cầu Nối Đến Thế Giới Web

Java cung cấp cho chúng ta `HttpURLConnection` - một class mạnh mẽ để thực hiện các HTTP request. Đây là một phần của Java Standard Edition, có sẵn mà không cần thêm thư viện ngoài.

![Java HttpURLConnection Overview](https://sspark.genspark.ai/cfimages?u1=Q8G82RIXhkM0Snmhi0cLsHSIv3I3DBnslkTo0jBVBRM2HOCqVK1V1NPcnFZztgUT%2FwWc%2BFrO4SzvI5uHK3NXharRuYCTS%2B0KQgZn1vB4fAyMaFlGIK7m1nO3L0VaJPFzF1Qq4l0%3D&u2=PGJmuvHzVpmTYkkn&width=2560)

_HttpURLConnection - công cụ mạnh mẽ của Java để thực hiện các HTTP request_

### Đặc Điểm Nổi Bật của HttpURLConnection:

- **Tích hợp sẵn**: Không cần thêm dependency
- **Linh hoạt**: Hỗ trợ tất cả HTTP methods
- **Hiệu quả**: Quản lý connection tốt
- **Bảo mật**: Hỗ trợ HTTPS một cách tự nhiên

## Gửi GET Request: Nghệ Thuật "Lấy" Thông Tin

GET request giống như việc bạn hỏi thông tin - đơn giản, trực tiếp và không làm thay đổi gì trên server. Hãy cùng xem cách thực hiện một GET request đến một API thực tế:\

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

### Giải Thích Code:

1. **URL Creation**: Tạo object URL từ string
2. **Connection Setup**: Mở kết nối và thiết lập các thuộc tính
3. **Headers**: Thêm các header cần thiết như Accept và User-Agent
4. **Timeout**: Thiết lập thời gian chờ để tránh treo ứng dụng
5. **Response Handling**: Xử lý response khác nhau tùy theo status code
6. **Resource Management**: Đảm bảo đóng connection và stream

## Gửi POST Request: Nghệ Thuật "Gửi" Dữ Liệu

POST request phức tạp hơn GET vì nó gửi dữ liệu lên server. Giống như việc bạn điền form và gửi đi, POST request thường được dùng để tạo mới dữ liệu.

![GET vs POST Request](https://sspark.genspark.ai/cfimages?u1=nPyzLZgsOpj3Pqd%2BcyvuLJlMj53u%2BFTuWxOia1rOI1hpEEcJhudeoK%2FfZ0D1iNXXy%2FQQLH0HbeTp78LXOjdkGs9BXsc7qe62LCJaTddNhpuD&u2=gerRMxSuIIJgMJLr&width=2560)

_Sự khác biệt giữa GET và POST request - hai phương thức cơ bản trong HTTP_

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

### Điểm Khác Biệt Chính Của POST Request:

1. **setDoOutput(true)**: Cho phép gửi dữ liệu ra
2. **Content-Type Header**: Chỉ định kiểu dữ liệu gửi đi
3. **OutputStream**: Sử dụng để ghi dữ liệu vào request body
4. **Content-Length**: Chỉ định độ dài của dữ liệu (tùy chọn)

## Xử Lý JSON Response: Từ Chuỗi Đến Đối Tượng

JSON (JavaScript Object Notation) là định dạng dữ liệu phổ biến nhất trong các REST API ngày nay. Việc xử lý JSON response đòi hỏi chúng ta phải parse chuỗi JSON thành các object Java.

### Cách 1: Sử Dụng Thư Viện Gson

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

### Giải Thích Code:

- Sau khi nhận **HTTP Response** từ `HttpURLConnection`, ta thường nhận về chuỗi JSON
- Để xử lý, ta có 2 cách: **mapping sang đối tượng Java** (dễ quản lý, dùng trong ứng dụng lớn) hoặc **truy cập trực tiếp JsonObject** (nhanh gọn khi chỉ cần vài trường).

## Bảo Mật API: Gửi Request Với Authentication

Trong thực tế, rất ít API mở công khai (public) hoàn toàn. Hầu hết các hệ thống đều yêu cầu xác thực người dùng thông qua Token (thường là JWT - JSON Web Token) hoặc API Key. Với `HttpURLConnection`, việc này được thực hiện thông qua việc tùy chỉnh **Request Headers**.

**Gửi Request Với Bearer Token**

Đây là chuẩn xác thực phổ biến nhất hiện nay. Chúng ta cần thêm header `Authorization` vào request.

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

_Lưu ý: Không bao giờ hard-code (lưu cứng) API Key hoặc Token trong code. Hãy sử dụng biến môi trường (Environment Variables) hoặc file config để bảo mật._

## Xử Lý Lỗi Nâng Cao: Khi Server Nói "Không"

Một ứng dụng tốt không phải là ứng dụng chạy mượt khi mọi thứ hoàn hảo, mà là ứng dụng vẫn đứng vững khi có lỗi xảy ra. `HttpURLConnection` ném ra `IOException` cho các lỗi mạng, nhưng với các lỗi logic từ server (4xx, 5xx), chúng ta cần xử lý `ErrorStream`.

**Chiến lược xử lý lỗi:**

1. **Phân loại Status Code:**

- **2xx**: Thành công.
- **4xx** (Client Error): Lỗi do người gửi (VD: 400 Bad Request, 401 Unauthorized, 404 Not Found).
- **5xx** (Server Error): Lỗi do server (VD: 500 Internal Server Error, 503 Service Unavailable).

2. **Đọc Error Body**: Server thường trả về chi tiết lỗi dưới dạng JSON trong `ErrorStream`.

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

Việc viết lại `url.openConnection()`, `setRequestProperty`, `BufferedReader` lặp đi lặp lại vi phạm nguyên tắc DRY (Don't Repeat Yourself). Một lập trình viên chuyên nghiệp sẽ đóng gói (wrap) các logic này lại.

Dưới đây là ý tưởng thiết kế một class `HttpClientUtil`:

```java
public class HttpClientUtil {

    // Enum định nghĩa các method
    public enum HttpMethod { GET, POST, PUT, DELETE }

    public static String execute(String urlStr, HttpMethod method, String body, String token) throws IOException {
        URL url = new URL(urlStr);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();

        conn.setRequestMethod(method.name());
        conn.setConnectTimeout(15000); // 15s timeout
        conn.setReadTimeout(15000);
        conn.setRequestProperty("Content-Type", "application/json");

        if (token != null) {
            conn.setRequestProperty("Authorization", "Bearer " + token);
        }

        // Gửi Body nếu có (POST/PUT)
        if (body != null && (method == HttpMethod.POST || method == HttpMethod.PUT)) {
            conn.setDoOutput(true);
            try (OutputStream os = conn.getOutputStream()) {
                byte[] input = body.getBytes("utf-8");
                os.write(input, 0, input.length);
            }
        }

        // Đọc Response (Sử dụng try-with-resources của Java 7+ cho gọn)
        int status = conn.getResponseCode();
        InputStream stream = (status > 299) ? conn.getErrorStream() : conn.getInputStream();

        if (stream == null) return "";

        try (BufferedReader br = new BufferedReader(new InputStreamReader(stream, "utf-8"))) {
            StringBuilder response = new StringBuilder();
            String responseLine;
            while ((responseLine = br.readLine()) != null) {
                response.append(responseLine.trim());
            }
            return response.toString();
        }
    }
}
```

## Nhìn Về Tương Lai: Java 11 HttpClient

Mặc dù `HttpURLConnection` (có từ Java 1.1) vẫn hoạt động tốt, nhưng nó có cú pháp khá cồng kềnh và cũ kỹ. Từ Java 11, Oracle đã giới thiệu `java.net.http.HttpClient` - một API hiện đại, hỗ trợ Asynchronous (bất đồng bộ) và HTTP/2.

So sánh nhanh:

- **HttpURLConnection**: Cổ điển, blocking I/O, code dài dòng.
- **Java 11 HttpClient**: Hiện đại, Fluent API (chuỗi hàm), hỗ trợ Non-blocking.

Ví dụ cùng một tác vụ GET request với **Java 11 HttpClient**:

```java
HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder()
      .uri(URI.create("https://jsonplaceholder.typicode.com/posts/1"))
      .build();

// Code cực kỳ ngắn gọn và dễ đọc
HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
System.out.println(response.body());
```

## LỜI KẾT:

- **HttpURLConnection** giống như một con dao của quân đội Thụy Sĩ: tuy cũ kỹ nhưng bền bỉ và có sẵn ở mọi nơi. Việc nắm vững cách sử dụng nó không chỉ giúp bạn hiểu sâu về cách HTTP hoạt động "dưới nắp ca-pô" mà còn giúp bạn làm việc với các hệ thống legacy (cũ) một cách dễ dàng.

- Tuy nhiên, trong các dự án mới (Greenfield projects), hãy cân nhắc sử dụng các thư viện bên thứ 3 như **OkHttp**, **Apache HttpClient** hoặc **Java 11 HttpClient** để tăng năng suất và hiệu năng.

- Hi vọng bài viết này đã cung cấp cho bạn cái nhìn toàn diện về lập trình mạng cơ bản trong Java. Happy Coding!
