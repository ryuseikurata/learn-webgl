import BaseCamera, { IBaseCamera } from "./base-camera";
import Matrix4, { IMatrix4 } from "../math/matrix4";
import { IScene } from "../core/scene";
import GL from '../core/gl';

export interface IOrthographicCamera extends IBaseCamera {
  width: number;
  viewRatio: number;
  near: number;
  far: number;
}

class OrthographicCamera extends BaseCamera implements IOrthographicCamera {
  public width: number = 10;
  public viewRatio: number = 1;
  public near: number = 1;
  public far: number = 1000;

  constructor(scene: IScene) {
    super();

    const { width, height } = GL;
    this.viewRatio = width / height;

    scene.activeCamera = this;
  }

  public getPMatrix(): IMatrix4 {
    const height = this.width / this.viewRatio;

    return Matrix4.orthographic(
      -this.width / 2,
      this.width / 2,
      -height / 2,
      height / 2,
      this.near,
      this.far
    );
  }
}

export default OrthographicCamera;
