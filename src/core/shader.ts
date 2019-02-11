import GL from "./gl";
import Program from "./program";

interface IShader {
  fShaderSource: string;
  vShaderSource: string;
}

class Shader {
  public programs: { [prop: string]: Program } = {};

  private fShaderSource: string;
  private vShaderSource: string;

  constructor({ fShaderSource, vShaderSource }: IShader) {
    this.fShaderSource = fShaderSource;
    this.vShaderSource = vShaderSource;
  }

  public program(defines: string[]): Program {
    defines = defines.sort();

    const definesKey = defines.join(";");

    if (!this.programs[definesKey]) {
      const definesString =
        [...defines].map(name => `#define ${name} 1`).join("\n") + "\n";

      this.programs[definesKey] = new Program({
        vShaderSource: definesString + this.vShaderSource,
        fShaderSource: definesString + this.fShaderSource
      });
    }

    return this.programs[definesKey];
  }

  public destructor(): void {
    for (const key in this.programs) {
        this.programs[key].destructor();
    }
}
}

export default Shader;
