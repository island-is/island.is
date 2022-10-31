import { useEffect, useMemo, useState } from 'react'
import { useLocale } from '@island.is/localization'
import { useAuthDomainsQuery } from '@island.is/service-portal/graphql'
import { ALL_DOMAINS, ISLAND_DOMAIN } from '../constants/domain'
import { useQueryParam } from '@island.is/service-portal/core'
import { useLocation, useHistory } from 'react-router-dom'
import { storageFactory } from '@island.is/shared/utils'

const sessionStore = storageFactory(() => sessionStorage)

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
  const [selectedDomainName, setSelectedDomainName] = useState<string | null>(
    null,
  )

  const defaultLabel = formatMessage({
    id: 'sp.access-control-delegations:all-domains',
    defaultMessage: 'Öll kerfi',
  })
  const allDomainsOption = {
    label: defaultLabel,
    value: ALL_DOMAINS,
  }

  const { data, loading } = useAuthDomainsQuery({
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

  const getOptionByName = (name?: string | null) =>
    domainOptions.find(({ value }) => value === name)

  /**
   * Updates the domain name in state, session storage and query string.
   * If no domain exist in query string then we skip it.
   */
  const updateDomainName = (value: string | null) => {
    const option = getOptionByName(value) ?? allDomainsOption

    const newDomainName = option.value
    setSelectedDomainName(newDomainName)
    sessionStore.setItem('domain', newDomainName)

    const query = new URLSearchParams(location.search)

    if (query.get('domain')) {
      query.set('domain', option.value)
      history.push(`${location.pathname}?${query.toString()}`)
    }
  }

  useEffect(() => {
    if (data?.authDomains) {
      const sessionDomainName = sessionStore.getItem('domain')

      if (sessionDomainName) {
        setSelectedDomainName(sessionDomainName)
      } else if (displayNameQueryParam) {
        const option = getOptionByName(displayNameQueryParam)

        if (option) {
          const newDomainName = option.value ?? null
          updateDomainName(newDomainName)
        }
      } else {
        updateDomainName(ISLAND_DOMAIN)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.authDomains])

  return {
    domainName: selectedDomainName === ALL_DOMAINS ? null : selectedDomainName,
    updateDomainName,
    domainOptions: domainOptions,
    defaultDomainOption:
      getOptionByName(selectedDomainName) ?? allDomainsOption,
    loading,
  }
}
