import {HttpService, Inject, Injectable} from "@nestjs/common";

export const SYSLUMENN_CLIENT_CONFIG = 'SYSLUMENN_CLIENT_CONFIG'

export interface SyslumennClientConfig {
  url: string
  username: string
  password: string
}

@Injectable()
export class SyslumennClient {
  private accessToken: string

  constructor(
    private httpService: HttpService,
    @Inject(SYSLUMENN_CLIENT_CONFIG)
    private clientConfig: SyslumennClientConfig
  ) {}

  private async getToken() {

    return
  }

  async getHomestayList(year: number) {

    return
  }
}
