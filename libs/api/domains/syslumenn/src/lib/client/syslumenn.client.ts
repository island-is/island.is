import { HttpService, Inject, Injectable } from '@nestjs/common'
import { IHomestay } from './models/homestay'
import { ILogin } from './models/login'

export const SYSLUMENN_CLIENT_CONFIG = 'SYSLUMENN_CLIENT_CONFIG'

export interface SyslumennClientConfig {
  url: string
  username: string
  password: string
}

@Injectable()
export class SyslumennClient {
  private accessToken: string = ''

  constructor(
    private httpService: HttpService,
    @Inject(SYSLUMENN_CLIENT_CONFIG)
    private clientConfig: SyslumennClientConfig,
  ) {}

  private async getToken() {
    const config = {
      notandi: this.clientConfig.username,
      lykilord: this.clientConfig.password,
    }

    const response: { data: ILogin } = await this.httpService
      .post(`${this.clientConfig.url}/dev/v1/Innskraning`, config)
      .toPromise()

    this.accessToken = response.data.audkenni
  }

  async getHomestays(year?: number): Promise<IHomestay[] | null> {
    await this.getToken()

    let url = `${this.clientConfig.url}/dev/v1/VirkarHeimagistingar/${this.accessToken}`

    if (year) {
      url = `${this.clientConfig.url}/dev/v1/VirkarHeimagistingar/${this.accessToken}/${year}`
    }

    const response: { data: IHomestay[] } = await this.httpService
      .get(url)
      .toPromise()

    return response.data
  }
}
