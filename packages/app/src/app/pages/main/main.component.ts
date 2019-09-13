import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ConsoleNode} from '../../classes/console-node';
import {SandboxNode} from '../../classes/sandbox-node';
import {NodeBase} from '../../classes/node-base';
import {Workspace} from '../../classes/workspace';
import {FetchNode} from '../../classes/fetch-node';
import {TimeoutNode} from '../../classes/timeout-node';

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

  public firstNode: NodeBase;

  public wp: Workspace;

  constructor() {
  }

  ngOnInit() {
    let ctx = this.canvas.nativeElement.getContext('2d');
    this.wp = new Workspace(ctx);

    let node = new FetchNode('first', this.wp);
    this.firstNode = node;

    node.drawObject.x = 20;
    node.drawObject.y = 220;

    node.params.url = 'https://swapi.co/api/people/1';

    let sandboxNode = new SandboxNode('sandbox', this.wp);
    node.addOut(sandboxNode);

    sandboxNode.drawObject.x = 300;
    sandboxNode.drawObject.y = 300;

    let timeoutNode = new TimeoutNode('timeout1', this.wp);

    let consoleNode = new ConsoleNode('console', this.wp);

    timeoutNode.params.interval = 3000;

    sandboxNode.addOut(timeoutNode);
    timeoutNode.addOut(consoleNode);

    consoleNode.drawObject.x = 1000;
    consoleNode.drawObject.y = 120;

    timeoutNode.drawObject.x = 700;
    timeoutNode.drawObject.y = 420;
    this.wp.init();
  }

  public run() {
    this.firstNode.run();
  }

}
