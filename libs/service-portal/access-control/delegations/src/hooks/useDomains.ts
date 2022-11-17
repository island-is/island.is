import { useEffect, useMemo, useState } from 'react'
import { useLocale } from '@island.is/localization'
import {
  AuthDomainDirection,
  useAuthDomainsQuery,
} from '@island.is/service-portal/graphql'
import { ALL_DOMAINS, ISLAND_DOMAIN } from '../constants/domain'
import { useQueryParam } from '@island.is/service-portal/core'
import { useLocation, useHistory } from 'react-router-dom'
import { isDefined, storageFactory } from '@island.is/shared/utils'

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
 *
 * @param includeDefaultOption If true, the default option will be added to the list of domains.
 */
export const useDomains = (includeDefaultOption = true) => {
  const { formatMessage, lang } = useLocale()
  const location = useLocation()
  const history = useHistory()
  const displayNameQueryParam = useQueryParam('domain')
  const [domainName, setDomainName] = useState<string | null>(null)

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
        direction: AuthDomainDirection.Outgoing,
      },
    },
  })

  const options: DomainOption[] = useMemo(
    () =>
      [
        includeDefaultOption ? allDomainsOption : null,
        ...(data?.authDomains || []).map((domain) => ({
          label: domain.displayName,
          value: domain.name,
        })),
      ].filter(isDefined),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data?.authDomains],
  )

  const getOptionByName = (name?: string | null) =>
    options.find(({ value }) => value === name)

  /**
   * Updates the domain name in state, session storage and query string.
   * If no domain exist in query string then we skip it.
   */
  const updateDomain = (opt: DomainOption) => {
    const option = opt ?? allDomainsOption
    const name = option.value
    setDomainName(name)
    sessionStore.setItem('domain', name)

    const query = new URLSearchParams(location.search)

    if (query.get('domain')) {
      query.set('domain', name)
      history.push(`${location.pathname}?${query.toString()}`)
    }
  }

  useEffect(() => {
    if (data?.authDomains) {
      const sessionDomainName = sessionStore.getItem('domain')

      if (sessionDomainName) {
        setDomainName(sessionDomainName)
      } else {
        const option = getOptionByName(displayNameQueryParam ?? ISLAND_DOMAIN)

        if (option) {
          updateDomain(option)
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.authDomains])

  return {
    name: domainName === ALL_DOMAINS ? null : domainName,
    updateDomain,
    options,
    selectedOption: getOptionByName(domainName),
    loading,
  }
}
