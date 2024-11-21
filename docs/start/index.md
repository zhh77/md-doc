# 准备工作
模型驱动是是一套前端框架，也是一套将最佳实践，设计模型，开发流程融入的开发解决方案；通过它即可以实现开发提效，处理复杂的场景会更得心应手；
具有快捷性，灵活性，扩展性集合一体特点，是一个下线低，上线高的方案。能针对不同水平的程序员都能发挥出对应的能力；
`md并不会要求使用ts，因为模型本身具有非常清晰的结构，但不影响使用ts。更倾向使用js，更能发挥js语言快捷，后续会有md的一套开发提示工具；`

## 核心库介绍
* md-base: 核心库，创建模型和管理各种配置configuration
* md-ui-base: ui基础库，规范各种ui协议，无须直接使用
* md-antd: 对接antd的ui库，将模型和对应的各种ui进行了结合，提供MDTable, MDForm, FieldRenderer, Operations等UI库；
* md-mock: mock库，实现了DataAction(即数据服务)的mock能力，提供基础的CRUD以及干预数据的能力；

手动安装或者配置依赖；

## 安装库
```node

```

## 全局设置
md是一个框架，内置了很多功能，但也有很多需要设置的地方，比如：数据请求，各种类型的转换，UI组件的属性控制；
使用`mdConfig.js`进行配置；并需要在项目启动时引入；

```javascript
import request from '@/common/utils/request';
import UIService from 'md-antd';
import { Configuration } from 'md-base';
import MockEngine from 'md-mock';
import moment from 'moment';
import './mdStyle.less';
import './typeConfig';
import './typeUI';

// 因为antd需要特殊的日期格式，所以需要将UIConfig的日期转换方案进行替换
function convertDate(value) {
  if (value) {
    if (value.isValid == null) {
      value = moment(value);
    }
    if (value && value.isValid && value.isValid()) {
      return value;
    }
  }
}

const UIConfig = {
  Date: {
    // fieldProps会通过field的属性未做组件的属性，此处Date组件，会使用field的format属性
    fieldProps: ['format'],
    // 属性转换方法，这里就将值和默认值转换成ui组件所需
    propsConvertor: {
      value: convertDate,
      defaultValue: convertDate,
    },
  },
};

// 设置UI的配置
UIService.setUIConfig({
  // antd各日期时间组件设置
  DatePicker: UIConfig.Date,
  'DatePicker.WeekPicker': UIConfig.Date,
  'DatePicker.RangePicker': UIConfig.Date,
  'DatePicker.MonthPicker': UIConfig.Date,
  // 设置Form的属性
  MDForm: {
    // 通过方法进行属性的干预，这里是设置search区的排版
    props(field, props) {
      if (props.scene !== 'search') {
        return {
          labelCol: { span: 6 },
        };
      }
    },
  },
  // 设置Table的默认属性，
  MDTable: {
    // 通过对象进行默认属性的设置
    props: {
      bordered: true,
      pagination: {
        size: 'small',
        showTotal(total) {
          return `共${total}条数据`;
        },
        showSizeChanger: true,
        showQuickJumper: true,
      },
    },
  },
  Operations: {
    props(field, props) {
      if(props.scene === 'table-row') {
        props.align = 'left';
      }
    }
  }
});

const commonRequest = async (type, url, options) => {
  let res;
  if (options.type === 'get') {
    options.params = options.data;
    delete options.data;
    res = await request.get(url, options);
  } else {
    res = await request.post(url, options);
  }
  return res;
};
// 设置配置
Configuration.setup({
  // 配置数据行为，
  DataAction: {
    // mock的全局设置
    Mock: {
      // 是否开启mock
      enable: location.search.indexOf('__mock__') > 0,
      // mock的引擎
      engine: MockEngine,
    },
    // 设置数据映射规则
    DataMapping: {
      // lit模型映射规则
      List: {
        query: {
          // request的映射是模型内部转出
          request: {
            pageSize: 'pageSize',
            pageIndex: 'currentPage',
          },
          // response的映射是数据转入模型
          response: {
            list: 'data',
            pageSize: 'page.pageSize',
            pageIndex: 'page.currentPage',
            total: 'page.total',
          },
        },
      },
    },
    //注册数据行为引擎(即数据请求)
    Engine: {
      common: commonRequest,
    },
  },
});
```

之后就可以愉快的在项目中开发了。
`注意md-base支持所有前端框架，但目前UI只沉淀的antd(4.24)的，所以在react+antd下开发最为能发挥其能力`


