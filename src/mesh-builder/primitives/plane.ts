import Geometry from "../../core/geometry";
import Mesh from "../../core/mesh";
import { IScene } from "../../core/scene";

function createPlane(scene: IScene, width: number, height = width) {

    const hWidth = width / 2;
    const hHeight = height / 2;

    const mesh = new Mesh(scene);

    const vertices = [
        -hWidth, -hHeight, 0,
        hWidth, -hHeight, 0,
        hWidth, hHeight, 0,
        -hWidth, hHeight, 0,
    ];
    const indices = {
        default: [0, 1, 2, 0, 2, 3],
    };

    mesh.geometry = new Geometry({
        vertices,
        indices,
    });

    return mesh;
}

export default createPlane;
