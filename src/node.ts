import { IPosition, IDirection } from './types/raw';

interface Node {
  id: number;
  position: IPosition;
  rotation: IDirection;
  scale: IDirection;

  parent?: Node;
}