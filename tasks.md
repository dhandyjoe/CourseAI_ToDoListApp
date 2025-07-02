# Implementation Tasks: Register, Login & CRUD List (ToDo List App)

- [x] Inisialisasi project backend dengan Express.js dan TypeScript
- [x] Setup struktur folder backend & frontend (jika diperlukan)
- [ ] Setup repository pattern untuk data layer:
  - [x] Implementasi memory store repository (untuk development/testing)
  - [x] Implementasi SQL store repository (untuk production)
- [x] Setup database SQL (misal: SQLite, PostgreSQL, dsb)
- [x] Setup environment variable untuk konfigurasi sensitive (DB, secret, dsb)
- [x] Setup direktori migrations untuk menyimpan migration SQL script

- [x] Membuat endpoint API untuk register user (Express.js + TypeScript)
- [x] Validasi input (nama, email, password) di backend (TypeScript)
- [x] Cek email unik di repository (support memory & SQL)
- [x] Hash password sebelum disimpan
- [x] Simpan data user ke repository (memory/SQL)
- [x] Response sukses/gagal register
- [x] Generate Bearer token (JWT) setelah register sukses
- [x] Endpoint register mengembalikan Bearer token
- [x] Unit test untuk endpoint register (TypeScript, gunakan memory repository)

- [x] Membuat endpoint API untuk login user (Express.js + TypeScript)
- [x] Validasi input (email, password) di backend (TypeScript)
- [x] Verifikasi email & password (hash check) dari repository (support memory & SQL)
- [x] Generate Bearer token (JWT) setelah login sukses
- [x] Endpoint login mengembalikan Bearer token
- [x] Response sukses/gagal login beserta token
- [x] Unit test untuk endpoint login (TypeScript, gunakan memory repository)

## CRUD List (ToDo)
- [ ] Implementasi endpoint REST API untuk fitur List (ToDo):
  - [x] Create List (POST /lists)
  - [x] Read/Get All Lists (GET /lists)
  - [x] Read/Get Single List (GET /lists/:id)
  - [x] Update List (PUT /lists/:id)
  - [x] Delete List (DELETE /lists/:id)
- [x] Validasi input data List (misal: title, description)
- [x] Setup repository pattern untuk List (memory & SQL)
- [x] Unit test untuk endpoint CRUD List (gunakan memory repository)

## Authentikasi & Proteksi Endpoint List
- [x] Semua endpoint List (CRUD) harus menggunakan Bearer token (JWT) hasil register/login
- [x] Middleware validasi JWT untuk endpoint List
- [x] Jika tidak ada/menggunakan token yang tidak valid, response error: "Token tidak sesuai" (401 Unauthorized)


