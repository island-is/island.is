import { Module } from '@nestjs/common'

import { CmsModule } from '@island.is/cms'

import { CmsTranslationsService } from './cms-translations.service'
import { CmsTranslationsResolver } from './cms-translations.resolver'
import { IntlService } from './intl.service'

import { GraphQLClient } from 'graphql-request'
import { getSdk } from '../../contentful/client'

@Module({
  controllers: [],
  imports: [CmsModule],
  providers: [
    CmsTranslationsResolver,
    CmsTranslationsService,
    IntlService,
    {
      provide: 'GRAPHQL_CLIENT',
      useFactory: async () => {
        const client = new GraphQLClient(
          'https://graphql.contentful.com/content/v1/spaces/8k0h54kbe6bj/environments/master',
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${process.env.CONTENTFUL_DELIVERY_KEY}`,
            },
          },
        )

        return getSdk(client)
      },
    },
  ],
  exports: [CmsTranslationsService, IntlService],
})
export class CmsTranslationsModule {}
