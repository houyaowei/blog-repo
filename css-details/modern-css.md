# Modern CSS

## @container

组件不再看全局 viewport（媒体查询匹配的是视口宽度），根据父容器的大小进行响应式调整。

```html
<div class="post">
  <div class="card">
    <h2>Card title</h2>
    <p>Card content</p>
  </div>
</div>
```

```css
.post {
  container-type: inline-size;
}

/* Apply styles if the container is narrower than 650px */
@container (width < 650px) {
  .card {
    width: 50%;
    background-color: lightgray;
    font-size: 1em;
  }
}
```

使用container-type **定义容器**类型，有4个选项可以配置

- normal：该元素不是任何容器尺寸查询的查询容器，但仍然是容器样式查询的查询容器。
- inline-size：查询基于容器行向尺度，将布局、样式和大小的限制应用于容器元素。
- size：查询基于容器行向和块向尺度，将布局、样式和大小的限制应用于容器元素。

当然也可以为容器定义容器查询

```css
.container {
  /* conatiner: sidebar/inline-size; // 简写方式 */
  container-type: inline-size;
  container-name: sidebar;
}

/* 容器尺寸查询 */
@container sidebar (min-width: 700px) {
  /* 样式 */
}
```

## @layout

通过@layer at-rule将 CSS 分成多个层，解决各种!important冲突的问题。
首先声明图层顺序：

```css
@layer reset, base, components, utilities;
```

reset层的样式最先被应用（最底层），utilities层的样式最后被考虑（最顶层）

```css
/* reset.css 或 normalize.css */
@layer reset {
  /* ...重置浏览器的默认样式... */
  * {
    box-sizing: border-box;
  }
}

/* 基础元素样式 */
@layer base {
  body {
    font-family: sans-serif;
  }
  a {
    color: #333;
  }
}

/* 引入第三方UI库，比如Ant Design Vue */
@import url('ant-design-vue/dist/reset.css') layer(library);
@layer library {
  /* 你可以写一些覆盖UI库的全局样式 */
}

/* 我们自己的业务组件 */
@layer components {
  .card {
    border: 1px solid #eee;
  }
  .button {
    padding: 8px 16px;
  }
}

/* 工具类，比如Tailwind里的 */
@layer utilities {
  .text-center {
    text-align: center;
  }
  .p-4 {
    padding: 1rem;
  }
}

/* 最后的“救命稻草”层，用来覆盖一切 */
@layer overrides {
  .some-very-specific-case {
    /* ... */
  }
}
```

对分散在多个css文件中的layer使用@import并配合layer函数一起使用：

```css
@import url('reset.css') layer(reset);
@import url('base.css') layer(base);
@import url('components.css') layer(components);
@import url('utilities.css') layer(utilities);
@import url('overrides.css') layer(overrides);
```

## :has()

```html
<section>
  <article class="featured">Featured content</article>
  <article>Regular content</article>
</section>
```

```css
section:has(.featured) {
  border: 2px solid blue;
}
```

## CSS Nesting

[MDN原文](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Nesting/At-rules)

## 容器查询单位

<table>
    <tbody>
    <tr>
        <td>单位</td>
        <td>描述</td>
    </tr>
    <tr>
        <td>cqw</td>
        <td>表示容器查询宽度占比，1cqw 等于容器宽度的 1%</td>
    </tr>
    <tr>
        <td>cqh</td>
        <td>表示容器查询高度占比，1cqh 等于容器高度的 1%</td>
    </tr>
    <tr>
        <td>cqi</td>
        <td>表示容器查询内联方向尺寸占比。默认情况下，Inline-Size指的就是水平方向，对应的是宽度，因此，1cqi 通常可以看成是容器宽度的 1%</td>
    </tr>
    <tr>
        <td>cqb</td>
        <td>表示容器查询块级方向尺寸占比。默认情况下，Block-Size指的就是垂直方向，对应的是高度，因此，1cqb 通常可以看成是容器高度的 1%</td>
    </tr>
    <tr>
        <td>cqmin</td>
        <td>表示容器查询较小尺寸的占比，例如容器尺寸是 300px * 500px，则 100cqmin 对应的是尺寸较小的宽度 300px</td>
    </tr>
    <tr>
        <td>cqmax</td>
        <td>表示容器查询较大尺寸的占比，例如容器尺寸是 300px * 500px，则 100cqmax 对应的是尺寸较大的高度 500px</td>
    </tr>
    </tbody>
</table>

## Subgrid

[mdn例子](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Subgrid) <br>
[css tricks](https://css-tricks.com/complete-guide-css-grid-layout/)

## 最后

最后附上大漠老师对modern css属性范围的整理

<image src="/modern-css.jpg" width="700px"/>
