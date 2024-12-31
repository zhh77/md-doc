# MDTable

Table: 由antd的Table扩展而来，实现和模型的绑定；
MDTable: 在Table的基础上，加入了完整CRUD的能力；以及多种编辑模式；数据列表模型的render方法会用此进行渲染

通常情况使用MDTable即可；如果只是使用 Antd Table的功能，可以考虑Table

和MDForm一样，支持模型渲染和组件渲染两种，参数都一致；

```javascript
import  {Table，MDTable } from 'md-antd';
import DemoModel from './model';

const Demo = () => {

// 必须是数组模型
const mDemoList = DemoModel.use();

const tableOptions = {
    // 自动加载，开启后，会自动执行模型的query并进行数据绑定
    autoLoad: true,
    // 开启过滤，生产查询表单
    filter: true,
    // 编辑模式，popup代表使用弹窗进行编辑，另外行编辑row，以及单元格编辑cell；
    editMode: 'popup',
    // 列表项， Antd Table的column的设置 + fieldset配置，详细见fieldset详细文档
    columns: [
      { field: 'shopName', width: '20%' },
      { field: 'shopId', width: '10%' },
      { field: 'mail', width: '20%' },
      // scene 渲染场景，props：field渲染的配置，当edit的时候有效
      { field: 'status', width: '10%',scene: 'edit', props:{} },
      { field: 'updatedTime', width: '20%' },
      { field: 'updatedBy', width: '10%' },
    ],
    // 行操作, 内置了edit，view和delete行为逻辑
    rowOperations: {
      items: [
        {
          name: 'edit',
          title: '绑定',
          // 判断是否显示
          checkVisible({ item }) {
            return item.bindStatus !== 1;
          },
          // 行为事件，定义了会覆盖内置的逻辑
          // onClick(e, args) {
          //   const {item, model, scene} = args;
          // },
          // 行为包装器，可以干预内置行为
          eventWrapper(click) => {
            return (e,args) => {
              click();
            }
          }
        },
        {
          name: 'delete',
          title: '解绑',
          // confirm设置
          confirm: {
            title: '您即将解绑邮箱，请确认?',
          },
          // 执行成功后的消息
          message: '解绑成功',
          checkVisible({ item }) {
            return item.bindStatus === 1;
          }
        },
      ],
    },
    fieldset: {
      scene:'view',
      // 对应字段的UI的props
      props: {}
    },
    // 弹窗编辑器属性
    editorProps: {
       // 弹窗标题
      title: '绑定邮箱',
      // 弹窗宽度
      width: 600,
      // 编辑器操作项
      operations: {
        // 内置了save和cancel
        items: [
          'cancel',
          {
            name: 'save',
            title: '绑定邮箱',
            message: '邮箱绑定成功'
          },
        ],
      },
      // form的属性，对应MDForm当属性设置,edit和view模式通用
      formProps: {
        // 表单展示的字段
        fields: ['shopName', 'shopId', 'mail', 'password'],
        // 字段的ui属性设置
        fieldset: {
          shopName: {
            scene: 'view',
          },
          shopId: {
            scene: 'view',
          },
        },
      },
      // view模式下表单的样式，默认使用formProps
      viewProps: {}
    },
    // 查询表单属性，mdForm的属性设置
    searchProps: {
      operations: {
        items: [
          {
            name: 'search',
          },
        ],
      },
      // 表单属性
      formProps: {}
    },
  }；
  // 组件渲染
  return <MDTable model={DemoModel} {...tableOptions}></MDTable>
  // 模型渲染
  return mDemoList.render();
}
```

## 特点说明

MDTable最大的特点是内置了CRUD操作和多种编辑模式，同时又能很灵活的扩展；

editMode:

- popup：弹窗编辑模式，add，edit，view都会弹出弹窗进行编辑
- row：行编辑模式，即点击编辑和查看时后，会将行变更可编辑
- cell，单元格编辑模式

内置行为
行为名 | 归属属性（分类） | 说明
:--------------- | :-: | :-
add | Operations | 新增操作，onClick(e, { model, scene },operation)，当前模型，注意如果是子模型渲染的model为子模型
save | operations | 保存操作，onClick参数同上
search | operations | 查询操作，onClick参数同上
reset | operations | 重置操作，onClick参数同上
batchDelete | operations | 批量删除，onClick参数同上
edit | rowOperations | 行编辑，onClick(e, { model, item, scene },operation)
view | rowOperations | 查看，popup模式下内置行为，其他的需自行自定行为，onClick参数同上
delete | rowOperations | 删除行，onClick参数同上
addChild | rowOperations | 添加子项，需model设置childrenField，onClick参数同上

## 完整参数

![参数说明](../../public/mdtable.png)
