import GL from "./gl";
import { type } from "os";

export interface IProgram {
  glProgram: WebGLProgram;
  uniform(
    name: string,
    value: WebGLTexture | Float32Array | Uint32Array | Uint16Array
  ): void;
  attribute(
    name: string,
    buffer: WebGLBuffer,
    stride: number,
    offset: number
  ): void;
}

interface IUniform {
  type: GLenum;
  position: WebGLUniformLocation;
  info: WebGLActiveInfo;
  unit?: number;
}

interface IUniforms {
  [prop: string]: IUniform;
}

interface IAttribute {
  type: GLenum;
  position: number;
  info: WebGLActiveInfo;
}

interface IAttributes {
  [prop: string]: IAttribute;
}

class Program implements IProgram {
  public glProgram: WebGLProgram;

  private uniforms: IUniforms = {};
  private attributes: IAttributes = {};

  private fShaderSource: string;
  private vShaderSource: string;

  constructor({
    fShaderSource,
    vShaderSource
  }: {
    fShaderSource: string;
    vShaderSource: string;
  }) {
    this.fShaderSource = fShaderSource;
    this.vShaderSource = vShaderSource;

    this.glProgram = this.initProgram();
  }

  public loadShader(type: GLenum, source: string) {
    const { gl } = GL;

    if (!gl) {
      throw new Error("undefined gl");
    }

    const shader = gl.createShader(type);
    if (!shader) {
      throw new Error("shader is null");
    }

    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      throw new Error(
        "An error occurred compiling the shaders: " +
          gl.getShaderInfoLog(shader)
      );
    }
    return shader;
  }

  public initProgram(): WebGLProgram {
    const { fShaderSource, vShaderSource } = this;
    const { gl } = GL;

    if (!gl) {
      throw new Error("undefined gl");
    }

    const fShader = this.loadShader(gl.FRAGMENT_SHADER, fShaderSource);
    const vShader = this.loadShader(gl.VERTEX_SHADER, vShaderSource);

    const program = gl.createProgram();
    if (!program) {
      throw new Error("program is null");
    }

    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      throw new Error(
        "Unable to initialize the shader program: " +
          gl.getProgramInfoLog(program)
      );
    }

    const uniforms: IUniforms = {};
    const attributes: IAttributes = {};

    const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

    for (let i = 0; i < uniformCount; i++) {
      const uniform = gl.getActiveUniform(program, i)!;

      const res = {
        type: this.getVariableType(uniform.type),

        info: uniform,
        position: gl.getUniformLocation(program, uniform.name)!,
        unit: undefined
      };

      let name = uniform.name;
      if (name.indexOf("[0]") !== -1) {
        name = name.replace("[0]", "");
      }
      uniforms[name] = res;
    }

    const attributeCount = gl.getProgramParameter(
      program,
      gl.ACTIVE_ATTRIBUTES
    );
    for (let i = 0; i < attributeCount; i++) {
      const attribute = gl.getActiveAttrib(program, i);

      if (!attribute) {
        throw new Error("undefined attribute");
      }

      const res = {
        type: this.getVariableType(attribute.type),
        info: attribute,
        position: gl.getAttribLocation(program, attribute.name)
      };

      attributes[attribute.name] = res;
    }

    this.attributes = attributes;
    this.uniforms = uniforms;
    return program;
  }

  private getVariableType(value: number): GLenum {
    const { gl } = GL;

    if (!gl) {
      throw new Error("undefined gl");
    }

    return [
      WebGLRenderingContext.FLOAT,
      WebGLRenderingContext.FLOAT_VEC2,
      WebGLRenderingContext.FLOAT_VEC3,
      WebGLRenderingContext.FLOAT_VEC4,
      WebGLRenderingContext.FLOAT_MAT2,
      WebGLRenderingContext.FLOAT_MAT3,
      WebGLRenderingContext.FLOAT_MAT4,
      WebGLRenderingContext.INT,
      WebGLRenderingContext.INT_VEC2,
      WebGLRenderingContext.INT_VEC3,
      WebGLRenderingContext.INT_VEC4,
      WebGLRenderingContext.BOOL,
      WebGLRenderingContext.BOOL_VEC2,
      WebGLRenderingContext.BOOL_VEC3,
      WebGLRenderingContext.BOOL_VEC4,
      WebGLRenderingContext.SAMPLER_2D,
      WebGLRenderingContext.SAMPLER_CUBE
    ].find(v => {
      return v === value;
    }) as GLenum;
  }

  public destructor(): void {
    const { gl } = GL;

    if (!gl) {
      throw new Error("undefined gl");
    }

    gl.deleteProgram(this.glProgram);
  }

  public uniform(
    name: string,
    value: WebGLTexture | Float32Array | Uint32Array | Uint16Array
  ): void {
    if (this.uniforms[name]) {
      const { gl } = GL;

      if (!gl) {
        throw new Error("undefined gl");
      }

      const { type, position } = this.uniforms[name];

      switch (type) {
        case WebGLRenderingContext.FLOAT_VEC3:
          gl.uniform3fv(position, value as Float32Array);
          break;
        case WebGLRenderingContext.FLOAT_MAT4:
          gl.uniformMatrix4fv(position, false, value as Float32Array);
          break;
        case WebGLRenderingContext.INT:
          gl.uniform1i(position, value as number);
          break;
        case WebGLRenderingContext.FLOAT:
          gl.uniform1f(position, value as number);
          break;
        default:
          throw new Error(`undefined uniform type ${type}`);
      }
    }
  }

  public attribute(
    name: string,
    buffer: WebGLBuffer,
    stride: number,
    offset: number
  ): void {
    if (this.attributes[name]) {
      const { gl } = GL;

      if (!gl) {
        throw new Error("undefined gl");
      }

      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

      const { type, position } = this.attributes[name];
      switch (type) {
        case WebGLRenderingContext.FLOAT_VEC3:
          gl.vertexAttribPointer(position, 3, gl.FLOAT, false, stride, offset);
          break;
        case WebGLRenderingContext.FLOAT_MAT4:
          gl.vertexAttribPointer(position, 4, gl.FLOAT, false, stride, offset);
          break;
        default:
        throw new Error('undefined attribute type');
      }

      gl.enableVertexAttribArray(position);
    }
  }
}

export default Program;
