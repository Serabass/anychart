import {NodeBase} from './node-base';
import {GridInfo} from '../pages/main/main.component';
import Konva from 'konva';
import {NodeEditComponent} from '../components/drawers/node-edit/node-edit.component';

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

    let scaleBy = 0.8;
    this.stage.on('wheel', e => {
      e.evt.preventDefault();
      let oldScale = this.stage.scaleX();

      let mousePointTo = {
        x: this.stage.getPointerPosition().x / oldScale - this.stage.x() / oldScale,
        y: this.stage.getPointerPosition().y / oldScale - this.stage.y() / oldScale
      };

      let newScale =
        e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
      this.stage.scale({ x: newScale, y: newScale });

      let newPos = {
        x:
          -(mousePointTo.x - this.stage.getPointerPosition().x / newScale) *
          newScale,
        y:
          -(mousePointTo.y - this.stage.getPointerPosition().y / newScale) *
          newScale
      };
      this.stage.position(newPos);
      this.stage.batchDraw();
    });
    this.nodes.forEach((node) => {
      node.init();
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
