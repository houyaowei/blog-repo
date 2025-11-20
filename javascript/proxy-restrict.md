# Proxy的局限性

## 内置对象

代理提供了一种特殊的方法，可以在最底层更改或调整现有对象的行为。但是，它并不完美也有局限性。
局限性在于对内置对象的处理，如Map，Set，Date，Promise，Class的私有属性，这些都使用了所谓的“内部插槽”。

它们类似于属性，但仅限于内部使用，仅用于规范目的。例如，Map 将项目（item）存储在 [[MapData]] 中。内建方法可以直接访问它们，而不通过 [[Get]]/[[Set]] 内部方法。所以 Proxy 无法拦截它们。

在类似这样的内建对象被代理后，代理对象没有这些内部插槽，因此内建方法将会失败。

报错的实例：

```javascript
const map = new Map();
const proxy = new Proxy(map, {
  get: (target, prop) => {
    console.log(`Getting ${prop}`);
    return target[prop];
  }
});

proxy.set('name', 'hyw');
```
报错：
```shell
TypeError: Method Map.prototype.set called on incompatible receiver #<Map>
```
在内部，一个 Map 将所有数据存储在其 [[MapData]] 内部插槽中。代理对象没有这样的插槽。内建方法 Map.prototype.set 方法试图访问内部属性 this.[[MapData]]，但由于 this=proxy，在 proxy 中无法找到，所以失败了。

一种解决方法：
```javascript
let proxy = new Proxy(map, {
  get(target, prop, receiver) {
    let value = Reflect.get(...arguments);
    return typeof value == "function" ? value.bind(target) : value;
  },
});

proxy.set("name", "hyw");
console.log(proxy.get("name"));//输出hyw
```
arguments为"get"/"set"(注意，这里只是捕捉器名称)，Reflect获得语言内部的方法，value即为get/set方法，并绑定到了目标对象（map）本身。所以proxy.set方法操作的不是代理对象。当set 捕捉器的内部实现尝试访问 this.[[MapData]] 内部插槽时，所以会成功。

## 对象的私有属性

```javascript
class User {
  #name = "hyw";
  getName() {
    return this.#name;
  }
}
let user = new User();
user = new Proxy(user, {});
console.log(user.getName());
```
会有如下报错
```shell
Cannot read private member #name from an object whose class did not declare it
```
修复的办法和内置对象保持一致。

## 可以撤销的proxy
一个代理对象，如果在特定情况下不再允许被代理，在声明时需要声明为Proxy.revocable。

```javascript
let object = {
  data: "Valuable data",
};

let { proxy, revoke } = Proxy.revocable(object, {});
console.log(proxy.data); // Valuable data

//撤销
revoke();
console.log(proxy.data); // Error

```
