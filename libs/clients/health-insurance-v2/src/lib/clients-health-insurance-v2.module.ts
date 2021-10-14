import { DynamicModule } from '@nestjs/common'
import { Configuration, DocumentApi } from '../../gen/fetch'
export class HealthInsuranceV2Module {
  static register(): DynamicModule {
    return {
      module: HealthInsuranceV2Module,
      imports: [],
      providers: [
        {
          provide: DocumentApi,
          useFactory: () => {
            return new DocumentApi(
              new Configuration({
                fetchApi: fetch,
                headers: {
                  'Content-Type': 'application/json',
                  Accept: 'application/json',
                  authHeader: `{"username": "","password": ""}`,
                },
              }),
            )
          },
        },
      ],
      exports: [DocumentApi],
    }
  }
}
