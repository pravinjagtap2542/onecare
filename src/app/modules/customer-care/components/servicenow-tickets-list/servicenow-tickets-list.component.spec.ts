import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicenowTicketsListComponent } from './servicenow-tickets-list.component';

describe('ServicenowTicketsListComponent', () => {
  let component: ServicenowTicketsListComponent;
  let fixture: ComponentFixture<ServicenowTicketsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicenowTicketsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicenowTicketsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
