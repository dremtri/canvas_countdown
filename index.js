let CANVAS_WIDTH = 700; // canvas 画布宽度
let CANVAS_HEIGHT = 300;  // canvas 画布高度
const CIRCLE_GAP = 1; // 圆与圆之间的空隙
const MARGIN_TOP = 0; // 图像距离画布顶端的距离
const MARGIN_LEFT = 0; // 图像距离画布左侧的距离
define('index', ['digit', 'moment'], function(digit, moment) {
  const ROW = digit['row']; // 数字数组的行数
  const COLUMN = digit['column']; // 数字数组的列数
  const COLON_COLUMN = digit['colon_column']; // 冒号数组的列数
  const ROW_GAP = digit['row_gap'];  // 数字与数字之间的间隔
  const CIRCLE_RADIUS = (CANVAS_WIDTH - MARGIN_LEFT - 9 * ROW_GAP - ((6 * (COLUMN - 2) + 2 * (COLON_COLUMN - 2)) * CIRCLE_GAP)) / ((6 * COLUMN + 2 * COLON_COLUMN) * 2);
  CANVAS_HEIGHT = Math.max(CANVAS_HEIGHT, ROW * 2 * (CIRCLE_RADIUS + CIRCLE_GAP))
  let BALLS = []; // 存储彩球
  let END_DATE = null;  
  let interval_id = null;
  let clock_interval_id = null;
  let context = null;
  let currentDiffTime = null;
  let startPoint = null;  // 开始点坐标

  // 倒计时demo运行入口
  function run(endDate) {
    END_DATE = endDate;
    initStartPoint();
    currentDiffTime = getCurrentDiffTime();
    let canvas = document.getElementById('canvas');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    context = canvas.getContext('2d');
    interval_id = setInterval(function() {
      // requestAnimationFrame(update)
      context && render(context)
      update()
    }, 50)
  }

  // 当前时间demo运行入口
  function clockRun() {
    initStartPoint();
    currentDiffTime = getCurrentTime();
    let canvas = document.getElementById('canvas');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    context = canvas.getContext('2d');
    clock_interval_id = setInterval(function() {
      context && render(context)
      clockUpdate()
    }, 50)
  }

  // 初始化数字的起始坐标
  function initStartPoint() {
    startPoint = {
      hours: {
        first: {
          x: MARGIN_LEFT,
          y: MARGIN_TOP
        },
        second: {
          x: MARGIN_LEFT + 2 * COLUMN * (CIRCLE_RADIUS + CIRCLE_GAP) + ROW_GAP,
          y: MARGIN_TOP
        }
      },
      minutes: {
        first: {
          x: MARGIN_LEFT + (4 * COLUMN + 2 * COLON_COLUMN) * (CIRCLE_RADIUS + CIRCLE_GAP) + ROW_GAP,
          y: MARGIN_TOP
        },
        second: {
          x: MARGIN_LEFT + (6 * COLUMN + 2 * COLON_COLUMN) * (CIRCLE_RADIUS + CIRCLE_GAP) + 2* ROW_GAP,
          y: MARGIN_TOP
        }
      },
      seconds: {
        first: {
          x: MARGIN_LEFT + (8 * COLUMN + 4 * COLON_COLUMN) * (CIRCLE_RADIUS + CIRCLE_GAP) + ROW_GAP,
          y: MARGIN_TOP
        },
        second: {
          x: MARGIN_LEFT + (10 * COLUMN + 4 * COLON_COLUMN) * (CIRCLE_RADIUS + CIRCLE_GAP) + 2 * ROW_GAP,
          y: MARGIN_TOP
        }
      },
      colon: {
        first: {
          x: MARGIN_LEFT + 4 * COLUMN * (CIRCLE_RADIUS + CIRCLE_GAP) + ROW_GAP,
          y: MARGIN_TOP
        },
        second: {
          x: MARGIN_LEFT + (8 * COLUMN + 2 * COLON_COLUMN) * (CIRCLE_RADIUS + CIRCLE_GAP) + ROW_GAP,
          y: MARGIN_TOP
        }
      }
    }
  }

  // 是否重新渲染canvas
  function isRedraw(nextDiffTime) {
    if(!currentDiffTime) {
      return true;
    }
    if(nextDiffTime.hours !== currentDiffTime.hours) {
      return true;
    }
    if(nextDiffTime.minutes !== currentDiffTime.minutes) {
      return true;
    }
    if(nextDiffTime.seconds !== currentDiffTime.seconds) {
      return true;
    }
    return false;
  }

  // 更新倒计时demo的canvas
  function update() {
    let nextDiffTime = getCurrentDiffTime();
    if(isRedraw(nextDiffTime)) {
      createBalls(nextDiffTime)
      currentDiffTime = nextDiffTime;
    }
    updateBalls();
  }

  // 更新当前时间demo的canvas
  function clockUpdate() {
    let nextDiffTime = getCurrentTime();
    if(isRedraw(nextDiffTime)) {
      createBalls(nextDiffTime)
      currentDiffTime = nextDiffTime;
    }
    updateBalls();
  }

  // 创建彩球
  function createBalls(nextDiffTime) {
    if(Number.parseInt(nextDiffTime.hours / 10) !== Number.parseInt(currentDiffTime.hours / 10)) {
      let hoursFirstPoint = startPoint['hours']['first'];
      addBalls(hoursFirstPoint.x, hoursFirstPoint.y, Number.parseInt(nextDiffTime.hours / 10))
    }
    if(Number.parseInt(nextDiffTime.hours % 10) !== Number.parseInt(currentDiffTime.hours % 10)) {
      let hoursSecondPoint = startPoint['hours']['second'];
      addBalls(hoursSecondPoint.x, hoursSecondPoint.y, Number.parseInt(nextDiffTime.hours % 10))
    }

    if(Number.parseInt(nextDiffTime.minutes / 10) !== Number.parseInt(currentDiffTime.minutes / 10)) {
      let minuteFirstPoint = startPoint['minutes']['first'];
      addBalls(minuteFirstPoint.x, minuteFirstPoint.y, Number.parseInt(nextDiffTime.minutes / 10))
    }
    if(Number.parseInt(nextDiffTime.minutes % 10) !== Number.parseInt(currentDiffTime.minutes % 10)) {
      let minuteSecondPoint = startPoint['minutes']['second'];
      addBalls(minuteSecondPoint.x, minuteSecondPoint.y, Number.parseInt(nextDiffTime.minutes % 10))
    }

    if(Number.parseInt(nextDiffTime.seconds / 10) !== Number.parseInt(currentDiffTime.seconds / 10)) {
      let secondsFirstPoint = startPoint['seconds']['first'];
      addBalls(secondsFirstPoint.x, secondsFirstPoint.y, Number.parseInt(nextDiffTime.seconds / 10))
    }
    if(Number.parseInt(nextDiffTime.seconds % 10) !== Number.parseInt(currentDiffTime.seconds % 10)) {
      let secondsSecondPoint = startPoint['seconds']['second'];
      addBalls(secondsSecondPoint.x, secondsSecondPoint.y, Number.parseInt(nextDiffTime.seconds % 10))
    }
  }

  // 存储创建的彩球
  function addBalls(x, y, num) {
    for(let i = 0; i < digit[num].length; i++) {
      for(let j = 0; j < digit[num][i].length; j++) {
        if(digit[num][i][j] === 1) {
          let circleCenterPoint = getCircleCenterPoint(x, y, i, j);
          let aBall = {
            x: circleCenterPoint.x,
            y: circleCenterPoint.y,
            g: 1.5 + Math.random(),
            vx: Math.pow(-1, Math.ceil(Math.random() * 1000)) * 4,
            vy: 0,
            color: randomColor()
          }
          BALLS.push(aBall);
        }
      }
    }
  }

  // 更新彩球的位置
  function updateBalls() {
    for(let i = 0; i < BALLS.length; i++) {
      let ball = BALLS[i]
      ball.x += ball.vx;
      ball.y += ball.vy;
      ball.vy += ball.g;
      if(ball.y >= CANVAS_HEIGHT - CIRCLE_RADIUS) {
        ball.y = CANVAS_HEIGHT - CIRCLE_RADIUS;
        ball.vy = - ball.vy * 0.75;
      }
    }
    clearBalls();
  }
  
  // 当前时间和结束时间的差值
  function getCurrentDiffTime() {
    let currentTime = moment();
    let hours = END_DATE.diff(currentTime, 'hours');
    let minutes = END_DATE.diff(currentTime, 'minutes') - hours * 60;
    let seconds = END_DATE.diff(currentTime, 'seconds') - hours * 60 * 60 - minutes * 60;
    return {
      hours,
      minutes,
      seconds
    }
  }

  // 当前时间的时分秒
  function getCurrentTime() {
    let currentTime = moment();
    let hours = currentTime.hour();
    let minutes = currentTime.minute() 
    let seconds = currentTime.second()
    return {
      hours,
      minutes,
      seconds
    }
  }

  // 绘制canvas
  function render(ctx) {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    
    let hours = Number.parseInt(currentDiffTime.hours);
    let minutes = Number.parseInt(currentDiffTime.minutes);
    let seconds = Number.parseInt(currentDiffTime.seconds);
    let hoursFirstPoint = startPoint['hours']['first'];
    let hoursSecondPoint = startPoint['hours']['second'];
    let minuteFirstPoint = startPoint['minutes']['first'];
    let minuteSecondPoint = startPoint['minutes']['second'];
    let secondsFirstPoint = startPoint['seconds']['first'];
    let secondsSecondPoint = startPoint['seconds']['second'];
    let colonFirstPoint = startPoint['colon']['first'];
    let colonSecondPoint = startPoint['colon']['second'];
    renderDigit(hoursFirstPoint.x, hoursFirstPoint.y, Number.parseInt(hours/10), ctx);
    renderDigit(hoursSecondPoint.x, hoursSecondPoint.y, Number.parseInt(hours%10), ctx)

    renderDigit(colonFirstPoint.x, colonFirstPoint.y, 'colon', ctx)

    renderDigit(minuteFirstPoint.x, minuteFirstPoint.y, Number.parseInt(minutes/10), ctx);
    renderDigit(minuteSecondPoint.x, minuteSecondPoint.y, Number.parseInt(minutes%10), ctx)

    renderDigit(colonSecondPoint.x, colonSecondPoint.y, 'colon', ctx)

    renderDigit(secondsFirstPoint.x, secondsFirstPoint.y, Number.parseInt(seconds/10), ctx);
    renderDigit(secondsSecondPoint.x, secondsSecondPoint.y, Number.parseInt(seconds%10), ctx)
    
    renderBalls(ctx);
  }
  
  // 绘制彩球
  function renderBalls(ctx) {
    for(let i = 0; i < BALLS.length; i++) {
      let ball = BALLS[i];
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, CIRCLE_RADIUS, 0, 2 * Math.PI, true);
      ctx.fillStyle = ball.color;
      ctx.closePath();
      ctx.fill();
    }
  }

  // 清除画布之外的彩球
  function clearBalls() {
    let count = 0;
    for(let i = 0; i < BALLS.length; i++) {
      let ball = BALLS[i];
      if(ball.x + CIRCLE_RADIUS > 0 && ball.x - CIRCLE_RADIUS < CANVAS_WIDTH) {
        BALLS[count] = ball;
        count++;
      }
    }
    BALLS = BALLS.slice(0, count + 1);
  }

  // 绘制数字
  function renderDigit(x, y, num, ctx) {
    ctx.fillStyle = "rgba(0, 102, 153, 1)";
    for(let i = 0; i < digit[num].length; i++) {
      for(let j = 0; j < digit[num][i].length; j++) {
        if(digit[num][i][j] === 1) {
          ctx.beginPath();
          let circleCenterPoint = getCircleCenterPoint(x, y, i, j)
          ctx.arc(circleCenterPoint.x, circleCenterPoint.y, CIRCLE_RADIUS, 0, 2 * Math.PI);
          ctx.closePath();
          ctx.fill();
        }
      }
    }
  }
  
  // 获得小球圆心的坐标
  function getCircleCenterPoint(startX, startY, row, column,) {
    return {
      x: startX + column * 2 * (CIRCLE_RADIUS + CIRCLE_GAP) + (CIRCLE_RADIUS + CIRCLE_GAP),
      y: startY + row * 2 * (CIRCLE_RADIUS + CIRCLE_GAP) + (CIRCLE_RADIUS + CIRCLE_GAP)
    }
  }

  // 获取一个随机颜色
  function randomColor() {
    let h = Math.floor(Math.random()*360); // 色度
    let s = Math.random() * 100 + '%';  // 饱和度
    let l = Math.random() * 100 + '%';  // 亮度
    // let a = Math.random();  // 透明度
    let a = 1;
    return `hsla(${h}, ${s}, ${l}, ${a})`;
  }
  return {
    run,
    clockRun
  }
})