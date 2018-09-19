(() => {
  kontra.init("canvas");

  const c = kontra.canvas;
  const ctx = kontra.context;
  const ratio = window.devicePixelRatio;
  const cWidth = 256;
  const cHeight = 256;

  c.width = cWidth * ratio;
  c.height = cHeight * ratio;
  c.style.width = `${cWidth}px`;
  c.style.height = `${cHeight}px`;
  ctx.scale(ratio, ratio);

  const ball = kontra.sprite({
    x: 20,
    y: 0,
    color: 'red',
    width: 20,
    height: 20,
    dx: 2,
    dy: 3
  });

  const racketHeight = 60;
  const racketWidth = 5;
  const racketColor = '#fff';
  const racketSpeed = 5;

  const racketLeft = kontra.sprite({
    x: 0,
    y: 0,
    color: racketColor,
    width: racketWidth,
    height: racketHeight
  });

  const racketRight = kontra.sprite({
    x: cWidth - racketWidth,
    y: cHeight - racketHeight,
    color: racketColor,
    width: racketWidth,
    height: racketHeight
  });

  const Message = () => {
    let text;

    return {
      text(str) {
        text = str;
      },

      render() {
        if (text) {
          ctx.fillStyle = 'white';
          ctx.font = '20px sans-serif';
          ctx.fillText(text, 50, 50);
        }
      }
    };
  };

  const message = Message();

  const loop = kontra.gameLoop({
    update() {

      // rackets

      if (kontra.keys.pressed('up')) {
        racketRight.dy = -racketSpeed;
      } else if (kontra.keys.pressed('down')) {
        racketRight.dy = racketSpeed;
      } else {
        racketRight.dy = 0;
      }

      if (kontra.keys.pressed('w')) {
        racketLeft.dy = -racketSpeed;
      } else if (kontra.keys.pressed('s')) {
        racketLeft.dy = racketSpeed;
      } else {
        racketLeft.dy = 0;
      }

      if (racketRight.y < 0) {
        racketRight.y = 0;
      }
      if (racketRight.y + racketHeight > cHeight) {
        racketRight.y = cHeight - racketHeight;
      }

      if (racketLeft.y < 0) {
        racketLeft.y = 0;
      }
      if (racketLeft.y + racketHeight > cHeight) {
        racketLeft.y = cHeight - racketHeight;
      }

      racketLeft.update();
      racketRight.update();

      // ball

      if (ball.collidesWith(racketRight)) {
        ball.dy += racketRight.dy/5;
        ball.dx = -ball.dx;
      } else if (ball.collidesWith(racketLeft)) {
        ball.dy += racketLeft.dy/5;
        ball.dx = -ball.dx;
      }

      if (ball.y + ball.height > cHeight || ball.y < 0) {
        ball.dy = -ball.dy;
      }

      message.text(`dx:${ball.dx},dy:${ball.dy}`);

      if (ball.x > cWidth) {
        loop.stop();
        message.text('Left player wins!')
      }

      if (ball.x < -ball.width) {
        loop.stop();
        message.text('Right player wins!')
      }

      ball.update();

    },

    render() {
      message.render();
      ball.render();
      racketLeft.render();
      racketRight.render();
    }
  });

  loop.start();

})();

