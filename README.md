# commonJS

常用 JS 工具类整理
例，vue 项目中，可以直接放在 utils 文件夹下，在 main.js 中引入；
绑在在原型中，直接使用。
示例：
step1：main.js；

<!-- 引入 -->

import BaseCommon from '@/utils/baseCommon';

<!-- 绑定 -->

Vue.prototype.$baseCommon = BaseCommon;

step2:其他页面调用(使用)：

<!-- this.$baseCommon.baseCommon.js 中的方法名 -->

this.$baseCommon.userBrowser();
