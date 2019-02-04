export default class Vector3 extends Float32Array {
  public static create(): Vector3 {
    const out = new Float32Array(9);
    out[1], out[2], out[3], out[5], out[6], out[7] = 0;
    out[0], out[4], out[8] = 1;
    return new Vector3(out);
  }

  public static translation(x: number, y: number): Vector3 {
    return new Vector3(
      new Float32Array([
        1, 0, 0,
        0, 1, 0,
        x, y, 1,
      ])
    );
  }

  public static rotation(radian: number): Vector3 {
    var c = Math.cos(radian);
    var s = Math.sin(radian);
    return new Vector3(
      new Float32Array([
        c,-s, 0,
        s, c, 0,
        0, 0, 1,
      ])
    );
  }

  public static scaling(x: number, y: number): Vector3 {
    return new Vector3(
      new Float32Array([
        x, 0, 0,
        0, y, 0,
        0, 0, 1,
      ])
    );
  }

  public multiply(m3: Vector3): Vector3 {
    const out = new Float32Array(9);
    out[0] = this[0] * m3[0] + this[1] * m3[3] + this[2] * m3[6];
    out[1] = this[0] * m3[1] + this[1] * m3[4] + this[2] * m3[7];
    out[2] = this[0] * m3[2] + this[1] * m3[5] + this[2] * m3[8];
    out[3] = this[3] * m3[0] + this[4] * m3[3] + this[5] * m3[6];
    out[4] = this[3] * m3[1] + this[4] * m3[4] + this[5] * m3[7];
    out[5] = this[3] * m3[2] + this[4] * m3[5] + this[5] * m3[8];
    out[6] = this[6] * m3[0] + this[7] * m3[3] + this[8] * m3[6];
    out[7] = this[6] * m3[1] + this[7] * m3[4] + this[8] * m3[7];
    out[8] = this[6] * m3[2] + this[7] * m3[5] + this[8] * m3[8];

    return new Vector3(out);
  } 
}