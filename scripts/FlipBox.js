
/**
 * 翻页组件，
 * 没有上下页记忆功能，翻页需要设置下一页显示的内容，不管上翻页还是下翻页，都是下一页
 * 
 * @param {any} container
 * @param {any} options {
 *  width {Number} 容器宽度,
 *  height {Number} 容器高度,
 *  container {Html Element} 容器element,
 *  curContent {Html Element} 当前页内容，是一个element,
 *  nextContent {Html Element} 下一页内容，是一个element,
 *  onChange {function} 当翻页后触发，参数是下一个容器element，需要在这里设置下一页的内容；当这个方法返回false时，表示没有下一页，下一页的按钮将不会出现
 * }
 * 
 * @returns {
 *  next: (type : string) => void 传递一个翻页类型[up|down]，手动触发翻页
 *  setNextContent: (content : string, isFilter : boolean) => void 手动设置下一页内容
 *  setHasNext: (bool : boolean) => void 设置是否还有下一页
 * }
 */
function FlipBox (options) {
  var totalHeight, 
      halfHeight,
      scrollTop,
      scrollHeight,
      curScrollHeight,
      nextScrollHeight;

  var div = document.createElement('div');

  // 当前页和下一页
  var curDom = options.curContent,
      nextDom = options.nextContent,
      container = options.container;

  // 上一页下一页按钮
  var upBtn = div.cloneNode(),
      downBtn = div.cloneNode();

  // 四个半个的div
  var topFront = div.cloneNode(),
      topBack = div.cloneNode(),
      bottomFront = div.cloneNode(),
      bottomBack = div.cloneNode(),
      topDom = div.cloneNode(),
      bottomDom = div.cloneNode(),
      innerTopFront = div.cloneNode(),
      innerTopBack = div.cloneNode(),
      innerBottomFront = div.cloneNode(),
      innerBottomBack = div.cloneNode();
  
  var hasNext = true,
      isFirst = true;

  ;(function __init () {
    scrollTop = curDom.scrollTop;
    scrollHeight = curDom.scrollHeight;

    // __toggleBtn();

    // 滚动同步
    curDom.addEventListener('scroll', function (evt) {
      scrollTop = curDom.scrollTop;
      scrollHeight = curDom.scrollHeight;

      topFront.scrollTop = scrollTop;
      bottomFront.scrollTop = bottomFront.scrollTop + scrollTop;

      __toggleBtn();
    });

    upBtn.addEventListener('click', function (evt) {
      actionUp();
    });

    downBtn.addEventListener('click', function (evt) {
      actionDown();
    });

    innerTopFront.innerHTML = curDom.innerHTML;
    innerTopBack.innerHTML = nextDom.innerHTML;
    innerBottomFront.innerHTML = curDom.innerHTML;
    innerBottomBack.innerHTML = nextDom.innerHTML;

    setTimeout(function () {
      curScrollHeight = curDom.scrollHeight;
      nextScrollHeight = nextDom.scrollHeight;

      innerTopFront.style.height = curScrollHeight + 'px';
      innerTopBack.style.height = nextScrollHeight + 'px';
      innerBottomFront.style.height = curScrollHeight + 'px';
      innerBottomBack.style.height = nextScrollHeight + 'px';

      topBack.scrollTop = options.height / 2;
      bottomFront.scrollTop = options.height / 2;
    }, 1000);

    // 添加容器class
    container.classList.add('flip-box');
    container.style.width = options.width + 'px';
    container.style.height = options.height + 'px';

    // 添加两个按钮class
    upBtn.classList.add('flip-btn-up');
    downBtn.classList.add('flip-btn-down');

    // 添加对应的class到四个小块div
    topFront.classList.add('sub-layer-front');
    topBack.classList.add('sub-layer-back');
    bottomFront.classList.add('sub-layer-front');
    bottomBack.classList.add('sub-layer-back');

    // 添加class到上下两个半块的容器div
    topDom.classList.add('flip-layer-top');
    bottomDom.classList.add('flip-layer-bottom');

    container.appendChild(upBtn);

    topFront.appendChild(innerTopFront);
    bottomFront.appendChild(innerBottomFront);
    topBack.appendChild(innerTopBack);
    bottomBack.appendChild(innerBottomBack);

    container.appendChild(curDom);
    topDom.appendChild(topFront);
    topDom.appendChild(topBack);
    container.appendChild(topDom);
    bottomDom.appendChild(bottomFront);
    bottomDom.appendChild(bottomBack);
    container.appendChild(bottomDom);
    container.appendChild(nextDom);

    container.appendChild(downBtn);
  })();

  /**
   * 修改按钮显示隐藏
   */
  function __toggleBtn () {
    if (scrollHeight === options.height) {
      downBtn.classList.remove('hide');
      upBtn.classList.remove('hide');
    }else if (scrollTop < 10) {
      downBtn.classList.remove('hide');
      upBtn.classList.add('hide');
    }else if (scrollTop > scrollHeight - options.height - 10) {
      upBtn.classList.remove('hide');
      downBtn.classList.add('hide')
    }else {
      downBtn.classList.add('hide');
      upBtn.classList.add('hide');
    }

    if (hasNext === false) {
      upBtn.classList.add('hide');
    }

    if (isFirst === true) {
      downBtn.classList.add('hide');
    }
  }

  /**
   * 开始翻页
   */
  function actionDown () {
    curDom.classList.add('hide');
    topDom.classList.add('active');
    var deg = 0;

    var anim = setInterval(function () {
      if (deg <= -180) {
        reset();
        clearInterval(anim);
        return;
      }
      topDom.style.transform = 'rotateX(' + (deg-=30) + 'deg)';
    }, 100);
  }
  function actionUp () {
    curDom.classList.add('hide');
    bottomDom.classList.add('active');
    var deg = 0;

    var anim = setInterval(function () {
      if (deg >= 180) {
        reset();
        clearInterval(anim);
        return;
      }
      bottomDom.style.transform = 'rotateX(' + (deg+=30) + 'deg)';
    }, 100);
  }

  /**
   * 重置UI
   */
  function reset () {
    isFirst = false;
    topDom.style.transform = 'rotateX(0deg)';
    bottomDom.style.transform = 'rotateX(0deg)';
    curDom.innerHTML = nextDom.innerHTML;

    options.onChange && (hasNext = options.onChange(nextDom));

    innerTopFront.innerHTML = curDom.innerHTML;
    innerTopBack.innerHTML = nextDom.innerHTML;
    innerBottomFront.innerHTML = curDom.innerHTML;
    innerBottomBack.innerHTML = nextDom.innerHTML;

    curDom.classList.remove('hide');
    topDom.classList.remove('active');
    bottomDom.classList.remove('active');

    scrollHeight = curDom.scrollHeight;
    __toggleBtn();
  }

  /**
   * html字符串过滤，<,>,&,"转换成对应的编码
   * 
   * @param {string} data 待转换内容
   * @returns {string} 转换后内容
   */
  function __filter (data) {
    return data.replace(/<|>|&|"/g, function (item) {
      switch (item) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '"': return '&quot;';
      }
    });
  }

  return {
    /**
     * 设置下一页内容，内容可以是文字，可以是html标签
     * 
     * @param {string} content 设置内容
     * @param {boolean} isFilter 是否转译html标签成普通文本
     */
    setNextContent: function (content, isFilter) {
      isFilter = typeof isFilter === 'boolean' ? isFilter : false;

      nextDom.innerHTML = isFilter ? __filter(content) : content;

      innerTopFront.innerHTML = curDom.innerHTML;
      innerTopBack.innerHTML = nextDom.innerHTML;
      innerBottomFront.innerHTML = curDom.innerHTML;
      innerBottomBack.innerHTML = nextDom.innerHTML;
    },

    /**
     * 翻页
     * 
     * @param {string} type ['up'|'down']
     */
    next: function (type) {
      if (type === 'up') {
        actionUp();
      }else if (type === 'down') {
        actionDown();
      }
    },

    /**
     * 设置是否还有下一页
     * 
     * @param {boolean} bool [true|false]
     */
    setHasNext(bool) {
      hasNext = bool;
    },

    /**
     * 设置是否是第一页
     * 
     * @param {boolean} bool [true|false]
     */
    isFirst(bool) {
      isFirst = bool;

      __toggleBtn();
    }
  };
}
