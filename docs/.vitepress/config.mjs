import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'ShopSpade',
  description: 'Vue 3 component library and utility functions',
  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/' },
      { text: '组件', link: '/components/' },
      { text: '工具函数', link: '/utils/' },
      { text: 'CLI', link: '/cli/' }
    ],
    sidebar: {
      '/guide/': [
        {
          text: '开始',
          items: [
            { text: '简介', link: '/guide/' },
            { text: '快速开始', link: '/guide/getting-started' },
          ]
        }
      ],
      '/components/': [
        {
          text: '组件',
          items: [
            { text: '组件总览', link: '/components/' },
            // 这里可以添加具体的组件文档链接
          ]
        }
      ],
      '/utils/': [
        {
          text: '工具函数',
          items: [
            { text: '概述', link: '/utils/' },
            // 这里可以添加具体的工具函数文档链接
          ]
        }
      ],
      '/cli/': [
        {
          text: 'CLI工具',
          items: [
            { text: '介绍', link: '/cli/' },
            { text: '命令列表', link: '/cli/commands' },
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/kkkdb/shopspade' }
    ]
  }
})
