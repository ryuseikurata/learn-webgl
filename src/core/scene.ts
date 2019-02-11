import { IEngine } from './engine';
import { IColorRGB } from '../types/raw';
import { ICamera } from '../camera';
import RenderManager, { IRenderManager } from './render-manager';
import Nesh, { IMesh } from './mesh';

export interface IScene {
  engine: IEngine;

  clearColor: IColorRGB;
  activeCamera?: ICamera;

  renderManager?: IRenderManager;

  meshes: IMesh[];

  render(): void;
}

class Scene implements IScene {
  public engine: IEngine;

  public clearColor: IColorRGB = { r: 255, g: 255, b: 255 };
  public activeCamera?: ICamera;

  public renderManager: RenderManager = new RenderManager(this);

  public meshes: IMesh[] = [];

  constructor(engine: IEngine) {
    this.engine = engine;
    this.engine.currentScene = this;
  }

  public render(): void {
    this.renderManager.render();
  }
}

export default Scene;

