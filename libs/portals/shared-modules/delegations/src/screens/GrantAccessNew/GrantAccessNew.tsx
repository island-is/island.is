import React, { useState } from 'react'
import { useLocale } from '@island.is/localization'
import { useQuery } from '@apollo/client'
import {
  Box,
  Text,
  Input,
  Button,
  Stack,
  Accordion,
  AccordionItem,
  Checkbox,
  SkeletonLoader,
  AlertMessage,
  Inline,
  Tag,
  Divider,
  DatePicker,
} from '@island.is/island-ui/core'
import { IntroHeader } from '@island.is/portals/core'
import { m } from '../../lib/messages'
import {
  AuthScopeCategoriesForGrantDocument,
  AuthScopeCategoriesForGrantQuery,
  AuthScopeTagsForGrantDocument,
  AuthScopeTagsForGrantQuery,
  AuthDomainsForGrantDocument,
  AuthDomainsForGrantQuery,
} from './GrantAccessNew.generated'
import { useScopeFiltering, getTotalScopeCount } from './useScopeFiltering'
import { useScopeSelection } from './useScopeSelection'

export const GrantAccessNew = () => {
  const { formatMessage, lang } = useLocale()

  // Step 1: Identity
  const [toNationalId, setToNationalId] = useState('')
  const [identity, setIdentity] = useState<{
    nationalId: string
    name: string
    type: string
  } | null>(null)

  // Step 2: Scope Selection
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])

  // Step 3: Validity
  const [validityPeriod, setValidityPeriod] = useState<Date | undefined>(
    undefined,
  )

  // Fetch data
  const {
    data: categoriesData,
    loading: categoriesLoading,
    error: categoriesError,
  } = useQuery<AuthScopeCategoriesForGrantQuery>(
    AuthScopeCategoriesForGrantDocument,
    {
      variables: { lang },
    },
  )

  const {
    data: tagsData,
    loading: tagsLoading,
    error: tagsError,
  } = useQuery<AuthScopeTagsForGrantQuery>(AuthScopeTagsForGrantDocument, {
    variables: { lang },
  })

  const {
    data: domainsData,
    loading: domainsLoading,
  } = useQuery<AuthDomainsForGrantQuery>(AuthDomainsForGrantDocument, {
    variables: { lang },
  })

  const categories = categoriesData?.authScopeCategories || []
  const tags = tagsData?.authScopeTags || []
  const domains = domainsData?.authDomains || []

  // Filtering - cast to compatible types
  const filteredCategories = useScopeFiltering({
    categories: categories as any,
    tags: tags as any,
    domains: domains as any,
    searchQuery,
    selectedTagIds,
  })

  // Selection
  const {
    selectedScopes,
    isSelected,
    toggleScope,
    clearSelection,
    selectAllInCategory,
    deselectAllInCategory,
  } = useScopeSelection()

  const loading = categoriesLoading || tagsLoading || domainsLoading
  const error = categoriesError || tagsError

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    )
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedTagIds([])
  }

  const hasActiveFilters = searchQuery.trim() !== '' || selectedTagIds.length > 0

  const totalScopeCount = getTotalScopeCount(categories as any)
  const filteredScopeCount = getTotalScopeCount(filteredCategories)

  return (
    <>
      <IntroHeader
        title={formatMessage(m.grantAccessNewTitle)}
        intro={formatMessage(m.grantAccessNewIntro)}
      />

      <Box marginTop={[3, 3, 6]}>
        <Stack space={5}>
          {/* Step 1: Identity */}
          <Box>
            <Text variant="h3" marginBottom={3}>
              {formatMessage(m.stepOneTitle)}
            </Text>
            <Input
              name="toNationalId"
              label={formatMessage(m.grantFormAccessHolder)}
              placeholder="000000-0000"
              value={toNationalId}
              onChange={(e) => setToNationalId(e.target.value)}
              backgroundColor="blue"
            />
            {/* TODO: Add identity validation and display */}
          </Box>

          <Divider weight="blueberry200" />

          {/* Step 2: Scope Selection */}
          <Box>
            <Text variant="h3" marginBottom={2}>
              {formatMessage(m.stepTwoTitle)}
            </Text>
            <Text marginBottom={4}>
              {formatMessage(m.grantAccessScopesIntro)}
            </Text>

            {/* Search Bar */}
            <Box marginBottom={3}>
              <Input
                name="search"
                placeholder={formatMessage(m.searchScopesPlaceholder)}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                backgroundColor="blue"
              />
              {hasActiveFilters && (
                <Box marginTop={2}>
                  <Button
                    variant="text"
                    size="small"
                    icon="close"
                    onClick={clearFilters}
                  >
                    {formatMessage(m.clearSearchAndFilters)}
                  </Button>
                </Box>
              )}
            </Box>

            {/* Tag Filters */}
            {tags.length > 0 && (
              <Box marginBottom={4}>
                <Text variant="eyebrow" marginBottom={2}>
                  {formatMessage(m.filterByTag)}
                </Text>
                <Inline space={1} flexWrap="wrap">
                  {tags.map((tag) => (
                    <Tag
                      key={tag.id}
                      variant={
                        selectedTagIds.includes(tag.id) ? 'blue' : 'white'
                      }
                      onClick={() => toggleTag(tag.id)}
                      outlined={!selectedTagIds.includes(tag.id)}
                    >
                      {tag.title}
                    </Tag>
                  ))}
                </Inline>
              </Box>
            )}

            {/* Selection Counter */}
            {selectedScopes.size > 0 && (
              <Box
                display="flex"
                justifyContent="spaceBetween"
                alignItems="center"
                marginBottom={3}
                padding={3}
                background="blue100"
                borderRadius="large"
              >
                <Text variant="small" fontWeight="semiBold">
                  {selectedScopes.size} {formatMessage(m.scopesSelected)}
                </Text>
                <Button variant="text" size="small" onClick={clearSelection}>
                  {formatMessage(m.clearSelection)}
                </Button>
              </Box>
            )}

            {/* Loading State */}
            {loading && (
              <Stack space={2}>
                <SkeletonLoader height={80} borderRadius="large" />
                <SkeletonLoader height={80} borderRadius="large" />
                <SkeletonLoader height={80} borderRadius="large" />
              </Stack>
            )}

            {/* Error State */}
            {error && (
              <AlertMessage
                type="error"
                title={formatMessage(m.errorTitle)}
                message={formatMessage(m.errorLoadingCategories)}
              />
            )}

            {/* Empty State - No Results */}
            {!loading &&
              !error &&
              hasActiveFilters &&
              filteredCategories.length === 0 && (
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  paddingY={10}
                >
                  <Text variant="h3" marginBottom={2}>
                    {formatMessage(m.noScopesMatchFilter)}
                  </Text>
                  <Button variant="text" onClick={clearFilters}>
                    {formatMessage(m.clearSearchAndFilters)}
                  </Button>
                </Box>
              )}

            {/* Categories with Scopes */}
            {!loading && !error && filteredCategories.length > 0 && (
              <>
                {hasActiveFilters && (
                  <Text variant="small" color="dark300" marginBottom={2}>
                    {formatMessage(m.showingResults, {
                      count: filteredScopeCount,
                      total: totalScopeCount,
                    })}
                  </Text>
                )}

                <Accordion dividerOnTop={false} dividerOnBottom={false}>
                  {filteredCategories.map((category) => {
                    const categorySelectedCount = category.scopes.filter((s) =>
                      isSelected(s.name),
                    ).length
                    const allSelected =
                      categorySelectedCount === category.scopes.length &&
                      category.scopes.length > 0

                    return (
                      <AccordionItem
                        key={category.id}
                        id={category.id}
                        label={
                          categorySelectedCount > 0
                            ? `${category.title} (${category.scopes.length}) - ${categorySelectedCount} valin`
                            : `${category.title} (${category.scopes.length})`
                        }
                        labelVariant="h4"
                        labelUse="h3"
                        iconVariant="default"
                      >
                        <Box paddingY={3}>
                          {category.description && (
                            <Text marginBottom={3}>{category.description}</Text>
                          )}

                          {/* Select All Button */}
                          {category.scopes.length > 1 && (
                            <Box marginBottom={2}>
                              <Button
                                variant="text"
                                size="small"
                                onClick={() => {
                                  if (allSelected) {
                                    deselectAllInCategory(category.scopes)
                                  } else {
                                    selectAllInCategory(
                                      category.id,
                                      category.title,
                                      category.scopes,
                                    )
                                  }
                                }}
                              >
                                {allSelected
                                  ? formatMessage(m.deselectAll)
                                  : formatMessage(m.selectAll)}
                              </Button>
                            </Box>
                          )}

                          <Stack space={2}>
                            {category.scopes.map((scope) => (
                              <Box
                                key={scope.name}
                                paddingLeft={2}
                                paddingY={2}
                                borderLeftWidth="standard"
                                borderColor={
                                  isSelected(scope.name) ? 'blue400' : 'blue200'
                                }
                              >
                                <Checkbox
                                  label={scope.displayName}
                                  subLabel={scope.description}
                                  name={scope.name}
                                  checked={isSelected(scope.name)}
                                  onChange={() =>
                                    toggleScope(
                                      scope.name,
                                      scope.displayName,
                                      scope.description,
                                      category.id,
                                      category.title,
                                    )
                                  }
                                  backgroundColor="blue"
                                  large
                                />
                              </Box>
                            ))}
                          </Stack>
                        </Box>
                      </AccordionItem>
                    )
                  })}
                </Accordion>
              </>
            )}
          </Box>

          <Divider weight="blueberry200" />

          {/* Step 3: Validity Period */}
          <Box>
            <Text variant="h3" marginBottom={3}>
              {formatMessage(m.stepThreeTitle)}
            </Text>
            <DatePicker
              label={formatMessage(m.grantValidityPeriod)}
              placeholderText={formatMessage(m.grantSelectDate)}
              selected={validityPeriod}
              handleChange={(date) => setValidityPeriod(date || undefined)}
              minDate={new Date()}
              locale={lang}
              backgroundColor="blue"
            />
          </Box>

          {/* Submit Button */}
          <Box display="flex" justifyContent="flexEnd">
            <Button
              icon="arrowForward"
              disabled={selectedScopes.size === 0}
            >
              {formatMessage(m.sendDelegationRequest)}
            </Button>
          </Box>
        </Stack>
      </Box>
    </>
  )
}

export default GrantAccessNew
