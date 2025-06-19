# JSON.stringify的其他用法

## 跳过的的属性
- 函数
- Symbol 类型的键和值
- 值为 undefined 的属性

## 注意，规避循环引用
```md
let room = {
  number: 23
};

let meetup = {
  title: "Conference",
  participants: ["Tom", "Jerry"]
};

meetup.place = room;       // meetup 引用了 room
room.occupiedBy = meetup; // room 引用了 meetup

JSON.stringify(meetup); //会报错Uncaught TypeError: Converting circular structure to JSON
```

## 使用 replacer
JSON.stringify 的完整语法是：
```md
JSON.stringify(value[, replacer, space])
```
replacer为要编码性数组或函数，space为缩进空格数。
- 如果是函数，则在序列化过程中，被序列化的值的每个属性都会经过该函数的转换、处理；
- 如果是数组，则只有包含在这个数组中的属性名才会被序列化到最终的 JSON 字符串中

```md
let room = {
  number: 23
};

let meetup = {
  title: "Conference",
  participants: [{name: "John"}, {name: "Alice"}],
  place: room // meetup 引用了 room
};

room.occupiedBy = meetup; // room 引用了 meetup

JSON.stringify(meetup, ['title', 'participants'])
//输出 -> {"title":"Conference","participants":[{},{}]}

JSON.stringify(meetup, ['title', 'participants', 'place', 'name', 'number'])
//输出 -> {"title":"Conference","participants":[{"name":"John"},{"name":"Alice"}],"place":{"number":23}}

```

replacer为函数的情况，接受两个参数 key、value，分别对应每个对象的键值。
```md
function replacer(key, value) {
  if (typeof value === "string") {
    return undefined;
  }
  return value;
}
function replacerFunc(key, value) {
  if (typeof value === "string") {
    return () => {};
  }
  return value;
}
const foo = {foundation: "Mozilla", model: "box", week: 45, transport: "car", month: 7};
JSON.stringify(foo, replacer);
// 输出-> {"week":45,"month":7}
```

请注意 replacer 函数会获取每个键/值对，包括嵌套对象和数组项。它被递归调用。replacer 中的 this 的值是包含当前属性的对象。

## 非预期效果
如果对象中包含非静态数据，如 new Date，会被内置的 toJSON 方法处理，返回这种类型的字符串。那如果对象中添加一个自定义的 toJSON，看会发生什么？

```md
let room = {
  number: 23,
  position: {
    x: 10,
    y: 20
  },
  toJSON() {
    return this.number;
  }
};
JSON.stringify(room)

//输出 -> 23
```
也就是如果有 toJSON() 方法，toJSON() 方法返回什么值，序列化结果就返回什么值，其余的会被忽略。

## 特殊属性
stringify的过程对类型的处理不太一样，布尔值、数字、字符串的包装对象会被转换为原始值。 NaN、Infinity、null都会被转换为 null。
