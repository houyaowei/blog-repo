# 前端5个Observer

## 5个Observer有哪些？
- MutationObserver
- IntersectionObserver
- ResizeObserver
- PerformanceObserver
- ReportingObserver

## MutationObserver
用途：提供了监视对 DOM 树所做更改的能力, 并捕捉这些变化。

```md
const next = window.requestAnimationFrame ? requestAnimationFrame : setTimeout;
const ignoreDOMList = ["style", "script", "link"];

observer = new MutationObserver((mutationList) => {
  const entry = {
    children: [],
  };

  for (const mutation of mutationList) {
    //捕捉删除的节点
    if (mutation.removedNodes.length) {
      // ...
    }
    //捕捉添加的节点
    if (mutation.addedNodes.length ) {
      // ...
    }
  }
});
//监控对象为document对象，也可以修改为具体的DOM对象
observer.observe(document, {
  childList: true,
  subtree: true,
});

```
调用observe后开始监听DOM变化，如果要停止观察，需要调用`observer.disconnect()`方法。


## IntersectionObserver
监听一种异步观察目标元素与其祖先元素或顶级文档视口（viewport）交叉状态的方法，然后在可视比例达到某个阈值的时候触发回调。

场景：图片懒加载实例

```md
<img data-src="./imgs/1.jpg" alt="懒加载" />
<img data-src="./imgs/2.png" alt="懒加载" />
<img data-src="./imgs/3.jpg" alt="懒加载" />
<img data-src="./imgs/4.jpg" alt="懒加载" />
<img data-src="./imgs/5.jpg" alt="懒加载" />
```
javascript实现
```md
document.addEventListener("DOMContentLoaded", () => {
  if ("IntersectionObserver" in window) {
    const imgs = document.getElementsByTagName("img");
    const imageObserve = new IntersectionObserver(
      (entries) => {
          entries.forEach((entry) => {
              if (entry.isIntersecting) {
                  console.log("进入可视区");
                  const img = entry.target;
                  img.src = img.dataset.src;
                  imageObserve.unobserve(img);
              }else {
                  console.log("未进入可视区");
              }
          });
      },
      {
        threshold: [0.25],
      },
    );
    [...imgs].forEach((img) => {
        // 开启监视每一个元素
        imageObserve.observe(img);
    });
  } else {
    alert("您的浏览器不支持IntersectionObserver！");
  }
});
```

## ResizeObserver
resize事件只针对窗口（window）触发，其他元素的尺寸调整通知可以使用ResizeObserver来实现。

基础用法：
```md
const resizeObserver = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
        console.log(entry.target);
        console.log(entry.contentRect);
    });
});
resizeObserver.observe(document.querySelector('.observer'));
```

## PerformanceObserver

PerformanceObserver 用于监听记录 performance 数据的行为，一旦记录了就会触发回调，

performance 使用 mark 方法记录某个时间点
```md
performance.mark("mark-test-start");
```
实现方法
```md
const observer = new PerformanceObserver((entryList) => {
  entryList.getEntries().forEach((entry) => {
    var logMark = "";
    var logMeasure = "";
    if (entry.entryType === "mark") {
      logMark = `${entry.name}的startTime是: ${entry.startTime}`;
      console.log(logMark);
    }
    if (entry.entryType === "measure") {
      console.log(
        (logMeasure = `${entry.name}的duration时间是: ${entry.duration}`),
      );
    }
  });
});
observer.observe({
  entryTypes: ["mark", "measure", "resource"],
});
performance.mark("mark-test-end");
```
创建 PerformanceObserver 对象，监听 mark（时间点）、measure（时间段）、resource（资源加载耗时）这三种记录时间的行为。也可以监测navigation（导航数据），first-input（fid指标）、layout-shift（cls指标），largest-contentful-paint（LCP指标）、longtask

## ReportingObserver
监听过时的 api、浏览器的一些干预行为的报告。
```md
//types也可以为crash
const options= {types: ['intervention', 'deprecation'], buffered: true}

const reportingObserver = new ReportingObserver((reports, observer) => {
    for (const report of reports) {
        console.log(report.body);//上报
    }
}, options);
reportingObserver.observe();
```
options 用来过滤上报的类型,buffered表示Observer实例创建前会生成report。

如果使用的sentry，可以参考[ReportingObserver](https://docs.sentry.io/platforms/javascript/configuration/integrations/reportingobserver/)

友情提醒，**用完Observer最后一定要disconnect**,切记~切记~
