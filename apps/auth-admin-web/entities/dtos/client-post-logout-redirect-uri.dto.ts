export class ClientPostLogoutRedirectUriDTO {
  constructor() {
    this.clientId = undefined
    this.redirectUri = undefined
  }

  clientId?: string
  redirectUri?: string
}
