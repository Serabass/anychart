import {NodeBase} from './node-base';
import {GridInfo} from '../pages/main/main.component';
import Konva from 'konva';

export class Workspace {
  public width = 1500;
  public height = 800;

  public nodes: NodeBase[] = [];
  public fpsDisplay: any;

  public stage: Konva.Stage;
  public layer: Konva.Layer;

  public gridInfo: GridInfo = {
    snap: true,
    x: 10,
    y: 10
  };

  public init() {
    this.stage = new Konva.Stage({
      container: this.container,
      width: this.width,
      height: this.height,
      draggable: true
    });
    this.layer = new Konva.Layer();
    let tween = null;
    let dragLayer = new Konva.Layer();
    this.stage.add(this.layer);
    this.stage.add(dragLayer);

    this.stage.on('dblclick', (e) => {
      if (e.target instanceof Konva.Rect) {
        debugger;
      }
    });
  }

  public addNodes() {
    for (let node of this.nodes) {
      this.layer.add(node.shape);
    }
    this.layer.batchDraw();
  }

  public constructor(public container: HTMLDivElement) {

  }
}
