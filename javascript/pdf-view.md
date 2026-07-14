# 前端预览pdf

> 只是记录pdf踩坑过程，特别是移动端的兼容性

## 后端返回pdf的格式

- 在线pdf
- pdf base64

## 加载在线pdf文档

对react技术栈而说，如果目标环境是iOS 18及其以上版本，`react-pdf`无疑是很好的选择;如果是Vue技术栈，`vue-pdf-embed`可以优先选择。 因为两者底层依赖的是Mozilla的`pdfjs-dist`，但是iOS 15及其以下机器请慎重考虑，问题其实挺多的。

[问题传送门](https://github.com/mozilla/pdf.js/issues?q=is%3Aissue%20state%3Aclosed%20ios&page=1)

但是作为老牌的pdf预览组件，`pdfjs-dist`已经兼容的非常好了。但是对于iOS 15及其以下可以考虑基于该组件进行退而求其次的方案，把每页的pdf文档通过canvas转换为图片。流程如下：

1. 使用pdfjs-dist加载pdf文档
2. 获取pdf文档页数
3. 每个page对象生成base64图片并保存
4. 遍历图片缓存数组

代码：

```javascript
import * as pdfjsLib from 'pdfjs-dist'
const imageUrls = ref([]) //存储转换后的base64

const renderPageToImage = async function (
  page,
  scale = 0.5,
  format = 'image/png',
  quality = 1,
) {
  //根据比例获取页面视口尺寸
  const viewport = page.getViewport({ scale: scale })
  const dpr = window.devicePixelRatio || 1
  // console.log('viewport:', viewport)
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  canvas.width = viewport.width * dpr
  canvas.height = viewport.height * dpr
  console.log('width:', viewport.width, 'height:', viewport.height, 'dpr:', dpr)
  imgWidth.value = viewport.width //适配视口宽度
  context.scale(dpr, dpr) // 设置缩放比例，防止模糊，这步至关重要
  // 将 PDF 页面渲染到 Canvas 上
  const renderContext = {
    canvasContext: context,
    viewport: viewport,
  }
  await page.render(renderContext).promise
  return canvas.toDataURL(format, quality)
}

const loadPageDetail = async (url) => {
  const loadingTask = pdfjsLib.getDocument(url) //加载pdf链接
  const pdf = await loadingTask.promise

  const urls = []
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    // 调用转换函数，生成图片 dataURL
    const dataUrl = await renderPageToImage(page, 0.65, 'image/png')
    urls.push(dataUrl)
  }
  imageUrls.value = urls
}
```

toDataURL()是通过baseline测试的，支持Safari ios 3（+），WebView on iOS 3（+），WebView Android 4.4（+），兼容性很好。

最后在页面循环图片即可：

```vue
<img
  v-for="(img, index) in imageUrls"
  :key="index"
  :src="img"
  :width="imgWidth"
/>
```

## 总结

移动端预览pdf如果兼容低版本系统，推荐使用这种方式，如果是后端返回base64格式，使用`react-pdf`或者`vue-pdf-embed`也没啥毛病。
