import { useEffect, useMemo, useState } from 'react'
import { useLocale } from '@island.is/localization'
import { useAuthDomainsQuery } from '@island.is/service-portal/graphql'
import { ALL_DOMAINS, ALL_DOMAINS_LABEL, ISLAND_DOMAIN } from '../constants'
import { useQueryParam } from '@island.is/service-portal/core'
import { useSessionStorage } from 'react-use'
import { useLocation, useHistory } from 'react-router-dom'

export type DomainOption = {
  label: string
  value: string
}

/**
 * This domain hook is used to fetch domains list for cuttent user as well as handle selection of the domain,
 * either in query string or session storage.
 *
 * The priority is the following:
 * 1. If there is a domain in query string and no session storage, use the query string
 * 2. If there is a domain in query string and session storage, use the session storage.
 * 3  If there is no domain in query string and session storage, use session storage.
 * 4. If there is no domain in query string and no session storage, use the default domain, i.e. ISLAND_DOMAIN.
 */
export const useDomains = () => {
  const { formatMessage, lang } = useLocale()
  const location = useLocation()
  const history = useHistory()
  const displayNameQueryParam = useQueryParam('domain')
  const [domainName, setDomainName] = useState<string | null>(null)

  const defaultLabel = formatMessage({
    id: 'sp.access-control-delegations:all-domains',
    defaultMessage: ALL_DOMAINS_LABEL,
  })
  const allDomainsOption = {
    label: defaultLabel,
    value: ALL_DOMAINS,
  }

  const { data, loading, refetch } = useAuthDomainsQuery({
    variables: {
      input: {
        lang,
      },
    },
  })

  const domainOptions: DomainOption[] = useMemo(
    () => [
      allDomainsOption,
      ...(data?.authDomains || []).map((domain) => ({
        label: domain.displayName,
        value: domain.name,
      })),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data?.authDomains],
  )

  const getOptionByLabel = (labelName?: string | null) =>
    domainOptions.find(({ label }) => labelName === label)

  const getOptionByName = (name?: string | null) =>
    domainOptions.find(({ value }) => value === name)

  const updateDomainName = (value: string | null) => {
    const option = getOptionByName(value) ?? allDomainsOption

    const newDomainName = option.value
    setDomainName(newDomainName)
    sessionStorage.setItem('domain', newDomainName)

    const query = new URLSearchParams(location.search)
    query.set('domain', option.label)
    history.push(`${location.pathname}?${query.toString()}`)
  }

  useEffect(() => {
    if (data?.authDomains) {
      const sessionDomainName = sessionStorage.getItem('domain')

      if (sessionDomainName) {
        setDomainName(sessionDomainName)
      } else if (displayNameQueryParam) {
        const option = getOptionByLabel(displayNameQueryParam)

        if (option) {
          const newDomainName = option.value ?? null
          updateDomainName(newDomainName)
        }
      } else {
        updateDomainName(ISLAND_DOMAIN)
      }
    }
  }, [data?.authDomains])

  const defaultDomainOption = domainName
    ? getOptionByName(domainName)
    : getOptionByLabel(displayNameQueryParam)

  return {
    domainName: domainName === ALL_DOMAINS ? null : domainName,
    updateDomainName,
    domainDisplayName: defaultDomainOption?.label ?? defaultLabel,
    domainOptions: domainOptions,
    defaultDomainOption: defaultDomainOption ?? allDomainsOption,
    loading,
    refetch,
  }
}
