# 数据类型

- baseType：基础类型，js 的基础类型
- extendType：扩展类型，在 baseType 类型之上根据固定的规则扩展而来
- bizType：业务类型，自定义处理

## 内置数据类型说明

| 类型名称  |  类型类别  | 说明                                               |
| :-------: | :--------: | :------------------------------------------------- |
|  string   |  baseType  | 字符串类型                                         |
|   date    |  baseType  | 日期类型，默认配置 `format: "YYYY-MM-DD"`          |
|  boolean  |  baseType  | 布尔类型                                           |
|  number   |  baseType  | 数字串类型                                         |
|   array   |  baseType  | 数组串类型，默认配置 `format: "{0} - {1}"`         |
|  datenum  | extendType | 日期数字，默认配置 `format: "YYYY-MM-DD HH:mm:ss"` |
| datetime  | extendType | 日期时间，默认配置 `format: "YYYY-MM-DD HH:mm:ss"` |
| daterange | extendType | 范围，默认配置 `format: "YYYY-MM-DD HH:mm:ss"`     |
|    int    | extendType | 整数，默认配置 `decimal: 0`                        |
|   enum    |  bizType   | 枚举                                               |

## 注册类型处理器

可以调用 ModelDriver 类的`registerExtendTypeHandler`和`registerBizTypeHandler`

```js
// 数据类型处理器接口，定义类型时需要按需重载
const ITypeHandler = {
  // 格式化数据做展示使用
  formatValue(value, field) {
    return BaseTypes.date.formatValue(value, field);
  },
  // 数据转换
  convertValue(value, field) {},
  // 自定义数据验证，暂未启用
  validateValue(value, field) {},
  // 规则验证，暂未启用
  rules: [],
};

// 扩展类型格式，因为会关联到dataType，所以需要指定类型字段
const extendTypes = {
  datenum: {
    // 扩展类型必须要指定基础类型，同时会继承基础类型的能力
    baseType: 'number',
    realType: 'date',
    format: 'YYYY-MM-DD HH:mm:ss',
    // 格式化数据做展示使用
    formatValue(value, field) {
      return BaseTypes.date.formatValue(value, field);
    },
    // 数据转换，这里不用设置，会继承基础类型的处理
    // convertValue(value, field) {},
  },
};

ModelDriver.registerExtendTypeHandler(extendTypes);

// 业务类型格式,和dataType是并行关系，因此不用设置类型，通常实现formatValue和convertValue就可以了
const BizTypes = {
  enum: {
    formatValue(value, field) {
      if (field.source) {
        let result = field.source.find((item) => item.value == value);
        if (result) {
          return result.text;
        }
      }
      return value;
    },
  },
};

ModelDriver.registerBizTypeHandler(extendTypes);
```
