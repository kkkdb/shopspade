# shopspade-cli

ShopSpade 前端项目脚手架工具，用于快速创建标准化的前端项目模板。

## 功能特性

- 🚀 快速创建项目
- 📦 支持多种项目模板
- 🔧 可选择包管理器
- 🎨 标准化项目结构

## 安装

```bash
npm install -g shopspade-cli
```

## 使用方法

### 创建新项目

```bash
shopspade-cli init [项目名称]
```

如果不指定项目名称，将会提示你输入。

### 交互式配置

在创建项目过程中，你需要进行以下选择：

1. 项目名称（如果未在命令行中指定）
2. 项目模板类型：
   - `application`: 完整的应用程序模板
   - `service`: 服务模块模板

## 项目模板说明

### application 模板

适用于创建完整的前端应用程序，包含以下特性：

- 基于 Vue 3 + Vite 的现代开发环境
- 内置路由配置和状态管理
- 统一的请求封装和接口管理
- 完整的项目结构和最佳实践

### service 模板

适用于创建独立的服务模块，特点如下：

- 轻量级的 Vue 3 + Vite 环境
- 专注于单一服务功能
- 易于集成到主应用中

## 项目结构

```
├── src/
│   ├── assets/        # 静态资源
│   ├── components/    # 组件
│   ├── config/        # 配置文件
│   ├── router/        # 路由配置
│   ├── store/         # 状态管理
│   └── views/         # 页面
├── public/            # 公共资源
└── package.json
```

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 贡献指南

欢迎提交 Issue 和 Pull Request。

## 开源协议

[ISC](LICENSE)