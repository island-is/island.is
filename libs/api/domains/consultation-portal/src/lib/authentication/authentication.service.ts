import { AuthenticationApi } from '@island.is/clients/consultation-portal'
import { Injectable } from '@nestjs/common'

@Injectable()
export class AuthenticationService {
  constructor(private authenticationApi: AuthenticationApi) {}

  async getAuthenticationUrl(): Promise<string> {
    const url = await this.authenticationApi.apiAuthRequestUrlGet()
    return url
  }
}
