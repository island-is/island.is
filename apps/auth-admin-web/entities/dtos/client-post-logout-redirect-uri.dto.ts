export class ClientPostLogoutRedirectUriDTO {
  constructor() {
    this.clientId = null
    this.redirectUri = null
  }

  clientId?: string
  redirectUri?: string
}
