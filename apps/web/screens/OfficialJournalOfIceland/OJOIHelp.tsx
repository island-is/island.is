import { useIntl } from 'react-intl'

import { SliceType } from '@island.is/island-ui/contentful'
import { Box } from '@island.is/island-ui/core'
import { Locale } from '@island.is/shared/types'
import {
  ContentLanguage,
  CustomPageUniqueIdentifier,
  Query,
  QueryGetOrganizationArgs,
} from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'
import { withMainLayout } from '@island.is/web/layouts/main'
import { CustomNextError } from '@island.is/web/units/errors'
import { webRichText } from '@island.is/web/utils/richText'

import { OJOIWrapper } from '../../components/OfficialJournalOfIceland'
import {
  CustomScreen,
  withCustomPageWrapper,
} from '../CustomPage/CustomPageWrapper'
import { GET_ORGANIZATION_QUERY } from '../queries'
import { m } from './messages'

interface OJOIHelpProps {
  organization?: Query['getOrganization']
  locale: Locale
}

const OJOIHelp: CustomScreen<OJOIHelpProps> = ({
  organization,
  customPageData,
  locale,
}) => {
  const { formatMessage } = useIntl()
  const { linkResolver } = useLinkResolver()

  return (
    <OJOIWrapper
      pageTitle={formatMessage(m.help.title)}
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
          title: formatMessage(m.breadcrumb.help),
          href: linkResolver('ojoihelp', [], locale).href,
        },
      ]}
    >
      <Box>{webRichText((customPageData?.content ?? []) as SliceType[])}</Box>
    </OJOIWrapper>
  )
}

OJOIHelp.getProps = async ({ apolloClient, locale }) => {
  const organizationSlug = 'stjornartidindi'

  const {
    data: { getOrganization },
  } = await apolloClient.query<Query, QueryGetOrganizationArgs>({
    query: GET_ORGANIZATION_QUERY,
    variables: {
      input: {
        slug: organizationSlug,
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
  withCustomPageWrapper(
    CustomPageUniqueIdentifier.OfficialJournalOfIceland,
    OJOIHelp,
  ),
)
