# Product Requirements Document (PRD)

## Fitur: Register dan Login untuk ToDo List App

### 1. Latar Belakang
Aplikasi ToDo List membutuhkan sistem autentikasi agar pengguna dapat menyimpan, mengelola, dan mengakses daftar tugas mereka secara personal dan aman. Fitur Register dan Login memungkinkan pengguna membuat akun dan mengakses data ToDo List milik mereka sendiri.

### 2. Tujuan
- Memungkinkan pengguna mendaftar akun baru (Register).
- Memungkinkan pengguna masuk ke aplikasi dengan akun yang sudah terdaftar (Login).
- Menyimpan data pengguna secara aman.
- Mengamankan akses ke data ToDo List berdasarkan akun pengguna.

### 3. Fitur Register
#### 3.1. Deskripsi
Pengguna dapat membuat akun baru dengan mengisi form registrasi.

#### 3.2. Alur
1. Pengguna mengakses halaman Register.
2. Pengguna mengisi data: nama, email, password.
3. Sistem melakukan validasi data (email unik, password minimal 6 karakter, dll).
4. Jika valid, data pengguna disimpan ke database.
5. Pengguna diarahkan ke halaman Login atau langsung masuk ke aplikasi.

#### 3.3. Validasi
- Email harus unik dan valid.
- Password minimal 6 karakter.
- Nama tidak boleh kosong.

#### 3.4. Error Handling
- Email sudah terdaftar.
- Format email tidak valid.
- Password terlalu pendek.

### 4. Fitur Login
#### 4.1. Deskripsi
Pengguna dapat masuk ke aplikasi menggunakan email dan password yang sudah terdaftar.

#### 4.2. Alur
1. Pengguna mengakses halaman Login.
2. Pengguna mengisi email dan password.
3. Sistem memvalidasi kredensial.
4. Jika valid, pengguna diarahkan ke halaman utama ToDo List.
5. Jika tidak valid, tampilkan pesan error.

#### 4.3. Validasi
- Email dan password harus sesuai dengan data di database.

#### 4.4. Error Handling
- Email atau password salah.
- Akun tidak ditemukan.

### 5. Non-Functional Requirements
- Password disimpan dengan enkripsi (hashing).
- Session/token untuk autentikasi setelah login.
- Responsif di berbagai perangkat.

### 6. Acceptance Criteria
- Pengguna dapat mendaftar dan login dengan data valid.
- Pengguna tidak dapat mendaftar dengan email yang sama.
- Pengguna tidak dapat login dengan data yang salah.
- Data ToDo List hanya dapat diakses setelah login.

### 7. Catatan Tambahan
- Pertimbangkan fitur "Lupa Password" di masa mendatang.
- UI/UX sederhana dan mudah digunakan.
