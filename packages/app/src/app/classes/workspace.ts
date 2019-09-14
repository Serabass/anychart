import {GridInfo} from '../pages/main/main.component';
import Konva from 'konva';
import {JsonProperty, Serializable} from 'typescript-json-serializer';
import {Entity} from './entity';
import {NodeBase} from './node-base';

declare var ng: any;

@Serializable()
export class Workspace extends Entity {
  @JsonProperty()
  public width = 1500;

  @JsonProperty()
  public height = 800;

  @JsonProperty()
  public nodes: any[] = [];
  public fpsDisplay: any;

  public stage: Konva.Stage;
  public layer: Konva.Layer;

  public throttle = 500;

  public gridInfo: GridInfo = {
    snap: true,
    x: 10,
    y: 10
  };

  public init() {
    let dragLayer = new Konva.Layer();
    let scaleBy = 0.8;
    this.stage = new Konva.Stage({
      container: this.container,
      width: this.width,
      height: this.height,
      draggable: true
    });

    this.layer = new Konva.Layer();
    this.stage.add(this.layer);
    this.stage.add(dragLayer);

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

    let con = this.stage.container();
    this.stage.on('dragstart', e => {
      e.evt.preventDefault(); // !important
    });
    con.addEventListener('dragover', e => {
      e.preventDefault(); // !important
    });
    con.addEventListener('drop', e => {
      e.preventDefault();
      // now we need to find pointer position
      // we can't use stage.getPointerPosition() here, because that event
      // is not registered by Konva.Stage
      // we can register it manually:
      this.stage.setPointersPositions(e);

      let s = (window as any).dragElement;
      let xx = (window as any).dragX;
      let yy = (window as any).dragY;
      let p = ng.probe(s);
      let c = p.componentInstance;
      let n = c.node.constructor;
      let node: NodeBase = new n(c.node.constructorName, this);

      let pos = this.stage.getPointerPosition();
      node.x = pos.x - this.stage.x() - xx;
      node.y = pos.y - this.stage.y() - yy;
      this.layer.add(node.shape);
      this.layer.batchDraw();
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
    super();
  }
}
