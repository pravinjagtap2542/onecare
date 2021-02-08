import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyTicketComponent } from './modify-ticket.component';

describe('ModifyTicketComponent', () => {
  let component: ModifyTicketComponent;
  let fixture: ComponentFixture<ModifyTicketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifyTicketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
