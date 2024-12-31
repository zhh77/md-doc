# TypeUI

字段渲染的核心，默认会根据类型来找到对应的组件进渲染，类型名匹配dataType或者bizType，获取TypeUI的顺序 bizType -> dataType;

注意view渲染，如果没必要不用特殊的配置，会直接用字段的formatValue来展示；

```js
const TypeUI = {
  // 配置格式说明，
  [type]: {
    // 输入组件配置，默认匹配edit场景，search场景如果没有配置则也会使用此配置
    input: {
      // 组件，字符时会自动在组件库中获取，也可以是具体封装的组件
      component: "Input",
      // 字段转换属性, 数据内字符是属性直接匹配，对象是属性转换
      fieldProps: [{ maxLength: "max" }],
      // 默认属性
      props: {},
      // 初始化方法，可以对props干预，默认上下文this=field
      init(props){}
    },
   // search场景配置，没有配置则会读取input的配置
   search:{}
   // view场景配置，
   view:{}
   //
  },
  string: {
    input: {
      component: 'Input',
    },
  },
  text: {
    input: {
      component: 'Input.TextArea',
    },
  },
  number: {
    input: {
      component: 'InputNumber',
    },
  },
  date: {
    input: {
      component: 'DatePicker',
    },
  },
  boolean: {
    input: {
      component: 'Switch',
    },
  },
  enum: {
    input: {
      component: 'Select',
      init(field, props) {
        if (field.dataType === 'array') {
          props.mode = 'multiple';
        }
        props.allowClear = !field.required;
      },
    },
    // 展示模式，可以在field或者fieldset的uiMode属性中设置
    uiMode: {
      // 横版排列
      hor(field) {
        let config = {
          // 支持的场景
          scenes: ['edit'],
        };

        if (field.dataType === 'array') {
          config.component = 'Checkbox.Group';
        } else {
          config.component = 'Radio.Group';
          config.props = {
            optionType: 'button',
          };
        }
        return config;
      },
      // 树形展示
      tree: {
        scenes: ['edit'],
        component: 'TreeSelect',
        init(field, props) {
          if (field.dataType === 'array') {
            props.treeCheckable = true;
          }
          props.allowClear = !field.required;
        },
      },
    },
  },
  dateRange: {
    input: {
      component: 'RangePicker',
    },
  },
  integer: {
    input: {
      component: 'InputNumber',
      props: {
        precision: 0,
      },
    },
  },
  array: {
    input: {
      component: 'Select',
      props: {
        mode: 'multiple',
      },
    },
  },
  object: {
    component: 'MDForm',
  },
  arrayObject: {
    component: 'MDTable',
  },
  model: {
    component: 'MDForm',
  },
  modelList: {
    component: 'MDTable',
  },
};
```
