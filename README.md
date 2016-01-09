butterfly-loader
====

[![Build Status](https://travis-ci.org/bencode/butterfly-loader.svg?branch=master)](https://travis-ci.org/bencode/butterfly-loader)
[![Coverage Status](https://coveralls.io/repos/bencode/butterfly-loader/badge.svg?branch=master&service=github)](https://coveralls.io/github/bencode/butterfly-loader?branch=master)


一个精致实用的"类AMD"javascript模块加载器，可用于node端和浏览器环境


## Useage


1. 在HTML中引入加载器


```html
<script src="path-to-butterfly-root/dist/butterfly.min.js"></script>
```

2. API


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


## butterfly.config(name, value) - 配置加载器

用于设置和获取config

### API

```js
loader.config(name)
loader.config(name, value)
```

一般用于配置`alias`和`resolve`规则


### 配置resolve

```js
butterfly.config('alias', {
  'util-request', 'util/request'
});
```

alias也可以是一个function

```js
butterfly.config('alias', function(id) {
  if (id.startsWith('ui-')) {
    return 'ui/' + id;
  }
});
```

### 配置resolve规则


```js
butterfly.config('resolve', function(id) {
  return '/assets/' + id + '.js';
});
```

### butterfly.new(namespace, [options]) -> Loader

定义一个新的loader

```js
window.x = butterfly.new('x', { autoloadAnonymous: true });
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


### butterfly.noConflict(deep)

默认情况下，加载器会占有`butterfly`和`define`两个全局变量，如果有冲突时可以使用这个方法解决

```js
window.x = butterfly.noConflict();
define(...)     // 这个就是原来的define
x.define(...)   // 现在就可以使用x来定义和加载模块了
```
