import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ConsoleNode} from '../../classes/console-node';
import {SandboxNode} from '../../classes/sandbox-node';
import {NodeBase} from '../../classes/node-base';
import {Workspace} from '../../classes/workspace';
import {FetchNode} from '../../classes/fetch-node';
import {TimeoutNode} from '../../classes/timeout-node';
import Konva from 'konva';
import {NodeEditComponent} from '../../components/drawers/node-edit/node-edit.component';
import {NzDrawerService} from 'ng-zorro-antd';

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

  constructor(private drawerService: NzDrawerService) {
  }

  ngOnInit() {
    this.wp = new Workspace(this.container.nativeElement);
    let node = new FetchNode('first', this.wp);
    this.firstNode = node;

    node.x = 20;
    node.y = 220;

    node.params.url = 'https://swapi.co/api/people/1';

    let sandboxNode = new SandboxNode('sandbox', this.wp);
    let sandboxNode2 = new SandboxNode('sandbox2', this.wp);
    node.addOut(sandboxNode);

    sandboxNode.x = 300;
    sandboxNode.y = 300;

    let timeoutNode = new TimeoutNode('timeout1', this.wp);
    let timeoutNode2 = new TimeoutNode('timeout2', this.wp);

    let consoleNode = new ConsoleNode('console', this.wp);
    let consoleNode2 = new ConsoleNode('console2', this.wp);

    timeoutNode.params.interval = 3000;
    timeoutNode2.params.interval = 1500;

    sandboxNode.addOut(timeoutNode);
    sandboxNode.addOut(timeoutNode2);
    timeoutNode.addOut(consoleNode);
    timeoutNode.addOut(consoleNode2);
    timeoutNode2.addOut(sandboxNode2);
    sandboxNode2.addOut(consoleNode2);

    consoleNode.x = 1000;
    consoleNode.y = 120;

    consoleNode2.x = 1000;
    consoleNode2.y = 420;

    timeoutNode.x = 700;
    timeoutNode.y = 420;

    timeoutNode2.x = 500;
    timeoutNode2.y = 620;

    sandboxNode2.x = 800;
    sandboxNode2.y = 620;

    this.wp.init();
    this.wp.addNodes();

    this.wp.stage.on('dblclick', (e) => {
      if (e.target instanceof Konva.Rect) {
        let currentNode = e.target.getAttr('node');
        const drawerRef = this.drawerService.create<NodeEditComponent, { node: NodeBase }, string>({
          nzTitle: 'Component',
          nzWidth: 500,
          nzContent: NodeEditComponent,
          nzContentParams: {
            node: currentNode
          }
        });

        drawerRef.afterOpen.subscribe(() => {
          console.log('Drawer(Component) open');
        });

        drawerRef.afterClose.subscribe(data => {
          console.log(data);
          if (typeof data === 'object') {
            currentNode.params = data;
          }
        });
      }
    });
  }

  public run() {
    this.firstNode.run();
  }
}
