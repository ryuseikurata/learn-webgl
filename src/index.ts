import Program from './program';
import Vector3 from './math/Vector3';

import fShader from './shaders/frag';
import vShader from './shaders/vert';

const main = async (): Promise<void> => {
  const width = 400;
  const height = 300;
  const canvas = document.createElement('canvas') as HTMLCanvasElement;
  canvas.width = width;
  canvas.height = height;
  document.body.appendChild(canvas);

  const gl = canvas.getContext('webgl')!;
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  const program = new Program(gl, { fShaderSource: fShader, vShaderSource: vShader });
  
  const positionAttributeLocation = gl.getAttribLocation(program.glProgram, "a_position");
  const resolutionUniformLocation = gl.getUniformLocation(program.glProgram, "u_resolution");
  const colorUniformLocation = gl.getUniformLocation(program.glProgram, "u_color");
  const matrixLocation = gl.getUniformLocation(program.glProgram, "u_matrix");

  const positionBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  const color = [Math.random(), Math.random(), Math.random(), 1];

  const translate = Vector3.translation(-100, 200);
  const rotation = Vector3.rotation(60 * Math.PI / 180);
  const scale = Vector3.scaling(0.8, 1);

  const matrix = translate
    .multiply(rotation)
    .multiply(scale);


  setGeometry(gl);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clearColor(0, 0, 0, 3);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program.glProgram);

  gl.enableVertexAttribArray(positionAttributeLocation);

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  var size = 2;          // 2 components per iteration
  var type = gl.FLOAT;   // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0;        // start at the beginning of the buffer
  gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
  gl.uniform4fv(colorUniformLocation, color);
  gl.uniformMatrix3fv(matrixLocation, false, matrix);

  // draw
  var primitiveType = gl.TRIANGLES;
  var offset = 0;
  var count = 18;
  gl.drawArrays(primitiveType, offset, count);
}

const setGeometry = (gl: WebGLRenderingContext) => {
  gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
          // 左縦列
          0, 0,
          30, 0,
          0, 150,
          0, 150,
          30, 0,
          30, 150,
 
          // 上の横棒
          30, 0,
          100, 0,
          30, 30,
          30, 30,
          100, 0,
          100, 30,
 
          // 下の横棒
          30, 60,
          67, 60,
          30, 90,
          30, 90,
          67, 60,
          67, 90,
      ]),
      gl.STATIC_DRAW);
};

window.addEventListener('load', main);