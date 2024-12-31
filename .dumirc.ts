import { defineConfig } from 'dumi';

export default defineConfig({
  themeConfig: {
    name: '模型驱动',
    nav:[
      {title: '开发说明',link:'/develop' },
      {title: '介绍',link:'/introduce' },
      {title: 'API文档',link:'/api' },
      {title: 'UI文档(MD-Antd)',link:'/antd' }
    ]
  },
  base: '/md-doc/',
  publicPath: '/md-doc/',
});
