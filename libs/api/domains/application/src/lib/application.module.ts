import { Module } from '@nestjs/common'
import fetch from 'isomorphic-fetch'
import { ApplicationResolver } from './application.resolver'
import { ApplicationService } from './application.service'
import { ApplicationsApi, Configuration } from '../../gen/fetch'

@Module({
  providers: [
    ApplicationResolver,
    ApplicationService,
    {
      provide: ApplicationsApi,
      useFactory: () =>
        new ApplicationsApi(
          new Configuration({
            fetchApi: fetch,
            basePath: 'http://localhost:3333',
          }),
        ),
    },
  ],
})
export class ApplicationModule {}
