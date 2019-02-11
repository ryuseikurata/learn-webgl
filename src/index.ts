import Engine from "./core/engine";
import Scene from "./core/scene";
import MeshBuilder from "./mesh-builder/mesh-builder";
import PerspectiveCamera from './camera/perspective-camera';

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

  const m1 = MeshBuilder.createCube(scene, 10, 10, 10);
  m1.position = {x: 0, y: 0, z: 0};

  function render() {
    m1.rotation.x += 1;
    m1.rotation.y += 1;
    scene.render();
    requestAnimationFrame(render);
  }
  render();
};

window.addEventListener("load", main);
