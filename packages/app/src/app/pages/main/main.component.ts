import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {TextNode} from '../../classes/text-node';
import {ConsoleNode} from '../../classes/console-node';
import {SandboxNode} from '../../classes/sandbox-node';
import {NodeBase} from '../../classes/node-base';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass']
})
export class MainComponent implements OnInit {

  public width = 1200;
  public height = 600;

  @ViewChild('canvas', {static: true})
  public canvas: ElementRef<HTMLCanvasElement>;

  public ctx: CanvasRenderingContext2D;

  public nodes: NodeBase<any, any, any>[] = [];

  public firstNode: NodeBase<any, any, any>;

  constructor() {
  }

  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');

    let node = new TextNode('first', this.ctx);
    this.firstNode = node;

    node.drawObject.x = 20;
    node.drawObject.y = 50;

    node.params.value = 'hello';

    let sandboxNode = new SandboxNode('sandbox', this.ctx);
    node.addOut(sandboxNode);

    sandboxNode.drawObject.x = 250;
    sandboxNode.drawObject.y = 70;

    let consoleNode = new ConsoleNode('console', this.ctx);
    let consoleNode2 = new ConsoleNode('console2', this.ctx);
    sandboxNode.addOut(consoleNode);
    sandboxNode.addOut(consoleNode2);

    consoleNode.drawObject.x = 500;
    consoleNode.drawObject.y = 120;

    consoleNode2.drawObject.x = 500;
    consoleNode2.drawObject.y = 320;

    this.nodes.push(node, sandboxNode, consoleNode, consoleNode2);
    this.draw();
  }

  public draw() {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.width, this.height);

    for (let node of this.nodes) {
      node.drawObject.draw();
    }

    requestAnimationFrame(() => this.draw());
  }

  public run() {
    this.firstNode.run();
  }
}
