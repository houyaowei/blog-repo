#  File相关

根据[规范文档](https://w3c.github.io/FileAPI/#dfn-file)描述，File继承自Blob。所以File既有Blob特性，又有自身特性（文件的名称、大小、类型和最后修改日期等）。
```c++
[Exposed=(Window,Worker), Serializable]
interface File : Blob {
  constructor(sequence<BlobPart> fileBits,
              USVString fileName,
              optional FilePropertyBag options = {});
  readonly attribute DOMString name;
  readonly attribute long long lastModified;
};

dictionary FilePropertyBag : BlobPropertyBag {
  long long lastModified;
};
```


## File对象

File对象可以通过两种方式创建，第一种是通过File构造器：
```javascript
new File(fileBits, fileName, options);
```
fileBits为 blobParts数组，blobParts可以是Blob对象，字符串和BufferSource，和[Blob](/javascript/byte-blob-base64#Blob)参数一致。

第二种方式是 input标签获得的文件列表：
```javascript
const fileInput = document.querySelector('input[type="file"]');
const files = fileInput.files;
```
或者从拖放操作的 [DataTransfer](https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer) 对象中获取

## FileReader

FileReader对象的唯一目的是用于读取File、Blob对象的内容。它提供了多种方法，像readAsArrayBuffer、readAsBinaryString、readAsDataURL和readAsText。
FileReader对象提供了以下方法来读取文件：

- readAsArrayBuffer(obj): 将文件读取为ArrayBuffer对象。
- readAsBinaryString(obj): 将文件读取为二进制字符串，此方法已弃用，推荐使用readAsArrayBuffer。
- readAsDataURL(obj): 将文件读取为DataURL字符串(base64)。
- readAsText(obj, encoding): 将文件读取为文本字符串，encoding参数指定编码方式，默认为UTF-8。

FileReader对象提供了以下事件来监听读取状态：

- onloadstart: 读取开始时触发。
- onprogress: 读取过程中触发, readyState为LOADing。
- onabort: 读取被中止时触发。
- onerror: 读取发生错误时触发。
- onload: 读取成功完成时触发， readyState为LOADing。
- onloadend: 读取完成时触发， readyState为DONE。

实例
```javascript
const fileInput = document.querySelector('input[type="file"]');
const files = fileInput.files;

files.forEach(file => {
  const reader = new FileReader();
  reader.onload = function(event) {
    const content = event.target.result;
    console.log(content);
  };
  reader.readAsText(file);
});
```

因为FileReader对象的readyState属性可以用来判断当前读取状态，它有以下值：

- EMPTY: 0，初始状态。
- LOADING: 1，正在读取。
- DONE: 2，读取完成。

所以，onprogress事件中可以使用readyState属性来判断当前读取状态。

另外，FileReader继承了[EventTarget](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget)接口，因此可以使用addEventListener方法来监听事件。
>  友情提示：Element 及其子项、document 和 window， XMLHttpRequest、AudioNode 和 AudioContext都继承了EventTarget，所以都允许使用addEventListener方法监听


```c++
[Exposed=(Window,Worker)]
interface FileReader: EventTarget {
  constructor();
  // async read methods
  undefined readAsArrayBuffer(Blob blob);
  undefined readAsBinaryString(Blob blob);
  undefined readAsText(Blob blob, optional DOMString encoding);
  undefined readAsDataURL(Blob blob);

  undefined abort();

  // states
  const unsigned short EMPTY = 0;
  const unsigned short LOADING = 1;
  const unsigned short DONE = 2;

  readonly attribute unsigned short readyState;

  // File or Blob data
  readonly attribute (DOMString or ArrayBuffer)? result;

  readonly attribute DOMException? error;

  // event handler content attributes
  attribute EventHandler onloadstart;
  attribute EventHandler onprogress;
  attribute EventHandler onload;
  attribute EventHandler onabort;
  attribute EventHandler onerror;
  attribute EventHandler onloadend;
};
```

注册事件监听实例
```javascript
const fileInput = document.querySelector('input[type="file"]');
const files = fileInput.files;

files.forEach(file => {
  const reader = new FileReader();
  reader.addEventListener('loadstart', () => {
    console.log('开始读取文件');
  });
  reader.addEventListener('progress', event => {
    console.log(`读取进度：${event.loaded}/${event.total}`);
  });
  reader.addEventListener('load', () => {
    console.log('文件读取完成');
  });
  reader.addEventListener('abort', () => {
    console.log('文件读取被取消');
  });
  reader.addEventListener('error', () => {
    console.log('文件读取出错');
  });
  reader.addEventListener('loadend', () => {
    console.log('文件读取结束');
  });
  reader.readAsText(file);
});
```

## 规范

[FileReader](https://w3c.github.io/FileAPI/#filereaderConstrctr)
