function animate(from: number, to: number, duration: number, update: (value: number) => void, easingFunction: (i: number) => number = easeOutQuint) {
  const start = Date.now();
  let elapsedTime = 0;
  
  const tick = () => {
    elapsedTime = Date.now() - start;
    update(from + (to - from) * easingFunction(Math.min(elapsedTime / duration, 1)));
    if (elapsedTime < duration) {
      setTimeout(tick, 0.5);
    }
  }
  tick();
}

function easeOutQuint(x: number): number {
  return 1 - Math.pow(1 - x, 5);
}

export { animate, easeOutQuint }