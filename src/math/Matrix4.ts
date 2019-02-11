import Vector3, { IVector3 } from './vector3';

export type IMatrix4 = Float32Array;

const identity = (): IMatrix4 => {
  return new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ]);
}

const translation = (vec: IVector3): IMatrix4 => {
  return new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    vec[0], vec[1], vec[2], 1,
  ]);
}

const xRotation = (radian: number): IMatrix4 => {
  const c = Math.cos(radian);
  const s = Math.sin(radian);
  return new Float32Array([
    1, 0, 0, 0,
    0, c, s, 0,
    0, -s, c, 0,
    0, 0, 0, 1,
  ]);
}

const yRotation = (radian: number): IMatrix4 => {
  const c = Math.cos(radian);
  const s = Math.sin(radian);
  return new Float32Array([
    c, 0, -s, 0,
    0, 1, 0, 0,
    s, 0, c, 0,
    0, 0, 0, 1,
  ]);
}

const zRotation = (radian: number): IMatrix4 => {
  const c = Math.cos(radian);
  const s = Math.sin(radian);
  return new Float32Array([
    c, s, 0, 0,
    -s, c, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ])
}

const scale = (vec: IVector3): IMatrix4 => {
  return new Float32Array([
    vec[0], 0,  0,  0,
    0, vec[1],  0,  0,
    0,  0, vec[2],  0,
    0,  0,  0,  1,
  ])
}

const orthographic = (
  left: number, right: number, bottom: number, top: number, near: number, far: number
): IMatrix4 => {
  return new Float32Array([
    2 / (right - left), 0, 0, 0,
    0, 2 / (top - bottom), 0, 0,
    0, 0, 2 / (near - far), 0,
    (left + right) / (left - right),
    (bottom + top) / (bottom - top),
    (near + far) / (near - far),
    1,
  ]);
}

const perspective = (
  fovy: number, aspect: number, near: number, far: number
): IMatrix4 => {
  const f = 1.0 / Math.tan(fovy / 2);
  const nf = 1 / (near - far);
  return new Float32Array([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (near + far) * nf, -1,
    0, 0, near * far * nf * 2, 0
  ]);
}

const lookAt = (
  eye: IVector3, center: IVector3, up: IVector3
): IMatrix4 => {
  const zAxis = Vector3.normalize(Vector3.sub(eye, center));
  const xAxis = Vector3.normalize(Vector3.cross(up, zAxis));
  const yAxis = Vector3.normalize(Vector3.cross(zAxis, xAxis));

  return new Float32Array([
    xAxis[0], xAxis[1], xAxis[2], 0,
    yAxis[0], yAxis[1], yAxis[2], 0,
    zAxis[0], zAxis[1], zAxis[2], 0,
    eye[0], eye[1], eye[2], 1,
  ]);
}

const multiply = (subject: IMatrix4, target: IMatrix4): IMatrix4 => {
  const out = new Float32Array(16);
  out[0] = target[0] * subject[0] + target[1] * subject[4] + target[2] * subject[8] + target[3] * subject[12];
  out[1] = target[0] * subject[1] + target[1] * subject[5] + target[2] * subject[9] + target[3] * subject[13];
  out[2] = target[0] * subject[2] + target[1] * subject[6] + target[2] * subject[10] + target[3] * subject[14];
  out[3] = target[0] * subject[3] + target[1] * subject[7] + target[2] * subject[11] + target[3] * subject[15];
  out[4] = target[4] * subject[0] + target[5] * subject[4] + target[6] * subject[8] + target[7] * subject[12];
  out[5] = target[4] * subject[1] + target[5] * subject[5] + target[6] * subject[9] + target[7] * subject[13];
  out[6] = target[4] * subject[2] + target[5] * subject[6] + target[6] * subject[10] + target[7] * subject[14];
  out[7] = target[4] * subject[3] + target[5] * subject[7] + target[6] * subject[11] + target[7] * subject[15];
  out[8] = target[8] * subject[0] + target[9] * subject[4] + target[10] * subject[8] + target[11] * subject[12];
  out[9] = target[8] * subject[1] + target[9] * subject[5] + target[10] * subject[9] + target[11] * subject[13];
  out[10] = target[8] * subject[2] + target[9] * subject[6] + target[10] * subject[10] + target[11] * subject[14];
  out[11] = target[8] * subject[3] + target[9] * subject[7] + target[10] * subject[11] + target[11] * subject[15];
  out[12] = target[12] * subject[0] + target[13] * subject[4] + target[14] * subject[8] + target[15] * subject[12];
  out[13] = target[12] * subject[1] + target[13] * subject[5] + target[14] * subject[9] + target[15] * subject[13];
  out[14] = target[12] * subject[2] + target[13] * subject[6] + target[14] * subject[10] + target[15] * subject[14];
  out[15] = target[12] * subject[3] + target[13] * subject[7] + target[14] * subject[11] + target[15] * subject[15];

  return out;
}

const inverse = (subject: IMatrix4): IMatrix4 => {
  // 逆行列の計算
  // A^(-1) = 1/det(A) * adj(A)
  // det ... 行列式
  // adj ... 余因子行列
  // ref: https://risalc.info/src/inverse-cofactor-ex3.html

  const a00 = subject[0], a01 = subject[1], a02 = subject[2], a03 = subject[3];
  const a10 = subject[4], a11 = subject[5], a12 = subject[6], a13 = subject[7];
  const a20 = subject[8], a21 = subject[9], a22 = subject[10], a23 = subject[11];
  const a30 = subject[12], a31 = subject[13], a32 = subject[14], a33 = subject[15];

  const b00 = a00 * a11 - a01 * a10;
  const b01 = a00 * a12 - a02 * a10;
  const b02 = a00 * a13 - a03 * a10;
  const b03 = a01 * a12 - a02 * a11;
  const b04 = a01 * a13 - a03 * a11;
  const b05 = a02 * a13 - a03 * a12;
  const b06 = a20 * a31 - a21 * a30;
  const b07 = a20 * a32 - a22 * a30;
  const b08 = a20 * a33 - a23 * a30;
  const b09 = a21 * a32 - a22 * a31;
  const b10 = a21 * a33 - a23 * a31;
  const b11 = a22 * a33 - a23 * a32;

  let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

  det = 1.0 / det;

  const out = new Float32Array(16);
  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
  out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
  out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
  out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
  out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
  out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
  out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

  return out;
}

const Matrix4 = {
  identity,
  translation,
  xRotation,
  yRotation,
  zRotation,
  scale,
  orthographic,
  perspective,
  lookAt,
  multiply,
  inverse,
}

export default Matrix4;