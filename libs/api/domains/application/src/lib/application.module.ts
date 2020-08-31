import { Module } from '@nestjs/common'
import fetch from 'isomorphic-fetch'
import { ApplicationResolver } from './application.resolver'
import { ApplicationService } from './application.service'
import { ApplicationApi, Configuration } from '../../gen/fetch'

@Module({
  providers: [
    ApplicationResolver,
    ApplicationService,
    {
      provide: ApplicationApi,
      useFactory: () =>
        new ApplicationApi(
          new Configuration({
            fetchApi: fetch,
            basePath: 'http://localhost:3333',
          }),
        ),
    },
  ],
})
export class ApplicationModule {}
