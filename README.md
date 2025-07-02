# 📋 ToDo List App Backend

A modern, secure, and well-tested RESTful API for ToDo List management. Built with Express.js, TypeScript, JWT authentication, and full Swagger (OpenAPI) documentation.

---

## 🎬 Demo Video

> _Tambahkan link atau embed video demo aplikasi di sini_
>
> [[Demo Video]](https://drive.google.com/file/d/12bK29eIeyzbUABenNoIyQiNj9mUmBPrK/view?usp=drive_link)

---

## ✨ Features
- **User Registration & Login** (JWT Auth)
- **CRUD ToDo List** (Create, Read, Update, Delete)
- **Input Validation** (register, login, list)
- **Repository Pattern** (Memory & SQL ready)
- **Unit Testing** (Jest + Supertest)

---

## 🗂️ API Endpoints

### 🔑 Auth
- `POST /api/auth/register` — Register user baru
- `POST /api/auth/login` — Login user

### 📝 List (ToDo)
> Semua endpoint di bawah ini membutuhkan Bearer token (JWT) pada header `Authorization`.

- `POST /api/lists` — Tambah list baru
- `GET /api/lists` — Ambil semua list milik user
- `GET /api/lists/:id` — Ambil detail list tertentu
- `PUT /api/lists/:id` — Update list
- `DELETE /api/lists/:id` — Hapus list

---

## 📚 Dokumentasi API

- Swagger UI: http://localhost:3000/api-docs
- Semua endpoint, request, response, dan error sudah terdokumentasi otomatis.
![image](https://github.com/user-attachments/assets/9cc36350-3480-4b4d-bf42-94ff9926ee51)


## 🧑‍💻 How to run it

1. **Install dependencies**
   ```sh
   npm install

1. **Running the server**
   ```sh
   npx ts-node src/index.ts

### Login
```sh
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@mail.com","password":"password"}'
```

### Create List (dengan token)
```sh
curl -X POST http://localhost:3000/api/lists \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"title":"Judul List","description":"Deskripsi"}'
```

## Proteksi Endpoint
- Semua endpoint List (CRUD) wajib Bearer token JWT.
- Jika token tidak ada: `{ message: "Token tidak ada" }` (401)
- Jika token tidak valid: `{ message: "Token tidak sesuai" }` (401)

## Testing
- Jalankan `npx jest` untuk menjalankan seluruh unit test.


---

Untuk detail lebih lanjut, lihat kode pada masing-masing folder/module.
