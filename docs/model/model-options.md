# Model构建参数

### 配置例子

```javascript

// 创建列表场景的模型
const ShopMailList = BaseShopMail.extend({
  // 模型的类型，分为data和list两种，分别对应对象和数组
  modelType: 'list',
  name: 'ShopMailList',
  title: '店铺邮箱列表',
  // 开启列表项模型，列表项模型可以会继承父模型的配置，可以用于操作单条数据
  itemModel: true,
  // 过滤配置，会生成filterModel，可以用于列表查询和生成查询条件表单
  filter: {
    // 过滤的字段，同模型字段配置一直
    fields: ['shopName', 'status'],
  },
  // 行为配置（数据请求行为），内置了基于模型的query，update，insert，delete四个action，还可以定义其他的
  action: {
    // 查询配置，查询的参数来源于filter
    query: {
      // 地址
      url: '/csc-mail-service/seller/web/mail-conf/query-page-list',
      // 映射配置
      dataMapping: {
        // response的映射是数据转入模型
        response: {
          list: 'data.items',
          pageSize: 'data.pageSize',
          pageIndex: 'data.currentPage',
          total: 'data.total',
        },
      },
      // 查询项配置
      options: {
        // 请求类型
        type: 'get',
        // 查询默认参数
        data: {
          tenantId: 1,
          platformType: 2,
        },
      },
    },
    update: {
      url: '/csc-mail-service/seller/web/mail-conf/bind',
      // update的的字段
      fields: ['shopId', 'mail', 'password', 'tenantId', 'platform'],
    },
    delete: {
      url: '/csc-mail-service/seller/web/mail-conf/unbind',
      fields: ['shopId', 'mail', 'tenantId', 'platform'],
    },
  },
});
```

## ModelOptions
无论是定义模型，子模型，相关模型参数，都通用ModelOptions，结构如下

```javascript
const BaseModel = MD.create({
  name: 'BaseModel',
  title: '基础模型',
  // List | Data
  modelType: 'Data',
  // 字段设置， 详细见Field配置
  fields: [],
  // 数据行为配置（数据请求）
  action: {
    query: {},
    insert: {},
    update: {},
    delete: {},
    // mock配置
    mock: {},
  },
  // 扩展属性，最后会附加到模型上
  props: {},
  // 初始化事件
  onInit(options) {},
  // 初始化结束事件
  onEndInit(options) {},
  // 模型上下文，可以传递到所有子模型中，默认带有根模型rootModel
  mdContext: {},
  //严格模式，开启后，数据必须和字段匹配， 值会进行转换，默认关闭
  strictMode: false,
  // 是否开启初始化数据，即模型创建的时候，通过getDefaultData 创建初始化数据
  enableInitData: true,
  // 是否开启字段link
  enableLink: true,
  //是否开启验证
  enableValidate: true,
  //触发延迟时间，所有的联动都会用这个时间做节流处理
  triggerTime: 300,
  //动态字段模式，开启后，字段变更会重新渲染，非必要情况不用使用，会带来性能损失
  dynamicField: false,
});
```

### 数据列表模型专有配置
```javascript

// 创建列表场景的模型
const ShopMailList = BaseShopMail.extend({
  ...,
  // 开启列表项模型，可以扩展itemModel的属性
  itemModel: {},
  // 过滤配置，会生成filterModel，可以用于列表查询和生成查询条件表单
  filter: {
    // 过滤的字段，同模型字段配置一直
    fields: ['shopName', 'status'],
  },
  // 是否需要分页
  needPager: true,
  // 分页设置
  pager: {
    pageIndex: 1,
    total: 0,
    pageSite: 1
  },
  // 子项字段，树形子节点字段,可以实现树形数据结构的操作
  childrenField: ''
  // 虚拟key，列表模型很多操作都局域虚拟key，非必要不用关闭；
  virtualKey: true，
  // 基础数据状态，详细待补充
  defaultItemState: {}
});
```


## Action 数据行为

分为两类，一类dataAction，内置了 query，insert，update，delete， find，还可以扩展其他的，另外一类是mock，只能设置一个，且需要md-mock库配合使用

### DataAction

| 参数名                                         |   类型   | 说明                                                                                            |
| :--------------------------------------------- | :------: | :---------------------------------------------------------------------------------------------- |
| url                                            |  string  | 请求地址，必填                                                                                  |
| options                                        |  object  | 请求配置项，`{type:'get', data: {}, ……}`,除了data作为基础请求数据外，其他的都由数据请求引擎定义 |
| fields                                         |  array   | 请求的字段，会将配置的字段组成请求的参数，也可以扩展fields的属性，比如：key和DataAction，已实现不同行为的字段差异                                                       |
| dataMapping                                    |  object  | 映射配置对象，见后面DataMapping说明                                                             |
| onRequest(config)                              | function | 请求干预事件，可以干预请求的配置；scope=model                                                   |
| onResponse(result, options, config)            | function | 响应干预事件，返回值可以作为新的结果；scope=model                                               |
| proxyRequest(actionName, url, options, config) | function | 请求代理函数，可以用这个方案干预请求，比如：不希望用系统的请求引擎                              |

的场景
actionType | String | 指定行为类型，自定义行为有效，对应内置的 `query | update | insert | delete | find`， 会触发对应的处理逻辑
urlMapping | object | url映射配置，会根据url到urlMapping取对应的值, 此项可以让url设置不依赖于具体的url，定义的时候，使用key，用mock完成开发，然后在注册UrlMapping。另外也可以让同一个模型在不同的场景下，有不同的数据请求地址；

### Mock配置

```javascript
const MockConfig = {
  // 字段干预配置，作用于insert和update，不限于模型字段
  fields: {
    id: {
      // 指定的mock的数据类型，同bizType
      mockType: 'id',
    },
    businessType: {
      // 不是本模型的可以指定对应另外模型的字段，也可以不设置字段，则会用key来创建
      field: BaseShopAuthority.businessType,
      value() {
        return 1;
      },
    },
  },
  //  指定的存储名，类似于表名，多模型可以共享，默认会使用模型的name
  store: 'modelStore',
  // insert结果干预配置
  insert: {
    // 延迟时间
    delay: 100,
    // 结果干预
    handler(res) {},
  },
};
```


