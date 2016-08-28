
var flipBox = FlipBox({
    width: 320,
    height: 600,
    container: document.getElementById('container'),
    curContent: document.getElementById('current'),
    nextContent: document.getElementById('next'),
    onChange: function (nextBox) {
      nextBox.innerHTML = "<img src='images/img" + Math.ceil((Math.random() * 10 % 3)) + ".jpg' style='width: 100%' />";

      // 如果没有下一页，则返回false
      // return false;
    }
  });

  setTimeout(function () {
    flipBox.setNextContent("<img src='images/img" + Math.ceil((Math.random() * 10 % 3)) + ".jpg' style='width: 100%' /><img src='images/img" + Math.ceil((Math.random() * 10 % 3)) + ".jpg' style='width: 100%' /><img src='images/img" + Math.ceil((Math.random() * 10 % 3)) + ".jpg' style='width: 100%' /><h1>haha</h1><h1>haha</h1><h1>haha</h1><h1>haha</h1><h1>haha</h1><h1>haha</h1><h1>haha</h1><h1>haha</h1><h1>haha</h1><h1>haha</h1>", false);

    flipBox.next('up');
  }, 2000);
  