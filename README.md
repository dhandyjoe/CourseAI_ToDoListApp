# 📋 ToDo List App Backend

[![Unit Tests](https://github.com/dhandyjoe/CourseAI_ToDoListApp/actions/workflows/test.yml/badge.svg)](https://github.com/dhandyjoe/CourseAI_ToDoListApp/actions/workflows/test.yml)
[![Coverage](https://img.shields.io/badge/coverage-95%25-brightgreen)](https://github.com/dhandyjoe/CourseAI_ToDoListApp)

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
- **CI/CD Pipeline** (GitHub Actions)

---

## 🚀 CI/CD Pipeline

### GitHub Actions Workflow
- **Automatic Testing**: Unit tests run on every push to any branch
- **Multi-Node Testing**: Tests pada Node.js 18.x dan 20.x
- **Coverage Reports**: Generate dan upload coverage reports
- **PR Integration**: Otomatis comment coverage pada Pull Requests
- **Quality Gates**: Minimum 70% coverage threshold

### Workflow Triggers
- Push ke branch manapun
- Pull Request ke branch manapun

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

## 🧪 Unit Test Coverage

Proyek ini memiliki **163 unit tests** dengan coverage yang sangat baik:

### 🎯 Coverage Statistics
- **Statements**: 95.06% (154/162)
- **Branches**: 97.56% (80/82) 
- **Functions**: 89.18% (33/37)
- **Lines**: 94.4% (135/143)

### 📋 Test Suites
| Test Suite                          | Tests    | Description                                   |
| ----------------------------------- | -------- | --------------------------------------------- |
| `authMiddleware.test.ts`            | 16 tests | JWT authentication middleware validation      |
| `controller-error-handling.test.ts` | 21 tests | Error handling scenarios for list controllers |
| `list.test.ts`                      | 37 tests | CRUD operations for ToDo lists                |
| `login.test.ts`                     | 4 tests  | User login functionality                      |
| `register.test.ts`                  | 6 tests  | User registration functionality               |
| `user-repositories.test.ts`         | 73 tests | Repository pattern implementations            |

### ⚙️ Test Commands
```sh
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Generate and open coverage report
npm run test:coverage:open
```

### 🔄 CI/CD Integration
- **GitHub Actions**: Otomatis run tests pada setiap push
- **Coverage Tracking**: Upload coverage ke Codecov
- **Quality Gates**: Minimum 70% coverage threshold
- **Multi-Node Testing**: Test pada Node.js 18.x dan 20.x

### 📊 Coverage by Module
- **Controllers**: 100% coverage (listController.ts)
- **Middlewares**: 100% coverage (authMiddleware.ts)
- **Routes**: 100% coverage dengan beberapa branch belum ter-cover
- **Repositories**: 78.94% coverage (SqlUserRepository belum ditest)

### 🎯 Coverage Threshold
Jest dikonfigurasi dengan minimum threshold 70% untuk:
- Branches, Functions, Lines, dan Statements

## Proteksi Endpoint
- Semua endpoint List (CRUD) wajib Bearer token JWT.
- Jika token tidak ada: `{ message: "Token tidak ada" }` (401)
- Jika token tidak valid: `{ message: "Token tidak sesuai" }` (401)

---

Untuk detail lebih lanjut, lihat kode pada masing-masing folder/module.
