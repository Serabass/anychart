import {Workspace} from './workspace';
import Konva from 'konva';
import {JsonProperty, Serializable} from 'typescript-json-serializer';
import {Entity} from './entity';
import * as uuid from 'uuid/v1';

@Serializable()
export abstract class NodeBase<TInput = any, TOutput = any, TParams = any> extends Entity {

  public _rect: any;

  public constructor(name: string, public workspace: Workspace = null) {
    super();
    this.constructorName = this.constructor.name;
    this.generateUniqueId();
    this.name = name;
    if (this.workspace) {
      this.workspace.nodes.push(this);
    }
  }

  public get shape() {
    if (this._shape) {
      return this._shape;
    }

    this._shape = new Konva.Group({
      x: this.x,
      y: this.y,
      draggable: true,
      startScale: 1,
    });

    let rect = new Konva.Rect({
      x: 0,
      y: 0,
      width: 120,
      height: 50,
      fill: this.color,
      stroke: 'black',
      startScale: 1,
      shadowColor: 'black',
      shadowBlur: 7,
      shadowOffsetX: 2,
      shadowOffsetY: 2,
      node: this
    });

    rect.strokeEnabled(false);

    let text = new Konva.Text({
      text: this.name,
      x: 0,
      y: rect.height() + 10,
      fontSize: 20,
      align: 'center',
      width: rect.width(),
      fontFamily: 'Calibri',
      fill: 'red',
    });
    this._shape.add(text);
    this._shape.add(rect);

    return this._shape;
  }

  public get rect() {
    if (this._rect) {
      return this._rect;
    }

    return this._rect = this.shape.findOne('Rect');
  }

  public get hasParams() {
    return this.paramsCount > 0;
  }

  public get paramsCount() {
    return Object.keys(this.__params || {}).length;
  }

  private static usedIds: string[] = [];

  @JsonProperty()
  public id: string;

  public __params: any;

  public errors: any[] = [];

  public lines: Konva.Line[] = [];

  public input: TInput;

  @JsonProperty()
  public name: string;

  @JsonProperty()
  public constructorName: string;

  public inNodes: NodeBase[] = [];

  public outNodes: NodeBase[] = [];

  @JsonProperty()
  private get ins(): string[] {
    return this.inNodes.map(n => n.id);
  }

  @JsonProperty()
  private get outs(): string[] {
    return this.outNodes.map(n => n.id);
  }

  @JsonProperty()
  /**
   * @deprecated
   */
  public params: { [key: string]: any } = {};

  @JsonProperty()
  public x: number;

  @JsonProperty()
  public y: number;

  @JsonProperty()
  public color: string;

  public processing = false;

  private _shape: Konva.Group;

  private generateUniqueId() {
    if (this.id) {
      return;
    }
    do {
      let id = uuid();

      if (!NodeBase.usedIds.includes(id)) {
        this.id = id;
        NodeBase.usedIds.push(id);
        break;
      }

    } while (true);
  }

  public init() {
    if (this.outNodes.length > 0) {
      let index = 0;
      for (let node of this.outNodes) {
        let bezierLine = new Konva.Line({
          // dash: [10, 10, 0, 10],
          strokeWidth: 3,
          stroke: 'black',
          lineCap: 'round',
          opacity: 0.3,
          points: [0, 0]
        });
        bezierLine.bezier(true);
        let updateLine = () => {

          let p1 = [
            this.shape.x() + this.shape.findOne('Rect').width(),
            this.shape.y() + (index + 1) * 10,
          ];

          let p2 = [
            node.shape.x(),
            node.shape.y() + node.shape.findOne('Rect').height() / 2,
          ];

          let a1 = [
            this.shape.x() + this.shape.findOne('Rect').width() + 50,
            this.shape.y() + (index + 1) * 10,
          ];

          let a2 = [
            node.shape.x() - 50,
            node.shape.y() + node.shape.findOne('Rect').height() / 2,
          ];

          let points = [
            ...p1,
            ...a1,
            ...a2,
            ...p2,
          ];
          bezierLine.points(points);
          this.workspace.layer.batchDraw();
        };

        this.shape.on('dragmove', updateLine);
        node.shape.on('dragmove', updateLine);
        this.workspace.layer.add(bezierLine);
        this.lines.push(bezierLine);
        index++;
        updateLine();
      }
    }

    this.shape.on('mousemove', (e) => {
      let x = e.evt.layerX - this.x;
      let y = e.evt.layerY - this.y;

      if (x > this.rect.width() - 20) {
        document.body.style.cursor = 'crosshair';
        this.shape.setAttr('draggable', false);
      } else {
        document.body.style.cursor = 'default';
        this.shape.setAttr('draggable', true);
      }
    });

    this.workspace.layer.on('mouseover', (evt) => {
      if (evt.target instanceof Konva.Shape) {
        if (!(evt.target instanceof Konva.Line)) {
          let shape = evt.target;
          document.body.style.cursor = 'pointer';
          shape.strokeEnabled(true);
          this.workspace.layer.draw();
        }
      }
    });

    this.workspace.layer.on('mouseout', (evt) => {
      if (evt.target instanceof Konva.Shape) {
        if (!(evt.target instanceof Konva.Line)) {
          let shape = evt.target;
          document.body.style.cursor = 'default';
          shape.strokeEnabled(false);
          this.workspace.layer.draw();
        }
      }
    });
  }

  public abstract process(): any;


  private timeout() {
    return new Promise(resolve => {
      setTimeout(resolve, this.workspace.throttle);
    });
  }

  public async run() {
    this.errors = [];
    this.processing = true;
    let rect = this.shape.find<Konva.Rect>('Rect')[0];
    let savedOpacity = rect.opacity();
    rect.opacity(0.5);
    this.workspace.layer.batchDraw();
    let result = null;

    try {
      result = await Promise.resolve(this.process());
    } catch (e) {
      this.errors.push(e);
      rect.opacity(savedOpacity);
      this.workspace.layer.batchDraw();
      return;
    }

    await this.timeout();
    rect.opacity(savedOpacity);
    this.workspace.layer.batchDraw();

    this.processing = false;

    for (let node of this.outNodes) {
      node.input = result;
      node.run();
    }
    rect.opacity(savedOpacity);
    this.workspace.layer.batchDraw();
  }

  public addOut(node: NodeBase) {
    this.outNodes.push(node);
    node.inNodes.push(this);
  }
}
