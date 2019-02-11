import BaseCamera, { IBaseCamera } from './base-camera';
import Matrix4, { IMatrix4 } from '../math/matrix4';
import { deg2rad } from '../math/utils';
import { IScene } from "../core/scene";
import GL from '../core/gl';

export interface IPerspectiveCamera extends IBaseCamera {
  fov: number;
  viewRatio: number;
  near: number;
  far: number;
};

class PerspectiveCamera extends BaseCamera implements IPerspectiveCamera {
  public fov: number = 60;
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
    return Matrix4.perspective(
      deg2rad(this.fov),
      this.viewRatio,
      this.near,
      this.far
    );
  }
}

export default PerspectiveCamera;