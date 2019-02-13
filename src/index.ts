import Engine from "./core/engine";
import Scene from "./core/scene";
import MeshBuilder from "./mesh-builder/mesh-builder";
import PerspectiveCamera from './camera/perspective-camera';
import DirectionalLight from './light/directional-light';

const main = async (): Promise<void> => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const canvas = document.createElement("canvas") as HTMLCanvasElement;
  canvas.width = width;
  canvas.height = height;
  document.body.appendChild(canvas);

  const engine = new Engine(canvas);
  const scene = new Scene(engine);
  
  const camera = new PerspectiveCamera(scene);
  camera.position = {x: 0, y: 0, z: -50};

  const light1 = new DirectionalLight(scene);
  light1.direction = { x: -1, y: -1, z: -1 };
  light1.intensity = 0.4;

  const mesh1 = MeshBuilder.createCube(scene, 10, 10, 10);
  mesh1.position = {x: 0, y: 0, z: 0};

  function render() {
    mesh1.rotation.x += 1;
    mesh1.rotation.y += 1;
    scene.render();
    requestAnimationFrame(render);
  }
  render();
};

window.addEventListener("load", main);
