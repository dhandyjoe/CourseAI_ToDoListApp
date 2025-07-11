# Codecov Integration Guide

## 🎯 Setup Codecov

### 1. Repository Setup
1. Buka [Codecov.io](https://codecov.io)
2. Login menggunakan GitHub account
3. Pilih repository `CourseAI_ToDoListApp`
4. Activate repository

### 2. GitHub Integration
- **No token required**: Codecov akan otomatis detect public repositories
- **Automatic uploads**: GitHub Actions akan upload coverage setiap push
- **PR Comments**: Codecov akan comment coverage pada Pull Requests

### 3. Configuration
File `codecov.yml` sudah dikonfigurasi dengan:
- **Target coverage**: 70%
- **Threshold**: 1%
- **Auto comments**: Enabled pada PR
- **Status checks**: Enabled

### 4. Badge Setup 
Badge Codecov sudah ditambahkan di README.md:
```markdown
[![codecov](https://codecov.io/gh/dhandyjoe/CourseAI_ToDoListApp/branch/master/graph/badge.svg)](https://codecov.io/gh/dhandyjoe/CourseAI_ToDoListApp)
```

## 📊 Features

### Coverage Reports
- **Real-time updates**: Badge update otomatis setelah setiap push
- **Trend analysis**: Tracking coverage changes over time
- **File-level coverage**: Detail coverage per file
- **Branch coverage**: Coverage untuk setiap branch

### Pull Request Integration
- **Coverage diff**: Perbandingan coverage before/after
- **File changes**: Coverage impact untuk setiap file yang diubah
- **Status checks**: Pass/fail berdasarkan coverage threshold
- **Auto comments**: Detailed coverage report di PR

### Dashboard Features
- **Coverage graphs**: Visual representation of coverage trends
- **Sunburst charts**: Visual breakdown coverage per module
- **Coverage heatmaps**: Identify areas yang perlu testing
- **Commit history**: Coverage history untuk setiap commit

## 🔧 Usage

### Viewing Coverage
1. **Badge**: Click badge di README untuk dashboard
2. **Dashboard**: https://codecov.io/gh/dhandyjoe/CourseAI_ToDoListApp
3. **PR Reports**: Otomatis muncul di Pull Request comments

### Coverage Thresholds
- **Project**: 70% minimum overall coverage
- **Patch**: 70% minimum untuk code changes
- **Tolerance**: 1% threshold untuk fluktuasi

### Status Checks
- ✅ **Pass**: Coverage >= 70%
- ❌ **Fail**: Coverage < 69%
- ⚠️ **Warning**: Coverage 69-70%

## 🚀 Benefits

1. **Quality Assurance**: Memastikan code quality tetap tinggi
2. **Visibility**: Team bisa melihat coverage trends
3. **Automated**: Tidak perlu manual checking
4. **Integration**: Seamless dengan GitHub workflow
5. **Reporting**: Detailed reports untuk decision making
