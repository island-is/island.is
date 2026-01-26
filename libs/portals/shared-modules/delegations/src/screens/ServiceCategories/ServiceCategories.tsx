import { useLocale } from '@island.is/localization'
import { useQuery } from '@apollo/client'
import {
  Box,
  Text,
  AccordionItem,
  Accordion,
  Stack,
  SkeletonLoader,
  AlertMessage,
} from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { IntroHeader } from '@island.is/portals/core'
import {
  AuthScopeTagsDocument,
  AuthScopeTagsQuery,
  AuthScopeCategoriesDocument,
  AuthScopeCategoriesQuery,
} from './ServiceCategories.generated'

export const ServiceCategories = () => {
  const { formatMessage, lang } = useLocale()

  const {
    data: categoriesData,
    loading: categoriesLoading,
    error: categoriesError,
  } = useQuery<AuthScopeCategoriesQuery>(AuthScopeCategoriesDocument, {
    variables: { lang },
  })
  const {
    data: tagsData,
    loading: tagsLoading,
    error: tagsError,
  } = useQuery<AuthScopeTagsQuery>(AuthScopeTagsDocument, {
    variables: { lang },
  })

  // const categories = data?.authScopeCategories || []
  const tags = tagsData?.authScopeTags || []
  const categories = categoriesData?.authScopeCategories || []

  const loading = categoriesLoading || tagsLoading
  const error = categoriesError || tagsError

  return (
    <>
      <IntroHeader
        title={formatMessage(m.whichDelegationsSuit)}
        intro={formatMessage(m.serviceCategoriesDescription)}
      />
      <Box marginTop={[3, 3, 6]}>
        {loading && (
          <Stack space={2}>
            <SkeletonLoader height={80} borderRadius="large" />
            <SkeletonLoader height={80} borderRadius="large" />
            <SkeletonLoader height={80} borderRadius="large" />
          </Stack>
        )}

        {error && (
          <AlertMessage
            type="error"
            title={formatMessage(m.errorTitle)}
            message={formatMessage(m.errorLoadingCategories)}
          />
        )}

        {!loading && !error && tags.length === 0 && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            paddingY={10}
          >
            <Text variant="h3">{formatMessage(m.noCategoriesAvailable)}</Text>
          </Box>
        )}

        <Box marginTop={6}>
          <Text variant="h3" color="blue400">
            Todo: Tags
          </Text>

          {!loading && !error && tags.length > 0 && (
            <Accordion dividerOnTop={false} dividerOnBottom={false}>
              {tags.map((tag) => (
                <AccordionItem
                  key={tag.id}
                  id={tag.id}
                  label={tag.title}
                  labelVariant="h3"
                  labelUse="h2"
                  iconVariant="default"
                >
                  <Box paddingY={3}>
                    {tag.description && (
                      <Text marginBottom={3}>{tag.description}</Text>
                    )}
                    {tag.scopes.length === 0 ? (
                      <Text variant="small" color="dark300">
                        {formatMessage(m.noScopesInCategory)}
                      </Text>
                    ) : (
                      <Stack space={2}>
                        {tag.scopes.map((scope) => (
                          <Box
                            key={scope.name}
                            paddingLeft={2}
                            paddingY={2}
                            borderLeftWidth="standard"
                            borderColor="blue200"
                          >
                            <Text variant="h5" marginBottom={1}>
                              {scope.displayName}
                            </Text>
                            {scope.description && (
                              <Text variant="small">{scope.description}</Text>
                            )}
                          </Box>
                        ))}
                      </Stack>
                    )}
                  </Box>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </Box>

        <Box marginTop={6}>
          <Text variant="h3" color="blue400">
            {formatMessage(m.serviceCategories)}
          </Text>

          {!loading && !error && categories.length > 0 && (
            <Accordion dividerOnTop={false} dividerOnBottom={false}>
              {categories.map((cat) => (
                <AccordionItem
                  key={cat.id}
                  id={cat.id}
                  label={cat.title}
                  labelVariant="h3"
                  labelUse="h2"
                  iconVariant="default"
                >
                  <Box paddingY={3}>
                    {cat.description && (
                      <Text marginBottom={3}>{cat.description}</Text>
                    )}
                    {cat.scopes.length === 0 ? (
                      <Text variant="small" color="dark300">
                        {formatMessage(m.noScopesInCategory)}
                      </Text>
                    ) : (
                      <Stack space={2}>
                        {cat.scopes.map((scope) => (
                          <Box
                            key={scope.name}
                            paddingLeft={2}
                            paddingY={2}
                            borderLeftWidth="standard"
                            borderColor="blue200"
                          >
                            <Text variant="h5" marginBottom={1}>
                              {scope.displayName}
                            </Text>
                            {scope.description && (
                              <Text variant="small">{scope.description}</Text>
                            )}
                          </Box>
                        ))}
                      </Stack>
                    )}
                  </Box>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </Box>
      </Box>
    </>
  )
}

export default ServiceCategories
