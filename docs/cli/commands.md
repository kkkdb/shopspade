# 命令列表

## create

创建新项目。

```bash
shopspade create [options] <project-name>
```

选项：
- `--template <template>` - 指定项目模板（vue3/react/node）
- `--typescript` - 使用 TypeScript
- `--force` - 强制覆盖目标目录
- `--packageManager <pm>` - 指定包管理器（npm/yarn/pnpm）

## add

添加新的组件或工具函数。

```bash
shopspade add [options] <type> <name>
```

选项：
- `--type <type>` - 类型（component/util）
- `--path <path>` - 指定创建路径
- `--test` - 同时创建测试文件

## dev

启动开发服务器。

```bash
shopspade dev [options]
```

选项：
- `--port <port>` - 指定端口号（默认：3000）
- `--host <host>` - 指定主机（默认：localhost）
- `--open` - 自动打开浏览器

## build

构建项目。

```bash
shopspade build [options]
```

选项：
- `--mode <mode>` - 构建模式（development/production）
- `--report` - 生成构建报告
- `--minify` - 压缩代码

## lint

代码检查。

```bash
shopspade lint [options] [files...]
```

选项：
- `--fix` - 自动修复问题
- `--format <format>` - 输出格式
- `--ignore-path <path>` - 指定忽略文件

## test

运行测试。

```bash
shopspade test [options]
```

选项：
- `--watch` - 监听文件变化
- `--coverage` - 生成覆盖率报告
- `--verbose` - 显示详细信息

## config

管理配置。

```bash
shopspade config [options] [key] [value]
```

选项：
- `--get <key>` - 获取配置
- `--set <key> <value>` - 设置配置
- `--delete <key>` - 删除配置
- `--list` - 显示所有配置

## upgrade

升级 CLI 工具。

```bash
shopspade upgrade [options]
```

选项：
- `--check` - 检查更新
- `--force` - 强制升级
- `--registry <url>` - 指定 registry
