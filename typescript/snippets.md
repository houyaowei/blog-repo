# TypeScript片段

## 交叉类型（&）和联合类型（|）

交叉类型（&）和联合类型（|）是TypeScript中用于组合类型的基本工具。交叉类型（&）用于将多个类型合并为一个类型，而联合类型（|）用于将多个类型合并为一个类型，其中每个类型都可以是其中的任何一个。

```javascript
交叉类型：type Person = {name: string} & {age: number} → 变量必须同时有name和age。
联合类型：type Data = string | number → 变量要么是字符串，要么是数字。
```

## 泛型

泛型（Generics）是TypeScript中作用是创建可复用、类型安全的组件 / 函数。泛型允许在定义函数、接口和类时使用类型参数，以便在使用时指定具体的类型。

1、泛型函数

```typescript
// 不用泛型（用 any 丢失类型）
function returnAny(value: any): any {
  return value
}
const num = returnAny(123) // 类型是 any，失去TS优势

// 用泛型（T 是类型参数，约定用大写字母表示）
function returnGeneric<T>(value: T): T {
  // T 动态接收传入值的类型
  return value
}
// 调用时TS自动推断 T 类型，也可手动指定
const str = returnGeneric('hello') // T=string，返回类型 string
const bool = returnGeneric<boolean>(true) // 手动指定 T=boolean
```

2、泛型接口, 定义可接收 “类型参数” 的接口 / 类型，适配不同场景的类型结构

```typescript
// 泛型接口
interface Container<T> {
  data: T // data 的类型由 T 决定
  timestamp: number
}

// 复用接口，适配不同数据类型
const stringContainer: Container<string> = { data: 'test', timestamp: 123 }
const userContainer: Container<{ id: number; name: string }> = {
  data: { id: 1, name: '张三' },
  timestamp: 456,
}
```

3、泛型类，类也能接收类型参数，让类的属性 / 方法适配不同类型。

```typescript
class Stack<T> {
  private items: T[] = []

  push(item: T): void {
    this.items.push(item)
  }

  pop(): T | undefined {
    return this.items.pop()
  }
}

// 用栈存储数字
const numberStack = new Stack<number>()
numberStack.push(1)
numberStack.pop() // 返回 number | undefined

// 用栈存储字符串
const stringStack = new Stack<string>()
stringStack.push('a')
```

4、泛型约束，默认 T 可以是任意类型，用 extends 约束 T 必须满足某种条件，避免非法类型传入。
<b>这点非常重要</b>。

```typescript
// 约束 T 必须有 length 属性
function getLength<T extends { length: number }>(value: T): number {
  return value.length
}

getLength('abc') // 合法（string 有 length）
getLength([3, 5, 9]) // 合法（array 有 length）
getLength(333) // 报错！number 没有 length 属性
```

## Never

TypeScript 中 never 类型表示 永远不会发生的值的类型，核心特点是 “无返回、无终点”—— 要么函数永不返回（无限循环、直接抛错），要么变量永远不可能有值。

1、永不返回的函数（最常用）

```TypeScript
// 1. 抛出错误的函数（执行后直接终止，不返回）
function throwError(msg: string): never {
  throw new Error(msg); // 抛错后函数终止，无返回值
}

// 2. 无限循环的函数（永远在执行，不会结束）
function infiniteLoop(): never {
  while (true) {
    // 无限循环，永远不返回
  }
}
```

2、 不可能有值的变量
变量被类型收窄后，若没有任何可能的取值，类型会变为 never（常用来做 “穷尽性检查”，避免逻辑遗漏）：

```TypeScript
type Direction = "up" | "down" | "left" | "right";

function handleDirection(dir: Direction) {
  switch (dir) {
    case "up": /* 处理上 */ break;
    case "down": /* 处理下 */ break;
    case "left": /* 处理左 */ break;
    // 若漏写 "right"，TS 会报错：dir 类型为 "right"，不能赋值给 never
    default: const _exhaustiveCheck: never = dir;
  }
}
```

3、never-any-void

- never vs void：void 表示 “函数有返回，但返回值为空”（如 function fn(): void {}）；never 表示 “函数根本不返回”。
- never vs any：any 是 “任意类型”，never 是 “没有类型”，二者完全对立。

## keyof

keyof 是索引类型查询操作符，核心作用是：提取某个类型的所有公开属性名，返回一个由这些属性名组成的联合类型，实现 “属性名的类型安全复用”。

1、提取类型的属性名联合

```TypeScript
// 定义一个接口（对象类型也适用）
interface User {
  id: number;
  name: string;
  age: number;
}

// keyof User 提取 User 的所有属性名，得到联合类型 "id" | "name" | "age"
type UserKey = keyof User; // 等同于 type UserKey = "id" | "name" | "age"

// 合法：只能赋值联合类型中的值
const key1: UserKey = "id";
// 报错："gender" 不在 User 的属性名里
const key2: UserKey = "gender";

```

2、高频场景：结合泛型实现类型安全的 “属性访问”
解决 “通过属性名访问对象属性时，确保属性名合法” 的问题（替代不安全的字符串硬编码）：

```TypeScript
interface User {
  id: number;
  name: string;
  age: number;
}

// 泛型 T 接收对象类型，K 接收 T 的属性名（由 keyof T 约束）
function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]; // 安全访问：K 一定是 T 的合法属性名
}

const user: User = { id: 1, name: "张三", age: 20 };

// 合法：key 是 "id"（User 的属性），返回类型 number
const id = getProp(user, "id");
// 合法：key 是 "name"，返回类型 string
const name = getProp(user, "name");
// 报错："gender" 不是 User 的属性（K 被 keyof User 约束）
const gender = getProp(user, "gender");
```

3、特殊情况：处理索引签名类型
如果类型有 “索引签名”（比如 { [key: string]: any }），keyof 会返回对应的索引类型：

```TypeScript
// string索引签名：属性名可以是任意 string
type StringObj = { [key: string]: number };
type StringObjKey = keyof StringObj; // 结果：string | number（TS 兼容数字作为字符串属性名）

// number索引签名：属性名可以是任意 number
type NumberObj = { [key: number]: string };
type NumberObjKey = keyof NumberObj; // 结果：number
```

## 类型断言(as)

手动指定一个值的类型（告诉 TS 编译器 “我比你更了解这个值的类型”），仅在编译阶段生效，不影响运行时。
核心作用：

- 类型转换：将一个宽泛类型（如 any、unknown）转为更具体的类型
- 修正类型：解决 TS 类型推断不准确的问题（比如 DOM 元素获取）

1、类型断言

```TypeScript
// 错误：HTMLElement 没有 value 属性
const input = document.getElementById('username');
input.value = 'test'; // 报错

// 正确：用 as 断言为 HTMLInputElement
const input = document.getElementById('username') as HTMLInputElement;
input.value = 'test'; // 正常
```

2、缩小 unknown 类型范围

```typescript
let data: unknown = 'hello world'
// 错误：unknown 类型不能调用 split
data.split(' ') // 报错

// 正确：断言为 string 类型
;(data as string).split(' ') // 正常
```

3、覆盖 TS 错误的类型推断

```typescript
interface User {
  name: string
  age: number
}
// TS 推断 res 为 object 类型
const res = { name: '张三', age: 20, gender: '男' }
// 正确：断言为 User 类型（忽略多余属性，仅保证核心结构匹配）
const user = res as User
```

4、避坑指南

- 不要断言 “不可能的类型”（编译不报错，运行必崩），参考实例1
- DOM 元素断言前，先判断是否存在（避免 null 报错），参考实例2
- 不依赖as忽略接口多余属性，参考实例3

实例1：

```typescript
// 错误示例：把 number 断言为 string，运行时调用 split 直接报错
const num: number = 123
const str = num as string
str.split('') // 运行时错误：num is not a function

应该先判断类型再断言
if (typeof num === 'string') {
  num.split('') // 无需断言，TS自动缩小类型
}
```

实例2

```typescript
// 错误示例：若#username元素不存在，input为null，断言后仍会报错
const input = document.getElementById('username') as HTMLInputElement
input.value = 'test' // 可能触发：Cannot set property 'value' of null

// 正确示例：先判断是否存在，再断言为 HTMLInputElement
const input = document.getElementById('username')
if (input) {
  const inputElement = input as HTMLInputElement
  inputElement.value = 'test'

  第二种写法(input as HTMLInputElement).value = 'test'
}
```

实例3

```typescript
interface User {
  name: string
  age: number
}
// 错误示例：res多了gender属性，用as忽略后，若后续依赖User无gender，易出问题
const res = { name: '张三', gender: '男' } // 缺少age属性！
const user = res as User // TS不报错，但user.age实际为undefined


正确做法：要么严格匹配接口，要么用类型守卫验证核心属性：
// 方式1：补全接口属性
const res = { name: '张三', age: 20, gender: '男' };
const user = res as User; // 可接受（多余属性不影响核心结构）

// 方式2：类型守卫验证
function isUser(data: unknown): data is User {
  return typeof data === 'object' && data !== null && 'name' in data && 'age' in data;
}
if (isUser(res)) {
  const user = res; // 自动推断为User
}
```

核心原则：as 是 “辅助 TS 识别类型”，不是 “掩盖类型错误”，优先用类型守卫、类型推断解决问题，而非依赖断言。
