import { useLocale } from '@island.is/localization'
import { useQuery } from '@apollo/client'
import {
  Box,
  Text,
  Stack,
  SkeletonLoader,
  AlertMessage,
  AccordionCard,
} from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { IntroHeader } from '@island.is/portals/core'
import {
  AuthScopeTagsDocument,
  AuthScopeTagsQuery,
  AuthScopeCategoriesDocument,
  AuthScopeCategoriesQuery,
} from './ServiceCategories.generated'
import { ScopesTable } from '../../components/ScopesTable/ScopesTable'
import { FaqList, FaqListProps } from '@island.is/island-ui/contentful'
import { useLoaderData } from 'react-router-dom'
import { AccessControlLoaderResponse } from '../AccessControl.loader'

export const ServiceCategories = () => {
  const { formatMessage, lang } = useLocale()
  const contentfulData = useLoaderData() as AccessControlLoaderResponse

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
          {!loading && !error && tags.length > 0 && (
            <>
              <Text variant="h3" color="blue400">
                Todo: Tags
              </Text>

              <Box
                marginTop={2}
                display="flex"
                flexDirection="column"
                rowGap={2}
              >
                {tags.map((tag) => (
                  <AccordionCard
                    key={tag.id}
                    id={tag.id}
                    label={tag.title}
                    labelVariant="h3"
                    labelUse="h2"
                    iconVariant="default"
                    visibleContent={tag.description}
                  >
                    <Box paddingY={3}>
                      {tag.scopes.length === 0 ? (
                        <Text variant="small" color="dark300">
                          {formatMessage(m.noScopesInCategory)}
                        </Text>
                      ) : (
                        <ScopesTable scopes={tag.scopes} />
                      )}
                    </Box>
                  </AccordionCard>
                ))}
              </Box>
            </>
          )}
        </Box>

        <Box marginTop={6}>
          {!loading && !error && categories.length > 0 && (
            <>
              <Text variant="h3" color="blue400">
                {formatMessage(m.serviceCategories)}
              </Text>
              <Box
                marginTop={2}
                display="flex"
                flexDirection="column"
                rowGap={2}
              >
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
                        <ScopesTable scopes={cat.scopes} />
                      )}
                    </Box>
                  </AccordionCard>
                ))}
              </Box>
            </>
          )}
        </Box>
        {contentfulData?.faqList && (
          <Box paddingTop={8}>
            <FaqList {...(contentfulData.faqList as unknown as FaqListProps)} />
          </Box>
        )}
      </Box>
    </>
  )
}

export default ServiceCategories
