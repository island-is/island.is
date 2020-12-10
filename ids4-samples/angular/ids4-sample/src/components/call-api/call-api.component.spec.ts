/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CallApiComponent } from './call-api.component';

describe('CallApiComponent', () => {
  let component: CallApiComponent;
  let fixture: ComponentFixture<CallApiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallApiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
