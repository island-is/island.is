import { Module } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import {
  createClient as createManagementClient,
  type PlainClientAPI,
} from 'contentful-management'
import { LazyDuringDevScope } from '@island.is/nest/config'
import { ContentfulTranslationConfig } from './contentful-translation.config'
import {
  CONTENTFUL_MANAGEMENT_CLIENT,
  CONTENTFUL_TRANSLATION_SPACE_ID,
} from './contentful-translation.constants'

@Module({
  providers: [
    {
      provide: CONTENTFUL_MANAGEMENT_CLIENT,
      scope: LazyDuringDevScope,
      useFactory: (
        config: ConfigType<typeof ContentfulTranslationConfig>,
      ): PlainClientAPI =>
        createManagementClient(
          { accessToken: config.managementAccessToken },
          {
            type: 'plain',
            defaults: {
              spaceId: CONTENTFUL_TRANSLATION_SPACE_ID,
              environmentId: config.environmentId,
            },
          },
        ),
      inject: [ContentfulTranslationConfig.KEY],
    },
  ],
  exports: [CONTENTFUL_MANAGEMENT_CLIENT],
})
export class ContentfulTranslationModule {}
