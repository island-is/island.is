import { Inject } from '@nestjs/common'
import {
  RESTDataSource,
  RequestOptions,
  HTTPCache,
} from 'apollo-datasource-rest'
import { DataSourceConfig } from 'apollo-datasource'
import { Base64 } from 'js-base64'
import {
  ChargeResponse,
  Charge,
  Catalog,
  PaymentServiceOptions,
} from './payment.type'

export const PAYMENT_OPTIONS = 'PAYMENT_OPTIONS'

export class PaymentAPI extends RESTDataSource {
  constructor(
    @Inject(PAYMENT_OPTIONS)
    private readonly options: PaymentServiceOptions,
  ) {
    super()
    this.baseURL = this.options.url //`https://tbrws-s.hysing.is/chargeFJS/v1`
    this.initialize({} as DataSourceConfig<any>)
  }

  willSendRequest(request: RequestOptions) {
    request.headers.set('Content-Type', 'application/json')
    request.headers.set(
      'Authorization',
      `Basic ${Base64.encode(
        `${this.options.username}:${this.options.password}`,
      )}`,
    )
  }

  createCharge(upcomingPayment: Charge): Promise<ChargeResponse> {
    console.log('client payment')
    const res = this.post<ChargeResponse>(`/chargeFJS/v1/charge`, upcomingPayment)
    
    console.log(JSON.stringify(res, null, 4));
    //return res
    const ok:ChargeResponse = {user4: '123', receptionID:'123'}
    return Promise.resolve(ok)
  }

  // could skip promise due to higher lvl graphql promise
  getCatalog() {
    const response = this.get<Catalog>(`/chargeFJS/v1/catalog`)
    return response
  }

  async getCatalogByPerformingOrg(performingOrganizationID: string) {
    const response = await this.get<Catalog>(
      `/chargeFJS/v1/catalog/performingOrg/${performingOrganizationID}`,
    )
    //console.log('service param: ' + performingOrganizationID)
    //console.log('service response: ' + response.item)
    return response
  }
}

// private readonly xroadApiUrl: string
//   private readonly xroadClientId: string
//   private readonly secret: string

//   constructor(xroadBaseUrl: string, xroadClientId: string, secret: string) {
//     const xroadPath =
//       'r1/IS-DEV/GOV/10005/Logreglan-Protected/RafraentOkuskirteini-v1'
//     this.xroadApiUrl = `${xroadBaseUrl}/${xroadPath}`
//     this.xroadClientId = xroadClientId
//     this.secret = secret
//   }

//   headers() {
//     return {
//       'X-Road-Client': this.xroadClientId,
//       SECRET: this.secret,
//       Accept: 'application/json',
//     }
//   }

//   async postApi(url: string, body: {}) {
//     const res = await fetch(`${this.xroadApiUrl}/${url}`, {
//       headers: {
//         ...this.headers(),
//         'Content-Type': 'application/json',
//       },
//       method: 'POST',
//       body: JSON.stringify(body),
//     })
//     return res.json()
//   }

//   async requestApi(url: string) {
//     const res = await fetch(`${this.xroadApiUrl}/${url}`, {
//       headers: this.headers(),
//     })
//     return res.json()
//   }