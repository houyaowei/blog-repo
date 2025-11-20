# js中异常隔离
在插件化架构中，异常隔离是保障系统稳定性的核心。通过隔离插件与宿主环境，即使单个插件崩溃，也不会影响整体系统运行。前端的隔离有3种方式：Proxy、iframe和Web Worker。

## Proxy方式
通过使用Proxy对象，可以实现对目标对象的代理访问。当访问目标对象时，Proxy对象会拦截并处理请求，从而实现异常隔离。

```javascript
const sandbox = newProxy(window, {
  get(target, key) {
    // 禁止访问敏感属性、方法
    if (key === 'document') {
      thrownewError('访问权限受限！');
    }
    return Reflect.get(target, key);
  },
  set(target, key, value) {
    // 禁止修改关键属性
    if (key === 'location') return false;
    return Reflect.set(target, key, value);
  }
});
```
特点：
- 隔离级别：逻辑隔离，共享主线程
- 开销：低，仅仅拦截主线程的对象
- 安全性：中等（TODO：绕过proxy攻击主线程）
- 适用场景：需要部分宿主环境访问权的插件

## iframe方式
通过 sandbox 属性限制权限

```javascript
<iframe
  sandbox="allow-scripts allow-same-origin"
  src="third-party.html"
></iframe>
```

sandbox有一下具体属性：

- allow-scripts：允许脚本执行
- allow-same-origin：允许同源访问
- allow-top-navigation：允许导航到同源页面
- allow-forms：允许表单提交
- allow-popups：允许弹出窗口
- allow-pointer-lock：允许指针锁定
- allow-modals：允许模态对话框
- allow-orientation-lock：允许屏幕方向锁定
- allow-pointer-lock：允许指针锁定
- allow-popups-to-escape-sandbox：允许沙箱化的文档打开新的浏览上下文，并且新浏览上下文不会继承沙箱标记
- allow-storage-access-by-user-activation：允许用户激活存储访问
- allow-top-navigation-to-custom-protocols：允许导航到自定义协议

特点：
- 隔离级别：（独立渲染进程、JS 执行环境）
- 开销：高，需要创建新的进程
- 安全性：高，安全项可以控制
- 适用场景：完全不可信的第三方链接

## web worker方式
通过创建一个独立的线程，可以实现对宿主环境的隔离。Worker 线程与js主线程能够同时运行，互不阻塞。可以将计算量大的任务交给worker线程执行，从而提高页面性能。

```javascript
//主文件
const myWorker = new Worker('/worker.js'); // 创建 worker
myWorker.addEventListener('message', e => {
    console.log(e.data);
});
myWorker.postMessage('Greeting from Main.js');

//worker文件
self.addEventListener('message', e => {
    console.log(e.data);
});
self.postMessage('Greeting from Worker.js');

```
特点：
- 隔离级别：物理隔离，独立线程，也无法访问DOM、主线程变量
- 开销：高，需要创建新的线程，包括通信序列化
- 安全性：高，线程崩溃也不影响主线程
- 适用场景：高安全要求或计算密集型任务


## 综合比较

<table>
    <thead>
        <tr>
            <th><section ><span leaf="">维度</span></section></th>
            <th><section><span>Proxy 代理</span></section></th>
            <th><section ><span >Web Workers</span></section></th>
            <th><section ><span>iframe</span></section></th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><strong><span>隔离级别</span></strong></td>
            <td><section><span>逻辑层（共享内存）</span></section></td>
            <td><section><span>物理线程（独立内存）</span></section></td>
            <td><section ><span>进程级（独立进程）</span></section></td>
        </tr>
        <tr>
            <td><strong><span>DOM 访问</span></strong></td>
            <td><section><span>可控（可部分允许）</span></section></td>
            <td><section><span>完全禁止</span></section></td>
            <td><section><span>可控（通过配置）</span></section></td>
        </tr>
        <tr>
            <td><strong><span leaf="">通信成本</span></strong></td>
            <td><section><span>无（直接访问变量）</span></section></td>
            <td><section><span>高（需序列化）</span></section></td>
            <td ><section><span>中（postMessage）</span></section></td>
        </tr>
        <tr>
            <td><strong><span>内存占用</span></strong></td>
            <td><section><span>低</span></section></td>
            <td><section><span>中</span></section></td>
            <td><section><span>高（独立文档环境）</span></section></td>
        </tr>
        <tr>
            <td><strong><span>安全性</span></strong></td>
            <td><section><span>中</span></section></td>
            <td><section><span>高</span></section></td>
            <td><section><span>极高</span></section></td>
        </tr>
            <tr>
                <td><strong><span>兼容性</span></strong></td>
                <td><section><span>现代浏览器（IE不支持）</span></section></td>
                <td><section><span>广泛（IE 10+）</span></section></td>
                <td><section><span>最好</span></section></td>
            </tr>
            <tr>
                <td ><strong><span>典型场景</span></strong></td>
                <td><section><span>需部分宿主权限的插件</span></section></td>
                <td><section><span>高安全计算任务</span></section></td>
                <td><section><span>完全不可信内容</span></section></td></tr></tbody>
</table>

## 方案选择

1. 决策树
```md
是否需要访问 DOM？
├── 是 → 是否需要高安全性？
│   ├── 是 → iframe（配置 sandbox 权限）
│   └── 否 → Proxy 代理
└── 否 → 是否需要高性能计算？
    ├── 是 → Web Workers
    └── 否 → Proxy 代理
```

2. 实战案例
- 埋点 SDK：Proxy 代理（需访问 performance API）
- 第三方支付插件：Web Workers（保障支付逻辑安全）
- HTML 预览：iframe（彻底隔离恶意代码）
