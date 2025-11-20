# 函数柯里化和偏函数

这两个都是高阶函数，在JavaScript中，高阶函数是指接受函数作为参数或返回函数作为结果的函数。高阶函数可以用于实现函数柯里化和偏函数。

## 函数柯里化
柯里化是一种函数的转换，它是指将一个函数从可调用的 f(a, b, c) 转换为可调用的 f(a)(b)(c)。
柯里化不会调用函数。它只是对函数进行转换。

一个简单的柯里化实例：
```javascript
function curry(f) { //辅助函数，执行柯里化转换
  return function(a) {
    return function(b) {
      return f(a, b);
    };
  };
}
//目标函数
function sum(a, b) {
  return a + b;
}

let curriedSum = curry(sum); //执行柯里化
curriedSum(1)(2)  // 结果为3
```

代码如上，实现非常简单：只有两个包装器（wrapper）。

- 执行curry(func) 的结果时，返回一个包装器 function(a)。
- 当 curriedSum(1) 这样调用时，它的参数会被保存在词法环境中，然后返回一个新的包装器 function(b)。
然后这个包装器被以 2 为参数调用，并将该参数传递给原始的 sum 函数。


一个稍微高级的柯里化实例：
```javascript
function add(a, b) {
  return a + b;
}

function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn(...args);
    } else {
      return function(...moreArgs) {
        return curried(...args, ...moreArgs);
      };
    }
  };
}

const curriedAdd = curry(add);
console.log(curriedAdd(2,3)) //正常掉用
console.log(curriedAdd(2)(3)); // 对第一个参数的柯里化
```


## 偏函数
一个简单的偏函数实例：

```javascript
function multiply(a, b, c) {
  return a * b * c;
}

function partial(fn, ...args) {
  return function(...moreArgs) {
    return fn(...args, ...moreArgs);
  };
}

const double = partial(multiply, 2);
console.log(double(3, 4)); // 输出 24
```



## 总结

函数柯里化和偏函数是函数式编程中的两个重要概念。函数柯里化是一种将多参数函数转换为单参数函数的技术。通过柯里化，我们可以将一个函数拆分为多个函数，每个函数只接受一个参数。这样可以提高代码的可读性和可维护性。

- 它们都是高阶函数
- 它们都是把多元函数转换成更低元的函数
- 偏函数只返回一次接受剩余参数的函数，柯理化会追述到所有参数补齐才会真正执行
- 柯理化就是自动化的偏函数应用
