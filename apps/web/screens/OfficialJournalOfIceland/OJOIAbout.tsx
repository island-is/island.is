import { useIntl } from 'react-intl'

import { SliceType } from '@island.is/island-ui/contentful'
import { Box } from '@island.is/island-ui/core'
import { Locale } from '@island.is/shared/types'
import {
  ContentLanguage,
  Query,
  QueryGetOrganizationArgs,
} from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'
import { withMainLayout } from '@island.is/web/layouts/main'
import { CustomNextError } from '@island.is/web/units/errors'
import { webRichText } from '@island.is/web/utils/richText'

import { OJOIWrapper } from '../../components/OfficialJournalOfIceland'
import { CustomScreen, withCustomSubpageWrapper } from '../CustomPage'
import { GET_ORGANIZATION_QUERY } from '../queries'
import { OJOI_BASE_CMS_ID, ORGANIZATION_SLUG } from './constants'
import { m } from './messages'

interface OJOIAboutProps {
  organization?: Query['getOrganization']
  locale: Locale
}

const OJOIAbout: CustomScreen<OJOIAboutProps> = ({
  organization,
  customPageData,
  locale,
}) => {
  const { formatMessage } = useIntl()
  const { linkResolver } = useLinkResolver()

  return (
    <OJOIWrapper
      pageTitle={formatMessage(m.about.title)}
      pageDescription={formatMessage(m.home.description)}
      organization={organization ?? undefined}
      pageFeaturedImage={formatMessage(m.home.featuredImage)}
      breadcrumbItems={[
        {
          title: formatMessage(m.breadcrumb.frontpage),
          href: linkResolver('homepage', [], locale).href,
        },
        {
          title: formatMessage(m.home.title),
          href: linkResolver('ojoihome', [], locale).href,
        },
        {
          title: formatMessage(m.breadcrumb.about),
          href: linkResolver('ojoiabout', [], locale).href,
        },
      ]}
    >
      <Box>{webRichText((customPageData?.content ?? []) as SliceType[])}</Box>
    </OJOIWrapper>
  )
}

OJOIAbout.getProps = async ({ apolloClient, locale }) => {
  const {
    data: { getOrganization },
  } = await apolloClient.query<Query, QueryGetOrganizationArgs>({
    query: GET_ORGANIZATION_QUERY,
    variables: {
      input: {
        slug: ORGANIZATION_SLUG,
        lang: locale as ContentLanguage,
      },
    },
  })

  if (!getOrganization?.hasALandingPage) {
    throw new CustomNextError(404, 'Organization page not found')
  }

  return {
    organization: getOrganization,
    locale: locale as Locale,
    showSearchInHeader: false,
    themeConfig: {
      footerVersion: 'organization',
    },
  }
}

export default withMainLayout(
  withCustomSubpageWrapper(OJOI_BASE_CMS_ID, 'um-stjornartidindin', OJOIAbout),
)
