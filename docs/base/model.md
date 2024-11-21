# Model API

## 模型通用方法
方法名 | 返回类型 | 说明
:- | :-: | :- 
getModelName() | string | 获取模型名称，返回`name + 模型id`；
getKey() | string | 获取模型的key，如果有开启`virtualKey`，则会优先返回；
getKeyField() | field | 获取主键字段；
getFields(fields) | [field] | 获取模型字段，fields, 不同类型返回不同结果，不设置-获取全员；array-获取在模型中的字段数组，不在模型中则会过滤掉；string-获取单个；
cloneFields(fields) | [field] | 复制字段, fields设置同上
createField(field) | field | 复制字段, fields设置同上
addProps(props) | this | 添加属性，props,属性对象

## 元模型
包含所有模型通用方法
方法名 | 返回类型 | 说明
:- | :-: | :- 
getModelType() | string | 获取模型类型，`Origin`: 元模型;`Data`: 单数据模型;`List`: 列表数据模型;
extend(options,isExtendField) | OriginModel | 扩展模型；options：object, 模型配置；isExtendField，boolean,是否扩展字段，默认为true，会根据设置继承同name字段的配置；
create(options,isExtendField) | DataModel/DataListModel | 创建(实例化)数据模型，即创建业务模型；参数同上
createDataModel(options,isExtendField) | DataModel | 实例化单数据模型，create快捷方法；参数同上
createListModel(options,isExtendField) | DataListModel | 实例化列表数据模型，create快捷方法；参数同上

## 单数据模型
包含所有模型通用方法
方法名 | 返回类型 | 说明
:- | :-: | :- 
getModelType() | string | 获取模型类型，`Origin`: 元模型;`Data`: 单数据模型;`List`: 列表数据模型;
setStore(data,isPartUpdate,safeMode) | this | 设置模型存储数据，不会触发刷新事件，data：Object，数据，data=null时，会触发rest方法；isPartUpdate，boolean, 是否局部更新，是则合并数据，否则覆盖数据；safeMode，boolean,是否开启安全模式，默认开启，开启后,不会执行convert方法；
getStore(fields) | data | 获取模型存储的数据；fields：[string],获取的目标字段名，如果设置了，则会分会设置的数据；
setData(data, isPartUpdate) | Object | 设置模型数据方法，和setStore的区别在于，强制开启安全模式，同时会触发模型刷新事件；返回格式化的数据；
async getData(fields) | Object | 获取模型数据方法，和getStore的区别在于，getData会等待所有的异步计算完成后返回数据；参数同上
async query(params, config) | Object | 查询数据，根据模型配置的request的query配置来取数，params：参数对象，params为空时，默认会根据keyField作为参数；config：object，请求扩展配置
async update(params, config) | Object | 更新数据，参数同上
async insert(params, config) | Object | 新增数据，参数同上
async delete(params, config) | Object | 删除数据，参数同上
async superUpdate(config) | Object | 超级更新方法，会判断是否存在key字段和值，如果存在则调用update，否则执行insert；config：object，请求扩展配置
convert(data) | Object | 模型数据转换方法，在StrictModel下有效，会严格根据字段和类型进行转换
async validate(data, checkAll) | Boolean | 数据验证，会根据字段进行验证数据，checkAll，boolean，是否检查全部，如果为true会返回所有的检查的错误，否则只返回第一个错误；
refresh(ignoreValidator) | | 刷新方法，会触发刷新事件，一般不用调用，需要强制刷新时调用；，ignoreValidator，boolean，是否忽略验证，默认为false，如果为true则会忽略验证结果进行刷新；
onChange(name, callback, mode) |this| 注册变化事件，会监听refresh方法；name：注册方法名；callback(data)：调用函数,data-更新后的数据；mode：非必填，触发模式，默认持续执行，设置为‘once’则会执行一次后销毁；
watch(name, fields, callback, mode) | this| 注册监听方法，异步执行，会监听fields的变动之后触发；fields：[string],监听的字段;其他参数同上
syncWatch(name, fields, callback, mode) | this | 注册同步监听方法，参数同上
offWatch(name, isSync) | this | 卸载监听方法，参数同上；name：注册的方法名；isSync: 是否同步监听；
getKeyValue(data) | any | 获取主键值，在设置了模型主键字段时有效；data：有设置时，在data中获取，否则在内部数据中获取；
getDefaultData(options) | Object | 获取默认数据，会获取每个字段的默认值；options:{params,initData}, params构建参数，会传递到每个field的getDefaultValue中；
reset() | Object | 重置方法，会获取默认数据，并设置到模型数据中；
isEmpty() | Object | 判断是否为空；
useValues(fields, data) | [Any] | 使用值，根据fields参数，返回值数组；
valueApply(fields, callback, data) | Any | 值应用，会取到传入的字段数据，执行callback方法，返回callback的值; fields，[string];data,目标数据，不设置，则取内部数据；callback([value1,value2,..., data]),callback参数为fields返回的值数据 + 整体的数据；
formatApply(fields, callback, data) | Any | 值应用，会取到传入的字段格式化的数据，执行callback方法，返回callback的值；参数同上；

## 列表数据模型
包含所有模型通用方法
方法名 | 返回类型 | 说明
:- | :-: | :- 
getModelType() | string | 获取模型类型，`Origin`: 元模型;`Data`: 单数据模型;`List`: 列表数据模型;
getStore(index) | data | 获取模型存储的数据；
setStore(data,isPartUpdate,safeMode) | this | 设置模型存储数据，不会触发刷新事件，data：Object，数据，data=null时，会触发rest方法；isPartUpdate，boolean, 是否局部更新，是则合并数据，否则覆盖数据；safeMode，boolean,是否开启安全模式，默认开启，开启后,不会执行convert方法；
setData(data, isPartUpdate) | Object | 设置模型数据方法，和setStore的区别在于，强制开启安全模式，同时会触发模型刷新事件；返回格式化的数据；
async getData(fields) | data | 获取模型数据方法，和getStore的区别在于，getData会等待所有的异步计算完成
getDefaultData() | Object | 获取默认数据，会获取每个字段的默认值；
addVirtualKey | Object | 给item数据添加虚拟key
reset() | Object | 重置方法，设置为空数组；
isEmpty() | Object | 判断是否为空；
setPager(pager) |  | 设置分页信息；
getPager(pager) | Object:Pager | 获取分页信息；


