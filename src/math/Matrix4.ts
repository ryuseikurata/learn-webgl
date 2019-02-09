import Vector3, {
  cross,
  sub,
  normalize
} from './Vector3';

export default class Matrix4 extends Float32Array {
  public static identity(): Matrix4 {
    return new Matrix4(
      new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
      ])
    );
  }

  public static translation({t1, t2, t3}: {t1: number, t2: number, t3: number}): Matrix4 {
    return new Matrix4(
      new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        t1, t2, t3, 1,
      ])
    );
  }

  public static xRotation(radian: number): Matrix4 {
    var c = Math.cos(radian);
    var s = Math.sin(radian);
    return new Matrix4(
      new Float32Array([
        1, 0, 0, 0,
        0, c, s, 0,
        0, -s, c, 0,
        0, 0, 0, 1,
      ])
    );
  }

  public static yRotation(radian: number): Matrix4 {
    var c = Math.cos(radian);
    var s = Math.sin(radian);
    return new Matrix4(
      new Float32Array([
        c, 0, -s, 0,
        0, 1, 0, 0,
        s, 0, c, 0,
        0, 0, 0, 1,
      ])
    );
  }

  public static zRotation(radian: number): Matrix4 {
    var c = Math.cos(radian);
    var s = Math.sin(radian);
    return new Matrix4(
      new Float32Array([
        c, s, 0, 0,
        -s, c, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
      ])
    );
  }

  public static scaling({s1, s2, s3}: {s1: number, s2: number, s3: number}): Matrix4 {
    return new Matrix4(
      new Float32Array([
        s1, 0,  0,  0,
        0, s2,  0,  0,
        0,  0, s3,  0,
        0,  0,  0,  1,
      ])
    );
  }

  public static projection(width: number, height: number, depth: number): Matrix4 {
    return new Matrix4(
      new Float32Array([
        2 / width, 0, 0, 0,
        0, -2 / height, 0, 0,
        0, 0, 2 / depth, 0,
        -1, 1, 0, 1,
      ])
    );
  }

  public static orthographic(
    left: number,
    right: number,
    bottom: number,
    top: number,
    near: number,
    far: number
  ): Matrix4 {
    return new Matrix4(
      new Float32Array([
        2 / (right - left), 0, 0, 0,
        0, 2 / (top - bottom), 0, 0,
        0, 0, 2 / (near - far), 0,
        (left + right) / (left - right),
        (bottom + top) / (bottom - top),
        (near + far) / (near - far),
        1,
      ])
    );
  }

  public static makeZToWMatrix(fudgeFactor: number): Matrix4 {
    return new Matrix4(
      new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, fudgeFactor,
        0, 0, 0, 1,
      ])
    );
  }

  public static perspective(
    fieldOfViewInRadians: number, 
    aspect: number, 
    near: number, 
    far: number
  ): Matrix4 {
    const f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
    const rangeInv = 1.0 / (near - far);

    return new Matrix4(
      new Float32Array([
        f / aspect, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (near + far) * rangeInv, -1,
        0, 0, near * far * rangeInv * 2, 0
      ])
    );
  }

  public static adjoint(input: Matrix4): Matrix4 {
    const out = new Float32Array(16);
    // 余因子行列
    // ref: https://oguemon.com/study/linear-algebra/cofactor-expansion/
    // out[0] = 

    return new Matrix4(out);
  }

  public static lookAt(eye: Vector3, center: Vector3, up: Vector3) {
    const zAxis = normalize(sub(eye, center));
    const xAxis = normalize(cross(up, zAxis));
    const yAxis = normalize(cross(zAxis, xAxis));

    return new Matrix4(
      new Float32Array([
        xAxis[0], xAxis[1], xAxis[2], 0,
        yAxis[0], yAxis[1], yAxis[2], 0,
        zAxis[0], zAxis[1], zAxis[2], 0,
        eye[0], eye[1], eye[2], 1,
      ])
    );
  }

  public multiply(m4: Matrix4): Matrix4 {
    const out = new Float32Array(16);
    out[0] = m4[0] * this[0] + m4[1] * this[4] + m4[2] * this[8] + m4[3] * this[12];
    out[1] = m4[0] * this[1] + m4[1] * this[5] + m4[2] * this[9] + m4[3] * this[13];
    out[2] = m4[0] * this[2] + m4[1] * this[6] + m4[2] * this[10] + m4[3] * this[14];
    out[3] = m4[0] * this[3] + m4[1] * this[7] + m4[2] * this[11] + m4[3] * this[15];
    out[4] = m4[4] * this[0] + m4[5] * this[4] + m4[6] * this[8] + m4[7] * this[12];
    out[5] = m4[4] * this[1] + m4[5] * this[5] + m4[6] * this[9] + m4[7] * this[13];
    out[6] = m4[4] * this[2] + m4[5] * this[6] + m4[6] * this[10] + m4[7] * this[14];
    out[7] = m4[4] * this[3] + m4[5] * this[7] + m4[6] * this[11] + m4[7] * this[15];
    out[8] = m4[8] * this[0] + m4[9] * this[4] + m4[10] * this[8] + m4[11] * this[12];
    out[9] = m4[8] * this[1] + m4[9] * this[5] + m4[10] * this[9] + m4[11] * this[13];
    out[10] = m4[8] * this[2] + m4[9] * this[6] + m4[10] * this[10] + m4[11] * this[14];
    out[11] = m4[8] * this[3] + m4[9] * this[7] + m4[10] * this[11] + m4[11] * this[15];
    out[12] = m4[12] * this[0] + m4[13] * this[4] + m4[14] * this[8] + m4[15] * this[12];
    out[13] = m4[12] * this[1] + m4[13] * this[5] + m4[14] * this[9] + m4[15] * this[13];
    out[14] = m4[12] * this[2] + m4[13] * this[6] + m4[14] * this[10] + m4[15] * this[14];
    out[15] = m4[12] * this[3] + m4[13] * this[7] + m4[14] * this[11] + m4[15] * this[15];

    return new Matrix4(out);
  }

  public inverse(): Matrix4 {
    // 逆行列の計算
    // A^(-1) = 1/det(A) * adj(A)
    // det ... 行列式
    // adj ... 余因子行列
    // ref: https://risalc.info/src/inverse-cofactor-ex3.html
    const a00 = this[0], a01 = this[1], a02 = this[2], a03 = this[3];
    const a10 = this[4], a11 = this[5], a12 = this[6], a13 = this[7];
    const a20 = this[8], a21 = this[9], a22 = this[10], a23 = this[11];
    const a30 = this[12], a31 = this[13], a32 = this[14], a33 = this[15];

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

    return new Matrix4(out);
  }
}