import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Coder',
  description: 'Coder blog',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '主页', link: '/' },
      { text: '技术', link: '/articles' },
      { text: '闲读书', link: '/books' },
      { text: '关于我', link: '/about-me' },
    ],

    sidebar: [
      {
        text: '边角料',
        collapsed: false,
        items: [
          { text: '闲读书', link: '/books' },
          { text: '关于我', link: '/about-me' },
        ],
      },
      {
        text: '框架思考',
        collapsed: false,
        items: [{ text: 'Islands架构', link: '/architecture/islands' }],
      },
      {
        text: 'JavaScript',
        collapsed: false,
        items: [
          { text: 'ESM原理', link: '/articles' },
          { text: '前端5个Observer', link: '/javascript/5-observer' },
          { text: 'JavaScript30年', link: '/javascript/js-30-years' },
          { text: 'stringify的其他用法', link: '/javascript/stringify' },
          { text: 'AbortController', link: '/javascript/abort-controller' },
        ],
      },
      {
        text: 'TypeScript',
        collapsible: false,
        items: [{ text: 'TypeScript片段', link: '/typescript/snippets' }],
      },
      {
        text: '构建工具',
        collapsed: false,
        items: [
          { text: 'Webpack插件开发', link: '/build-tools/webpack-plugin' },
          { text: 'Vite插件开发', link: '/build-tools/vite-plugin' },
          { text: 'swc', link: '/build-tools/swc' },
        ],
      },
      {
        text: '杂项',
        collapsed: false,
        items: [{ text: '10幅寺庙对联', link: '/sundry/10-couplet' }],
      },
      {
        text: '跑步',
        collapsed: false,
        items: [
          { text: '我的跑步装备', link: '/running/running-equip' },
          { text: '健康跑', link: '/running/healthy-running' },
        ],
      },
    ],
    footer: {
      message: '陕ICP备15010740号',
      copyright: 'Copyright © 2015-present Coder blog',
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/houyaowei' }],
  },
})
