
import { Provider } from '@nestjs/common';
import { createEnhancedFetch, type EnhancedFetchAPI } from '@island.is/clients/middlewares';
import { ConfigType, LazyDuringDevScope } from '@island.is/nest/config';

export const ContentfulFetchProviderKey = 'ContentfulFetchProviderKey';

export const ContentfulFetchProvider: Provider<EnhancedFetchAPI> = {
  provide: ContentfulFetchProviderKey,
  scope: LazyDuringDevScope,
  useFactory: (config: ConfigType<typeof ContentfulClientConfig>) =>
    createEnhancedFetch({
      name: 'contentful-graphql-client',
      autoAuth: config.apiKey ? {
        mode: 'header',
        header: 'Authorization',
        value: `Bearer ${config.apiKey}`,
      } : undefined,
    }),
  inject: [ContentfulClientConfig.KEY],
};
