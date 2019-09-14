import {Component, ElementRef, OnInit} from '@angular/core';
import {ConsoleNode} from '../../classes/console-node';
import {FetchNode} from '../../classes/fetch-node';
import {SandboxNode} from '../../classes/sandbox-node';
import {TextNode} from '../../classes/text-node';
import {TimeoutNode} from '../../classes/timeout-node';
import {ScriptNode} from '../../classes/script-node';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.sass']
})
export class ToolbarComponent implements OnInit {

  public tools = [
    ConsoleNode,
    FetchNode,
    SandboxNode,
    TextNode,
    TimeoutNode,
    ScriptNode,
  ];

  public nodes = [];

  constructor(public element: ElementRef<HTMLElement>) { }

  ngOnInit() {
    for (let tool of this.tools) {
      this.nodes.push(new tool(tool.name));
    }

    this.element.nativeElement.addEventListener('dragstart', (e) => {
      (window as any).dragElement = e.target;
      (window as any).dragX = e.offsetX;
      (window as any).dragY = e.offsetY;
    });
  }
}
