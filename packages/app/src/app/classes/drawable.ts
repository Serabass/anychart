import {NodeBase} from './node-base';

export class Drawable {
  public x = 0;
  public y = 0;

  public width = 150;
  public height = 70;

  public lineWidth = 1;

  public constructor(public node: NodeBase) {

  }

  public get left() {
    return this.x;
  }

  public get top() {
    return this.y;
  }

  public get right() {
    return this.x + this.width;
  }

  public get bottom() {
    return this.y + this.height;
  }
}

