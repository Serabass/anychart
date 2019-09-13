import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ConsoleNode} from '../../classes/console-node';
import {SandboxNode} from '../../classes/sandbox-node';
import {NodeBase} from '../../classes/node-base';
import {Workspace} from '../../classes/workspace';
import {FetchNode} from '../../classes/fetch-node';

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

    let node = new FetchNode('first', this.wp);
    this.firstNode = node;

    node.drawObject.x = 20;
    node.drawObject.y = 220;

    node.params.url = 'https://swapi.co/api/people/1';

    let sandboxNode = new SandboxNode('sandbox', this.wp);
    node.addOut(sandboxNode);

    sandboxNode.drawObject.x = 500;
    sandboxNode.drawObject.y = 300;

    let consoleNode = new ConsoleNode('console', this.wp);
    let consoleNode2 = new ConsoleNode('console2', this.wp);
    sandboxNode.addOut(consoleNode);
    sandboxNode.addOut(consoleNode2);

    consoleNode.drawObject.x = 1000;
    consoleNode.drawObject.y = 120;

    consoleNode2.drawObject.x = 1000;
    consoleNode2.drawObject.y = 420;
    this.wp.nodes.push(node, sandboxNode, consoleNode, consoleNode2);
    this.wp.init();
  }

  public run() {
    this.firstNode.run();
  }

}
