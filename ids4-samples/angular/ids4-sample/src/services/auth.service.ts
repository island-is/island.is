import { Injectable } from '@angular/core';
import {
  UserManager,
  UserManagerSettings,
  User,
  WebStorageStateStore,
} from 'oidc-client';
import { environment } from './../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private manager = new UserManager(getClientSettings());
  private user: User = null;

  constructor() {
    this.manager.getUser().then((user) => {
      this.user = user;
    });
  }

  isLoggedIn(): boolean {
    return this.user != null && !this.user.expired;
  }

  getClaims(): any {
    return this.user.profile;
  }

  getAuthorizationHeaderValue(): string {
    return `${this.user.token_type} ${this.user.access_token}`;
  }

  startAuthentication(): Promise<void> {
    return this.manager.signinRedirect();
  }

  completeAuthentication(): Promise<void> {
    return this.manager.signinRedirectCallback().then((user) => {
      this.user = user;
    });
  }
}

export function getClientSettings(): UserManagerSettings {
  return {
    authority: environment.identityServer.authority,
    client_id: environment.identityServer.clientId,
    redirect_uri: environment.identityServer.redirectUri,
    response_type: environment.identityServer.responseType,
    scope: environment.identityServer.scope,
    loadUserInfo: true,
    filterProtocolClaims: true,
    userStore: new WebStorageStateStore({ store: window.localStorage }),
  };
}
