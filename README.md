# Shopspade

This is a monorepo project containing a Vue 3 component library and utility functions.

## Project Structure

```
shopspade/

├── packages/
│   ├── components/     # Vue 3 component library
│   ├── utils/         # Utility library
│   └── cli/          # Project scaffold CLI tool
├── docs/             # Documentation
├── examples/          # Example projects
```

## Installation

### CLI Tool

```bash
npm install -g @shopspade/cli
```

The CLI tool helps you quickly scaffold new frontend projects with ShopSpade's recommended configurations and best practices.

### Components

```bash
pnpm add @shopspade/components
```

## Documentation

本地运行文档：

```bash
# 开发模式
pnpm docs:dev

# 构建文档
pnpm docs:build

# 预览构建后的文档
pnpm docs:preview
```

### Utils

```bash
pnpm add @shopspade/utils
```

## Usage

```typescript
// Import components
import { Button } from '@shopspade/components'
import '@shopspade/components/style'

// Import utilities
import { request } from '@shopspade/utils'
```

## Development Setup

1. Install dependencies:
```bash
pnpm install
```

2. Build all packages:
```bash
pnpm build
```

3. Development:
```bash
pnpm dev
```

## Usage

### Components

```typescript
import { Button } from '@shopspade/components'
import '@shopspade/components/style'
```

### Utils

```typescript
import { formatDate, debounce } from '@shopspade/utils'
```

## Commands

- `pnpm build`: Build all packages
- `pnpm dev`: Start development mode
- `pnpm lint`: Lint all packages
- `pnpm test`: Run tests
- `pnpm clean`: Clean build artifacts


## CI/CD

1. 创建变更集
```
pnpm changeset
```

2. 提交变更
```
git add . && git commit -m "chore: add changeset"
```

3. 更新版本和变更日志
```
pnpm changeset version
```

4. 提交版本更新
```
git add . && git commit -m "chore: version packages"
```

5. 创建标签并推送
```
git tag v1.0.x
git push --tags
```