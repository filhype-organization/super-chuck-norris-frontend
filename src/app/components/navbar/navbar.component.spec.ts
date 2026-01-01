import '../../../test-helpers/test-init';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthModule } from 'angular-auth-oidc-client';
import { NavbarComponent } from './navbar.component';
import { EnvironmentMock } from '../../../test-helpers/environment-mock';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    // Configuration de l'environnement de test
    EnvironmentMock.setup();
    await TestBed.configureTestingModule({
      imports: [
        NavbarComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        AuthModule.forRoot({
          config: {
            authority: 'test-authority',
            redirectUrl: 'test-redirect',
            clientId: 'test-client-id',
            scope: 'test-scope',
            responseType: 'code',
            silentRenew: false,
            useRefreshToken: false,
            ignoreNonceAfterRefresh: true,
          }
        })
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
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
