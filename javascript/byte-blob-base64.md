# ArrayBuffer，Base64 和 Blob
把这几个放到一起，是因为这些概念都与二进制数据的处理（虽然Base64为文本数据）有关。如用base64显示image，如用Blob对象下载文件，如果涉及到二级制数据传输，可能需要TypedArray。

## ArrayBuffer
ArrayBuffer对象用来表示通用的原始二进制数据缓冲区。这个虽然也叫『Array』, 但是它不是数组，而是一个二进制数据的容器，不能直接访问其中的元素。另外，它的大小是固定的，也不支持动态扩展。ArrayBuffer只是一片内存区域，里面存的什么元素无法判断。

```javascript
let buffer = new ArrayBuffer(16); // 创建长度为16字节的buffer
alert(buffer.byteLength); // 16
```
如果要操作其中的数据，需要借助另一套工具，例如 TypedArray 或 DataView。DataView被叫做『数据视图』，是一种未类型化数据的视图。需要注意的是，这两种『工具』本身并不存储数据，而是对数据的访问方式进行了封装。

TypedArray顾名思义是一种类型化数组，它是一种特殊的数组，所有的元素都是同一种类型，例如 Uint8Array 表示一个无符号8位整数数组，Int16Array 表示一个有符号16位整数数组，Float32Array 表示一个32位浮点数数组。

部分TypedArray:
- Uint8Array —— 将 ArrayBuffer 中的每个字节视为 0 到 255 之间的单个数字（每个字节是 8 位，因此只能容纳那么多）
- Uint16Array —— 将每 2 个字节视为一个 0 到 65535 之间的整数。
- Uint32Array —— 将每 4 个字节视为一个 0 到 4294967295 之间的整数。
- Float64Array —— 将每 8 个字节视为一个 5.0x10-324 到 1.8x10308 之间的浮点数

<img src=./imgs/binary.webp>

```javascript
const b = new ArrayBuffer(8);
const v1 = new Int32Array(b);

//操作数据
const f64a = new Float64Array(8);
f64a[0] = 10;
f64a[1] = 20;
f64a[2] = f64a[0] + f64a[1];

//操作底层数据
fetch('image.jpg')
  .then(res => res.arrayBuffer())
  .then(buffer => {
    // 可以转为 blob 或 base64 再显示
  })
```
普通数组的操作方法和属性，对 TypedArray 数组也同样适用：copyWithin,entries,every,find,findIndex,forEach,includes,keys,map,reduce,reverse,sort,slice,splice,toString,values,filter等。



 DataView 对象操作二进制：

```javascript
const buffer = new ArrayBuffer(4);
const view = new DataView(buffer);
view.setUint8(0, 1); //设置第1个字节为1
console.log(view.getUint8(0)); // 输出 1
```


## Blob
Blob是二进制数据的容器，可以用来存储二进制数据，例如图片、音频、视频等。Blob对象可以用来创建URL，也可以用来处理File相关对象。

Blob 由一个可选的字符串 type（通常是 MIME 类型，如image/png，text/plain，text/html，application/json）和 blobParts 组成（Blob 对象，字符串和 [BufferSource](https://webidl.spec.whatwg.org/#BufferSource)）。
```javascript
new Blob(blobParts, options);
```
blobParts为数组类型。

Blob实例：
```javascript

//字符串
const obj = { hello: "world" };
const blob = new Blob([JSON.stringify(obj, null, 2)], {
  type: "application/json",
});

//二进制构建blob
let hello = new Uint8Array([72, 101, 108, 108, 111]); // 二进制格式的 "hello"
let blob = new Blob([hello, ' ', 'world'], {type: 'text/plain'});
```

Blob也经常用做下载文件：
```javascript
//下载文件
<a download="hello.txt" href='#' id="link">Download</a>

let blob = new Blob(["Hello, world!"], {type: 'text/plain'});
a.href = URL.createObjectURL(blob);
a.download = 'hello.txt';
a.click();

//显示图片
const blob = new Blob([arrayBuffer], { type: 'image/png' });
const url = URL.createObjectURL(blob);
img.src = url;

//blob转ArrayBuffer
const bufferPromise = await blob.arrayBuffer();
或者
blob.arrayBuffer().then(buffer => /* 处理 ArrayBuffer */);

```
浏览器内部为每个通过 URL.createObjectURL 生成的 URL 存储了一个 URL → Blob 映射。不过它有个副作用。虽然这里有 Blob 的映射，但 Blob 本身只保存在内存中的。浏览器无法释放，需要手动释放，可以通过调用 URL.revokeObjectURL(url) 来释放。

对于比较大的blob对象，转化为ArrayBuffer比较耗内存。将 blob 转换为 stream 进行处理更加合理。
```javascript
const readableStream = blob.stream();
const stream = readableStream.getReader();

while (true) {
  // 对于每次迭代：value 是下一个 blob 数据片段
  let { done, value } = await stream.read();
  if (done) {
    // 读取完毕，stream 里已经没有数据了
    console.log('all blob processed.');
    break;
  }
  // 对刚从 blob 中读取的数据片段做一些处理
  console.log(value);
}
```


## Base64
Base64 是一种将二进制数据编码成 ASCII 字符串的方式。通常用做图片显示。
```javascript
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA..." />
```
Blob转base64：
```javascript
const blob = new Blob(['Hello, world!'], { type: 'text/plain' });
const reader = new FileReader();
reader.readAsDataURL(blob); //返回 base64
//reader.readAsArrayBuffer(blob) 返回Arraybuffer
reader.onload = function() {
  console.log(reader.result);
};
```
