// import {
//   Configuration,
//   DrivingLicenseBookApi,
// } from '../../gen/fetch'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { XRoadConfig } from '@island.is/nest/config'
import type { ConfigType } from '@island.is/nest/config'
// import { DrivingLicenseBookClientConfig } from './drivingLicenseBookClient.config'
import { Injectable, Inject } from '@nestjs/common'
import { AuthHeaderMiddleware } from '@island.is/auth-nest-tools'

@Injectable()
export class VmstUnemploymentClientService {
  constructor(
    // private clientConfig: ConfigType<typeof DrivingLicenseBookClientConfig>,
    @Inject(XRoadConfig.KEY)
    private xroadConfig: ConfigType<typeof XRoadConfig>,
  ) {}

  async create() {
    // const api = new DrivingLicenseBookApi(
    //   new Configuration({
    //     fetchApi: createEnhancedFetch({
    //       name: 'clients-driving-license-book',
    //       ...this.clientConfig.fetch,
    //     }),
    //     basePath: `${this.xroadConfig.xRoadBasePath}/r1/${this.clientConfig.xRoadServicePath}`,
    //     headers: {
    //       'X-Road-Client': this.xroadConfig.xRoadClient,
    //     },
    //   }),
    // )
    // const config = {
    //   username: this.clientConfig.username,
    //   password: this.clientConfig.password,
    // }
    // const { token } = await api.apiAuthenticationAuthenticatePost({
    //   authenticateModel: config,
    // })
    // if (token) {
    //   return api.withMiddleware(new AuthHeaderMiddleware(`Bearer ${token}`))
    // } else {
    //   throw new Error(
    //     'Driving license book client configuration and login went wrong',
    //   )
    // }
  }
}
