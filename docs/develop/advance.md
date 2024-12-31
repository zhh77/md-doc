# 进阶功能

模型驱动的开发，上手并不难，模型的定义内容并不多，ui部分也是依托于现有的框架（比如：react + antd），实现功能有很多的方式。但想要真正掌握好，以模型驱动思路去开发，核心是以下两点：

1. 思维的转变，需要围绕模型进行设计，通过定义字段和扩展模型，实现各种复杂的逻辑和展示效果。
2. 了解模型和字段如何ui的结合的，内部渲染和响应的思路。理解TypeUI，fieldset这些的作用。灵活应用虚拟字段，渲染字段，联动等能力实现复杂的场景。

此外基于设计原则的理解和运用也是模型设计质量的保障。

## 虚拟字段

当一些场景里面，模型的字段无法满足业务所需，但字段本身又只有当前场景存在，切不存在独立的值（比如计算而来），这时候就可以创建一个虚拟字段；
字段中设置`isStore:false`，即不保存在模型store中，就会变更虚拟字段，使用与临时处理，比如：渲染，计算等。配合`private:true`使用，不会别其他模型继承。

虚拟字段，获取值可以重写`getValue`, 如果只是展示用可以用`formatValue`

```javascript
 {
  dataType: "number",
  title: "年收入",
  // 是否内部存储，一些展示所用的字段，不通用存储下来，可以设置此属性
  isStore: false,
  // 私有字段，默认不会继承
  private: true,
  // 自定义渲染，这里计算年度收入
  formatValue(value, data) {
    // 值是通过月收入合计而来
    const salary = this.model.salary.getValue(data);
    if (salary != null) {
      return salary * 12;
    }
  },
},
```

## 渲染字段

一个字段只会渲染成一种类型的UI，使用字段的`field.update`方法改变一下字段的相关渲染属性就能达到目的。但有时候，有需要渲染成多个类型，比如：列表中，更具摸个逻辑渲染不同的类型的ui，这是就需要使用渲染字段（通常是是在编辑场景使用）

在模型上定义`renders`属性，在需要的时候，设置字段的`renderState`，这时就会加载`renders`里面对应的配置与当前字段进行合并，新增一个渲染字段，专门作为渲染。渲染的字段不会对原来的字段造成影响。

如下图所示，只是一个或者一类都不用渲染字段；

![alt text](../../public/renderField-1.png)

这个例子例子是value字段会根据type字段的值，渲染成不同的录入，是1个字段会渲染成多个录入的类型，就必须使用渲染字段。

![alt text](../../public/renderField-2.png)

通过`getRenderOptions`方法返回`renderState`就能开启渲染组件。而`links`联动则是，动态改变渲染字段达到不同的渲染效果。

```javascript
[
  {
    name: 'type',
    title: '类型',
    dataType: 'string',
    required: true,
    bizType: 'enum',
    source: [
      {
        label: '字符串',
        value: 'string',
      },
      {
        label: '数字',
        value: 'number',
      },
      {
        label: '日期',
        value: 'date',
      },
      {
        label: '日期范围',
        value: 'dateRange',
      },
      {
        label: '枚举',
        value: 'enum',
      },
      {
        label: '自定义',
        value: 'custom',
      },
    ],
    defaultValue: 'string',
  },
  {
    name: 'value',
    title: '属性值',
    dataType: 'string',
    // 开启渲染字段模式，列表中如果有联动渲染必须开启，表单不需要
    getRenderOptions(data) {
      // 根据type字段设置渲染状态，切换成渲染字段
      return {
        renderState: data.type,
      };
    },
    links: {
      fields: ['type'],
      onChange(type) {
        // 根据type字段设置渲染状态，切换成渲染字段
        this.update({ renderState: type });
      },
    },
    // 定义渲染字段
    renders: {
      number: {
        dataType: 'number' /*  */,
        placeholder: '请输入数字',
      },
      date: {
        dataType: 'date',
        placeholder: '请输入日期',
      },
      dateRange: {
        dataType: 'dateRange',
        placeholder: '请输入日期范围',
      },
      enum: {
        dataType: 'string',
        bizType: 'enum',
        placeholder: '请选择',
        source: [
          {
            label: '男',
            value: '男',
          },
          {
            label: '女',
            value: '女',
          },
        ],
      },
      custom: {
        dataType: 'number',
        // 使用uiConfig来自定义组件
        uiConfig: {
          component: Rate,
        },
      },
    },
  },
];
```

## 模型生命周期

## MDContext

模型上下文对象，主要用途是共享模型的数据，子模型`mdContext`是一层层继承下去的。子模型包含夫模型的所有`mdContext`。

```javascript
const model = MD.create({
  ...,
  // 参数创建
  mdContext: {
    data: {}
  }
});

// 设置上下对象
model.mdContext.set("data1", {})

// 获取上下问对象
const data = model.mdContext.get("data")
```

## 子模型

子模型分为两类，一类是字段子模型，以字段为载体创建的子模型。一类是功能子模型，在父模型上直接创建的功能子模型；

子模型的通用特征如下：

1. 会继承父模型的上下文对象mdContext；
2. 通过model.mainModel可以访问父模型的model对象；
3. 支持无限制的子级，但只有一个rootModel，可以通过`model.getRootModel()`来获取；

### 字段子模型

字段子模型，当字段是有数据结构的类型，会自动创建一个模型，会和父模型共享数据，通过`field.fieldModel`可以访问。

支持的字段类型：dataType为`model, modelList`是两个模型类型 + `modelConfig:MDModel`，基础类型 的`object`类型以及`array` + `itemType:'object'` + `structure`设定具体结构的，都会自动成创建子模型。

主要特点如下：

1. 数据通信, 默认是单向的，有field->fieldModel, 共享一个数据对象，改动fieldModel的数据，field的数据也会变动，但不会触发字段onChange事件。字段上开启`modelBinding:true`后，可以开启双向绑定，即fieldModel也会触发field的onChange事件。

2. filedModel是完成的模型，具有模型的所有特性。字段的验证、转换、渲染等都会切换成fieldModel的。

```javascript
[
  {
    // 模型类型的字段
    dataType: 'model',
    // 对应的模型，可以是元模型或者实例模型，如果时元模型则会自动实例化
    modelConfig: MDModel,
    // modelConfig 为元模型时，modelExtend是模型实例化时的扩展配置
    modelExtend: {},
  },
  {
    dataType: 'array',
    // 数组项的数据类型
    itemType: 'object',
    // 数组项的数据结构，同模型的fields配置
    structure: [{ name: 'name', dataType: 'string' }],
  },
];
```

### 功能子模型

功能子模型是模型为了满足某些功能而创建的模型，目前只有列表模型具有itemModel和filterModel，分别解决的数据项的操作和过滤条件的控制。详细见[列表模型](../api/list-mode.md)。

功能子模型是独立的个体，和父模型之间没有联动通信。

## 树型结构模型

列表模型支持树形结构，使用也比较简单，有两种模式如下，更多相关API见[列表模型-Tree模式](../api/list-mode.md)。

1. 模式一,树形结构 数据只需要设置子字段

```javascript
// 数据结构
const data = {
  {
    ...,
    children:[
      {...}
    ]
  }
}

const listModel = MD.create({
  ...,
  fields: [
    {
      name: "parentId",
      title: "父ID",
      dataType: "number",
    },
    {
      name: "structure",
      title: "数据结构",
      dataType: "array",
    }
  ],
  // 子字段必须是数组
  tree: {
    childField: "children",
  },
  // 模式二，正常的数组结构，
  tree: {
    parentField: "parentId",
    childrenField: "structure",
  }
});


```

1. 模式二, 正常数组结构，通过字段关联父级。模型自动会转成成树形结构。

```javascript
// 数据结构
const data = [
  {
    id:1,
    parentID:null
  },
   {
    id:2,
    parentID:2
  }
];

const listModel = MD.create({
  ...,
  fields: [
     {
      name: "parentId",
      title: "父ID",
      dataType: "number",
    },
    {
      name: "parentId",
      title: "父ID",
      dataType: "number",
    },
  ],
  // 模式二，正常的数组结构，
  tree: {
    // 属性字段
    parentField: "parentId",
    // 转换后的子字段，默认为children
    childField: "children",
  }
});

// 转换后
const treeData = [
  {
    id:1,
    parentID:null
    children:[
      {
        id:2,
        parentID:2
      }
    ]
  },
];

```

## DataEnum

## 模型工厂
