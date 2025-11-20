# 前端暗黑主题修改

实现方法有5种：1、浏览器自动匹配 2、手动切换 3、根据时间自动切换 4、样式的filter方法 5、添加data-theme属性

## 浏览器自动匹配

浏览器自动匹配是通过CSS的@media查询来实现的。当用户设备的系统设置为暗黑模式时，浏览器会自动应用相应的CSS样式。例如：

```css
@media (prefers-color-scheme: dark) {
  //暗黑模式
  body {
    background-color: #fff;
    color: red;
  }
}
@media (prefers-color-scheme: light) {
  body {
    background-color: #000;
    color: #ccc;
  }
}
```

这种方式需要在:root中添加

```css
color-scheme: light dark;
```

## 手动切换

实现方案为在:root中定义样式变量并初始值，并声明dark样式类，改变样式变量，body中引用这些变量。

```css
:root {
  --bg-color: #ffffff;
  --text-color: #333333;
  --border-color: #e5e7eb;
}
.dark {
  --bg-color: #1a1a1a;
  --text-color: #f5f5f5;
  --border-color: #374151;
}
body {
  background-color: var(--bg-color);
  color: var(--text-color);
  transition:
    background-color 0.3s,
    color 0.3s; /* 平滑过渡 */
}
```

在JavaScript事件中动态改变html元素的样式。

```javascript
function setTheme(theme?: 'light' | 'dark' | 'auto') {
  if (theme) localStorage.setItem('theme', theme)
  const targetTheme = theme || localStorage.getItem('theme') || 'auto'
  const isDark =
    targetTheme === 'dark' ||
    (targetTheme === 'auto' && colorSchemeQuery.matches)
  if (theme == 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    else document.documentElement.classList.remove('dark')
  }

}
```

## 根据时间自动切换

根据时间自动切换是通过JavaScript来实现的。当用户设备的系统设置为暗黑模式时，JavaScript会根据当前时间来修改CSS的color-scheme属性。例如：

```javascript
const now = new Date()
const hour = now.getHours()

if (hour < 6 || hour > 18) {
  document.documentElement.style.colorScheme = 'light'
} else {
  document.documentElement.style.colorScheme = 'dark'
}
```

当然在:root中添加color-scheme。

## 浏览器检测是否是dark模式

```javascript
const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)')
console.log('colorSchemeQuery:', colorSchemeQuery.matches)
```

colorSchemeQuery为true时,表示系统是深色模式。如果要检测显示模式的切换，可以为colorSchemeQuery注册change事件。

```javascript
colorSchemeQuery.addEventListener('change', () => {
  //其他逻辑
})``
```

## 样式的filter方法

```javascript
document.documentElement.style.filter = 'invert(100%)'
```

去掉filter即去掉暗黑模式。

## 添加data-theme属性

在html元素中添加data-theme属性可以方便地切换主题。例如：

```css
:root {
  --bg-color: #ffffff;
  --text-color: #333333;
  --border-color: #e5e7eb;
}
[data-theme='dark'] {
  --bg-color: #1a1a1a;
  --text-color: #f5f5f5;
  color-scheme: dark;
}
body {
  background-color: var(--bg-color);
  color: var(--text-color);
  transition:
    background-color 0.3s,
    color 0.3s; /* 平滑过渡 */
}
```

```javascript
document.documentElement.setAttribute('data-theme', 'dark')
```
