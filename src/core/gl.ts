import ElementBuffer from "../buffer/element-buffer";

interface IGL {

  width: number;
  height: number;

  gl?: WebGLRenderingContext;

  buffers: Set<Buffer | ElementBuffer>;
}

const GL: IGL = {
  width: 0,
  height: 0,

  gl: undefined,

  buffers: new Set(),
};

export default GL;