type Vector3 = Float32Array;

const cross = (v1: Vector3, v2: Vector3): Vector3 => {
  return new Float32Array([
    v1[1] * v2[2] - v1[2] * v2[1],
    v1[2] * v2[0] - v1[0] * v2[2],
    v1[0] * v2[1] - v1[1] * v2[0]
  ]);
}

const sub = (v1: Vector3, v2: Vector3): Vector3 => {
  return new Float32Array([
    v1[0] - v2[0],
    v1[1] - v2[1],
    v1[2] - v2[2],
  ]);
}

const normalize = (v: Vector3) => {
  const length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  return length > 0.00001 ? new Float32Array([
    v[0]/length,
    v[1]/length,
    v[2]/length
  ]) : new Float32Array([0, 0, 0]);
}

export default Vector3;
export {
  cross,
  sub,
  normalize,
};