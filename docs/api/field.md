# 字段

模型字段，必须要依赖于模型存在, 主要包含：

1. 字段的数据结构和特性, 比如：数据类型(dataType), 数据源(source)，结构（structure），子模型（fieldModel）等；
2. 数据相关的操作，比如：转换，验证，监听数据变化，联动；
3. 数据行为配置，比如：key（store存储），dataAction(数据请求)；
4. 字段业务特征，主要由扩展业务类型(bizType)和扩展业务属性而来；
5. 渲染相关配置，比如：UI配置（UIConfig），渲染字段(renderField)等；

## FieldOptions

构建的参数说明：

```javascript
const FieldOptions = {
  name: 'field',
  title: '字段',
  // 数据类型，string/text/number/int/date/datetime/
  dataType: 'array',
  // 业务类型，
  bizType: 'enum',
  // 默认值，类型要求符合字段的类型要求
  defaultValue: [],
  // 是否模型的主键，一个模型有且只有一个主键，先入为主
  isKey: false,
  // 是否存储数据，如果不存储，字段的值还是可以访问，但不会保存在模型的store中。
  isStore: true,
  // 私有字段，不会被隐式继承(不设定fields时)
  private:true,
  // 是否开启验证
  isValid: true,
  // 是否必须
  required: true,
  // 最大值，不同类型的最大，最小值的含义不一样，string/array代表长度，number/date代表数值，
  max: 20,
  // 最小值
  min: 0,
  // 自定义规则，正则或者正则字符
  regular: '',
  // 自定义验证方法，要求返回 {success: true, message: ''}
  valid(value, data){},

  //自定义验证信息，统一的验证信息通过Configuration来定义，特殊的可以自定义, 规则如下：
  validationMessage: {
    required: '【${field.title}】不能为空！',
    min: '【${field.title}】不能大于【${ruleValue}】个字符！'
  },
  // 格式化配置，不同类型的格式化配置的要求不同
  format: '',
  // // 格式化表达式，
  // formatByExpression: '${field}',
  // 数据存储的键值，默认同name
  key: '',
  // 数据行为,在model的Action中生效，一般不会定义在标准的模型上，推荐在具体action的fields中定义
  dataAction: {
    // action的数据键值
    key: '',
    // 数据类型
    dataType: '',
    // 自定义数据转换方法
    convert(value,data){}
  },
  // enum的数据源, source的配置详细见后续source配置说明
  source: [{ value: '', label: '' }],
  // source的通用配置
  sourceConfig: {
    // 指定value的key
    valueKey:'',
    // 指定label的可以
    labelKey:'',
  },
  // 字段数据结构，[object]和object生效，会生成子模型fieldModel
  structure: [
    // 结构的字段定义同字段一致
    {
      name: 'state',
      title: '状态值',
      dataType: 'object',
    },
    {
      name: 'label',
      title: '状态名',
      dataType: 'string',
    },
  ],
  // 子模型配置，当dataType为model或者modelList时生效，对象为具体的模型或者ModelOptions
  modelConfig: Model,
  // 子模型的扩展配置
  modelExtend: ModelOption,
  // 是否开启子模型绑定。默认为关闭，即数据单项传递，字段值会同步到子模型，子模型不变动更新字段。开启后，会双向同步；
  modelBinding: false,

  // 是否开启联动，默认开启
  enableLink : true,
  // 联动设置, 支持单个{},多个[]，详细见后续联动配置说明
  links: {
    // 联动字段
    fields: ['type'],
    // 触发模式，有模型整体数据`dataChange`和字段值`valueChange`两种变更；加上both，可以实现精准控制
    triggerModel: 'both',
    // 变动响应事件
    onChange(type) {
      // 设置是否可见
      this.setVisible(type === 'link');
    },
  },
  // 绑定的字段，必须为实例化后的模型字段，会同步值和变更相应
  bindField:MDField,
  // 自定义UI配置，默认会根据dataType和bizType进行匹配渲染，这里可以自定义组件
  uiConfig: {
    // 自定义组件，设置string代表是使用内置组件，也可以设置成具体的组件
    component: '',
    // UI的显示模式，根据具体的UI而定
    uiMode: '',
    // 组件属性, 对应组件的属性值
    props: {},
  },
  // uiMode在field上的快捷定义, 定义在typeUI中
  uiMode: 'hor',
  placeholder: '请输入',
  // 自定义渲染，快捷生成渲染字段的方法，适用于列表中个性化渲染场景，配置renderState使用
  getRenderOptions(data, scene){},
  // 渲染字段设置，可以根据不同场景生成使用不同的
  renders:{}
  // 渲染状态，和renders对应，设置后，会使用renders对应的配置来生成渲染字段，可以通过update或者getRenderOptions来生效
  renderState,
};
```

## 枚举数据源

枚举数据源source只有当bizType='enum'时会内部消费，其他时候是手动消费；
支持一下数据源模式

1. 静态数据源

```javascript
const Field = {
  source: [{ value: '', label: '' }],
};
```

2. 动态数据源

```javascript
可以使用方法来动态的返回数据源，如果要更新数据源，则调用field.updateSource();
const Field = {
  async source() {
    // this为当前field
    return [{ value: '', label: '' }];
  }
}
```

3. 模型数据源

```javascript
const Field = {
  sourceConfig: {
    // 关联的模型,必须为ListDataModel,支持 MDModel | string | function(field)，三种；string时：模型路径如：'items.child',或者当前模型关键字'self'
    model: MDModel,
    // 模型扩展参数
    modelExtend: ModelOptions,
    // 然后通过valueField和labelField指定对应的字段
    valueField: '',
    labelField: '',
  },
};
```

4. 字段数据源
   可以指定当前模型或者其他模型的字段作为数据源；字段值为数据源

```javascript
const Field = {
  sourceConfig: {
    // 关联的字段，字段类型为modelList获取array， mdField | string | function(field)；string时，会从当前模型的路径去取
    field: '',
    // 然后通过valueKey和labelKey指定对应的字段
  },
};
```

5. 父字段数据源
   指定一个parentField作为父级数据源，会取parentField的sourceItem的子项为数据源

```javascript
const fields = [
  {
    name: 'province',
    title: '省',
    dataType: 'string',
    bizType: 'enum',
    // 数据源为省市二级联动
    source: [
      {
        value: 'zhejiang',
        label: '浙江',
        children: [
          {
            value: 'hangzhou',
            label: '杭州',
          },
          {
            value: 'ningbo',
            label: '宁波',
          },
        ],
      },
      {
        value: 'jiangsu',
        label: '江苏',
        children: [
          {
            value: 'nanjing',
            label: '南京',
          },
        ],
      },
    ],
  },
  {
    name: 'city',
    title: '城市',
    dataType: 'string',
    bizType: 'enum',
    sourceConfig: {
      //设置父字段
      parentField: 'province',
      // 设置对应的子项的key
      childrenKey: 'children',
    },
  },
];
```

6. DataEnum
   针对复杂的数据源，推荐使用数据枚举对象来管理，支持数据动态更新，缓存等能力；详细见 [DataEnum](./md.md#dataenum)

```javascript
const Field = {
  sourceConfig: {
    // 指定DataEnum对象
    dataEnum: DataEnum,
  },
};
```

## 基础方法说明

|                    方法名                    |    返回值    | 说明                                                                    |
| :------------------------------------------: | :----------: | :---------------------------------------------------------------------- |
|               getValue (data)                |     any      | 获取对象的值，data为指定数据源，如不指定，则取模型内数据；              |
|            setValue (value, data)            |              | 设置字段的值                                                            |
|          formatValue (value, data)           |    string    | 将数据格式化成字符串                                                    |
|             convertValue (value)             |     any      | 转换成字段类型的值                                                      |
| `async` validateValue (value, data, options) |   boolean    | 验证值，返回`{success: false, error:{field,message,validValue}}`        |
|         update(props, triggerUpdate)         |              | 更新字段，会触发字段的重新渲染; triggerChange控制是否触发字段变更时间   |
|            getDefaultValue(args)             |              | 获取默认值，当defaultValue为方法时，会执行defaultValue(...args)来获取值 |
|                isEmpty(value)                |              | 判断数据是否为空                                                        |
|                  setVisible                  |              | 设置字段的显示状态，当字段有渲染时，则会更新渲染；                      |
|               getModelStore()                | object/array | 快速获取模型store的方法                                                 |

## 数据源相关方法

|             方法名              | 返回值 | 说明                                                                        |
| :-----------------------------: | :----: | :-------------------------------------------------------------------------- |
|          getSource ()           |        | 获取数据源的方法，获取数据源请使用此方法，不要直接操作source属性            |
| getSourceItem (value, dynamic)  |        | 根据枚举值获取枚举项的方法，dynamic是否动态获取，如果匹配不到则会在动态获取 |
| getSourceLabel (value, dynamic) |        | 根据枚举值获取枚举展示label                                                 |
|        getSourceModel ()        |        | 获取数据源模型，如果是模型数据源时有效                                      |
|         updateSource ()         |        | 更新数据源                                                                  |

## 事件

|         方法名          | 返回值 | 说明                                |
| :---------------------: | :----: | :---------------------------------- |
| onUpdate(name, handler) |        | 注册update触发事件                  |
|     offUpdate(name)     |        | 注销update事件                      |
| onChange(name, handler) |        | 注册值更新触发事件， handler(value) |
|     offChange(name)     |        | 注销值更新事件                      |

## 进阶方法说明

|             方法名              |   返回值   | 说明                                                                                                    |
| :-----------------------------: | :--------: | :------------------------------------------------------------------------------------------------------ |
|          copy(extend)           | ModelField | 通过extend扩展除新的ModelField                                                                          |
|      getActionValue(data)       |    any     | 获取action对应的value                                                                                   |
|   setActionValue(value, data)   |            | 这只action的value                                                                                       |
|      callBase(name, args)       |            | 调用原始方法                                                                                            |
|        clearLinks(name)         |            | 根据name清除links                                                                                       |
| bindField(field, changeHandler) |            | 关联到其他字段，其他字段更新时会，会同步更新。一个字段有且只能绑定一个关联字段, 变动时执行changeHandler |
| copyWith(field, data, handler)  |            | 从另外一个字段复制值                                                                                    |
|      getRenderField(data)       |            | 获取渲染字段                                                                                            |

## RenderField说明

在一个字段经常会有多种的展示状态，而只凭update方法来更新属性控制渲染，往往会破坏字段的原始属性，造成污染；这时候就需要渲染字段来完成。
RenderField类似于field的一个子字段，专门负责渲染。在renders里面定义，渲染场景和类型；通过renderState属性来控制；
实例：TODO
