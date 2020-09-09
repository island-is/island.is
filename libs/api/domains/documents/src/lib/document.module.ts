import { Module, Scope } from '@nestjs/common'
import fetch from 'isomorphic-fetch'
import { DocumentResolver } from './document.resolver'
import { DocumentService } from './document.service'
import { CustomersApi, Configuration } from '../../gen/fetch'
import { DocumentOauthConnection } from './document.connection'

@Module({
  providers: [
    DocumentResolver,
    DocumentService,
    {
      provide: CustomersApi,
      useFactory: async () =>
        new CustomersApi(
          new Configuration({
            fetchApi: fetch,
            basePath: 'https://test-skjalabirting-island-is.azurewebsites.net',
            //TODO Fetch a new token on expiration
            headers: {
              Authorization: `Bearer ${await DocumentOauthConnection.fetchToken()}`,
            },
          }),
        ),
      //scope: Scope.REQUEST
    },
  ],
})
export class DocumentModule {}
