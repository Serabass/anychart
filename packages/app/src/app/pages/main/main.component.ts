import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {TextNode} from '../../classes/text-node';
import {ConsoleNode} from '../../classes/console-node';
import {SandboxNode} from '../../classes/sandbox-node';
import {NodeBase} from '../../classes/node-base';
import {Workspace} from '../../classes/workspace';

export interface GridInfo {
  snap: boolean;
  x: number;
  y: number;
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass']
})
export class MainComponent implements OnInit {

  @ViewChild('canvas', {static: true})
  public canvas: ElementRef<HTMLCanvasElement>;

  public ctx: CanvasRenderingContext2D;

  public firstNode: NodeBase<any, any, any>;

  public wp: Workspace;

  constructor() {
  }

  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.wp = new Workspace(this.ctx);

    let node = new TextNode('first', this.ctx);
    this.firstNode = node;

    node.drawObject.x = 20;
    node.drawObject.y = 50;

    node.params.value = 'hello';
    node.params.value2 = 'hello2';

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
    this.wp.nodes.push(node, sandboxNode, consoleNode, consoleNode2);
    this.wp.init();
  }

  public run() {
    this.firstNode.run();
  }

}
