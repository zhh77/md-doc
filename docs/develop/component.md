# 组件封装(React)

## TypeUI封装

TypeUI的开发和正常组件开发一样，只是有特定的传入属性:

- field: 传入的字段；
- scene: 场景值;
- value: 字段的值;
- data: 当前数据，列表模型为列表项，对象模型为自己本身数据
- onChange: 值改变的回调

```javascript
const UI = (props) => {
  const {field, scene,value, data,onChange} = props;
  return ();
}
```

typeUI的注册和设置见 [TypeUI文档](../antd/typeui.md);

## UIDecorator封装

UIDecorator装饰器，用于对字段组件进行装饰。使用和内置装饰器见文档[UIDecorator文档](../antd/uidecorator.md)；

装饰器的封装是正常的组件, 参数和TypeUI一致，只是没有onChange事件：

## 模型组件封装

模型组件是指接收模型并利用模型的特点完成一定渲染的组件。比如：MDTable，MDFrom，MDList都是模型组件。

下面例子是通过antd Table和模型结合，实现的一个横版table的例子
效果图：
![alt text](../../public/ui-hortable.png)

组件代码如下：

```javascript
import React, { useState, useEffect } from 'react';

import { Table } from 'antd';
import { UIHelper } from 'md-antd';
const MDHorTable = (props) => {
  const { model, scene = 'view', titleColumn, buildColumn } = props;
  const [columns, setColumns] = useState([]);
  const [list, setList] = useState([]);

  useEffect(() => {
    // 生成fieldset
    const fieldset = UIHelper.getFieldset(props.fields, model, props.fieldset);

    // 获取模型加载依赖
    const loadPromise = model.getLoadPromise();
    model.onChange('bindHorTable', (data) => {
      // 依赖加载完成后再进行渲染处理
      loadPromise.then(() => {
        let cols = [];

        // 添加字段列
        cols.push({
          // title: titleFieldConfig.field.title,
          dataIndex: 'field',
          className: 'md-hortable-titlecolumn',
          render(value, item, index) {
            return fieldset[index].field.title;
          },
          ...buildColumnProps(titleColumn, fieldset),
        });

        // 循环数据生成列
        data.forEach((item, i) => {
          const key = `key${i}`;

          const baseRender = (value, data, index) => {
            const fieldConfig = fieldset[index],
              uiScene = fieldConfig.scene || scene;

            const renderField = fieldConfig.field;
            // 字段渲染，查看场景
            if (uiScene === 'view') {
              return renderField.renderView(value, item, fieldConfig.viewer);
            }

            // 编辑场景渲染
            return renderField.render(fieldConfig.props, item, uiScene);
          };

          let columnProps;
          if (buildColumn) {
            columnProps = buildColumn(i, item, data);
            if (columnProps) {
              buildColumnProps(columnProps, fieldset, item, baseRender);
            }
          }

          cols.push({
            dataIndex: key,
            render: baseRender,
            ...columnProps,
          });
        });
        // 简单生成填充的数据
        let dataList = fieldset.map((fd, i) => {
          return { key: i };
        });
        setColumns(cols);
        setList(dataList);
      });
    });

    model.load();
  }, [scene]);

  return (
    <Table
      {...props}
      columns={columns}
      dataSource={list}
      rowKey="key"
      showHeader={false}
      className="md-hortable"
    />
  );
};

function buildColumnProps(props, fieldset, item, baseRender) {
  if (props?.render) {
    const render = props.render;
    props.render = (text, record, index) => {
      const fieldConfig = fieldset[index];
      const value = fieldConfig.field.getValue(item);
      const result = render(value, item, index, fieldConfig.field);
      if (result === undefined && baseRender) {
        return baseRender(value, item, index);
      }
      return result;
    };
  }
  return props;
}

export default MDHorTable;
```
