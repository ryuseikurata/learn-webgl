import ShaderMaterial from "./shader-material";

import Vector3, { IVector3 } from "../math/vector3";
import { IColorRGB } from "../types/raw";

import fShaderSource from "../shaders/material-simple.frag";
import vShaderSource from "../shaders/material-simple.vert";

class SimpleMaterial extends ShaderMaterial {
  public color: IColorRGB = { r: 91, g: 162, b: 150 };

  constructor() {
    super({
      name: "SIMPLE",
      vertexShaderSource: vShaderSource,
      fragmentShaderSource: fShaderSource,
      macros: [],
      uniforms: ["uColor"],
      lighting: false,
      shadow: false
    });
  }

  public condition(macro: string): boolean {
    return false;
  }

  public uniform(name: string): Float32Array | WebGLTexture {
    switch (name) {
      case "uColor":
        return this.getColor();
      default:
        throw new Error('undefined uniform name');
    }
  }

  public getColor(): IVector3 {
    return new Float32Array([
      this.color.r / 255,
      this.color.g / 255,
      this.color.b / 255
    ]);
  }
}

export default SimpleMaterial;