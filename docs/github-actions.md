# GitHub Actions Documentation

## 🚀 CI/CD Pipeline

### Overview
GitHub Actions workflow untuk automated testing dan coverage reporting yang berjalan pada setiap push dan pull request.

### Workflow File
- **Location**: `.github/workflows/test.yml`
- **Name**: Unit Tests
- **Triggers**: Push dan Pull Request ke semua branch

## 📋 Workflow Steps

### 1. Environment Setup
```yaml
runs-on: ubuntu-latest
strategy:
  matrix:
    node-version: ['18']
```

### 2. Code Checkout
```yaml
- name: Checkout code
  uses: actions/checkout@v4
```

### 3. Node.js Setup
```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: ${{ matrix.node-version }}
```

### 4. Dependencies Installation
```yaml
- name: Install dependencies
  run: npm install
```

### 5. Test Execution
```yaml
- name: Run unit tests
  run: npm test

- name: Run tests with coverage
  run: npm run test:coverage
```

### 6. Coverage Upload
```yaml
- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v4
  with:
    file: ./coverage/lcov.info
    flags: unittests
    name: codecov-umbrella
    fail_ci_if_error: false
    verbose: true
```

### 7. PR Coverage Comments
```yaml
- name: Comment coverage on PR
  if: github.event_name == 'pull_request'
  uses: actions/github-script@v7
```

## 🔧 Configuration

### Test Scripts
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:coverage:open": "jest --coverage && start coverage\\lcov-report\\index.html"
  }
}
```

### Jest Configuration
```javascript
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

## 📊 Monitoring

### Status Badges
- **Tests**: [![Unit Tests](https://github.com/dhandyjoe/CourseAI_ToDoListApp/actions/workflows/test.yml/badge.svg)](https://github.com/dhandyjoe/CourseAI_ToDoListApp/actions/workflows/test.yml)
- **Coverage**: [![codecov](https://codecov.io/gh/dhandyjoe/CourseAI_ToDoListApp/branch/master/graph/badge.svg)](https://codecov.io/gh/dhandyjoe/CourseAI_ToDoListApp)

### Dashboard Links
- [Actions Dashboard](https://github.com/dhandyjoe/CourseAI_ToDoListApp/actions)
- [Workflow Runs](https://github.com/dhandyjoe/CourseAI_ToDoListApp/actions/workflows/test.yml)

## 🔍 Troubleshooting

### Common Issues

#### 1. Dependencies Installation Failed
```bash
Error: Dependencies lock file is not found
```
**Solution**: Workflow menggunakan `npm install` bukan `npm ci`

#### 2. Tests Failed
```bash
Test Suites: 1 failed, 5 passed
```
**Solution**: Check test logs untuk error details

#### 3. Coverage Upload Failed
```bash
Codecov upload failed
```
**Solution**: Check Codecov configuration dan repository settings

### Debug Steps
1. Check Actions tab untuk detailed logs
2. Verify all test files ada dan valid
3. Ensure package.json scripts configured correctly
4. Check coverage files generated di `coverage/` directory

## 🎯 Best Practices

### Code Quality
- Maintain 70%+ test coverage
- Write meaningful test descriptions
- Test both success dan error scenarios
- Use proper mocking untuk external dependencies

### Workflow Optimization
- Use caching untuk dependencies (jika ada lock file)
- Parallelize independent jobs
- Use appropriate timeouts
- Minimize workflow run time

### Security
- Tidak commit secrets ke repository
- Use GitHub Secrets untuk sensitive data
- Regularly update actions versions
- Review workflow permissions
