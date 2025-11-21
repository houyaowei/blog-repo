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
          { text: 'Proxy限制', link: '/javascript/proxy-restrict' },
          { text: 'js异常隔离', link: '/javascript/js-isolation' },
          { text: 'WebWorker总结', link: '/javascript/web-worker' },
          {
            text: 'ArrayBuffer，Base64 和 Blob',
            link: '/javascript/byte-blob-base64',
          },
          {
            text: 'File相关',
            link: '/javascript/file-relation',
          },
          { text: '柯里化与偏函数', link: '/javascript/curring' },
          { text: 'DOM继承关系', link: '/javascript/dom-inherit' },
          { text: '暗黑模式', link: '/javascript/theme' },
        ],
      },
      {
        text: 'Go语言',
        collapsible: true,
        items: [
          { text: '【转载】Go语言的优点和缺点', link: '/go/go-good-bad-ugly' },
        ],
      },
      {
        text: 'TypeScript',
        collapsible: true,
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
