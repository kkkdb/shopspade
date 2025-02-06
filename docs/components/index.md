# 组件总览

ShopSpade 组件库提供了一系列高质量的 Vue 3 组件，帮助你快速构建现代化的用户界面。

## 组件列表

### 基础组件

- Button 按钮
- Icon 图标
- Typography 排版

### 布局组件

- Grid 栅格
- Space 间距
- Divider 分割线

### 表单组件

- Input 输入框
- Select 选择器
- Checkbox 复选框
- Radio 单选框
- Switch 开关

### 数据展示

- Table 表格
- Tag 标签
- Badge 徽标

### 反馈组件

- Modal 对话框
- Message 全局提示
- Notification 通知提醒框
- Progress 进度条

## 组件使用

所有组件支持全量引入和按需引入两种方式：

### 全量引入

```js
import { createApp } from 'vue'
import ShopSpade from '@shopspade/components'
import '@shopspade/components/dist/style.css'

const app = createApp(App)
app.use(ShopSpade)
```

### 按需引入

```js
import { Button, Input } from '@shopspade/components'
import '@shopspade/components/dist/style.css'

// 在组件中使用
export default {
  components: {
    Button,
    Input
  }
}
```
