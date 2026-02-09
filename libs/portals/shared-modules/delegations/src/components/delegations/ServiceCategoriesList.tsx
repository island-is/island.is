import { AccordionCard, Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { ScopesTable } from '../ScopesTable/ScopesTable'
import { m } from '../../lib/messages'
import { AuthApiScope } from '@island.is/api/schema'
import { AuthScopeCategoriesQuery } from '../../screens/ServiceCategories/ServiceCategories.generated'

export const ServiceCategoriesList = ({
  loading,
  error,
  categories,
  onSelectScope,
  selectedScopes,
}: {
  loading: boolean
  error: boolean
  categories: AuthScopeCategoriesQuery['authScopeCategories']
  onSelectScope?: (scope: AuthApiScope) => void
  selectedScopes?: AuthApiScope[]
}) => {
  console.log('categories', categories)
  const { formatMessage } = useLocale()
  return (
    <Box marginTop={6}>
      {!loading && !error && categories.length > 0 && (
        <>
          <Text variant="h3" color="blue400">
            {formatMessage(m.serviceCategories)}
          </Text>
          <Box marginTop={2} display="flex" flexDirection="column" rowGap={2}>
            {categories.map((cat) => (
              <AccordionCard
                key={cat.id}
                id={cat.id}
                label={cat.title}
                labelVariant="h3"
                labelUse="h2"
                iconVariant="default"
                visibleContent={cat.description}
              >
                <Box paddingY={3}>
                  {cat.scopes.length === 0 ? (
                    <Text variant="small" color="dark300">
                      {formatMessage(m.noScopesInCategory)}
                    </Text>
                  ) : (
                    <ScopesTable
                      scopes={cat.scopes}
                      onSelectScope={onSelectScope}
                      selectedScopes={selectedScopes}
                    />
                  )}
                </Box>
              </AccordionCard>
            ))}
          </Box>
        </>
      )}
    </Box>
  )
}

export default ServiceCategoriesList
