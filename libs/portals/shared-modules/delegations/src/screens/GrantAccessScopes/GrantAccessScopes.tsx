import { useQuery } from '@apollo/client'
import {
  AuthScopeCategoriesDocument,
  AuthScopeCategoriesQuery,
  AuthScopeTagsDocument,
  AuthScopeTagsQuery,
} from '../ServiceCategories/ServiceCategories.generated'
import { useLocale } from '@island.is/localization'
import ServiceCategoriesList from '../../components/delegations/ServiceCategoriesList'
import { useEffect, useMemo, useState } from 'react'

import { AuthApiScope } from '@island.is/api/schema'
import {
  Box,
  Filter,
  FilterMultiChoice,
  Input,
  Text,
} from '@island.is/island-ui/core'
import { DelegationPaths } from '../../lib/paths'
import { DelegationsFormFooter } from '../../components/delegations/DelegationsFormFooter'
import { useNavigate } from 'react-router-dom'
import { m } from '../../lib/messages'
import { ScopesTable } from '../../components/ScopesTable/ScopesTable'
import { IntroHeader } from '@island.is/portals/core'
import * as styles from './GrantAccessScopes.css'
import { useDelegationForm } from '../../context'
import add from 'date-fns/add'
import { useDomains } from '../../hooks/useDomains/useDomains'

export const GrantAccessScopes = () => {
  const { lang } = useLocale()
  const { formatMessage } = useLocale()
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<{
    tags: string[]
    domains: string[]
  }>({
    tags: [],
    domains: [],
  })
  const navigate = useNavigate()
  const {
    data: categoriesData,
    loading: categoriesLoading,
    error: categoriesError,
  } = useQuery<AuthScopeCategoriesQuery>(AuthScopeCategoriesDocument, {
    variables: { lang },
  })
  const {
    data: tagsData,
    // loading: tagsLoading,
    // error: tagsError,
  } = useQuery<AuthScopeTagsQuery>(AuthScopeTagsDocument, {
    variables: { lang },
  })
  const { identities, selectedScopes, setSelectedScopes } = useDelegationForm()
  const defaultDate = add(new Date(), { years: 1 })
  const { options: domainOptions } = useDomains(false)

  const filters = useMemo(() => {
    return [
      {
        id: 'tags',
        label: 'Tags',
        selected: filter.tags,
        filters:
          tagsData?.authScopeTags.map((tag) => ({
            value: tag.id,
            label: tag.title,
          })) || [],
      },
      {
        id: 'domains',
        label: 'Stofnun',
        selected: filter.domains,
        filters: domainOptions,
      },
    ]
  }, [tagsData, filter, domainOptions])

  const onSelectScope = (scope: AuthApiScope) => {
    if (selectedScopes.some((s) => s.name === scope.name)) {
      setSelectedScopes(selectedScopes.filter((s) => s.name !== scope.name))
    } else {
      setSelectedScopes([...selectedScopes, scope])
    }
  }

  const filteredScopes = useMemo(() => {
    const searchQueryLower = searchQuery.toLowerCase()

    // Build a set of scope names that belong to the selected tags
    const scopeNamesInSelectedTags = new Set<string>()
    if (filter.tags.length > 0 && tagsData?.authScopeTags) {
      tagsData.authScopeTags
        .filter((tag) => filter.tags.includes(tag.id))
        .forEach((tag) => {
          tag.scopes.forEach((scope) => {
            scopeNamesInSelectedTags.add(scope.name)
          })
        })
    }

    return (
      categoriesData?.authScopeCategories
        ?.flatMap((category) => category.scopes)
        .filter((scope) => {
          // Search query filter
          const displayName = scope.displayName.toLowerCase()
          const description = scope.description?.toLowerCase()
          const name = scope.name.toLowerCase()
          const domain = scope.domain?.displayName?.toLowerCase()
          const matchesSearch =
            displayName.includes(searchQueryLower) ||
            description?.includes(searchQueryLower) ||
            name.includes(searchQueryLower) ||
            domain?.includes(searchQueryLower)

          // Tags filter - check if scope name is in selected tags
          const matchesTags =
            filter.tags.length === 0 || scopeNamesInSelectedTags.has(scope.name)

          // Domains filter
          const matchesDomains =
            filter.domains.length === 0 ||
            (scope.domain?.name && filter.domains.includes(scope.domain.name))

          return matchesSearch && matchesTags && matchesDomains
        }) || []
    )
  }, [categoriesData, searchQuery, filter, tagsData])

  const onConfirm = () => {
    setSelectedScopes(
      selectedScopes.map((scope) => ({
        ...scope,
        validTo: defaultDate,
      })),
    )
    navigate(DelegationPaths.DelegationsGrantPeriod)
  }

  // on mount, check if there are identities selected, if not, navigate to first step
  useEffect(() => {
    if (identities.length === 0) {
      navigate(DelegationPaths.DelegationsGrantNew)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <IntroHeader
        title={formatMessage(m.grantAccessStepsTitle)}
        intro={formatMessage(m.grantAccessStepsIntro)}
      />
      <Text variant="h4" marginBottom={4}>
        {formatMessage(m.scopesTableTitle)}
      </Text>
      <Box display="flex" columnGap={2} marginBottom={4}>
        <div className={styles.inputWrapper}>
          <Input
            name="search"
            placeholder={formatMessage(m.searchScopesPlaceholder)}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            backgroundColor="blue"
            icon={{ name: 'search' }}
            size="sm"
          />
        </div>
        <Filter
          variant="popover"
          labelClearAll={formatMessage(m.filterClearAll)}
          labelClear={formatMessage(m.filterClear)}
          labelOpen={formatMessage(m.filterOpen)}
          onFilterClear={() => {
            setFilter({
              tags: [],
              domains: [],
            })
          }}
          filterCount={filter.tags.length + filter.domains.length}
        >
          <FilterMultiChoice
            labelClear={formatMessage(m.filterClear)}
            categories={filters}
            onChange={(event) =>
              setFilter({
                ...filter,
                [event.categoryId]: event.selected,
              })
            }
            onClear={(categoryId) =>
              setFilter({
                ...filter,
                [categoryId]: [],
              })
            }
          />
        </Filter>
      </Box>

      {filter.tags.length > 0 ||
      filter.domains.length > 0 ||
      searchQuery.length > 0 ? (
        <ScopesTable
          scopes={filteredScopes}
          onSelectScope={onSelectScope}
          selectedScopes={selectedScopes}
        />
      ) : (
        <ServiceCategoriesList
          loading={categoriesLoading}
          error={!!categoriesError}
          categories={categoriesData?.authScopeCategories || []}
          onSelectScope={onSelectScope}
          selectedScopes={selectedScopes}
        />
      )}
      <Box marginBottom={7}>
        <DelegationsFormFooter
          // disabled={!formState.isValid || mutationLoading}
          // loading={mutationLoading}
          disabled={selectedScopes.length === 0}
          onCancel={() => navigate(DelegationPaths.Delegations)}
          showShadow={false}
          confirmLabel={formatMessage(m.grantChoosePeriod)}
          confirmIcon="arrowForward"
          onConfirm={onConfirm}
        />
      </Box>
    </div>
  )
}

export default GrantAccessScopes
