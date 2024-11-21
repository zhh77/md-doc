# 模型字段配置
模型字段配置有三部分构成，
1. 基础的模型配置，配置字段的数据结构信息
2. 针对类型处理器，自定义配置项（以具体类型为准）
3. 针对UI添加的（以具体UI要求为准）

## 基础数据结构配置
属性名称 | 类型 | 必填 | 说明
:---: | :-: | :-: |:-
key | `string` | `是` | 数据的key，用在具体数据中,比如后端传入的数据，表单填入的数据；
keyPath | `string` | 否 | 数据的key的路径，专门用在多级的格式，比如：```key:'date'```,```keyPath:'parent'```，那么真实的路径是```parent.date```
name | `string` | 否 | 字段定义名称，使用模型时使用，通常不用手动设置，创建模型时，会自动根据属性名添加
dataType | `string` | `是` | 数据类型，主要是由`基础数据类型-baseType`和`扩展数据类型-extendType`组成
realType | `string` | 否 | 数据真实类型，realType必须为`基础数据类型-baseType`，比如：日期字符串格式，真实类型就为`date`
bizType | `string` | 否 | 业务数据类型
isKey | `boolean` | 否 | 是否是主键，一个模型有且只会有一个主键，如果有多个设置只会取第一个


## 基础数据类型相关配置
属性名称 | 类型 | 必填 | 影响类型 | 说明
:-: | :-: | :-: |:-: |:-
format | `string` | 否 | date|array | 格式化配置，影响类型处理器的format方法
decimal | `number` | 否 | number | 小数位数
required | `boolean` | 否 | All | 是否必须，默认为否
max | `number` | 否 | string|date|number | 最大值，string|array为长度，date|number为值
min | `number` | 否 | string|date|number | 最小值，string|array为长度，date|number为值
source | `array[{value,text}]` | 否 | enum | 数据来源
defaultValue | any| function(params) | 否 | enum | 默认值, 类型要求与字段相同，静态值或者方法获取。默认会在model的getDefaultData({params})里面调取;

## 配置Demo
```js
{
  id: {
    key: "id",
    title: "自增id",
    dataType: "string",
    bizType: "id",
    isKey: true,
  },
  name: {
    key: "name",
    title: "人名",
    dataType: "string",
    bizType: "name",
    max: 10,
    required: true
  },
  email: {
    key: "email",
    title: "邮箱",
    dataType: "string",
    bizType: "email",
  },
  int: {
    key: "int",
    title: "整数",
    dataType: "int",
    min: 100,
    max: 10000,
  },
  enum: {
    key: "enum",
    title: "枚举",
    dataType: "string",
    bizType: "enum",
    source: [
      {
        value: 0,
        text: "未开始",
      },
      {
        value: 1,
        text: "已启动",
      },
      {
        value: 2,
        text: "已完成",
      },
    ],
  },
  link: {
    key: "link",
    title: "链接",
    dataType: "url",
  },
  datenum: {
    key: "datenum",
    title: "日期数字",
    dataType: "datenum",
  },
  daterange: {
    key: "daterange",
    title: "日期范围",
    dataType: "daterange",
  },
}
```
## ModelField对象方法说明
方法名 | 返回值 | 说明
:-: | :-: |:-
copy(extend) | ModelField | 通过extend扩展除新的ModelField
formatValue(value) | string | 将数据格式化成字符串，可以重写
convertValue(value) | any | 转换成字段匹配的数据，可以重写
setValue(data) |  | 设置字段值，data为空时，会赋值给数据对象模型。
getValue(data) | any | 获取字段值，data为空时，会赋值给数据对象模型，能够适配`parent.child`多级的格式，可以重写
getDefaultValue(params) | any | 获取默认值，会调取defaultValue来获得，可以重写
