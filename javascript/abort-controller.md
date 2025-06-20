# AbortController
Promise中没有『中止』的概念，但可以使用[AbortController](https://developer.mozilla.org/zh-CN/docs/Web/API/AbortController)来中止请求，这并不是Promise规范本身的功能,这是一个独立的API，它提供了一种机制来中止一个或多个请求。AbortController可以与Fetch API、XMLHttpRequest等一起使用，以中止请求，还可以中止其他异步任务（流、WebSockets等）。

规范定义：
```md
interface AbortController {
  constructor();
  [SameObject] readonly attribute AbortSignal signal;
  undefined abort(optional any reason);
};
```
## 基本用法
```md
let controller = new AbortController();
let signal = controller.signal; // 获取 "signal" 对象，

// 监听abort事件， controller.abort() 被调用时触发
signal.addEventListener('abort', () => alert("abort!"));

//在适合时机取消
controller.abort(); // 中止

// 事件触发，signal.aborted 变为 true
alert(signal.aborted); // true
```
## 和Fetch API配合
```md
let controller = new AbortController();
setTimeout(() => controller.abort(), 1000); //1秒后中止

try {
  let response = await fetch(url, {
    signal: controller.signal
  });
} catch(err) {
  if (err.name == 'AbortError') { // handle abort()
    alert("Aborted!");
  } else {
    throw err;
  }
}
```
AbortController也可以同时中止多个Promise。
```md
let urls = []; //fetch urls
let controller = new AbortController();
let fetchJobs = urls.map(url => fetch(url, {
  signal: controller.signal
}));

await Promise.all(fetchJobs);
```

## AbortSignal事件
因为 AbortSignal继承了EventTarget，所以可以在AbortSignal（signal属性上）上监听abort事件。

```md
interface AbortSignal : EventTarget {
  [NewObject] static AbortSignal abort(optional any reason);
  [Exposed=(Window,Worker), NewObject] static AbortSignal timeout([EnforceRange] unsigned long long milliseconds);
  [NewObject] static AbortSignal _any(sequence<AbortSignal> signals);

  readonly attribute boolean aborted;
  readonly attribute any reason;
  undefined throwIfAborted();

  attribute EventHandler onabort;
};
```
应用场景为有不同类型并行的异步任务，需要单个AbortController中止。
我们把上面的实例做下改造。
```md
let urls = [];
let controller = new AbortController();
// 自定义任务
let ourJob = new Promise((resolve, reject) => {
  ...
  controller.signal.addEventListener('abort', reject);
});

let fetchJobs = urls.map(url => fetch(url, { // fetches
  signal: controller.signal
}));

Promise.all([...fetchJobs, ourJob]);
```


## 规范
[AbortController](https://dom.spec.whatwg.org/#abortcontroller)
