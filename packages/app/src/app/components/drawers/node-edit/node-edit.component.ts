import {Component, Input, OnInit} from '@angular/core';
import {NodeBase} from '../../../classes/node-base';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzDrawerRef} from 'ng-zorro-antd';

@Component({
  selector: 'app-node-edit',
  templateUrl: './node-edit.component.html',
  styleUrls: ['./node-edit.component.sass']
})
export class NodeEditComponent implements OnInit {

  @Input()
  public node: NodeBase;

  validateForm: FormGroup;
  constructor(private fb: FormBuilder, private drawerRef: NzDrawerRef<any>) { }

  ngOnInit() {
    let controlsConfig = {
    };

    Object.entries(this.node.params).forEach(([key, value]) => {
      controlsConfig[key] = [null];
    });
    this.validateForm = this.fb.group(controlsConfig);
    Object.entries(this.node.params).forEach(([key, value]) => {
      controlsConfig[key] = [null];
      this.validateForm.setValue(this.node.params);
    });
  }

  public keys(v) {
    return Object.keys(v);
  }

  public save() {
    this.drawerRef.close(this.validateForm.value);
  }

  public close() {
    this.drawerRef.close();
  }
}
