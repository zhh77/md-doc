# 元模型

元模型是数据模型基础，所有数据模型都是元模型的实例。通过MD.create创建的元模型。模型实例只有在页面真正消费的时候才会实例化。
关于模型的介绍，可以参考[模型介绍](../introduce/model.md)。

```javascript
// 通过MD.create创建模型后会得到元模型
const baseModel = MD.create({
  ...
});

```

## 方法说明

| 方法名                                  |        返回类型         | 说明                                                                                                                                                                                                              |
| :-------------------------------------- | :---------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| extend (modelOptions, additionalFields) |       OriginModel       | 扩展模型，返回新的元模型, additionalFields 新添加的字段                                                                                                                                                           |
| extendFields (fields)                   |        [MDField]        | 扩展字段，返回新的字段集合；                                                                                                                                                                                      |
| create (modelOptions)                   | DataModel/DataListModel | 创建数据模型，即实例化模型                                                                                                                                                                                        |
| createDataModel (modelOptions)          |        DataModel        | 创建数据对象模型                                                                                                                                                                                                  |
| createListModel (modelOptions)          |        DataModel        | 创建数据列表模型                                                                                                                                                                                                  |
| getFields (options)                     |  [MDField] / [String]   | 获取字段集合， options={fields, excludeFields, nameMode};fields:[字段名]，指定的字段； excludeFields：排除的字段，fields为空时有效；nameMode: 只获取字段名字数组                                                  |
| extendAction (action)                   |          void           | 扩展数据行为                                                                                                                                                                                                      |
| getModelType ()                         |         String          | 获取模型类型，返回'Origin'；                                                                                                                                                                                      |
| getOptions                              |      modelOptions       | 获取modelOptions；                                                                                                                                                                                                |
| getField (field, options)               |         MDField         | 根据路径获取模型内联字段，包括模型字段或者子模型字段,field 字段名或者路径,options:{item, chain} item:列表项数据，列表传入时，可以获取动态渲染字段, chain:链模式，如果路径模式会返回创建一个新的带chain模式的field |
| cloneFields(fields)                     |        [MDField]        | 克隆字段，可扩展字段，fields ： [字段名/FieldOptions]                                                                                                                                                             |
