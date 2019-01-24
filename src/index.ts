// import * as fShader from './shaders/frag.glsl';
// import * as vShader from './shaders/vert.glsl';

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
}

window.addEventListener('load', main);