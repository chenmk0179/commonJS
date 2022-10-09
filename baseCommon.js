export default class BaseCommon {
  /** 格式化日期
   * @param time 13位毫秒数时间戳
   * @param pattern 默认返回的日期格式
   * @returns {string} 返回值是格式化的字符串日期
   */
  static parseTime(time, pattern) {
    if (arguments.length === 0 || !time) {
      return null;
    }
    const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}';
    let date;
    if (typeof time === 'object') {
      date = time;
    } else {
      if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
        time = parseInt(time);
      } else if (typeof time === 'string') {
        time = time.replace(new RegExp(/-/gm), '/');
      }
      if (typeof time === 'number' && time.toString().length === 10) {
        time = time * 1000;
      }
      date = new Date(time);
    }
    const formatObj = {
      y: date.getFullYear(),
      m: date.getMonth() + 1,
      d: date.getDate(),
      h: date.getHours(),
      i: date.getMinutes(),
      s: date.getSeconds(),
      a: date.getDay(),
    };
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
      let value = formatObj[key];
      // Note: getDay() returns 0 on Sunday
      if (key === 'a') {
        return ['日', '一', '二', '三', '四', '五', '六'][value];
      }
      if (result.length > 0 && value < 10) {
        value = '0' + value;
      }
      return value || 0;
    });
    return time_str;
  }

  /** 金额转化
   * @param n 数字
   * @returns {string} 返回值是汉字大写
   */
  static transMoney(n) {
    let fraction = ['角', '分'];
    let digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
    let unit = [
      ['元', '万', '亿'],
      ['', '拾', '佰', '仟'],
    ];
    let head = n < 0 ? '欠' : '';
    n = Math.abs(n);
    let s = '';
    for (let i = 0; i < fraction.length; i++) {
      s += (
        digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]
      ).replace(/零./, '');
    }
    s = s || '整';
    n = Math.floor(n);

    for (let i = 0; i < unit[0].length && n > 0; i++) {
      let p = '';
      for (let j = 0; j < unit[1].length && n > 0; j++) {
        p = digit[n % 10] + unit[1][j] + p;
        n = Math.floor(n / 10);
      }
      s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
    }
    return (
      head +
      s
        .replace(/(零.)*零元/, '元')
        .replace(/(零.)+/g, '零')
        .replace(/^整$/, '零元整')
    );
  }
  /** 排序
   * @param value
   * @param type up为升序，down为降序
   * @returns {Array} 返回值是格式化的数组
   */
  static arraySort(value, type) {
    if (type === 'up') {
      value.sort((a, b) => {
        return a - b;
      });
      return value;
    } else if (type === 'down') {
      value.sort((a, b) => {
        return b - a;
      });
      return value;
    } else {
      console.error('type类型错误');
      return false;
    }
  }

  /** 返回当前浏览器是什么类型的浏览器
   * @returns {string} 返回值为浏览器类型
   * Edge浏览器也使用chrome内核，故Edge上也会返回chrome
   */
  static userBrowser() {
    let browserName = navigator.userAgent.toLowerCase();
    let browserType = '';
    if (/msie/i.test(browserName) && !/opera/.test(browserName)) {
      browserType = 'IE';
    } else if (/firefox/i.test(browserName)) {
      browserType = 'Firefox';
    } else if (
      /chrome/i.test(browserName) &&
      /webkit/i.test(browserName) &&
      /mozilla/i.test(browserName)
    ) {
      browserType = 'Chrome';
    } else if (/opera/i.test(browserName)) {
      browserType = 'Opera';
    } else if (
      /webkit/i.test(browserName) &&
      !(
        /chrome/i.test(browserName) &&
        /webkit/i.test(browserName) &&
        /mozilla/i.test(browserName)
      )
    ) {
      browserType = 'Safari';
    } else {
      browserType = '未知浏览器';
    }
    return browserType;
  }

  /** 字符串大小写转换
   * @param str
   * @param type  firCaps:首字母大写;firLower:首字母小写;allCaps:全部大写;allLower:全部小写;
   * @returns {string} 返回值为浏览器类型
   * Edge浏览器也使用chrome内核，故Edge上也会返回chrome
   */
  static changeCase(str, type) {
    if (typeof str !== 'string' || str === '') return false;
    if (type === 'firCaps') {
      return str.replace(str[0], str[0].toUpperCase());
    } else if (type === 'firLower') {
      return str.replace(str[0], str[0].toLowerCase());
    } else if (type === 'allCaps') {
      return str.toUpperCase();
    } else if (type === 'allLower') {
      return str.toLowerCase();
    } else {
      return str;
    }
  }

  /** 设置，获取URL参数
   * @param url  URL地址
   * @returns {key:value} 返回值为对象
   * Edge浏览器也使用chrome内核，故Edge上也会返回chrome
   */
  static getUrlPrmt(url) {
    url = url ? url : window.location.href;
    let _pa = url.substring(url.indexOf('?') + 1),
      _arrS = _pa.split('&'),
      _rs = {};
    for (let i = 0, _len = _arrS.length; i < _len; i++) {
      let pos = _arrS[i].indexOf('=');
      if (pos == -1) {
        continue;
      }
      let name = _arrS[i].substring(0, pos),
        value = window.decodeURIComponent(_arrS[i].substring(pos + 1));
      _rs[name] = value;
    }
    return _rs;
  }

  /**
   * 节流
   * @param {*} func 执行函数
   * @param {*} delay 节流时间,毫秒
   */
  static throttle(func, delay) {
    let timer = null;
    return function () {
      if (!timer) {
        timer = setTimeout(() => {
          func.apply(this, arguments);
          // 或者直接 func()
          timer = null;
        }, delay);
      }
    };
  }

  /**
   * 防抖
   * @param {*} fn 执行函数
   * @param {*} wait 防抖时间,毫秒
   */
  static debounce(fn, wait) {
    let timeout = null;
    return function () {
      // 如果多次触发将上次记录延迟清除掉
      if (timeout !== null) clearTimeout(timeout);
      timeout = setTimeout(() => {
        fn.apply(this, arguments);
        // 或者直接 fn()
        timeout = null;
      }, wait);
    };
  }
}
