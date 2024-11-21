# DataListModel
数据列表模型，管理模型的数据集合，和数据对象模型相比，除了存储的对象是array外，还有很多对于集合和列表项的方法；

```javascript
// 通过MD.create创建模型后会得到元模型
const baseModel = MD.create({
  ...，
});

// 通过元模型进行create指定modelType会默认创建列表模型实例
const dataModel = baseModel.create({
  modelType: 'List',
  ....
});

// 或者通过MD对象直接创建
const dataModel = MD.createDataListModel({
  ....,
  // 设置filter的配置，开启filterModel
  filter: {
    ...ModelOptions,
    // 开启查询绑定，filterModel有变更则会触发模型的load重新执行；
    bindSearch: true,
  },
  // 开启itemModel，使用默认的设置
  itemModel: true,
  // 开启itemModel,可以设置库宗属性
  itemModel: ModelOptions,
  // 是否需要分页
  needPager: true,
  // 分页设置
  pager: {
    pageIndex: 1,
    total: 0,
    pageSite: 1
  },
  // 子项字段，树形子节点字段,可以实现树形数据结构的操作
  childrenField: ''
  // 虚拟key，列表模型很多操作都局域虚拟key，非必要不用关闭；
  virtualKey: true，
  // 基础数据状态，详细待补充
  defaultItemState: {}
});
```
## 子模型
ListModel包含两个子模型，filterModel和itemModel，都为数据对象模型，可以直接通过`model.xxx`来访问；
### filterModel
filterModel会关联query Action，只会作为查询使用

### itemModel
主要用于操作行数据，除了继承列表模型的Action外，还有特有的一些方法方便操作
方法名 | 返回类型 | 说明
:--------------- | :-: | :-
equalItem (item) | boolean | 判断当前模型数据是否和item是同一个，基于vk比较
updateItem (options) | object | 更新item，同列表模型
getItemIndex () | number | 获取当前模型数据，在列表模型中的序号
deleteItem (options) | | 在列表模型中，删除当前数据；

## 专属方法-行操作
item为行数据；所有的行数据都生产一个虚拟key(VK)作为区分；如果消费数据中没用到这个数据可以通过model.trim(item)去除；

方法名 | 返回类型 | 说明
:--------------- | :-: | :-
getItemVK (item) | String/number | 获取行虚拟key
findItem (key, options) | object | 根据key获取行数据，key可以为具体的key，也可以是item行数据；options:{ needIndex:是否需要返回index，如果为true，返回的是{item,index}，否则返回item; data:查询的data，如果有设置则会在data中查询,未设置则使用模型数据; parentMode:为true时，data则是被认定为父数据，只会在data中查找，提升检索效率，tree模式下有效 }
getItemIndex (item, data) | number | 获取行序号，item可以为key或者具体的行数据
`async` validateItem (item, options) | boolean | 验证行数据；options同validate设置；
`async` updateItem (item, options) | object | 更新行数据,  , 由action更新和内部更新两种。action更新，会调用update或者insert action; 内部更新，会先检索行，如果找不到则不会操作，对应options:{ replace: 是否替换内部数据,默认替换, watch: 是否开启变更的监控，默认开启； refresh：是否刷新模型，默认刷新； action：false时不开启action模式, data：指定的父数据 }；
async insertItem (item, index, data, isRefresh) | object | 插入行数据，不会调用action；
`async` deleteItem (item, data, isRefresh) | object | 删除行数据，如果配置了delete的action，会自动调用，否则只删除模型内部数据；
watchItem (item, name, fields, callback, mode) |  | 注册指定行的变化的事件
offWatchItem (item, name) | | 注销指定行的变化的事件
`async` updateItemField (field, value, item) | | 更新制定行字段的的数据, 不会执行action；
`async` deleteItems (items, data, key) | | 在模型或者data中。删除包含的items集合；根据key数组删除数据，key为默认为模型的key字段，也可以自行设置其他的字段
`async` deleteItemsByKeys (keys, data, key) | | 在模型或者data中，根据key数组删除数据，key为默认为模型的key字段，也可以自行设置其他的字段
selectItems(items) | | 选择行
getSelectedItems() | | 获取选择行
getSelectedKeys(key) | | 获取选择行的key，key默认为主键

## 专属方法-tree模式
当模型设置childrenField后会开启tree模式
方法名 | 返回类型 | 说明
:--------------- | :-: | :-
`async` insertChild (parent, item, index, isRefresh) | | 在parent下插入单个子项,会执行insertItem方法，并返回结果
`async` insertChildren (item, children, index, isRefresh) | | 在parent下插入子项数组,不会调用insertItem；

## 专属方法-列表内部数据操作
操作模型的store的快捷方法；

方法名 | 返回类型 | 说明
:--------------- | :-: | :-
storeEach (handlerFn, data) | | 循环列表store或者data的数据 
storeMap (handlerFn, data) | array | 循环列表store或者data的数据，返回新的数组
storeFilter (filterFn, data) | | 过滤列表store或者data的数据
storeFind (filterFn, data) | | 查找单个列表store或者data的数据

## 数据获取&存储
方法名 | 返回类型 | 说明
:--------------- | :-: | :-
getStore (fields) | array | 获取模型存储的数据, fields 是否根据字段获取，true为根据模型字段获取，[]为指定的字段
setStore (data)  | array | 设置模型存储的数据， 会触发onChange事件
`async` getData (options) | array | 获取模型数据，如果有初始获取，则会query行为配置，会自动执行，会等待联动计算和监听事件处理完, 会执行setData，options={fields：指定字段，reload：是否强制重新加载数据}
`async` setData (data) | array | 设置模型数据, 会触发模型的onRefresh事件，并调用setStore；
getDefaultData (initData)  | object | 获取默认的数据，在reset和list insert时会生效
getKeyValue (data) | any | 获取key值，data为空时，则使用内部数据
reset () | any | 重置数据为默认数据
setOriginData (data) |  | 设置原始数据，原始数据会在reset中使用
valueApply (fields, callback, data) | any | 值应用，会取到传入的字段数据，执行callback方法，返回callback的值
formatApply (fields, callback, data) | any |值格式化，会取到传入的字段格式化的数据，执行callback方法，返回callback的值
useValues (fields, data)| any | 使用值，根据fields参数，返回值数组
setFieldsValue (values, data) | | 设置一组字段的值
setPager (pager, isSearch) | | 设置分页信息
getPager () | | 获取分页信息

## 数据行为
所有的data参数为空的情况下，都为操作本身模型内数据；数据行为必须要设置模型的action才生效；

方法名 | 返回类型 | 说明
:--------------- | :-: | :-
`async` save (data) | any | 快捷保存操作，识别新增和更新，进行执行对应行为，需设置keyField
`async` insert (params, options, config) | any | 新增操作
`async` update (params, options, config) | any | 更新
`async` query (params, options, config) | any | 查询
`async` load (params) | any | 执行query方法，填充模型
`async` delete (params, options, config) | any | 删除
isNew (data) | boolean | 判断是否新增数据，需设置keyField
hasAction (actionName) | boolean | 判断是否存在action


## 数据处理
方法名 | 返回类型 | 说明
:--------------- | :-: | :-
`async` validate (options) | boolean | 数据验证,注意这里验证的样式单条数据，等同于validateItem； options:{ data: 验证的数据，在列表模型中为必须，为空时则会验证模型自身数据, fields: '指定验证的字段', checkAll:'是否全部检测，否则只返回第一个错误的信息' }；
convert (data, force) | object | 数据转换，会将data或者模型内数据进行转换，force为true或者开启了严格模式，则会保证数据字段为模型定义字段；
trim (data) | object | 清除内部标识数据
isEmpty () | boolean | 判断数据是否为空


## 模型事件
模型的事件除了watch(字段值变化)外，都是基于AOP来实现的
方法名 | 返回类型 | 说明
:--------------- | :-: | :-
onBefore(methodName, name, callback, mode) | | 基础的aop-before方法，methodName模型的方法名;name: 事件名(自主定义)，callback:事件回调，isBefore:是否在刷新前置执行，mode=’once'仅执行后边销毁
on(methodName, name, callback, mode) | | 注册aop-after方法， 其他参数同上
off(type, methodName) | |  注销aop方法，type：before/after;
fireOrigin(methodName, ...args) | | 执行原始的方法，在aop之后，可以通过此方法调用之前的方法
onRefresh (name, callback, isBefore, mode) | | 注册监听模型内容刷新的方法，onRefresh必定会触发onChange, name: 事件名(自主定义)，callback:事件回调，isBefore:是否在刷新前置执行，mode=’once'仅执行后边销毁
offRefresh (name) | | 销毁注册的内容刷新的事件
onChange (name, callback, isBefore, mode) | | 注册监听模型存储变更的方法，, 参数onRefresh
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
方法名 | 返回类型 | 说明
:--------------- | :-: | :-
getModelType () |  String | 获取模型类型，返回'Data'；
getOptions | modelOptions | 获取modelOptions；
getField (field, options) | MDField | 根据路径获取模型内联字段，包括模型字段或者子模型字段,field 字段名或者路径,options:{item, chain} item:列表项数据，列表传入时，可以获取动态渲染字段, chain:链模式，如果路径模式会返回创建一个新的带chain模式的field
getFields (field, options) | MDField | 根据路径获取模型内联字段数组，详细同上
cloneFields(fields) | [MDField] | 克隆字段，可扩展字段，fields ： [字段名/FieldOptions] 
getModelName () | String | 获取模型名称
getModel (path) | MDModel | 根据路径获取当前模型下的子模型
getKeyField () | String | 获取key字段
createField (name, field, isModelCreate) | String | 创建字段方法，根据不同类型的模型，重载创建不同类型的字段; isModelCreate:是否由当前模型创建，即字段关联模型为当前模型
addProps () | String | 模型添加属性
callBase (name, ...args) | Any | 运行模型的原型链方法，在扩展了模型props后可以通过此方法调用原方法; 重载方法想调用原方法时使用


