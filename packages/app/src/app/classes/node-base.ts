import {Workspace} from './workspace';
import Konva from 'konva';
import {JsonProperty} from 'typescript-json-serializer';
import {Entity} from './entity';

export abstract class NodeBase<TInput = any, TOutput = any, TParams = any> extends Entity {

  __params: any;

  public errors: any[] = [];

  @JsonProperty()
  public name: string;

  @JsonProperty()
  public get constructorName() {
    return this.constructor.name;
  }

  public constructor(name: string, public workspace: Workspace = null) {
    super();
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
      height: 60,
      fill: this.color,
      stroke: 'black',
      startScale: 1,
      shadowColor: 'black',
      shadowBlur: 4,
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

  public get hasParams() {
    return this.paramsCount > 0;
  }

  public get paramsCount() {
    return Object.keys(this.__params || {}).length;
  }

  public lines: Konva.Line[] = [];

  public input: TInput;

  @JsonProperty()
  public inNodes: NodeBase[] = [];

  @JsonProperty()
  public outNodes: NodeBase[] = [];

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

  public init() {
    if (this.outNodes.length > 0) {
      let index = 0;
      for (let node of this.outNodes) {
        let line = new Konva.Arrow({
          stroke: 'black',
          fill: 'black',
          points: [],
        });

        let updateLine = () => {
          let numbers = [
            this.shape.x() + this.shape.find('Rect')[0].width(),
            this.shape.y() + (index + 1) * 10,
            node.shape.x(),
            node.shape.y() + node.shape.find('Rect')[0].height() / 2
          ];
          line.points(numbers);
          this.workspace.layer.batchDraw();
        };

        this.shape.on('dragmove', updateLine);
        node.shape.on('dragmove', updateLine);
        updateLine();
        this.workspace.layer.add(line);
        this.lines.push(line);
        index++;
      }
    }

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
