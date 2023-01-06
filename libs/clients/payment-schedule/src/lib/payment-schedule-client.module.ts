import { DynamicModule, Module } from '@nestjs/common'
import { Configuration, DefaultApi } from '../gen/fetch'
import { PaymentScheduleServiceOptions } from './types'
import { createEnhancedFetch } from '@island.is/clients/middlewares'

@Module({})
export class PaymentScheduleClientModule {
  static register(options: PaymentScheduleServiceOptions): DynamicModule {
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
                fetchApi: createEnhancedFetch({
                  name: 'clients-payment-schedule',
                  treat400ResponsesAsErrors: true,
                  logErrorResponseBody: true,
                  timeout: 90000,
                }),
                basePath: baseURL,
                headers: {
                  'Content-Type': 'application/json',
                  Accept: 'application/json',
                  'X-Road-Client': options.xRoadClientId,
                },
              }),
            ),
        },
      ],
      exports: [DefaultApi],
    }
  }
}
