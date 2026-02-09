import { useQuery } from '@apollo/client'
import {
  AuthScopeCategoriesDocument,
  AuthScopeCategoriesQuery,
  AuthScopeTagsDocument,
  AuthScopeTagsQuery,
} from '../ServiceCategories/ServiceCategories.generated'
import { useLocale } from '@island.is/localization'
import ServiceCategoriesList from '../../components/delegations/ServiceCategoriesList'
import { useMemo, useState } from 'react'

import { AuthApiScope } from '@island.is/api/schema'
import {
  Box,
  Filter,
  FilterMultiChoice,
  Input,
} from '@island.is/island-ui/core'
import { DelegationPaths } from '../../lib/paths'
import { DelegationsFormFooter } from '../../components/delegations/DelegationsFormFooter'
import { useNavigate } from 'react-router-dom'
import { m } from '../../lib/messages'
import { ScopesTable } from '../../components/ScopesTable/ScopesTable'

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
  const [selectedScopes, setSelectedScopes] = useState<AuthApiScope[]>([])

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
        filters: [
          { value: 'Vinnueftirlitið', label: 'Vinnueftirlitið' },
          { value: 'Mínar síður Ísland.is', label: 'Mínar síður Ísland.is' },
        ],
      },
    ]
  }, [tagsData, filter])

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
        ?.filter((category) =>
          category.scopes.some((scope) => {
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
              filter.tags.length === 0 ||
              scopeNamesInSelectedTags.has(scope.name)

            // Domains filter
            const matchesDomains =
              filter.domains.length === 0 ||
              (scope.domain?.displayName &&
                filter.domains.includes(scope.domain.displayName))

            return matchesSearch && matchesTags && matchesDomains
          }),
        )
        .flatMap((category) => category.scopes) || []
    )
  }, [categoriesData, searchQuery, filter, tagsData])

  return (
    <div>
      <Box display="flex" columnGap={2} marginBottom={4}>
        <Input
          name="search"
          placeholder={formatMessage(m.searchScopesPlaceholder)}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          backgroundColor="blue"
        />
        <Filter
          variant="popover"
          labelClearAll="Hreinsa allar síur"
          labelClear="Hreinsa síu"
          labelOpen="Opna síu"
          labelClose="Loka síu"
          labelTitle="Sía API Vörulista"
          labelResult="Sýna niðurstöður"
          onFilterClear={() => setSearchQuery('')}
          //  labelClearAll={formatMessage(m.clearAllFilters)} labelClear={formatMessage(m.clearFilter)} labelOpen={formatMessage(m.openFilter)} onFilterClear={() => setSearchQuery('')}
        >
          <FilterMultiChoice
            labelClear="Hreinsa val"
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
          onCancel={() => navigate(DelegationPaths.Delegations)}
          showShadow={false}
          confirmLabel={formatMessage(m.grantChoosePermissions)}
          confirmIcon="arrowForward"
        />
      </Box>
    </div>
  )
}

export default GrantAccessScopes
