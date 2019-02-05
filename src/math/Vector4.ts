export default class Vector4 extends Float32Array {
  public static identity(): Vector4 {
    return new Vector4(
      new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
      ])
    );
  }

  public static translation(x: number, y: number, z: number): Vector4 {
    return new Vector4(
      new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        x, y, z, 1,
      ])
    );
  }

  public static xRotation(radian: number): Vector4 {
    var c = Math.cos(radian);
    var s = Math.sin(radian);
    return new Vector4(
      new Float32Array([
        1, 0, 0, 0,
        0, c, s, 0,
        0, -s, c, 0,
        0, 0, 0, 1,
      ])
    );
  }

  public static yRotation(radian: number): Vector4 {
    var c = Math.cos(radian);
    var s = Math.sin(radian);
    return new Vector4(
      new Float32Array([
        c, 0, -s, 0,
        0, 1, 0, 0,
        s, 0, c, 0,
        0, 0, 0, 1,
      ])
    );
  }

  public static zRotation(radian: number): Vector4 {
    var c = Math.cos(radian);
    var s = Math.sin(radian);
    return new Vector4(
      new Float32Array([
        c, s, 0, 0,
        -s, c, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
      ])
    );
  }

  public static scaling(x: number, y: number, z: number): Vector4 {
    return new Vector4(
      new Float32Array([
        x, 0,  0,  0,
        0, y,  0,  0,
        0,  0, z,  0,
        0,  0,  0,  1,
      ])
    );
  }

  public static projection(width: number, height: number, depth: number): Vector4 {
    return new Vector4(
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
  ): Vector4 {
    return new Vector4(
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

  public multiply(m4: Vector4): Vector4 {
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

    return new Vector4(out);
  } 
}