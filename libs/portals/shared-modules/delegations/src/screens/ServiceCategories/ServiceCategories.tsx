import React from 'react'
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
  Divider,
} from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { IntroHeader } from '@island.is/portals/core'
import {
  AuthScopeCategoriesDocument,
  AuthScopeCategoriesQuery,
  AuthScopeTagsDocument,
  AuthScopeTagsQuery,
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

  const categories = categoriesData?.authScopeCategories || []
  const tags = tagsData?.authScopeTags || []
  const loading = categoriesLoading || tagsLoading
  const error = categoriesError || tagsError

  return (
    <>
      <IntroHeader
        title={formatMessage(m.serviceCategories)}
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

        {!loading && !error && categories.length === 0 && tags.length === 0 && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            paddingY={10}
          >
            <Text variant="h3">
              {formatMessage(m.noCategoriesAvailable)}
            </Text>
          </Box>
        )}

        {!loading && !error && categories.length > 0 && (
          <>
            <Text variant="h3" marginBottom={3}>
              {formatMessage(m.categories)}
            </Text>
            <Accordion dividerOnTop={false} dividerOnBottom={false}>
              {categories.map((category) => (
                <AccordionItem
                  key={category.id}
                  id={category.id}
                  label={category.title}
                  labelVariant="h4"
                  labelUse="h3"
                  iconVariant="default"
                >
                  <Box paddingY={3}>
                    {category.description && (
                      <Text marginBottom={3}>{category.description}</Text>
                    )}
                    {category.scopes.length === 0 ? (
                      <Text variant="small" color="dark300">
                        {formatMessage(m.noScopesInCategory)}
                      </Text>
                    ) : (
                      <Stack space={2}>
                        {category.scopes.map((scope) => (
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
          </>
        )}

        {!loading && !error && tags.length > 0 && (
          <>
            {categories.length > 0 && <Divider weight="blueberry200" />}
            <Box marginTop={categories.length > 0 ? 6 : 0}>
              <Text variant="h3" marginBottom={3}>
                {formatMessage(m.lifeEvents)}
              </Text>
              <Accordion dividerOnTop={false} dividerOnBottom={false}>
                {tags.map((tag) => (
                  <AccordionItem
                    key={tag.id}
                    id={tag.id}
                    label={tag.title}
                    labelVariant="h4"
                    labelUse="h3"
                    iconVariant="default"
                  >
                    <Box paddingY={3}>
                      {tag.intro && <Text marginBottom={3}>{tag.intro}</Text>}
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
                              borderColor="purple200"
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
            </Box>
          </>
        )}
      </Box>
    </>
  )
}

export default ServiceCategories
