import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeToolComponent } from './node-tool.component';

describe('NodeToolComponent', () => {
  let component: NodeToolComponent;
  let fixture: ComponentFixture<NodeToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
