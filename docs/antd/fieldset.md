# fieldset

字段集，使用一组字段构建功能应用的场景； 比如：form或者table这类组件中，配置字段进行渲染的字段相关配置。
即原来的fieldsProps配置,
有两种配置模式，所有使用数据集来沟通的组件

- 独立配置模式，默认模式，也是所有场景都支持的模式；在fieldset配置上可以加入其他特有配置
- 融合模式，在原有的属性上，附加上fieldset的配置; 如果有独立fieldset配置会合并，优先级独立fieldset > 融合的

```javascript
// form使用独立配置模式
const formProps = {
  fields: ['name', 'age'],
  // fieldset设置
  fieldset: {
    name: {
      scene: 'edit',
      // 字段对应的ui属性设置
      props: {},
      // 以下是form item的附加属性
      // itemLayout下所占列数
      colSpan: 2,
      // 针对表单的item的属性设置
      itemProps: {},
      // itemGroup的属性配置，itemGroup模型下有效，主要控制包裹的div
      itemGroup: {},
      // TypeUI渲染的模式设置，会找对typeUI.uiMode配置下对应的组件进行渲染
      uiMode: '',
      // 展示器，针对view场景下的展示渲染
      viewer: {
        // 展示器名称
        name: 'tag',
        // 展示器属性
        props(value, data, field) {},
      },
    },
  },
};

// table中的column是使用的融合模式
const tableProps = {
  columns: [
    // 直接设定字段名，支持在后面设置fieldset配置
    'name',
    // column设置中，加入了fieldset配置
    {
      // column的配置
      width: 100,
      // 指定字段
      field: 'age',
      scene: 'edit',
      // 字段对应的ui属性设置
      props: {},
    },
    {
      // fieldGroup模式下，不支持融合配置模式，只能使用单独fieldset设置
      field: ['province', 'city'],
      width: 100,
    },
  ],
  // fieldset设置
  fieldset: {
    name: {
      scene: 'edit',
      // 字段对应的ui属性设置
      props: {},
    },
    // 同样可以设置，两边会合并(第一层配置)，这里的配置优先
    age: {},
    city: {},
  },
};
```
