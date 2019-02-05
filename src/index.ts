import Program from "./program";
import Vector4 from "./math/Vector4";

import fShader from "./shaders/frag";
import vShader from "./shaders/vert";

const main = async (): Promise<void> => {
  const width = 400;
  const height = 300;
  const canvas = document.createElement("canvas") as HTMLCanvasElement;
  canvas.width = width;
  canvas.height = height;
  document.body.appendChild(canvas);

  const gl = canvas.getContext("webgl")!;
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  const program = new Program(gl, {
    fShaderSource: fShader,
    vShaderSource: vShader
  });

  const positionAttributeLocation = gl.getAttribLocation(program.glProgram, "a_position");
  const colorUniformLocation = gl.getUniformLocation(program.glProgram, "u_color");
  const matrixLocation = gl.getUniformLocation(program.glProgram, "u_matrix");

  const positionBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clearColor(0, 0, 0, 3);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program.glProgram);

  gl.enableVertexAttribArray(positionAttributeLocation);

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  var size = 3;
  var type = gl.FLOAT;
  var normalize = false;
  var stride = 0;
  var offset = 0;
  gl.vertexAttribPointer(
    positionAttributeLocation,
    size,
    type,
    normalize,
    stride,
    offset
  );

  const color = [Math.random(), Math.random(), Math.random(), 1];
  gl.uniform4fv(colorUniformLocation, color);

  setGeometry(gl);

  const projection = Vector4.projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 400)
  const translate = Vector4.translation(150, 100, 100);
  const rotationX = Vector4.xRotation((50 * Math.PI) / 180);
  const rotationY = Vector4.yRotation((20 * Math.PI) / 180);
  const rotationZ = Vector4.zRotation((60 * Math.PI) / 180);
  const scale = Vector4.scaling(0.9, 1, 0.8);
  
  const matrix = Vector4.identity()
    .multiply(projection)
    .multiply(translate)
    .multiply(rotationX)
    .multiply(rotationY)
    .multiply(rotationZ)
    .multiply(scale)
  
  gl.uniformMatrix4fv(matrixLocation, false, matrix);    

  // draw
  var primitiveType = gl.TRIANGLES;
  var offset = 0;
  var count = 18;
  gl.drawArrays(primitiveType, offset, count);

};

const setGeometry = (gl: WebGLRenderingContext) => {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      // 左縦列
      0,   0,  0,
      30,   0,  0,
       0, 150,  0,
       0, 150,  0,
      30,   0,  0,
      30, 150,  0,

      // 上の横棒
      30,   0,  0,
     100,   0,  0,
      30,  30,  0,
      30,  30,  0,
     100,   0,  0,
     100,  30,  0,

      // 下の横棒
      30,  60,  0,
      67,  60,  0,
      30,  90,  0,
      30,  90,  0,
      67,  60,  0,
      67,  90,  0
    ]),
    gl.STATIC_DRAW);
};

window.addEventListener("load", main);
