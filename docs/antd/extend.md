# 模型扩展

UI可以针模型和字段进行扩展，以实现模型和UI的结合。

## 数据模型扩展

模型实例化后可以使用
方法名 | 返回类型 | 说明
:--------------- | :-: | :-
render (props, scene) | ReactDom（MDForm|MDTable） | 模型渲染，数据对象模型会渲染成MDForm，数据数组模型会渲染成MDTable;
updateUI (uiConfig) | | 更新多个字段UI，会每个field的updateUI，uiConfig的格式为： {fieldName: fieldUIConfig}

## 元模型扩展

只有在元模型中使用
方法名 | 返回类型 | 说明
:--------------- | :-: | :-
use (options, onInit) | MDModel | 模型实例化的hook，在组件中使用

## 字段扩展

| 方法名                               | 返回类型 | 说明                                                                                            |
| :----------------------------------- | :------: | :---------------------------------------------------------------------------------------------- |
| getValueByUI (data)                  |   any    | 针对ui获取字段值; 因对ui的值类型和字段数据类型不一致的问题，更多的是内部使用                    |
| setValueByUI (value, data)           |   any    | ui设置字段值;                                                                                   |
| updateUI (uiConfig, item)            |          | 更新单个字段UI，会引起字段的重绘，item是在listModel下的行数据，可以完成行级字段的渲染           |
| setUIDecorator (decorator, isUpdate) |          | 设置UI装饰器，装饰器配置，isUpdate为true时，会触发updateUI，详细见[UI装饰器](./ui-decorator.md) |
| getUIDecorator(name)                 |  object  | 获取UI装饰器                                                                                    |
| render (props, data, scene)          | ReactDom | 字段渲染函数，会渲染成对应的TypUI                                                               |

### uiConfig说明

uiConfig是针对TypeUI的配置，格式如下

```
const uiConfig = {
  // 组件，字符时会自动在组件库中获取，也可以直接传入组件
  component: '',
  // 具体组件的props，传入会和默认的配置进行合并
  props: {}
}
```
