import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {TextNode} from '../../classes/text-node';

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

  public node: TextNode;

  constructor() {
    this.node = new TextNode('first');
    this.node.params.value = 'hello';

    this.node.outNodes.push(new TextNode('second'));
  }

  ngOnInit() {
    this.node.run();
    // this.ctx = this.canvas.nativeElement.getContext('2d');

    // this.draw();
  }

  public draw() {
    let ctx = this.ctx;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, this.width, this.height);

    requestAnimationFrame(() => this.draw());
  }
}
