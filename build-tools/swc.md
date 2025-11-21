# swc编译入门

## 搭建环境

```bash
pnpm i -D @swc/cli @swc/core
```

准备编译代码片段

```javascript
import { isString } from 'javascript-validate-utils'

let name = 'houyw'
const speak = (p = '', content) => {
  if (isString(p)) {
    console.log(`${p} said:`, content)
  } else {
    console.log('emo! everyone keep slient')
  }
}
speak(name, 'hello,rust~')
speak({}, 'hello,rust~')
```

执行swc命令进行编译

```bash
npx swc 文件名/目录 -o output.js
```

-o 等同 --out-file，指定编译后的代码输出到的文件。
SWC即可以单个文件编译，也支持整个目录编译。如果使用上面的命令编译整个目录，SWC会把所有文件的编译结果写到output.js中，源文件过多的话，目标文件就会很大，可以指定构建目录的方式保持各文件独立，命令需要修改如下：

```bash
npx swc ./src -d dist
```

## 增加配置文件

熟悉babel的都知道，babel有配置文件.babelrc，swc也有配置文件.swcwc，如果不需要可以在执行编译时使用--no-swcrc过滤掉，使用默认配置。

```json
{
  "$schema": "https://swc.rs/schema.json",
  "jsc": {
    "parser": {
      "syntax": "ecmascript", //语法支持
      "jsx": false, //是否支持jsx语法
      "dynamicImport": false,
      "privateMethod": false,
      "functionBind": false,
      "exportDefaultFrom": false,
      "exportNamespaceFrom": false,
      "decorators": false,
      "decoratorsBeforeExport": false,
      "topLevelAwait": false,
      "importMeta": false,
      "preserveAllComments": false
    },
    "transform": null,
    "target": "es5", //编译目标
    "loose": false,
    "externalHelpers": false,
    // Requires v1.2.50 or upper and requires target to be es2016 or upper.
    "keepClassNames": false
  },
  "isModule": false
}
```

使用.swcrc配置文件的在编译时需要在命令行里指定:

```bash
npx swc src -d dist .swcrc
```

## 增加浏览器支持

浏览器支持情况配置是在.swcrc文件的env部分中配置，这是对标babel的预设插件@babel/preset-env，接收客户自定义支持的浏览器版本，babel会根据浏览器配置信息并结合core-js生成适用于特定版本的兼容代码。
在babel中推荐使用.browserslistrc并在这个文件中配置，因为这个配置还可以被其他库（autoprefixer、stylelint、eslint-plugin-compat等)识别。
支持.browserslistrc文件的话，首先安装browserslist，并修改.swcrc的env配置：

```json
{
  "env": {
    "targets": {
      "chrome": "79"
    },
    "mode": "entry",
    "coreJs": "3.22"
  }
}
```

- targets: 设定目标环境，也可以字符串的形式，如 "targets": "> 0.25%, not dead"。
- mode: 此选项配置如何处理 polyfill，可选项有"usage"，"entry"和undefined。当使用 usage或 entry选项时，swc添加对 core-js 模块的直接引用。 core-js 将根据相对文件进行解析，并且可访问。
- corejs: 指定corejs版本，只有在mode为"usage"、"entry"时有效，建议尽可能的指定完整的版本号（主版本号.次版本号.修订号），避免无法正确解析目标版本导致polyfills包无法正确加载。
