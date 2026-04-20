import { useLocale } from '@island.is/localization'
import { useQuery } from '@apollo/client'
import { Box, Text, AlertMessage } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { IntroHeader } from '@island.is/portals/core'
import {
  AuthScopeTagsDocument,
  AuthScopeTagsQuery,
  AuthScopeCategoriesDocument,
  AuthScopeCategoriesQuery,
} from './ServiceCategories.generated'

import { FaqList, FaqListProps } from '@island.is/island-ui/contentful'
import { useGetServicePortalPageQuery } from '@island.is/portals/core'
import { useUserInfo } from '@island.is/react-spa/bff'
import { isCompany } from '@island.is/shared/utils'
import { ServiceCategoriesGrid } from '../../components/ServiceCategoriesGrid/ServiceCategoriesGrid'

export const ServiceCategories = () => {
  const { formatMessage, lang } = useLocale()
  const userInfo = useUserInfo()
  const { data: contentfulQueryData } = useGetServicePortalPageQuery({
    variables: { input: { slug: 'umbod/thjonustuflokkar', lang } },
  })
  const contentfulData = contentfulQueryData?.getServicePortalPage
  const faqList =
    (isCompany(userInfo) && contentfulData?.faqListCompany) ||
    contentfulData?.faqList

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

        {faqList && faqList.questions.length > 0 && (
          <Box paddingTop={8}>
            <FaqList {...(faqList as unknown as FaqListProps)} />
          </Box>
        )}
      </Box>
    </>
  )
}

export default ServiceCategories
