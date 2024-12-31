# Viewer 展示器

展示是在字段在scene='view'时生效的字段特殊渲染方式。可以定义在field和fieldset中；

## 展示器注册

```javascript
import React from 'react';
import { Tag } from 'antd';

import { Configuration } from 'md-base';
// 注册
Configuration.extend('UIViewer', {
  // tag的展示器
  tag(props, value, data, field) {
    return <Tag {...props}>{value}</Tag>;
  },
});
```

## 展示器使用

```javascript
{
  // 在fieldset中设置
  fieldset: {
    job: {
      // 展示器配置
      viewer: {
        name: "tag",
        props(value) {
          return {
            color: value === "student" ? "blue" : "green",
          };
        },
      },
    },
  },
}
```
