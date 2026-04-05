import '../../../test-helpers/test-init';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { JokeAdminComponent } from './joke-admin.component';
import { EnvironmentMock } from '../../../test-helpers/environment-mock';

describe('JokeAdminComponent', () => {
  let component: JokeAdminComponent;
  let fixture: ComponentFixture<JokeAdminComponent>;

  beforeEach(async () => {
    EnvironmentMock.setup();

    await TestBed.configureTestingModule({
      imports: [JokeAdminComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(JokeAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    EnvironmentMock.cleanup();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
