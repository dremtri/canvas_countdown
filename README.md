# canvas_countdown
使用canvas绘制炫酷倒计时

## 使用了requirejs模块化开发
使用require加载moment,lodash等第三方库。
## 查看demo
在main.js文件中调用不同的方法启动不同的演示效果
```
require(['index', 'moment'], function(index, moment) {
  let endDate = moment('2020-03-05 23:30:26', 'YYYY-MM-DD HH:mm:ss');
  if(moment().valueOf() > endDate.valueOf()) {
    console.log('结束时间不能小于当前时间')
    return;
  }
  index.run(endDate);  // 倒计时
  // index.clockRun();  // 时钟
  console.log('初始化');
})
```
