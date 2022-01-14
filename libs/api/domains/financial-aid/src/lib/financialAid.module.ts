import { Module, DynamicModule } from '@nestjs/common'
import { FinancialAidResolver } from './financialAid.resolver'
import { FinancialAidService } from './financialAid.service'
import { ApplicationApi, Configuration } from '../../gen/fetch'
import { createEnhancedFetch } from '@island.is/clients/middlewares'

export interface Config {
  baseApiUrl: string
}

@Module({})
export class FinancialAidModule {
  static register(config: Config): DynamicModule {
    return {
      module: FinancialAidModule,
      providers: [
        FinancialAidResolver,
        FinancialAidService,
        {
          provide: ApplicationApi,
          useFactory: async () =>
            new ApplicationApi(
              new Configuration({
                fetchApi: createEnhancedFetch({
                  name: 'FinancialAidModule.applicationApi',
                  timeout: 60000,
                }),
                basePath: config.baseApiUrl,
              }),
            ),
        },
      ],
      exports: [],
    }
  }
}
