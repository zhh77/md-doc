import { defineConfig } from 'dumi';

export default defineConfig({
  themeConfig: {
    name: '模型驱动',
    nav:[{title: '快速开始',link:'/start' }, {title: '核心库',link:'/model' }, {title: 'MD-AntD',link:'/antd' }]
  },
  base: '/md-doc/',
  publicPath: '/md-doc/',
});
