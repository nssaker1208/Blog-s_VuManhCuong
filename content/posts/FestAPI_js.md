---
title: "Fetch API trong JavaScript - Gọi REST API hiện đại"
date: "2025-12-24"
draft: false
comments: true
tags:
  ["JavaScript", "Fetch API", "REST API", "Promise", "Async/Await", "Frontend"]
categories: ["Web Development", "JavaScript Tutorial", "Frontend Development"]
description: "Hướng dẫn chi tiết sử dụng Fetch API với async/await, xử lý lỗi và Promise trong JavaScript hiện đại"
---

# Fetch API trong JavaScript - Gọi REST API hiện đại

**Chủ đề:** Web Development, JavaScript Modern, REST API

## 1. Giới thiệu

Nếu bạn đã từng làm việc với JavaScript những năm trước 2015, chắc hẳn bạn không thể quên "cơn ác mộng" mang tên `XMLHttpRequest` hay cấu trúc `ajax` cồng kềnh của jQuery. Code rối rắm, callback lồng nhau (callback hell) khiến việc lấy dữ liệu từ server trở thành một cực hình.

**Fetch API** ra đời như một luồng gió mới, mang đến cách tiếp cận hiện đại và thanh lịch hơn trong việc giao tiếp với server. Từ những ngày đầu của Ajax, khi mà việc giao tiếp với server còn phức tạp và rườm rà, đến thời đại của Fetch API - chúng ta đã chứng kiến một cuộc cách mạng thầm lặng nhưng sâu sắc.

## 2. Fetch API là gì?

Fetch API không chỉ đơn thuần là một phương pháp để gửi HTTP request - nó là một triết lý mới trong việc xử lý giao tiếp bất đồng bộ. Nó cung cấp phương thức toàn cục `fetch()` để giúp bạn lấy tài nguyên từ mạng một cách dễ dàng và logic hơn.

Nếu `XMLHttpRequest` giống như một chiếc máy điện thoại bàn cũ kỹ với những nút bấm phức tạp, thì Fetch API như một chiếc smartphone hiện đại - đơn giản, trực quan và mạnh mẽ.

### 2.1. So sánh XMLHttpRequest vs Fetch API

```javascript
// XMLHttpRequest - Quá khứ với những dòng code rối rắm
const xhr = new XMLHttpRequest();
xhr.open("GET", "/api/users");
xhr.onreadystatechange = function () {
  if (xhr.readyState === 4 && xhr.status === 200) {
    const data = JSON.parse(xhr.responseText);
    console.log(data);
  }
};
xhr.send();

// Fetch API - Hiện tại với sự thanh lịch
fetch("/api/users")
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Lỗi:", error));
```

### 2.2. Tại sao nên dùng Fetch thay vì XMLHttpRequest?

- **Promise-based:** Fetch sử dụng Promises, giúp xử lý các thao tác bất đồng bộ sạch sẽ hơn, tránh callback hell
- **Cú pháp gọn gàng:** Dễ đọc, dễ hiểu và "giống tiếng Anh" hơn
- **Stream API:** Hỗ trợ xử lý dữ liệu dạng luồng (stream), hữu ích khi tải file lớn
- **Tích hợp sẵn:** Không cần thêm thư viện, có sẵn trong trình duyệt hiện đại

## 3. Cơ chế hoạt động: Từ Promise đến Async/Await

Bản chất của `fetch()` là trả về một **Promise**. Promise này sẽ **Resolve** (thành công) khi nhận được phản hồi từ server (ngay cả khi đó là lỗi 404 hay 500), và chỉ **Reject** (thất bại) khi có lỗi mạng (mất mạng, DNS lỗi) khiến request không thể thực hiện.

### 3.1. Promise-based approach

```javascript
// Sử dụng Promise chain (.then)
fetch("https://api.example.com/data")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    console.log("Data:", data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
```

### 3.2. Async/Await approach (Khuyến nghị)

```javascript
// Sử dụng async/await - code đồng bộ hơn, dễ đọc hơn
const fetchUserData = async (userId) => {
  try {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error("Không thể lấy dữ liệu người dùng:", error);
    throw error;
  }
};
// Sử dụng
fetchUserData(1)
  .then((data) => console.log(data))
  .catch((error) => console.error(error));
```

## 4. Hướng dẫn thực hành - CRUD với Fetch API

Chúng ta sẽ sử dụng API giả lập `JSONPlaceholder` để thực hành các thao tác CRUD (Create, Read, Update, Delete) cơ bản.

### 4.1. GET Request - Lấy dữ liệu

Đây là thao tác cơ bản nhất. Mặc định `fetch()` sẽ sử dụng phương thức GET.

```javascript
// Lấy danh sách users
async function getUsers() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const users = await response.json();
    console.log("Users:", users);
    return users;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách users:", error);
  }
}

// Lấy một user cụ thể
async function getUserById(id) {
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/users/${id}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const user = await response.json();
    console.log("User:", user);
    return user;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin user:", error);
  }
}

// Gọi hàm
getUsers();
getUserById(1);
```

### 4.2. POST Request - Tạo mới dữ liệu

Khi gửi dữ liệu lên server, bạn cần thêm tham số thứ 2 vào `fetch()` để cấu hình `method`, `headers` và `body`.

> **Lưu ý quan trọng:** Bạn phải dùng `JSON.stringify()` để chuyển object JavaScript thành chuỗi JSON, và khai báo header `Content-Type: application/json`

```javascript
async function createPost(postData) {
  const newPost = {
    title: "Học Fetch API",
    body: "Fetch API rất mạnh mẽ và dễ dùng",
    userId: 1,
  };

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(newPost),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Đã tạo bài viết:", data);
    return data;
  } catch (error) {
    console.error("Lỗi khi tạo bài viết:", error);
  }
}

createPost();
```

### 4.3. PUT Request - Cập nhật toàn bộ

```javascript
async function updatePost(id, postData) {
  const updatedPost = {
    id: id,
    title: "Bài viết đã được cập nhật",
    body: "Nội dung mới hoàn toàn",
    userId: 1,
  };

  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPost),
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Đã cập nhật bài viết:", data);
    return data;
  } catch (error) {
    console.error("Lỗi khi cập nhật:", error);
  }
}

updatePost(1);
```

### 4.4. PATCH Request - Cập nhật một phần

```javascript
async function patchPost(id, updates) {
  const partialUpdate = {
    title: "Chỉ cập nhật title",
  };

  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(partialUpdate),
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Đã cập nhật một phần:", data);
    return data;
  } catch (error) {
    console.error("Lỗi khi patch:", error);
  }
}

patchPost(1);
```

### 4.5. DELETE Request - Xóa dữ liệu

```javascript
async function deletePost(id) {
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${id}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log(`Đã xóa bài viết ID: ${id}`);
    return true;
  } catch (error) {
    console.error("Lỗi khi xóa:", error);
    return false;
  }
}

deletePost(1);
```

## 5. Cái bẫy xử lý lỗi (Must Read!)

Khi server trả về lỗi `404 Not Found` hay `500 Server Error`, Fetch **KHÔNG** coi đó là lỗi để nhảy vào `catch`. Với Fetch, miễn là server có phản hồi, thì đó là thành công (Resolve). Nó chỉ nhảy vào `catch` khi mất mạng hoặc DNS lỗi (Network Error).

### 5.1. Cách xử lý lỗi đúng chuẩn

```javascript
async function fetchDataSafely(url) {
  try {
    const response = await fetch(url);

    // QUAN TRỌNG: Kiểm tra response.ok trước
    // response.ok = true nếu status trong khoảng 200-299
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // Bây giờ catch mới bắt được cả lỗi mạng lẫn lỗi HTTP
    console.error("Có lỗi xảy ra:", error.message);
    // Xử lý chi tiết theo loại lỗi
    if (error.message.includes("404")) {
      console.log("Tài nguyên không tồn tại");
    } else if (error.message.includes("500")) {
      console.log("Lỗi server nội bộ");
    } else {
      console.log("Lỗi kết nối mạng");
    }

    throw error; // Re-throw nếu muốn xử lý ở cấp cao hơn
  }
}
```

### 5.2. Xử lý lỗi với status codes

```javascript
async function handleResponse(response) {
  if (response.ok) {
    return response.json();
  }

  // Xử lý chi tiết theo status code
  switch (response.status) {
    case 400:
      throw new Error("Bad Request - Dữ liệu không hợp lệ");
    case 401:
      throw new Error("Unauthorized - Cần đăng nhập");
    case 403:
      throw new Error("Forbidden - Không có quyền truy cập");
    case 404:
      throw new Error("Not Found - Không tìm thấy tài nguyên");
    case 500:
      throw new Error("Internal Server Error - Lỗi server");
    default:
      throw new Error(`HTTP error! status: ${response.status}`);
  }
}

// Sử dụng
async function getData() {
  try {
    const response = await fetch("https://api.example.com/data");
    const data = await handleResponse(response);
    console.log(data);
  } catch (error) {
    console.error("Error:", error.message);
  }
}
```

## 6. Các tính năng nâng cao

### 6.1. Thêm Headers (Authentication)

```javascript
async function fetchWithAuth(url, token) {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
  }
}

// Sử dụng
const token = "your-jwt-token-here";
fetchWithAuth("https://api.example.com/protected", token);
```

### 6.2. Timeout cho Request

```javascript
async function fetchWithTimeout(url, timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error.name === "AbortError") {
      console.error("Request timeout sau", timeout, "ms");
    } else {
      console.error("Error:", error);
    }
    throw error;
  }
}

// Sử dụng
fetchWithTimeout("https://api.example.com/data", 3000);
```

### 6.3. Upload File

```javascript
async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("description", "My uploaded file");

  try {
    const response = await fetch("https://api.example.com/upload", {
      method: "POST",
      body: formData,
      // Không cần set Content-Type header, browser tự động set
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Upload success:", result);
    return result;
  } catch (error) {
    console.error("Upload failed:", error);
  }
}

// Sử dụng với input file
document.getElementById("fileInput").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    uploadFile(file);
  }
});
```

## 7. Best Practices

- **Luôn kiểm tra response.ok:** Không dựa vào catch để bắt lỗi HTTP
- **Sử dụng async/await:** Code dễ đọc hơn Promise chain
- **Xử lý timeout:** Tránh request treo mãi không có kết quả
- **Tạo utility function:** Đóng gói logic fetch để tái sử dụng
- **Loading state:** Hiển thị loading indicator khi đang fetch
- **Error handling UI:** Thông báo lỗi thân thiện cho user

### 7.1. Utility Function mẫu

```javascript
// Utility function tổng quát cho mọi request
const apiClient = {
  baseURL: "https://api.example.com",

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  get(endpoint) {
    return this.request(endpoint, { method: "GET" });
  },

  post(endpoint, data) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  put(endpoint, data) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" });
  },
};

// Sử dụng
apiClient.get("/users").then((users) => console.log(users));
apiClient.post("/posts", { title: "New Post" });
```

## 8. Kết luận

Fetch API kết hợp với Async/Await thực sự làm cho code JavaScript trở nên thanh thoát và dễ bảo trì hơn rất nhiều. Chỉ cần bạn nhớ kỹ quy tắc về xử lý lỗi với `response.ok`, bạn đã nắm chắc 80% công lực rồi. Fetch API không chỉ là một công cụ - nó là triết lý mới trong việc xây dựng ứng dụng web hiện đại, nơi mà sự đơn giản và hiệu quả đi đôi với nhau.

Từ những ví dụ cơ bản đến các kỹ thuật nâng cao như authentication, timeout, và upload file, bạn đã có đủ kiến thức để tự tin xây dựng các ứng dụng web tương tác với REST API một cách chuyên nghiệp. Hãy thực hành nhiều, thử nghiệm với các API thực tế, và bạn sẽ thấy sức mạnh thực sự của Fetch API!
