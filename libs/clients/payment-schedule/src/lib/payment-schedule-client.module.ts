import { DynamicModule, Module } from '@nestjs/common'
import { Base64 } from 'js-base64'
import { Configuration, DefaultApi } from '../gen/fetch'
import { PaymentScheduleServiceOptions } from './types'

@Module({})
export class PaymentScheduleClientModule {
  static register(options: PaymentScheduleServiceOptions): DynamicModule {
    console.log('PaymentScheduleClientModule.register()', options)
    const { xRoadBaseUrl, xRoadProviderId } = options
    const baseURL = `${xRoadBaseUrl}/r1/${xRoadProviderId}/paymentSchedule_v1`
    return {
      module: PaymentScheduleClientModule,
      imports: [],
      providers: [
        {
          provide: DefaultApi,
          useFactory: () =>
            new DefaultApi(
              new Configuration({
                fetchApi: fetch,
                basePath: baseURL,
                headers: {
                  'Content-Type': 'application/json',
                  Accept: 'application/json',
                  'X-Road-Client': options.xRoadClientId,
                  Authorization: `Basic ${Base64.encode(
                    `${options.username}:${options.password}`,
                  )}`,
                },
              }),
            ),
        },
      ],
      exports: [DefaultApi],
    }
  }
}
