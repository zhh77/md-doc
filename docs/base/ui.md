# UI 服务

- 分为`MDUI`和`TypeUI`，主要做框架约束，方便进行跟踪和定位，具体的 UI 都需要自行实现

## UIService 对象方法说明

|                        名称                        | 返回类型 | 说明                                                                                 |
| :------------------------------------------------: | :------: | :----------------------------------------------------------------------------------- |
|    createUI(name`:string`, component`:object`)     |   MDUI   | 通过 component 创建 MDUI，component 具体的组件或者配置或者方法都可以，具体看 UI 库自己的实现 |
|  createTypeUI(name`:string`, component`:object`)   |  TypeUI  | 通过 component 创建 TypeUI                                                           |
|          registerTypeUI(config`:object`)           |          | 注册 TypeUI，config 见下段说明                                                       |
|              getTypeUI(type`:string`)              |  TypeUI  | 注册 TypeUI                                                                          |
|       getInputComponent(field`:ModelField`)        |  TypeUI  | 获取 TypeUI 中的 Input Component                                                     |
| inputFormatValue(field`:ModelField`, value`:any`)  |  TypeUI  | InputComponent 格式化方法                                                            |
| inputConvertValue(field`:ModelField`, value`:any`) |  TypeUI  | InputComponent 类型转换方法                                                          |

## TypeUI Config 格式

```js
const TypeUIConfig = {
  //对应的类型，不用区分dataType和bizType，统一注册
  string: {
    // 对应的输入组件, 用于表单场景
    input: {
      component: null,
      convertValue(value) {},
      formatValue(value) {},
      //其他定义由各自UI库自行决定
    },
  },
};
```
