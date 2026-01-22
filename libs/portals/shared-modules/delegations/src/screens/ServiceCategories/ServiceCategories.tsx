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
} from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { IntroHeader } from '@island.is/portals/core'
import {
  AuthScopeCategoriesDocument,
  AuthScopeCategoriesQuery,
} from './ServiceCategories.generated'

export const ServiceCategories = () => {
  const { formatMessage, lang } = useLocale()

  const { data, loading, error } = useQuery<AuthScopeCategoriesQuery>(
    AuthScopeCategoriesDocument,
    {
      variables: { lang },
    },
  )

  const categories = data?.authScopeCategories || []

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

        {!loading && !error && categories.length === 0 && (
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
          <Accordion dividerOnTop={false} dividerOnBottom={false}>
            {categories.map((category) => (
              <AccordionItem
                key={category.id}
                id={category.id}
                label={category.title}
                labelVariant="h3"
                labelUse="h2"
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
        )}
      </Box>
    </>
  )
}

export default ServiceCategories
