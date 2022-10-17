import { useMemo } from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import { useAuthDomainsQuery } from '@island.is/service-portal/graphql'

export const ALL_DOMAINS = 'all-domains'

type DomainOption = {
  label: string
  value: string
}

export const useDomains = (domainName?: string | null) => {
  useNamespaces('sp.access-control-delegations')

  const { formatMessage, lang } = useLocale()
  const { data, loading, refetch } = useAuthDomainsQuery({
    variables: {
      input: {
        lang,
      },
    },
  })

  const domainOptions: DomainOption[] = useMemo(
    () => [
      {
        label: formatMessage({
          id: 'sp.access-control-delegations:all-domains',
          defaultMessage: 'Öll kerfi',
        }),
        value: ALL_DOMAINS,
      },
      ...(data?.authDomains || []).map((domain) => ({
        label: domain.displayName,
        value: domain.name,
      })),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data?.authDomains],
  )

  return {
    domainOptions: domainOptions,
    defaultDomainOption:
      domainOptions.find(({ value }) => value === domainName) ??
      domainOptions[0],
    loading,
    refetch,
  }
}
