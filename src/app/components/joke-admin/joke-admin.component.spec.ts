import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { JokeAdminComponent } from './joke-admin.component';
import { EnvironmentMock } from '../../../test-helpers/environment-mock';

describe('JokeAdminComponent', () => {
  let component: JokeAdminComponent;
  let fixture: ComponentFixture<JokeAdminComponent>;

  beforeEach(async () => {
    // Configuration de l'environnement de test
    EnvironmentMock.setup();

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

  afterEach(() => {
    // Nettoyage après chaque test
    EnvironmentMock.cleanup();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
