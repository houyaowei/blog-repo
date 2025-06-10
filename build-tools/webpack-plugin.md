## Webpack插件

webpack的插件在平时开发中很常见，像提取样式的、性能分析的，络绎不绝。插件为开发者提供了完整的能力，扩展webpack的处理范围。

webpack插件一般有如下组成：
- 一个JavaScript函数或者是一个类。
- 如果是命名函数，需要在prototype上定义apply方法；如果是类，只需要提供apply方法。参数为compiler事件钩子。
- 指定一个绑定在webpack上的hook，hook函数中注入Compilation。
- webpack内部数据处理。
- 功能实现后调用指定的回调函数。

compiler 对象代表了完整的 webpack 环境配置。这个对象在启动 webpack 时一次性创建，并配置好所有可操作的配置，包括 options，loader 和 plugin。当在 webpack 环境中应用一个插件时，插件将收到此 compiler 对象的引用。可以使用它来访问 webpack 的主环境。

compilation 对象代表了一次资源版本构建。当运行 webpack 开发环境中间件时，每当检测到一个文件变化，就会创建一个新的 compilation，从而生成一组新的编译资源。一个 compilation 对象表现了当前的模块资源、编译生成资源、变化的文件、以及被跟踪依赖的状态信息。通过 Compilation 也能读取到 Compiler 对象。
Compiler 和 Compilation 的区别在于：Compiler 代表了整个 Webpack 从启动到关闭的生命周期，而 Compilation 只是代表了一次新的编译。

webpack本质上是一种事件流的机制，它的工作流程就是将各个插件串联起来，而实现这一切的核心就是Tapable，webpack中最核心的负责编译的Compiler和负责创建bundles的Compilation都是Tapable的实例。Tapable暴露出挂载plugin的方法。

Tapable提供了很多Hooks类，这些Hooks用来挂载插件。

```md
const {
    SyncHook,
    SyncBailHook,
    SyncWaterfallHook,
    SyncLoopHook,
    AsyncParallelHook,
    AsyncParallelBailHook,
    AsyncSeriesHook,
    AsyncSeriesBailHook,
    AsyncSeriesWaterfallHook
 } = require("tapable");
```
来看下SyncHookd 用法:
```md
//实例化，获得们需要的Hook
const hook1 = new SyncHook(["arg1", "arg2", "arg3"]);
//绑定事件到webapck事件流
hook1.tap('hook1', (arg1, arg2, arg3) => console.log(arg1, arg2, arg3)) //1,2,3
//执行绑定的事件
hook1.call(1,2,3)
```
有了上面理论，下面看怎么实现一个最基本的插件。根据上面的插件组成介绍，需要先声明一个类并提供apply方法：
```md
class MyWebpackPlugin {
  constructor(doneCallback, failCallback) {
      this.doneCallback = doneCallback;
      this.failCallback = failCallback;
  }
  apply(compiler) {
    compiler.hooks.done.tap('MyWebpackPlugin', (compilation,callback) => {
        this.doneCallback(compilation, callback);
    });
    compiler.hooks.failed.tap('MyWebpackPlugin', (err) => {
        this.failCallback(err);
    });
  }
}
module.exports = MyWebpackPlugin;
```
这里我们借助hooks的两个事件：done和failed。<br/>
done：在成功构建并且输出了文件后，Webpack 即将退出时发生；<br/>
failed：在构建出现异常导致构建失败，Webpack 即将退出时发生；

在webpack中引入插件文件，并实例化：
```md
const EndWebpackPlugin = require("./src/index");
plugins: [
    //实例化插件
    new EndWebpackPlugin((status)=> {
      // console.log(status)
    } ,()=> {
      console.log("failed")
    })
  ]
```
