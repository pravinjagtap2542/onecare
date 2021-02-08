import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchpageHeaderComponent } from './searchpage-header.component';

describe('SearchpageHeaderComponent', () => {
  let component: SearchpageHeaderComponent;
  let fixture: ComponentFixture<SearchpageHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchpageHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchpageHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
