import { useIntl } from 'react-intl'

import { SliceType } from '@island.is/island-ui/contentful'
import { Box } from '@island.is/island-ui/core'
import { Locale } from '@island.is/shared/types'
import {
  ContentLanguage,
  CustomPage,
  CustomPageUniqueIdentifier,
  Query,
  QueryGetCustomSubpageArgs,
  QueryGetOrganizationArgs,
} from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'
import { withMainLayout } from '@island.is/web/layouts/main'
import { CustomNextError } from '@island.is/web/units/errors'
import { webRichText } from '@island.is/web/utils/richText'

import { OJOIWrapper } from '../../components/OfficialJournalOfIceland'
import { CustomScreen, withCustomPageWrapper } from '../CustomPage'
import { GET_ORGANIZATION_QUERY } from '../queries'
import { GET_CUSTOM_SUBPAGE_QUERY } from '../queries/CustomPage'
import { ORGANIZATION_SLUG } from './constants'
import { m } from './messages'

interface OJOISubpageProps {
  organization?: Query['getOrganization']
  customSubpage?: CustomPage
}

const OJOISubpage: CustomScreen<OJOISubpageProps> = ({
  organization,
  customSubpage,
}) => {
  const { formatMessage } = useIntl()
  const { linkResolver } = useLinkResolver()

  return (
    <OJOIWrapper
      pageTitle={customSubpage?.ogTitle ?? ''}
      pageDescription={customSubpage?.ogDescription ?? ''}
      organization={organization ?? undefined}
      pageFeaturedImage={customSubpage?.ogImage?.url}
      breadcrumbItems={[
        {
          title: formatMessage(m.breadcrumb.frontpage),
          href: linkResolver('homepage', []).href,
        },
        {
          title: formatMessage(m.home.title),
          href: linkResolver('ojoihome', []).href,
        },
        {
          title: customSubpage?.ogTitle ?? '',
        },
      ]}
    >
      <Box>{webRichText((customSubpage?.content ?? []) as SliceType[])}</Box>
    </OJOIWrapper>
  )
}

OJOISubpage.getProps = async ({
  apolloClient,
  locale,
  query,
  customPageData,
}) => {
  const [
    {
      data: { getOrganization },
    },
    {
      data: { getCustomSubpage },
    },
  ] = await Promise.all([
    apolloClient.query<Query, QueryGetOrganizationArgs>({
      query: GET_ORGANIZATION_QUERY,
      variables: {
        input: {
          slug: ORGANIZATION_SLUG,
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient.query<Query, QueryGetCustomSubpageArgs>({
      query: GET_CUSTOM_SUBPAGE_QUERY,
      variables: {
        input: {
          slug: query.slug as string,
          parentPageId: customPageData?.id ?? '',
          lang: locale as ContentLanguage,
        },
      },
    }),
  ])

  if (!getCustomSubpage) {
    throw new CustomNextError(404, 'Custom subpage not found')
  }

  return {
    organization: getOrganization,
    showSearchInHeader: false,
    themeConfig: {
      footerVersion: 'organization',
    },
    customSubpage: getCustomSubpage ?? undefined,
  }
}

export default withMainLayout(
  withCustomPageWrapper(
    CustomPageUniqueIdentifier.OfficialJournalOfIceland,
    OJOISubpage,
  ),
)
