import { Inject, Injectable } from '@nestjs/common'
import type { GraphqlCacheKeyProvider } from '@island.is/nest/graphql'
import {
  FEATURE_FLAG_CLIENT,
  type FeatureFlagClient,
} from '@island.is/nest/feature-flags'
import { Features } from '@island.is/feature-flags'

/**
 * Cache vacancy queries by the evaluated feature flag result ("true"/"false")
 * instead of by IP, so we get exactly 2 cache entries.
 */
@Injectable()
export class VacancyCacheKeyProvider implements GraphqlCacheKeyProvider {
  operationNames = [
    'GetIcelandicGovernmentInstitutionVacancies',
    'GetIcelandicGovernmentInstitutionVacancyDetails',
  ]

  // Match anonymous or renamed queries that resolve vacancy fields.
  queryPatterns = [
    /icelandicGovernmentInstitutionVacancies/,
    /icelandicGovernmentInstitutionVacancyById/,
  ]

  constructor(
    @Inject(FEATURE_FLAG_CLIENT)
    private readonly featureFlagClient: FeatureFlagClient,
  ) {}

  async getCacheKeyData(requestContext: {
    request: { http?: { headers: { get(name: string): string | null } } }
  }): Promise<string> {
    const forwardedFor =
      requestContext.request.http?.headers.get('x-forwarded-for') ?? ''
    const ip =
      forwardedFor
        .split(',')
        .map((s) => s.trim())
        .find((s) => s.length > 0) ?? ''

    const useNewApi = await this.featureFlagClient.getValue(
      Features.useNewVacancyApi,
      false,
      { id: ip, attributes: { ipAddress: ip } },
    )

    return String(useNewApi)
  }
}
