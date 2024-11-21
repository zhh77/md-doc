
# MD 核心对象
* MD：核心库，创建模型和注册类型；
* Configuration：配置对象，复杂各种配置的注册和管理；
* DataHelper：数据帮助库
* Monitor： 监听库，md插件消费

```js
import MD, {Configuration, DataHelper, Monitor};
```

## MD常用方法
方法名 | 返回类型 | 说明
:- | :-: | :-
create(options `:ModelOptions`) | OriginModel | 创建基础元模型，元模型建议只做定义，不在使用侧直接使用；
createDataModel(options`:ModelOptions`, instantiation`:boolean`) | OriginModel | DataModel | 创建数据元模型，同时根据instantiation来判断是否实例化；
createDataListModel(options`:ModelOptions`, instantiation`:boolean`)| OriginModel | DataListModel | 创建列表数据元模型，同时根据instantiation来判断是否实例化；
isModel(model`:object`) | boolean | 判断是否是模型
isDataModel(model`:object`) | boolean | 判断是否是数据模型
registerExtendType(types`:ITypeHandler`) | | 注册扩展类型
registerBizType(types`:ITypeHandler`)  | | 注册业务类型处理器
createModelFactory(baseOptions`:ModelOptions`, models: `:object`) | ModelFactory | 创建模型工厂,可用于一个父模型，多个子模型的管理和使用
createDataEnum(options)| DataEnum | 创建数据枚举，实现动态枚举值的处理，可用于字段枚举数据源


## ModelFactory 
基于模型的设计模型，便于业务抽象设计
```javascript
const factory = MD.createModelFactory({}, {child1: {}});
```

### 参数说明
* baseOptions: 父模型的配置项
* models: 子模型的配置，采用 {childName : ModelOptions } 的方式；

### 对象属性
属性/方法名 | 类型/返回类型 | 说明
:- | :-: | :-
getModel(name, extend) | DataModel | 获取子模型
extendBase(extend) | DataModel | 获取父模型
extendModels(extend)|  | 扩展子模型

## DataEnum
标准的value-label的数据源，内置对应的数据模型，可以有其他字段，但必须有value和label字段；
可以作为单独的数据源使用，也可以设置成Field的枚举数据源；

```javascript
// [{value:'类型是any',label: '字符类型'}] 
const dataSource = MD.createDataEnum(options);
```
### options 参数说明
options是由ModelOptions + 以下属性组成

参数名 | 类型 | 说明
:- | :-: | :-
* props | object | DataNum对象的扩展属性
* onChange(data)| function |数据源变更后相应的事件；
* autoLoad| boolean | 创建时是否自动加载数据；

### 对象属性
属性/方法名 | 类型/返回类型 | 说明
:- | :-: | :-
load(params) | [{}] | 加载数据
getData(key) |  [{}] | 根据key获取数据
getItem(value)| {} | 根据value获取数据项
getLabel(value)| String | 根据value获取数据项
getKey(data)| String | 获取key
getLoadPromise()| Promise | 获取加载的promise，其他依赖DataEnum的会在loadPromise结束之后执行数据处理；
onChange(name, handle)|  | 数据变更事件

<!-- ### 其他方法
方法名 | 返回类型 | 说明
:- | :-: | :-

isModelField(field`:object`) | boolean | 判断是否是模型字段
isBaseField(model`:object`) | boolean | 判断是否是基础字段
isDataField(field`:object`) | boolean | 判断是否是数据字段
getTypeHandler(types`:ITypeHandler`) | TypeHandler | 获取类型处理器 -->






