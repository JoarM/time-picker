function calculateAngle(length: number, height: number) {
  return Math.atan2(height, length) * 57.2957795 < 0 ? Math.atan2(height, length) * 57.2957795 + 360 : Math.atan2(height, length) * 57.2957795;
}

function pythagoras(a: number, b: number) {
  return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
}

function toAlwaysPosetive(i: number) {
  return Math.sqrt(Math.pow(i, 2));
}

export { calculateAngle, pythagoras, toAlwaysPosetive }