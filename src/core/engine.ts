import { IColorRGB } from "../types/raw";
import GL from "./gl";
import { IProgram } from "../core/program";
import { IScene } from "../core/scene";

export interface IEngine {
  currentProgram: IProgram;
  currentScene: IScene;
  clearColorBuffer(color: IColorRGB, alpha?: number): void;
  clearDepthBuffer(): void;
  uniform(name: string, value: Float32Array | WebGLTexture): void;
  attribute(
    name: string,
    buffer: WebGLBuffer,
    stride: number,
    offset: number
  ): void;
  elements(buffer: WebGLBuffer): void;
  draw(mode: number, count: number, type: number, offset: number): void;
  useProgram(program: IProgram): void;
}

class Engine implements IEngine {
  public currentProgram!: IProgram;
  public currentScene!: IScene;

  constructor(canvas: HTMLCanvasElement) {
    GL.gl = canvas.getContext("webgl", {
      antialias: true,
      preserveDrawingBuffer: true
    })!;

    const { gl } = GL;

    GL.width = canvas.width;
    GL.height = canvas.height;

    {
      gl.viewport(0, 0, GL.width, GL.height);
      gl.enable(gl.DEPTH_TEST);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    }
  }

  public clearColorBuffer(color: IColorRGB, alpha: number = 1.0): void {
    const { gl } = GL;

    if (!gl) {
      throw new Error("undefined gl");
    }

    gl.clearColor(color.r / 255, color.g / 255, color.b / 255, alpha);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  public clearDepthBuffer(): void {
    const { gl } = GL;

    if (!gl) {
      throw new Error("undefined gl");
    }

    gl.clear(gl.DEPTH_BUFFER_BIT);
  }

  public useProgram(program: IProgram): void {
    const { gl } = GL;

    if (!gl) {
      throw new Error("undefined gl");
    }

    this.currentProgram = program;
    gl.useProgram(this.currentProgram.glProgram);
  }

  public uniform(name: string, value: Float32Array | WebGLTexture): void {    
    this.currentProgram.uniform(name, value);
  }

  public attribute(
    name: string,
    buffer: WebGLBuffer,
    stride: number,
    offset: number
  ): void {
    this.currentProgram.attribute(name, buffer, stride, offset);
  }

  public elements(buffer: WebGLBuffer): void {
    const { gl } = GL;

    if (!gl) {
      throw new Error("undefined gl");
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
  }

  public draw(mode: number, count: number, type: number, offset: number): void {
    const { gl } = GL;

    if (!gl) {
      throw new Error("undefined gl");
    }

    gl.drawElements(mode, count, type, offset);
  }
}

export default Engine;
