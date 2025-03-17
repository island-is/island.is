import { useIntl } from 'react-intl'

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
  withCustomSubpageWrapper,
} from '../CustomPage/CustomPageWrapper'
import { GET_ORGANIZATION_QUERY } from '../queries'
import { m } from './messages'

const OJOIHelpPage: CustomScreen<OJOIHelpProps> = ({
  organization,
  locale,
  customPageData,
}) => {
  console.log(customPageData)
  return (
    <Box>
      {customPageData &&
        webRichText(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error make web strict
          customPageData?.content as SliceType[],
        )}
    </Box>
  )
}

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
      pageTitle={organization?.title ?? ''}
      pageDescription={formatMessage(m.home.description)}
      organization={organization ?? undefined}
      pageFeaturedImage={formatMessage(m.home.featuredImage)}
      breadcrumbItems={[
        {
          title: formatMessage(m.breadcrumb.frontpage),
          href: linkResolver('homepage', [], locale).href,
        },
        {
          title: formatMessage(m.breadcrumb.help),
          href: linkResolver('ojoihelp', [], locale).href,
        },
      ]}
    >
      <OJOIHelpPage
        locale={locale}
        customPageData={customPageData}
        organization={organization}
      />
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
  withCustomSubpageWrapper(
    'leidbeiningar',
    CustomPageUniqueIdentifier.OfficialJournalOfIceland,
    OJOIHelp,
  ),
)
