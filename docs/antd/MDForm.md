## MDForm
MDForm ： 在Form的基础上，加入了复杂布局和基本操作(基于Operations)的能力；数据对象模型的render方法会用此进行渲染；

Form一般情况没必要使用，全部使用MDForm来构建表单；

```javascript
import  { MDForm } from 'md-antd';

const Demo = () => {
  const formProps = {
    labelCol: { span: 8 },
    labelAlign: 'right',
    autoLayout: true,
    scene: 'edit',
    groups: [
      {
        renderType: 'tab',
        items: [
          {
            title: '基本配置',
            items: [
              {
                fields: [
                  'name',
                  'title',
                  'configType',
                  'itemType',
                  'format',
                  'decimal',
                  'source',
                  'structure',
                  ['min', <span key="1">-</span>, 'max'],
                  'required',
                ],
              },
              {
                fields: ['regular'],
              },
              {
                fields: ['defaultValue'],
              },
              {
                fields: ['desc'],
              },
              {
                title: '类型特有配置',
                fields: ['extendProps'],
                checkVisible(model) {
                  return model.extendProps.structure != null;
                },
              },
            ],
          },
          {
            title: '联动配置',
            items: [
              {
                fields: ['links'],
              },
            ],
          },
          {
            title: '展示配置',
            items: [
              {
                fields: ['uiScene', 'formatExpression'],
              },
              {
                fields: ['renders'],
              },
              {
                fields: ['renderState'],
              },
            ],
          },
        ],
      },
    ],
    fieldsProps: {
      min: {
        itemGroup: {
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
          },
        },
      },
      extendProps: {
        labelCol: { span: 0 },
        props: {
          labelCol: { span: 8 },
          labelAlign: 'right',
          autoLayout: true,
        },
      },
    },
    operations: {
      align: 'right',
      items: [
        { name: 'save', type: 'primary', text: '保存字段', onClick: onSaveField },
        'reset',
        {
          name: 'delete',
          text: '删除',
          confirm: '确定删除该字段？',
          onClick: e => {
            mItemModel.deleteItem({ autoFill: true });
            mItemModel.setOriginData(mItemModel.getStore());
          },
        },
      ],
    },
  };

  return <MDForm {...formProps}></MDForm>
}

```

## 完整属性
![参数说明](../../public/mdform.png)
