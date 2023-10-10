import { useEffect, useMemo, useState } from 'react'
import { AuthDomainDirection } from '@island.is/api/schema'
import { useLocale } from '@island.is/localization'
import { ALL_DOMAINS } from '../../constants/domain'
import { useQueryParam } from '@island.is/portals/core'
import { useLocation, useNavigate } from 'react-router-dom'
import { isDefined } from '@island.is/shared/utils'
import { useAuthDomainsQuery } from './useDomains.generated'
import { m } from '../../lib/messages'

export type DomainOption = {
  label: string
  value: string
}

/**
 * This domain hook is used to fetch domains list for current user as well as handle selection of the domain,
 * either in query string or session storage.
 *
 * The priority is the following:
 * 1. If there is a domain in query string and no session storage, use the query string
 * 2. If there is a domain in query string and session storage, use the query string.
 * 3  If there is no domain in query string and session storage, use session storage.
 * 4. If there is no domain in query string and no session storage, use the default domain, i.e. (ISLAND_DOMAIN or ADMIN_ISLAND_DOMAIN).
 *
 * @param includeDefaultOption If true, the default option will be added to the list of domains.
 */
export const useDomains = (includeDefaultOption = true) => {
  const { formatMessage, lang } = useLocale()
  const location = useLocation()
  const navigate = useNavigate()

  const defaultPortalDomain = ALL_DOMAINS
  const displayNameQueryParam = useQueryParam('domain')

  const [domainName, setDomainName] = useState<string | null>(null)
  const [queryString, setQueryString] = useState<string>('')

  const defaultLabel = formatMessage(m.allDomains)
  const allDomainsOption = {
    label: defaultLabel,
    value: ALL_DOMAINS,
  }

  const { data, loading } = useAuthDomainsQuery({
    variables: {
      input: {
        lang,
        direction: AuthDomainDirection.outgoing,
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

    const query = new URLSearchParams({ domain: name })

    const domainQuery = name !== ALL_DOMAINS ? `?${query.toString()}` : ''
    setQueryString(domainQuery)

    navigate(`${location.pathname}${domainQuery}`, {
      replace: true,
    })
  }

  const updateDomainByName = (name: string) => {
    const option = getOptionByName(name)

    // Priority
    // 1. Option is found by name
    // 2. Option is not found by name, try to find default domain
    // 3. Default domain option is not found, select the first option in the list
    if (option) {
      updateDomain(option)
    } else {
      const islandDomainOption = getOptionByName(defaultPortalDomain)

      // Default to default domain if the domain is not found
      if (islandDomainOption) {
        updateDomain(islandDomainOption)
      } else {
        // Default to the first option in the list
        updateDomain(options[0])
      }
    }
  }

  useEffect(() => {
    if (data?.authDomains) {
      // Priority
      // 1. Query string
      // 2. Default domain
      if (displayNameQueryParam) {
        updateDomainByName(displayNameQueryParam)
      } else {
        updateDomainByName(defaultPortalDomain)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.authDomains])

  return {
    name: domainName,
    updateDomain,
    options,
    selectedOption: getOptionByName(domainName),
    loading,
    queryString,
  }
}
