import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  MOCK_API_KEYS,
  MOCK_APPROVED_SERVICE_PROVIDERS,
  MOCK_COMPANY,
  MOCK_EQUALITY_PLANS,
  MOCK_GRANTED_BY_NATIONAL_ID,
  MOCK_PLAN_SUBMISSIONS,
  MOCK_REPORT_SUBMISSIONS,
  MOCK_REPORTS,
  MOCK_SERVICE_PROVIDERS,
} from './data'
import {
  DirectorateOfEqualityApiKey,
  DirectorateOfEqualityApiKeyType,
  DirectorateOfEqualityAvailableServiceProvider,
  DirectorateOfEqualityCompany,
  DirectorateOfEqualityEqualityPlan,
  DirectorateOfEqualityIssuedApiKey,
  DirectorateOfEqualityMutationResult,
  DirectorateOfEqualityReport,
  DirectorateOfEqualityServiceProvider,
  DirectorateOfEqualitySubmission,
  DirectorateOfEqualitySubmissionType,
} from './types'

const MOCK_DELAY_MS = 400

type MockQueryResult<T> = {
  data: T | undefined
  loading: boolean
  error: Error | undefined
}

let companyLoaded = false

const useMockLoading = (skip: boolean, key: string) => {
  const [loadedKey, setLoadedKey] = useState<string | null>(null)
  useEffect(() => {
    if (skip) {
      return
    }
    const timer = setTimeout(() => setLoadedKey(key), MOCK_DELAY_MS)
    return () => clearTimeout(timer)
  }, [skip, key])
  return !skip && loadedKey !== key
}

const loadedQueryKeys = new Set<string>()

const useMockCachedLoading = (skip: boolean, key: string) => {
  const loading = useMockLoading(skip || loadedQueryKeys.has(key), key)
  useEffect(() => {
    if (!skip && !loading) {
      loadedQueryKeys.add(key)
    }
  }, [skip, loading, key])
  return loading
}

export const useDirectorateOfEqualityCompanyQuery = (): MockQueryResult<{
  directorateOfEqualityCompany: DirectorateOfEqualityCompany
}> => {
  const loading = useMockLoading(companyLoaded, 'company')
  useEffect(() => {
    if (!loading) {
      companyLoaded = true
    }
  }, [loading])
  const data = useMemo(
    () => ({ directorateOfEqualityCompany: MOCK_COMPANY }),
    [],
  )
  return { data: loading ? undefined : data, loading, error: undefined }
}

export const useDirectorateOfEqualitySubmissionsQuery = (options: {
  variables: { input: { type: DirectorateOfEqualitySubmissionType } }
  skip?: boolean
}): MockQueryResult<{
  directorateOfEqualitySubmissions: { items: DirectorateOfEqualitySubmission[] }
}> => {
  const { type } = options.variables.input
  const skip = options.skip ?? false
  const loading = useMockLoading(skip, type)
  const data = useMemo(
    () => ({
      directorateOfEqualitySubmissions: {
        items:
          type === DirectorateOfEqualitySubmissionType.EQUALITY_PLAN
            ? MOCK_PLAN_SUBMISSIONS
            : MOCK_REPORT_SUBMISSIONS,
      },
    }),
    [type],
  )
  return { data: loading || skip ? undefined : data, loading, error: undefined }
}

export const useDirectorateOfEqualityEqualityPlanQuery = (options: {
  variables: { input: { id: string } }
}): MockQueryResult<{
  directorateOfEqualityEqualityPlan: DirectorateOfEqualityEqualityPlan | null
}> => {
  const { id } = options.variables.input
  const loading = useMockLoading(false, id)
  const data = useMemo(
    () => ({
      directorateOfEqualityEqualityPlan:
        MOCK_EQUALITY_PLANS.find((plan) => plan.id === id) ?? null,
    }),
    [id],
  )
  return { data: loading ? undefined : data, loading, error: undefined }
}

export const useDirectorateOfEqualityReportQuery = (options: {
  variables: { input: { id: string } }
}): MockQueryResult<{
  directorateOfEqualityReport: DirectorateOfEqualityReport | null
}> => {
  const { id } = options.variables.input
  const loading = useMockLoading(false, id)
  const data = useMemo(
    () => ({
      directorateOfEqualityReport:
        MOCK_REPORTS.find((report) => report.id === id) ?? null,
    }),
    [id],
  )
  return { data: loading ? undefined : data, loading, error: undefined }
}

type MockRefetchableQueryResult<T> = MockQueryResult<T> & {
  refetch: () => void
}

type MockMutationOptions<TData> = {
  onCompleted?: (data: TData) => void
  onError?: (error: Error) => void
}

type MockMutationTuple<TVariables, TData> = [
  (options: { variables: TVariables }) => Promise<{ data: TData }>,
  { loading: boolean },
]

const mockStore: {
  serviceProviders: DirectorateOfEqualityServiceProvider[]
  apiKeys: DirectorateOfEqualityApiKey[]
} = {
  serviceProviders: [...MOCK_SERVICE_PROVIDERS],
  apiKeys: [...MOCK_API_KEYS],
}

const randomHex = (length: number) =>
  Array.from({ length }, () =>
    Math.floor(Math.random() * 16).toString(16),
  ).join('')

const useMockRefetch = () => {
  const [, setVersion] = useState(0)
  const refetch = useCallback(() => setVersion((value) => value + 1), [])
  return { refetch }
}

const useMockMutation = <TVariables, TData>(
  run: (variables: TVariables) => TData,
  options?: MockMutationOptions<TData>,
): MockMutationTuple<TVariables, TData> => {
  const [loading, setLoading] = useState(false)
  const mutate = ({ variables }: { variables: TVariables }) => {
    setLoading(true)
    return new Promise<{ data: TData }>((resolve) => {
      setTimeout(() => {
        const data = run(variables)
        setLoading(false)
        options?.onCompleted?.(data)
        resolve({ data })
      }, MOCK_DELAY_MS)
    })
  }
  return [mutate, { loading }]
}

export const useDirectorateOfEqualityServiceProvidersQuery = (): MockRefetchableQueryResult<{
  directorateOfEqualityServiceProviders: {
    items: DirectorateOfEqualityServiceProvider[]
  }
}> => {
  const loading = useMockCachedLoading(false, 'serviceProviders')
  const { refetch } = useMockRefetch()
  const data = {
    directorateOfEqualityServiceProviders: {
      items: [...mockStore.serviceProviders],
    },
  }
  return {
    data: loading ? undefined : data,
    loading,
    error: undefined,
    refetch,
  }
}

export const useDirectorateOfEqualityAvailableServiceProvidersQuery = (): MockQueryResult<{
  directorateOfEqualityAvailableServiceProviders: {
    items: DirectorateOfEqualityAvailableServiceProvider[]
  }
}> => {
  const loading = useMockLoading(false, 'availableServiceProviders')
  const data = useMemo(
    () => ({
      directorateOfEqualityAvailableServiceProviders: {
        items: MOCK_APPROVED_SERVICE_PROVIDERS.filter(
          (provider) =>
            !mockStore.serviceProviders.some(
              (granted) => granted.nationalId === provider.nationalId,
            ),
        ),
      },
    }),
    [],
  )
  return { data: loading ? undefined : data, loading, error: undefined }
}

export const useDirectorateOfEqualityApiKeysQuery = (): MockRefetchableQueryResult<{
  directorateOfEqualityApiKeys: { items: DirectorateOfEqualityApiKey[] }
}> => {
  const loading = useMockCachedLoading(false, 'apiKeys')
  const { refetch } = useMockRefetch()
  const data = {
    directorateOfEqualityApiKeys: { items: [...mockStore.apiKeys] },
  }
  return {
    data: loading ? undefined : data,
    loading,
    error: undefined,
    refetch,
  }
}

export const useDirectorateOfEqualityIssueApiKeyMutation = (
  options?: MockMutationOptions<{
    directorateOfEqualityIssueApiKey: DirectorateOfEqualityIssuedApiKey
  }>,
) =>
  useMockMutation(
    ({
      input,
    }: {
      input: {
        label: string | null
        expiresAt: string
        type: DirectorateOfEqualityApiKeyType
      }
    }) => {
      const keyId = randomHex(16)
      const issued: DirectorateOfEqualityIssuedApiKey = {
        id: `key-${keyId}`,
        keyId,
        type: input.type,
        key: `doe_${keyId}_${randomHex(48)}`,
        label: input.label,
        createdAt: new Date().toISOString(),
        createdByNationalId: MOCK_GRANTED_BY_NATIONAL_ID,
        expiresAt: input.expiresAt,
        lastUsedAt: null,
        revokedAt: null,
      }
      const stored: DirectorateOfEqualityApiKey = {
        id: issued.id,
        keyId,
        type: issued.type,
        label: issued.label,
        createdAt: issued.createdAt,
        createdByNationalId: issued.createdByNationalId,
        expiresAt: issued.expiresAt,
        lastUsedAt: null,
        revokedAt: null,
      }
      mockStore.apiKeys = [stored, ...mockStore.apiKeys]
      return { directorateOfEqualityIssueApiKey: issued }
    },
    options,
  )

export const useDirectorateOfEqualityRevokeApiKeyMutation = (
  options?: MockMutationOptions<{
    directorateOfEqualityRevokeApiKey: DirectorateOfEqualityMutationResult
  }>,
) =>
  useMockMutation(({ input }: { input: { id: string } }) => {
    mockStore.apiKeys = mockStore.apiKeys.map((apiKey) =>
      apiKey.id === input.id
        ? { ...apiKey, revokedAt: new Date().toISOString() }
        : apiKey,
    )
    return { directorateOfEqualityRevokeApiKey: { success: true } }
  }, options)

export const useDirectorateOfEqualityGrantServiceProviderMutation = (
  options?: MockMutationOptions<{
    directorateOfEqualityGrantServiceProvider: DirectorateOfEqualityMutationResult
  }>,
) =>
  useMockMutation(({ input }: { input: { nationalId: string } }) => {
    const provider = MOCK_APPROVED_SERVICE_PROVIDERS.find(
      (item) => item.nationalId === input.nationalId,
    )
    if (provider) {
      mockStore.serviceProviders = [
        {
          ...provider,
          grantedAt: new Date().toISOString(),
          grantedByNationalId: MOCK_GRANTED_BY_NATIONAL_ID,
        },
        ...mockStore.serviceProviders,
      ]
    }
    return {
      directorateOfEqualityGrantServiceProvider: { success: !!provider },
    }
  }, options)

export const useDirectorateOfEqualityRevokeServiceProviderMutation = (
  options?: MockMutationOptions<{
    directorateOfEqualityRevokeServiceProvider: DirectorateOfEqualityMutationResult
  }>,
) =>
  useMockMutation(({ input }: { input: { nationalId: string } }) => {
    mockStore.serviceProviders = mockStore.serviceProviders.filter(
      (provider) => provider.nationalId !== input.nationalId,
    )
    return { directorateOfEqualityRevokeServiceProvider: { success: true } }
  }, options)
