interface IProgram {
  fShaderSource: string;
  vShaderSource: string;
}

class Program {
  public glProgram: WebGLProgram;

  private fShaderSource: string;
  private vShaderSource: string;
  private gl: WebGLRenderingContext;

  constructor(
    gl: WebGLRenderingContext, 
    { fShaderSource, vShaderSource }: IProgram,
  ) {
    this.gl = gl;

    this.fShaderSource = fShaderSource;
    this.vShaderSource = vShaderSource;

    this.glProgram = this.initProgram();
  }

  public loadShader(type: GLenum, source: string) {
    const { gl } = this;

    const shader = gl.createShader(type);
    if (!shader) {
      throw new Error('shader is null');
    }

    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      throw new Error("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
  }
  return shader;
  }

  public initProgram(): WebGLProgram {
    const { fShaderSource, vShaderSource, gl } = this;

    const fShader = this.loadShader(gl.FRAGMENT_SHADER, fShaderSource);
    const vShader = this.loadShader(gl.VERTEX_SHADER, vShaderSource);

    const program = gl.createProgram();
    if (!program) {
      throw new Error('program is null');
    }

    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      throw new Error("Unable to initialize the shader program: " + gl.getProgramInfoLog(program));
    }

    return program;
  }

 }
 
 export default Program;