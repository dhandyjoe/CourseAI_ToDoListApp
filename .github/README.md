# GitHub Actions Workflows

## 🧪 Unit Tests Workflow

File: `.github/workflows/test.yml`

### Triggers
- **Push**: Setiap push ke branch manapun
- **Pull Request**: Setiap pull request ke branch manapun

### Features
- **Multi-Node Testing**: Test pada Node.js versi 18.x dan 20.x
- **Coverage Report**: Generate coverage report dengan threshold 70%
- **Codecov Integration**: Upload coverage ke Codecov untuk tracking
- **PR Comments**: Otomatis comment coverage report pada Pull Request

### Workflow Steps
1. **Checkout code** - Download source code
2. **Setup Node.js** - Install Node.js dengan cache npm
3. **Install dependencies** - `npm ci` untuk install dependencies
4. **Run unit tests** - `npm test` untuk menjalankan semua test
5. **Run coverage** - `npm run test:coverage` untuk generate coverage
6. **Upload coverage** - Upload ke Codecov (optional)
7. **Comment PR** - Comment coverage report pada PR

### Status Badge
Untuk menambahkan badge status di README:

```markdown
[![Unit Tests](https://github.com/dhandyjoe/CourseAI_ToDoListApp/actions/workflows/test.yml/badge.svg)](https://github.com/dhandyjoe/CourseAI_ToDoListApp/actions/workflows/test.yml)
```

### Configuration
- **Coverage threshold**: 70% untuk statements, branches, functions, lines
- **Test timeout**: Default Jest timeout
- **Node versions**: 18.x, 20.x (LTS versions)
- **OS**: Ubuntu Latest

### Troubleshooting
- Pastikan semua dependencies ada di `package.json`
- Pastikan test scripts ada di `package.json`
- Coverage threshold harus dipenuhi (70%)
