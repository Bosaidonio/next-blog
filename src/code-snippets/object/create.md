```js
/**
 * Object.create 的实现，基于 ECMAScript 规范
 *
 * 规范参考：
 * ECMAScript (ECMA-262) 规范：https://tc39.es/ecma262/
 * Object.create 具体定义：https://tc39.es/ecma262/#sec-object.create
 *
 */
function objectCreate(proto, propertiesObject) {
  // 1. 如果 proto 不是对象且不是 null，抛出 TypeError
  if (typeof proto !== 'object' && proto !== null) {
    throw new TypeError('Object prototype may only be an Object or null: ' + proto)
  }

  // 2. 创建一个新的对象，并将该对象的[[Prototype]]设置为 proto
  const obj = {}
  Object.setPrototypeOf(obj, proto)

  // 3. 如果 propertiesObject 不是 undefined
  if (propertiesObject !== undefined) {
    // 使用 Object.defineProperties 来处理属性描述符
    Object.defineProperties(obj, propertiesObject)
  }
  // 4. 返回对象
  return obj
}
```

```js
// 测试示例
// 1、创建以 null 为原型的对象
const nullObj = objectCreate(null)
console.log(Object.getPrototypeOf(nullObj)) // null
console.log('toString' in nullObj) // false

// 2、创建有指定原型的对象
const protoObj = { inherited: true }
const obj = objectCreate(protoObj)
console.log(Object.getPrototypeOf(obj) === protoObj) // true
console.log(obj.inherited) // true

// 3、创建属性描述的对象
const objWithProps = objectCreate(Object.prototype, {
  x: {
    value: 42,
    writable: true,
    enumerable: true,
    configurable: true
  },
  y: {
    value: 'hello',
    enumerable: false
  }
})

console.log(objWithProps.x) // 42
console.log(objWithProps.y) // hello
console.log(Object.keys(objWithProps)) // ['x'] (y不可被枚举)
```

```js
function consectetur(ipsum) {
  const { a, b } = ipsum
  return a + b
}
```
