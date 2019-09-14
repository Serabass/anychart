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

  @ViewChild('container', {static: true})
  public container: ElementRef<HTMLDivElement>;

  public firstNode: NodeBase;

  public wp: Workspace;

  constructor() {
  }

  ngOnInit() {
    this.wp = new Workspace(this.container.nativeElement);
    let node = new FetchNode('first', this.wp);
    this.firstNode = node;

    node.x = 20;
    node.y = 220;

    node.params.url = 'https://swapi.co/api/people/1';

    let sandboxNode = new SandboxNode('sandbox', this.wp);
    node.addOut(sandboxNode);

    sandboxNode.x = 300;
    sandboxNode.y = 300;

    let timeoutNode = new TimeoutNode('timeout1', this.wp);

    let consoleNode = new ConsoleNode('console', this.wp);
    let consoleNode2 = new ConsoleNode('console2', this.wp);

    timeoutNode.params.interval = 3000;

    sandboxNode.addOut(timeoutNode);
    timeoutNode.addOut(consoleNode);
    timeoutNode.addOut(consoleNode2);

    consoleNode.x = 1000;
    consoleNode.y = 120;

    consoleNode2.x = 1000;
    consoleNode2.y = 420;

    timeoutNode.x = 700;
    timeoutNode.y = 420;
    this.wp.init();
    node.init();
    consoleNode.init();
    consoleNode2.init();
    sandboxNode.init();
    timeoutNode.init();
    timeoutNode.init();

    this.wp.addNodes();
  }

  public run() {
    this.firstNode.run();
  }
}
