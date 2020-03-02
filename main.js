require.config({
  baseUrl: '.',
  packages: [{
    name: 'moment',
    location: '.',
    main: 'moment'
  }, {
    name: 'lodash',
    location: '.',
    main: 'lodash'
  }]
});
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