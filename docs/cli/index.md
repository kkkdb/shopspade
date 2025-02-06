# CLI 工具

ShopSpade CLI 是一个命令行工具，用于快速创建和管理项目。

## 安装

```bash
npm install -g @shopspade/cli
```

## 使用方法

### 创建新项目

```bash
shopspade create my-project
```

在创建过程中，CLI 会询问你一些问题来配置项目：

- 选择项目模板（Vue 3、React、Node.js）
- 是否使用 TypeScript
- 是否包含示例代码
- 选择包管理器（npm、yarn、pnpm）

### 添加组件

```bash
shopspade add component MyComponent
```

这将在 `src/components` 目录下创建新的组件文件，包含基础的组件模板。

### 添加工具函数

```bash
shopspade add util formatDate
```

这将在 `src/utils` 目录下创建新的工具函数文件。

## 命令列表

| 命令 | 描述 | 选项 |
|------|------|------|
| `create` | 创建新项目 | `--template` 指定模板 |
| `add` | 添加组件或工具函数 | `--type` 指定类型 |
| `dev` | 启动开发服务器 | `--port` 指定端口 |
| `build` | 构建项目 | `--mode` 指定模式 |
| `lint` | 代码检查 | `--fix` 自动修复 |

## 配置文件

CLI 支持通过 `shopspade.config.js` 文件进行配置：

```js
module.exports = {
  template: 'vue3',
  typescript: true,
  packageManager: 'pnpm',
  plugins: [
    // 插件配置
  ]
}
```

## 最佳实践

1. 使用版本控制（Git）
2. 遵循项目结构约定
3. 保持依赖的最新版本
4. 编写单元测试
5. 遵循代码规范
