butterfly
====

一个精致实用的"类AMD"javascript模块加载器，可用于node端和浏览器环境


## Useage

1. 在HTML中引入加载器


```html
<script src="path-to-butterfly-root/dist/butterfly.js"></script>
```


## API

```js
define(id, depends, factory)
define(id, depends)
define(id, factory)
define(depends, factory)
define(factory)

butterfly.new(namespace, [options]) -> Loader
butterfly.noConflict(deep)

loader.config(name)
loader.config(name, value)

loader.define(id, depends, factory)
loader.require(depends, callback)
loader.hasDefine(id)
loader.undefine(id)
loader.getModules()
loader.resolve(id)
```
