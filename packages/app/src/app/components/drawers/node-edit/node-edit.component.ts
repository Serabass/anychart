import {Component, Input, OnInit} from '@angular/core';
import {NodeBase} from '../../../classes/node-base';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NzDrawerRef} from 'ng-zorro-antd';
import 'reflect-metadata';

@Component({
  selector: 'app-node-edit',
  templateUrl: './node-edit.component.html',
  styleUrls: ['./node-edit.component.sass']
})
export class NodeEditComponent implements OnInit {

  @Input()
  public node: NodeBase;

  validateForm: FormGroup;
  constructor(private fb: FormBuilder,
              private drawerRef: NzDrawerRef<any>) { }

  ngOnInit() {
    if (!this.node.__params) {
      this.node.__params = {};
    }
    let controlsConfig = {
      color: [null],
    };
    let val: any = {};
    Object.entries(this.node.__params).forEach(([key, value]) => {
      controlsConfig[key] = [null];
      val[key] = this.node[key] || null;
    });

    val.color = this.node.color;

    this.validateForm = this.fb.group(controlsConfig);
    this.validateForm.setValue(val);
  }

  public keys(v) {
    return Object.keys(v);
  }

  public enumValues(v) {
    return Object.keys(v).filter(k => typeof v[k as any] === 'number');
  }

  public save() {
    this.drawerRef.close(this.validateForm.value);
  }

  public close() {
    this.drawerRef.close();
  }
}
