import type { GraphqlCacheKeyProvider } from '@island.is/nest/graphql'

/**
 * Include client IP in the response cache key for vacancy queries,
 * because the useNewVacancyApi feature flag targets by IP address.
 */
export const vacancyCacheKeyProvider: GraphqlCacheKeyProvider = {
  operationNames: [
    'GetIcelandicGovernmentInstitutionVacancies',
    'GetIcelandicGovernmentInstitutionVacancyDetails',
  ],
  getCacheKeyData: (requestContext) =>
    requestContext.request.http?.headers.get('x-forwarded-for') ?? '',
}
