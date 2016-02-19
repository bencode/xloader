xloader
====

[![Build Status](https://travis-ci.org/bencode/xloader.svg?branch=master)](https://travis-ci.org/bencode/xloader)
[![Coverage Status](https://coveralls.io/repos/bencode/xloader/badge.svg?branch=master&service=github)](https://coveralls.io/github/bencode/xloader?branch=master)


一个精致实用的Javascript AMD模块加载器，可用于NodeJs环境和浏览器环境。


## Useage


在HTML中引入加载器


```html
<script src="${path-to-xloader}/dist/xloader.min.js"></script>
```

## API


### define(id, depends, factory) - 定义模块


```js
/**
 * 定义模块
 * @param {String}  id      - 模块id
 * @param {Array}   depends - 依赖模块
 * @param {Any}     factory - 模块构造器
 */
define(id, depends, factory)
define(id, depends)
define(id, factory)
define(depends, factory)
define(factory)
```


### require(ids, callback) - 加载模块



### xloader.config(name, value) - 配置加载器

用于设置和获取config

```js
loader.config(name)
loader.config(name, value)
```

一般用于配置`alias`和`resolve`规则


### 配置resolve

```js
xloader.config('alias', {
  'util-request', 'util/request'
});
```

alias也可以是一个function

```js
xloader.config('alias', function(id) {
  if (id.startsWith('ui-')) {
    return 'ui/' + id;
  }
});
```

### 配置resolve规则


```js
xloader.config('resolve', function(id) {
  return '/assets/' + id + '.js';
});
```

### xloader.new(namespace, [options]) -> Loader

定义一个新的loader

```js
window.x = xloader.new('x', { autoloadAnonymous: true });
```

然后就可以使用x加载器了

```js
x.define('util', ['exports'], function(exports) {
  exports.sum = function(a, b) {
    return a + b;
  };
});


x.require(['util'], function(util) {
  util.sum(1, 2).should.be.equal(3);
});
```


### loader.define(id, depends, factory)

定义模块

### loader.require(depends, callback)

加载模块

### loader.hasDefine(id)

判断模块是否已加载

### loader.undefine(id)

取消定义一个模块

### loader.getModules()

取得加载器中所有的模块

### loader.resolve(id)

解析模块远程地址


### xloader.noConflict(deep)

默认情况下，加载器会占有`xloader`, `define`, `require`三个全局变量，如果有冲突时可以使用这个方法解决

```js
window.x = xloader.noConflict();
define(...)     // 这个就是原来的define
x.define(...)   // 现在就可以使用x来定义和加载模块了
```
