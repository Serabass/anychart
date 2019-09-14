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

    this.stage.on('dragstart', (e) => {
      if (e.target instanceof Konva.Stage) {
        return;
      }
      return;
      let shape = e.target.parent;
      // moving to another layer will improve dragging performance
      shape.moveTo(dragLayer);
      this.stage.draw();

      if (tween) {
        tween.pause();
      }
      shape.setAttrs({
        shadowOffset: {
          x: 15,
          y: 15
        },
        scale: {
          x: shape.getAttr('startScale') * 1.2,
          y: shape.getAttr('startScale') * 1.2
        }
      });
    });

    this.stage.on('dragend', e => {
      if (e.target instanceof Konva.Stage) {
        return;
      }
      return;
      let shape = e.target.parent;
      shape.moveTo(this.layer);
      this.stage.draw();
      shape.to({
        duration: 0.5,
        easing: Konva.Easings.ElasticEaseOut,
        scaleX: shape.getAttr('startScale'),
        scaleY: shape.getAttr('startScale'),
        shadowOffsetX: 2,
        shadowOffsetY: 2,
      });
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
