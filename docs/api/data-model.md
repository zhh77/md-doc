# 数据对象模型

DataModel，管理单模型数据(object)

## 创建代码

```javascript
// 通过MD.create创建模型后会得到元模型
const baseModel = MD.create({
  ...，
});

// 通过元模型进行create会默认创建数据模型实例
const dataModel = baseModel.create({
  ....
});

// 或者通过MD对象直接创建
const dataModel = baseModel.createDatModel({
  ....
});
```

## 数据获取

| 方法名                               | 返回类型 | 说明                                                                                                                                                                 |
| :----------------------------------- | :------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| getStore (fields)                    |  object  | 获取模型存储的数据, fields 是否根据字段获取，true为根据模型字段获取，[]为指定的字段                                                                                  |
| setStore (data)                      |  object  | 设置模型存储的数据， 会触发onChange事件                                                                                                                              |
| `async` getData (options)            |  object  | 获取模型数据，如果有初始获取，则会query行为配置，会自动执行，会等待联动计算和监听事件处理完, 会执行setData，options={fields：指定字段，reload：是否强制重新加载数据} |
| `async` setData (data)               |  object  | 设置模型数据, 会触发模型的onRefresh事件，并调用setStore；                                                                                                            |
| getDefaultData (options)             |  object  | 获取默认的数据，在reset和list insert时会生效，options:{params,initData}, params构建参数，会传递到每个field的getDefaultValue中；                                      |
| getKeyValue (data)                   |   any    | 获取key值，data为空时，则使用内部数据                                                                                                                                |
| reset ()                             |   any    | 重置数据为默认数据                                                                                                                                                   |
| setOriginData (data)                 |          | 设置原始数据，原始数据会在reset中使用                                                                                                                                |
| valueApply (fields, callback, data)  |   any    | 值应用，会取到传入的字段数据，执行callback方法，返回callback的值                                                                                                     |
| formatApply (fields, callback, data) |   any    | 值格式化，会取到传入的字段格式化的数据，执行callback方法，返回callback的值                                                                                           |
| useValues (fields, data)             |   any    | 使用值，根据fields参数，返回值数组                                                                                                                                   |
| setFieldsValue (values, data)        |          | 根据values设置对应字段的值                                                                                                                                           |
| getFieldsValue (fields, data)        |          | 获取fields对应的值对象                                                                                                                                               |

## 数据行为

所有的data参数为空的情况下，都为操作本身模型内数据；数据行为必须要设置模型的action才生效；

| 方法名                                   | 返回类型 | 说明                                                           |
| :--------------------------------------- | :------: | :------------------------------------------------------------- |
| `async` save (data)                      |   any    | 快捷保存操作，识别新增和更新，进行执行对应行为，需设置keyField |
| `async` insert (params, options, config) |   any    | 新增操作                                                       |
| `async` update (params, options, config) |   any    | 更新                                                           |
| `async` query (params, options, config)  |   any    | 查询                                                           |
| `async` load (params)                    |   any    | 执行query方法，填充模型                                        |
| `async` delete (params, options, config) |   any    | 删除                                                           |
| isNew (data)                             | boolean  | 判断是否新增数据，需设置keyField                               |
| hasAction (actionName)                   | boolean  | 判断是否存在action                                             |

runAction (actionName, )

## 数据处理

| 方法名                     | 返回类型 | 说明                                                                                                                                              |
| :------------------------- | :------: | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| `async` validate (options) | boolean  | 数据验证, options:{ data: 验证的数据，为空时则会验证模型自身数据, fields: '指定验证的字段', checkAll:'是否全部检测，否则只返回第一个错误的信息' } |
| convert (data, force)      |  object  | 数据转换，会将data或者模型内数据进行转换，force为true或者开启了严格模式，则会保证数据字段为模型定义字段；                                         |
| trim (data)                |  object  | 清除内部标识数据                                                                                                                                  |
| isEmpty ()                 | boolean  | 判断数据是否为空                                                                                                                                  |

## 模型事件

模型的事件除了watch(字段值变化)外，都是基于AOP来实现的
方法名 | 返回类型 | 说明
:--------------- | :-: | :-
onBefore(methodName, name, callback, mode) | | 基础的aop-before方法，methodName模型的方法名;name: 事件名(自主定义)，callback:事件回调，isBefore:是否在刷新前置执行，mode=’once'仅执行后边销毁
on(methodName, name, callback, mode) | | 注册aop-after方法， 其他参数同上
off(type, methodName) | | 注销aop方法，type：before/after;
fireOrigin(methodName, ...args) | | 执行原始的方法，在aop之后，可以通过此方法调用之前的方法
onRefresh (name, callback, isBefore, mode) | | 注册监听模型内容刷新的方法，onRefresh必定会触发onChange,
offRefresh (name) | | 销毁注册的内容刷新的事件
onChange (name, callback, isBefore, mode) | | 注册监听模型存储变更的方法，isBefore:是否前置执行
offChange (name) | | 销毁监听模型存储变更的方法
watch (name, fields, callback, mode) | | 注册fields值变化监听，同field的links，异步方法，会延迟执行会有节流控制
syncWatch(name, fields, callback, mode) | | 注册fields值变化监听，同步方法，在某些场景需要直接拿到变化相应，可以用此方法
offWatch(name, isSync) | | 注销值变化监听事件

## 数据状态控制

在模型中，可以针对数据设置一些状态，比如：显示/隐藏，错误等等
方法名 | 返回类型 | 说明
:--------------- | :-: | :-
setDataState(stateName, state, data, options) | | 设置单个数据状态，options = { apply: false, merge: true}; apply 是否应用处理器变化；merge：更新模式默认我merge合并，false则为替换
setDataStates(states, data, options) | | 设置多个状态，会合并， 参数同上，states=null时，则会清空所有状态
getDataState(stateName, data) || 获取单个状态
getDataStates(data) | | 获取所有状态
applyDataState(states, data) | | 应用数据状态变化，会调用状态处理器进行响应处理，setDataState会默认自动调用。也直接调用，这样states是不存储的，但同样可以触发变化响应

## 基础方法说明

| 方法名                                   |   返回类型   | 说明                                                                                                                                                                                                              |
| :--------------------------------------- | :----------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| getModelType ()                          |    String    | 获取模型类型，返回'Data'；                                                                                                                                                                                        |
| getOptions                               | modelOptions | 获取modelOptions；                                                                                                                                                                                                |
| getField (field, options)                |   MDField    | 根据路径获取模型内联字段，包括模型字段或者子模型字段,field 字段名或者路径,options:{item, chain} item:列表项数据，列表传入时，可以获取动态渲染字段, chain:链模式，如果路径模式会返回创建一个新的带chain模式的field |
| getFields (field, options)               |   MDField    | 根据路径获取模型内联字段数组，详细同上                                                                                                                                                                            |
| cloneFields (fields)                     |  [MDField]   | 克隆字段，可扩展字段，fields ： [字段名/FieldOptions]                                                                                                                                                             |
| getModelName ()                          |    String    | 获取模型名称                                                                                                                                                                                                      |
| getModel (path)                          |   MDModel    | 根据路径获取当前模型下的子模型                                                                                                                                                                                    |
| getKeyField ()                           |    String    | 获取key字段                                                                                                                                                                                                       |
| createField (name, field, isModelCreate) |    String    | 创建字段方法，根据不同类型的模型，重载创建不同类型的字段; isModelCreate:是否由当前模型创建，即字段关联模型为当前模型                                                                                              |
| addProps ()                              |    String    | 模型添加属性                                                                                                                                                                                                      |
| callBase (name, ...args)                 |     Any      | 运行模型的原型链方法，在扩展了模型props后可以通过此方法调用原方法; 重载方法想调用原方法时使用                                                                                                                     |
