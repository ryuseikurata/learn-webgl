export type IVector3 = Float32Array;

const cross = (v1: IVector3, v2: IVector3): IVector3 => {
  return new Float32Array([
    v1[1] * v2[2] - v1[2] * v2[1],
    v1[2] * v2[0] - v1[0] * v2[2],
    v1[0] * v2[1] - v1[1] * v2[0]
  ]);
}

const sub = (v1: IVector3, v2: IVector3): IVector3 => {
  return new Float32Array([
    v1[0] - v2[0],
    v1[1] - v2[1],
    v1[2] - v2[2],
  ]);
}

const normalize = (v: IVector3) => {
  const length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  return length > 0.00001 ? new Float32Array([
    v[0]/length,
    v[1]/length,
    v[2]/length
  ]) : new Float32Array([0, 0, 0]);
}

const Vector3 ={
  cross,
  sub,
  normalize,
};

export default Vector3;