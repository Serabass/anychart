import {Component, Input, OnInit} from '@angular/core';
import {NodeBase} from '../../classes/node-base';

@Component({
  selector: 'app-node-tool',
  templateUrl: './node-tool.component.html',
  styleUrls: ['./node-tool.component.sass']
})
export class NodeToolComponent implements OnInit {

  @Input()
  public node: NodeBase;

  constructor() { }

  ngOnInit() {
  }

}
