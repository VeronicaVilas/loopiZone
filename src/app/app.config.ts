import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { provideAuth0 } from '@auth0/auth0-angular';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideAuth0({
      domain: 'dev-eeipn5gto1zg5v42.us.auth0.com',
      clientId: '9JctXyGk9SUqr5YjgcXF5UfSS6CMSfNg',
      authorizationParams: {
        redirect_uri: window.location.origin,
        audience: 'https://dev-eeipn5gto1zg5v42.us.auth0.com/api/v2/',
        scope: 'openid profile email offline_access',
      },
      useRefreshTokens: true,
      cacheLocation: 'localstorage',
    }),
  ]
};
