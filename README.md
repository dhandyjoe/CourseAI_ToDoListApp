# 📋 ToDo List App Backend

[![Unit Tests](https://github.com/dhandyjoe/CourseAI_ToDoListApp/actions/workflows/test.yml/badge.svg)](https://github.com/dhandyjoe/CourseAI_ToDoListApp/actions/workflows/test.yml)
[![codecov](https://codecov.io/gh/dhandyjoe/CourseAI_ToDoListApp/branch/master/graph/badge.svg)](https://codecov.io/gh/dhandyjoe/CourseAI_ToDoListApp)

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
- **Node.js Testing**: Tests pada Node.js 18.x (configurable untuk multi-version)
- **Coverage Reports**: Generate dan upload coverage reports ke Codecov
- **PR Integration**: Otomatis comment coverage pada Pull Requests
- **Quality Gates**: Minimum 70% coverage threshold
- **Fast Feedback**: Results tersedia dalam ~2-3 menit

### Codecov Integration
- **Real-time Coverage**: Badge coverage yang update otomatis
- **Trend Analysis**: Tracking coverage changes over time
- **PR Coverage**: Detailed coverage report pada setiap Pull Request
- **Coverage Visualization**: Grafik dan statistik coverage

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
- **Codecov Integration**: Real-time coverage tracking dan reporting
- **Quality Gates**: Minimum 70% coverage threshold
- **Node.js Testing**: Test pada Node.js 18.x (configurable)
- **PR Coverage**: Detailed coverage analysis pada Pull Requests
- **Status Checks**: Automated pass/fail berdasarkan coverage

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

## 📖 Documentation

### 🔧 Setup & Configuration

#### Codecov Integration
1. **Repository Setup**
   - Buka [Codecov.io](https://codecov.io) dan login dengan GitHub
   - Pilih repository `CourseAI_ToDoListApp` dan activate
   - No token required untuk public repositories

2. **GitHub Actions Configuration**
   - Workflow: `.github/workflows/test.yml`
   - Triggers: Push dan Pull Request ke semua branch
   - Node.js version: 18.x (dapat diubah ke matrix untuk multi-version)

#### Local Development
```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests dengan coverage
npm run test:coverage

# Run tests dalam watch mode
npm run test:watch

# Generate dan buka coverage report
npm run test:coverage:open
```

### 🚀 CI/CD Pipeline Details

#### Workflow Steps
1. **Environment Setup**: Ubuntu latest dengan Node.js 18.x
2. **Code Checkout**: Download source code dari repository
3. **Dependencies Install**: `npm install` untuk install packages
4. **Unit Tests**: Run semua test suites (163 tests)
5. **Coverage Generation**: Generate coverage report dalam format LCOV
6. **Codecov Upload**: Upload coverage data ke Codecov
7. **PR Comments**: Auto-comment coverage report pada Pull Requests

#### Quality Gates
- **Minimum Coverage**: 70% untuk statements, branches, functions, lines
- **Coverage Tolerance**: 1% threshold untuk fluktuasi
- **Status Checks**: Pass/fail berdasarkan coverage threshold
- **Automated Reporting**: Coverage trends dan analysis

### 📊 Coverage Configuration

#### Jest Configuration
```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts',
    '!src/config/**',
    '!src/migrations/**'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
};
```

#### Codecov Configuration
```yaml
# codecov.yml
coverage:
  precision: 2
  range: "70...100"
  status:
    project:
      default:
        target: 70%
        threshold: 1%
```

### 🔍 Monitoring & Reports

#### Status Badges
- **Tests**: [![Unit Tests](https://github.com/dhandyjoe/CourseAI_ToDoListApp/actions/workflows/test.yml/badge.svg)](https://github.com/dhandyjoe/CourseAI_ToDoListApp/actions/workflows/test.yml)
- **Coverage**: [![codecov](https://codecov.io/gh/dhandyjoe/CourseAI_ToDoListApp/branch/master/graph/badge.svg)](https://codecov.io/gh/dhandyjoe/CourseAI_ToDoListApp)

#### Dashboard Links
- **Codecov Dashboard**: https://codecov.io/gh/dhandyjoe/CourseAI_ToDoListApp
- **GitHub Actions**: https://github.com/dhandyjoe/CourseAI_ToDoListApp/actions
- **Workflow Runs**: https://github.com/dhandyjoe/CourseAI_ToDoListApp/actions/workflows/test.yml

#### Coverage Features
- **Real-time Updates**: Badge dan dashboard update otomatis
- **Trend Analysis**: Tracking coverage changes over time
- **File-level Coverage**: Detail coverage untuk setiap file
- **PR Integration**: Coverage diff dan analysis pada Pull Requests
- **Branch Comparison**: Compare coverage antar branches

### 🛠️ Troubleshooting

#### Common Issues
1. **Dependencies Installation Failed**
   ```bash
   Error: Dependencies lock file is not found
   ```
   **Solution**: Workflow menggunakan `npm install` bukan `npm ci`

2. **Tests Failed**
   ```bash
   Test Suites: 1 failed, 5 passed
   ```
   **Solution**: Check Actions tab untuk detailed error logs

3. **Coverage Upload Failed**
   ```bash
   Codecov upload failed
   ```
   **Solution**: Verify Codecov repository activation dan configuration

#### Debug Steps
- Check GitHub Actions tab untuk detailed logs
- Verify semua test files valid dan dapat dijalankan
- Ensure coverage files generated di `coverage/` directory
- Review Jest configuration untuk coverage settings

### 📈 Best Practices

#### Code Quality
- Maintain minimum 70% test coverage
- Write descriptive test cases
- Test both success dan error scenarios
- Use proper mocking untuk external dependencies

#### CI/CD Optimization
- Use dependency caching jika ada lock file
- Parallelize independent jobs
- Set appropriate timeouts
- Monitor workflow execution time

#### Coverage Management
- Review coverage reports regularly
- Identify untested code areas
- Prioritize testing critical business logic
- Use coverage trends untuk quality decisions

---

Untuk detail lebih lanjut, lihat kode pada masing-masing folder/module.
