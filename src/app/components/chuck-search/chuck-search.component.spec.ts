import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChuckSearchComponent } from './chuck-search.component';

describe('ChuckSearchComponent', () => {
  let component: ChuckSearchComponent;
  let fixture: ComponentFixture<ChuckSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChuckSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChuckSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
