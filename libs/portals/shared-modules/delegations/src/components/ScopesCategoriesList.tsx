import { AccordionCard, Box, Checkbox, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { ScopesTable } from './ScopesTable/ScopesTable'
import { m } from '../lib/messages'
import { AuthApiScope } from '@island.is/api/schema'
import { AuthScopeCategoriesQuery } from '../screens/ServiceCategories/ServiceCategories.generated'

export const ScopesCategoriesList = ({
  loading,
  error,
  categories,
  onSelectScope,
  selectedScopes,
  onSelectCategory,
}: {
  loading: boolean
  error: boolean
  categories: AuthScopeCategoriesQuery['authScopeCategories']
  onSelectScope?: (scope: AuthApiScope) => void
  selectedScopes?: AuthApiScope[]
  onSelectCategory?: (scopes: AuthApiScope[]) => void
}) => {
  const { formatMessage } = useLocale()
  return (
    !loading &&
    !error &&
    categories.length > 0 && (
      <Box display="flex" flexDirection="column" rowGap={2}>
        {categories.map((cat) => {
          const selectedScopesInCategory =
            selectedScopes?.filter((s) =>
              cat.scopes.some((cs) => cs.name === s.name),
            ) ?? []
          const isIndeterminate =
            selectedScopesInCategory?.length > 0 &&
            (selectedScopesInCategory?.length ?? 0) < cat.scopes.length

          return (
            <AccordionCard
              key={cat.id}
              id={cat.id}
              label={
                <Box display="flex" alignItems="center" zIndex={10}>
                  <Checkbox
                    name={`mobile-category-${cat.id}`}
                    checked={
                      selectedScopesInCategory?.length === cat.scopes.length
                    }
                    indeterminate={isIndeterminate}
                    onChange={() =>
                      onSelectCategory?.(cat.scopes as AuthApiScope[])
                    }
                  />
                  <Text variant="h3">{cat.title}</Text>
                </Box>
              }
              labelVariant="h3"
              labelUse="h2"
              iconVariant="default"
              visibleContent={cat.description}
              startExpanded={
                !!selectedScopes?.some((s) =>
                  cat.scopes.some((cs) => cs.name === s.name),
                )
              }
            >
              <Box paddingY={[0, 0, 3]}>
                {cat.scopes.length === 0 ? (
                  <Text variant="small" color="dark300">
                    {formatMessage(m.noScopesInCategory)}
                  </Text>
                ) : (
                  <ScopesTable
                    scopes={cat.scopes as AuthApiScope[]}
                    showCheckbox
                    onSelectScope={onSelectScope}
                  />
                )}
              </Box>
            </AccordionCard>
          )
        })}
      </Box>
    )
  )
}

export default ScopesCategoriesList
