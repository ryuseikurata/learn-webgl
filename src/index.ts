import Program from "./program";
import Matrix4 from "./math/Matrix4";

import fShader from "./shaders/frag";
import vShader from "./shaders/vert";

const main = async (): Promise<void> => {
  const width =  window.innerWidth;
  const height = window.innerHeight;

  let cameraAngle = 0;
  let yRad = 150;
  let translate = {t1: 0, t2: 70, t3: -200};
  let rotation = {r1: 0, r2: 150, r3: 180};
  let scale = {s1: 1, s2: 1, s3: 1};

  const s1 = buildSlider("s1", -360, 360, 0);
  document.body.append(s1);
  s1.oninput = (event: Event) => {
    const elem = <HTMLInputElement>event.srcElement;
    cameraAngle = elem.valueAsNumber;
    drawScene
  };

  const canvas = document.createElement("canvas") as HTMLCanvasElement;
  canvas.width = width;
  canvas.height = height;
  document.body.appendChild(canvas);

  const gl = canvas.getContext("webgl")!;

  const program = new Program(gl, {
    fShaderSource: fShader,
    vShaderSource: vShader
  });

  const positionLocation = gl.getAttribLocation(program.glProgram, "a_position");
  const colorLocation = gl.getAttribLocation(program.glProgram, "a_color");
  const matrixLocation = gl.getUniformLocation(program.glProgram, "u_matrix");

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  setGeometry(gl);

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  setColors(gl);

  let oldTime = 0;

  const drawScene = (time: number) => {
    const deltaTime = time - oldTime;
    oldTime = time;

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.enable(gl.CULL_FACE);

    gl.enable(gl.DEPTH_TEST);

    gl.useProgram(program.glProgram);
  
    // 座標設定

    gl.enableVertexAttribArray(positionLocation);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    var size = 3;
    var type = gl.FLOAT;
    var normalize = false;
    var stride = 0;
    var offset = 0;
    gl.vertexAttribPointer(
      positionLocation, size, type, normalize, stride, offset
    );

    // 色設定

    gl.enableVertexAttribArray(colorLocation);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

    var size = 3;
    var type = gl.UNSIGNED_BYTE;
    var normalize = true;
    var stride = 0;
    var offset = 0;
    gl.vertexAttribPointer(
      colorLocation, size, type, normalize, stride, offset
    );

    // 座標変換

    const fieldOfViewRadians = degToRad(60);
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 1;
    const zFar = 2000;
    const perspective = Matrix4.perspective(fieldOfViewRadians, aspect, zNear, zFar);
    
    yRad += 100 * deltaTime * 0.001;
    rotation.r2 = yRad;    

    const cameraMatrix = Matrix4.yRotation(degToRad(cameraAngle))
      .multiply(Matrix4.translation({t1: 0, t2: 0, t3: 300}));  
      
    const cameraPosition = new Float32Array([
      cameraMatrix[12],
      cameraMatrix[13],
      cameraMatrix[14],
    ]);
    const up = new Float32Array([0, 1, 0]);
    const center = new Float32Array([0, 0, 0]);

    const viewMatrix = cameraMatrix
      .multiply(Matrix4.lookAt(cameraPosition, center, up))
      .inverse();
    const viewProjectionMatrix = perspective.multiply(viewMatrix)

    const objectCount = 5;
    for(var i = 0; i < objectCount; ++i) {
      const angle = i * Math.PI * 2 / objectCount;
      translate.t1 = Math.cos(angle) * 200;
      translate.t3 = Math.sin(angle) * 200;

      const matrix = viewProjectionMatrix
        .multiply(Matrix4.translation(translate))
        .multiply(Matrix4.xRotation(degToRad(rotation.r1)))
        .multiply(Matrix4.yRotation(degToRad(rotation.r2)))
        .multiply(Matrix4.zRotation(degToRad(rotation.r3)))
        .multiply(Matrix4.scaling(scale))

      gl.uniformMatrix4fv(matrixLocation, false, matrix);
  
      var primitiveType = gl.TRIANGLES;
      var offset = 0;
      var count = 16 * 6;
      gl.drawArrays(primitiveType, offset, count);
    }

    requestAnimationFrame(drawScene);
  }

  requestAnimationFrame(drawScene);
};

const degToRad = (d: number) => {
  return d * Math.PI / 180;
}

const buildSlider = (id: string, min: number, max: number, value: number = 0): HTMLInputElement => {
  const element = document.createElement("input") as HTMLInputElement;
  element.type = "range";
  element.min = `${min}`;
  element.max = `${max}`;
  element.value = `${value}`;
  element.id = id;

  return element;
}

const setGeometry = (gl: WebGLRenderingContext) => {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      // left column front
      0,   0,  0,
      0, 150,  0,
      30,   0,  0,
      0, 150,  0,
      30, 150,  0,
      30,   0,  0,

      // top rung front
      30,   0,  0,
      30,  30,  0,
      100,   0,  0,
      30,  30,  0,
      100,  30,  0,
      100,   0,  0,

      // middle rung front
      30,  60,  0,
      30,  90,  0,
      67,  60,  0,
      30,  90,  0,
      67,  90,  0,
      67,  60,  0,

      // left column back
        0,   0,  30,
       30,   0,  30,
        0, 150,  30,
        0, 150,  30,
       30,   0,  30,
       30, 150,  30,

      // top rung back
       30,   0,  30,
      100,   0,  30,
       30,  30,  30,
       30,  30,  30,
      100,   0,  30,
      100,  30,  30,

      // middle rung back
       30,  60,  30,
       67,  60,  30,
       30,  90,  30,
       30,  90,  30,
       67,  60,  30,
       67,  90,  30,

      // top
        0,   0,   0,
      100,   0,   0,
      100,   0,  30,
        0,   0,   0,
      100,   0,  30,
        0,   0,  30,

      // top rung right
      100,   0,   0,
      100,  30,   0,
      100,  30,  30,
      100,   0,   0,
      100,  30,  30,
      100,   0,  30,

      // under top rung
      30,   30,   0,
      30,   30,  30,
      100,  30,  30,
      30,   30,   0,
      100,  30,  30,
      100,  30,   0,

      // between top rung and middle
      30,   30,   0,
      30,   60,  30,
      30,   30,  30,
      30,   30,   0,
      30,   60,   0,
      30,   60,  30,

      // top of middle rung
      30,   60,   0,
      67,   60,  30,
      30,   60,  30,
      30,   60,   0,
      67,   60,   0,
      67,   60,  30,

      // right of middle rung
      67,   60,   0,
      67,   90,  30,
      67,   60,  30,
      67,   60,   0,
      67,   90,   0,
      67,   90,  30,

      // bottom of middle rung.
      30,   90,   0,
      30,   90,  30,
      67,   90,  30,
      30,   90,   0,
      67,   90,  30,
      67,   90,   0,

      // right of bottom
      30,   90,   0,
      30,  150,  30,
      30,   90,  30,
      30,   90,   0,
      30,  150,   0,
      30,  150,  30,

      // bottom
      0,   150,   0,
      0,   150,  30,
      30,  150,  30,
      0,   150,   0,
      30,  150,  30,
      30,  150,   0,

      // left side
      0,   0,   0,
      0,   0,  30,
      0, 150,  30,
      0,   0,   0,
      0, 150,  30,
      0, 150,   0
    ]),
    gl.STATIC_DRAW);
};

const setColors = (gl: WebGLRenderingContext) => {
  gl.bufferData(
      gl.ARRAY_BUFFER,
      new Uint8Array([
          // left column front
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,

          // top rung front
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,

          // middle rung front
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,

          // left column back
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,

          // top rung back
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,

          // middle rung back
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,

          // top
        70, 200, 210,
        70, 200, 210,
        70, 200, 210,
        70, 200, 210,
        70, 200, 210,
        70, 200, 210,

          // top rung right
        200, 200, 70,
        200, 200, 70,
        200, 200, 70,
        200, 200, 70,
        200, 200, 70,
        200, 200, 70,

          // under top rung
        210, 100, 70,
        210, 100, 70,
        210, 100, 70,
        210, 100, 70,
        210, 100, 70,
        210, 100, 70,

          // between top rung and middle
        210, 160, 70,
        210, 160, 70,
        210, 160, 70,
        210, 160, 70,
        210, 160, 70,
        210, 160, 70,

          // top of middle rung
        70, 180, 210,
        70, 180, 210,
        70, 180, 210,
        70, 180, 210,
        70, 180, 210,
        70, 180, 210,

          // right of middle rung
        100, 70, 210,
        100, 70, 210,
        100, 70, 210,
        100, 70, 210,
        100, 70, 210,
        100, 70, 210,

          // bottom of middle rung.
        76, 210, 100,
        76, 210, 100,
        76, 210, 100,
        76, 210, 100,
        76, 210, 100,
        76, 210, 100,

          // right of bottom
        140, 210, 80,
        140, 210, 80,
        140, 210, 80,
        140, 210, 80,
        140, 210, 80,
        140, 210, 80,

          // bottom
        90, 130, 110,
        90, 130, 110,
        90, 130, 110,
        90, 130, 110,
        90, 130, 110,
        90, 130, 110,

          // left side
        160, 160, 220,
        160, 160, 220,
        160, 160, 220,
        160, 160, 220,
        160, 160, 220,
        160, 160, 220]),
      gl.STATIC_DRAW);
}

window.addEventListener("load", main);
