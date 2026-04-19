import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { AuthModule } from 'angular-auth-oidc-client';
import { NavbarComponent } from './navbar.component';
import { EnvironmentMock } from '../../../test-helpers/environment-mock';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    EnvironmentMock.setup();

    await TestBed.configureTestingModule({
      imports: [
        NavbarComponent,
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
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
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
