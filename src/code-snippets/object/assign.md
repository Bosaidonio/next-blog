```js
/**
 * Object.assign 的实现，基于 ECMAScript 规范
 *
 * 规范参考：
 * ECMAScript (ECMA-262) 规范：https://tc39.es/ecma262/
 * Object.assign 具体定义：https://tc39.es/ecma262/#sec-object.assign
 *
 */
function objectAssign(target) {
  // 1. 如果目标为 null 或 undefined，抛出错误
  if (target == null) {
    throw new TypeError('Cannot convert undefined or null to object');
  }

  // 2. 将目标转换为对象
  var to = Object(target);

  // 3. 如果没有源对象，直接返回目标
  if (arguments.length === 1) return to;

  // 4. 依次处理每个源对象
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    // 如果源为 undefined 或 null，继续下一个源
    if (source == null) continue;

    // 将源转换为对象
    var from = Object(source);

    // 获取源对象的自身属性键
    var ownKeys = [].concat(
      Object.getOwnPropertyNames(from),
      Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(from) : []
    );

    // 复制所有可枚举属性
    for (var j = 0; j < ownKeys.length; j++) {
      var key = ownKeys[j];

      // 获取属性描述符
      var desc = Object.getOwnPropertyDescriptor(from, key);

      // 如果属性是可枚举的，复制它
      if (desc && desc.enumerable) {
        to[key] = from[key];
      }
    }
  }

  // 5. 返回修改后的目标对象
  return to;
}
```


```js
// 测试示例
const target = { a: 1 };
const source1 = { b: 2 };
const source2 = { c: 3, [Symbol('d')]: 4 };

const result = objectAssign(target, source1, source2);
console.log(result); // { a: 1, b: 2, c: 3, Symbol(d): 4 }

```
