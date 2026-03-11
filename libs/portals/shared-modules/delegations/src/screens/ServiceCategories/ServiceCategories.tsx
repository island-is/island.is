import { useLocale } from '@island.is/localization'
import { useQuery } from '@apollo/client'
import {
  Box,
  Text,
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
import { ServiceCategoriesGrid } from '../../components/ServiceCategoriesGrid/ServiceCategoriesGrid'

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
        {error && (
          <AlertMessage
            type="error"
            title={formatMessage(m.errorTitle)}
            message={formatMessage(m.errorLoadingCategories)}
          />
        )}

        <ServiceCategoriesGrid
          categories={tags}
          loading={loading}
          error={!!error}
        />

        {!loading && !error && categories.length > 0 && (
          <Box marginTop={6} marginBottom={2}>
            <Text variant="h3">{formatMessage(m.serviceCategories)}</Text>
          </Box>
        )}

        <ServiceCategoriesGrid
          categories={categories}
          loading={loading}
          error={!!error}
        />

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
