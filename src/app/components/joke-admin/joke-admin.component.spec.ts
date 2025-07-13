import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { JokeAdminComponent } from './joke-admin.component';

describe('JokeAdminComponent', () => {
  let component: JokeAdminComponent;
  let fixture: ComponentFixture<JokeAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        JokeAdminComponent,
        HttpClientTestingModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JokeAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
