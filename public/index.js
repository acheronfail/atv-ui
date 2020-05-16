async function send(param, count = 1) {
  for (let i = 0; i < count; ++i) {
    await fetch(`/atv/${param}`);
  }
}

async function sendCustom() {
  const input = document.querySelector('#input');
  send(input.value);
  input.value = '';
}

window.onload = function () {
  function getDirection(direction) {
    switch (direction) {
      case Hammer.DIRECTION_LEFT:
        return 'Left';
      case Hammer.DIRECTION_RIGHT:
        return 'Right';
      case Hammer.DIRECTION_UP:
        return 'Up';
      case Hammer.DIRECTION_DOWN:
        return 'Down';
    }
  }

  function isVertical(direction) {
    switch (direction) {
      case Hammer.DIRECTION_LEFT:
      case Hammer.DIRECTION_RIGHT:
        return false;
      case Hammer.DIRECTION_UP:
      case Hammer.DIRECTION_DOWN:
        return true;
    }
  }

  // Control button.
  document
    .querySelector('#bottom-button-row')
    .addEventListener('click', (event) => {
      document.querySelector('#controls').classList.toggle('hidden');
    });

  // The Home.
  const homeArea = document.querySelector('#home');
  const hammerHome = new Hammer(homeArea);
  hammerHome.on('tap', async (event) => {
    await send('Home');
  });

  // The Menu.
  const menuArea = document.querySelector('#menu');
  const hammerMenu = new Hammer(menuArea);
  hammerMenu.on('tap', async (event) => {
    await send('Menu');
  });

  // The D-Pad.
  const dpadArea = document.querySelector('#dpad');
  const hammerDpad = new Hammer(dpadArea);
  hammerDpad.get('pan').set({ direction: Hammer.DIRECTION_ALL });

  const { width, height } = dpadArea.getBoundingClientRect();
  const panState = {
    xThreshold: width / 6,
    xEventsSent: 0,
    yThreshold: height / 6,
    yEventsSent: 0,
  };

  hammerDpad.on('tap', async (event) => {
    await send('Select');
  });

  hammerDpad.on('panend', async (event) => {
    numberPanEventsSent = 0;

    const momentumEvents = Math.floor(Math.abs(event.velocity));
    console.log(`pan: momentum ${momentumEvents}`);
    for (let i = 0; i < momentumEvents; ++i) {
      await send(getDirection(event.direction));
    }
  });

  hammerDpad.on('pan', async (event) => {
    const distance = Math.abs(event.distance);
    const direction = getDirection(event.direction);

    // Keep track of the last time we sent an event.
    if (
      (isVertical(event.direction) &&
        distance < panState.yEventsSent * panState.yThreshold) ||
      distance < panState.xEventsSent * panState.xThreshold
    ) {
      console.log('pan: already fired');
      return;
    }

    // We're sending another event.
    numberPanEventsSent++;
    await send(direction);
  });
};
