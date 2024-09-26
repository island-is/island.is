import { Provider } from '@nestjs/common'

import {
  createEnhancedFetch,
  type EnhancedFetchAPI,
} from '@island.is/clients/middlewares'
import { environment } from '../../../environment'

export const ENHANCED_FETCH_PROVIDER_KEY = 'enhanced-fetch-provider'

export const EnhancedFetchProvider: Provider<EnhancedFetchAPI> = {
  provide: ENHANCED_FETCH_PROVIDER_KEY,
  useFactory: () =>
    createEnhancedFetch({
      name: `bff-${environment.name}-service`,
    }),
}
