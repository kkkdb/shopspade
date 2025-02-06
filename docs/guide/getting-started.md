# 快速开始

## 安装

ShopSpade 提供了多个包，你可以根据需要安装：

```bash
# 安装组件库
pnpm add @shopspade/components

# 安装工具库
pnpm add @shopspade/utils

# 全局安装 CLI 工具
npm install -g @shopspade/cli
```

## 使用组件库

```vue
<script setup>
import { Button } from '@shopspade/components'
</script>

<template>
  <Button>点击我</Button>
</template>
```

## 使用工具函数

```js
import { formatDate } from '@shopspade/utils'

const date = formatDate(new Date(), 'YYYY-MM-DD')
console.log(date) // 2025-02-06
```

## 使用 CLI 工具

```bash
# 创建新项目
shopspade create my-project

# 查看帮助信息
shopspade --help
```

## 开发环境

推荐的开发环境配置：

- Node.js 16+
- pnpm 8+
- Vue 3
- TypeScript 5+
- VSCode 编辑器（推荐安装 Volar 插件）

## 目录结构

```
my-project/
├── src/
│   ├── components/     # 组件目录
│   ├── utils/         # 工具函数
│   ├── assets/        # 静态资源
│   └── App.vue        # 根组件
├── package.json
└── README.md
```
