# 工具函数

ShopSpade 提供了一系列实用的工具函数，涵盖了日常开发中常见的场景。

## 安装

```bash
pnpm add @shopspade/utils
```

## 使用方式

```js
// 按需导入
import { formatDate, deepClone } from '@shopspade/utils'

// 使用函数
const date = formatDate(new Date(), 'YYYY-MM-DD')
const obj = deepClone({ a: 1, b: { c: 2 } })
```

## 函数分类

### 日期处理

- `formatDate` - 格式化日期
- `parseDate` - 解析日期字符串
- `addDays` - 添加天数
- `diffDays` - 计算日期差

### 数据处理

- `deepClone` - 深拷贝
- `debounce` - 防抖函数
- `throttle` - 节流函数
- `unique` - 数组去重

### 验证函数

- `isEmail` - 邮箱验证
- `isPhone` - 手机号验证
- `isURL` - URL验证
- `isEmpty` - 空值检查

### 字符串处理

- `camelCase` - 转驼峰命名
- `kebabCase` - 转连字符命名
- `capitalize` - 首字母大写
- `trim` - 去除空格

### 数字处理

- `formatNumber` - 数字格式化
- `random` - 随机数生成
- `round` - 四舍五入
- `clamp` - 数值限制

## 注意事项

- 所有函数都经过 TypeScript 类型定义
- 支持 Tree Shaking，只打包使用到的函数
- 兼容 CommonJS 和 ES Module 两种模块系统
