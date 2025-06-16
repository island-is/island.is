import { useIntl } from 'react-intl'

import {
  Box,
  CategoryCard,
  GridColumn,
  GridContainer,
  GridRow,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { Locale } from '@island.is/shared/types'
import { SLICE_SPACING } from '@island.is/web/constants'
import {
  ContentLanguage,
  CustomPageUniqueIdentifier,
  Query,
  QueryGetOrganizationArgs,
} from '@island.is/web/graphql/schema'
import { withMainLayout } from '@island.is/web/layouts/main'
import { CustomNextError } from '@island.is/web/units/errors'

import { OJOIWrapper } from '../../components/OfficialJournalOfIceland'
import {
  CustomScreen,
  withCustomPageWrapper,
} from '../CustomPage/CustomPageWrapper'
import { GET_ORGANIZATION_QUERY } from '../queries'
import { ORGANIZATION_SLUG } from './constants'
import { m } from './messages'

const OJOIRssPage: CustomScreen<OJOIRssProps> = ({ organization }) => {
  const { formatMessage } = useIntl()

  return (
    <OJOIWrapper
      pageTitle={organization?.title ?? ''}
      pageDescription={formatMessage(m.home.description)}
      organization={organization ?? undefined}
      pageFeaturedImage={formatMessage(m.home.featuredImage)}
      isHomePage
    >
      <Stack space={SLICE_SPACING}>
        <Box background="blue100" paddingTop={8} paddingBottom={8}>
          <GridContainer>
            <GridRow>
              <GridColumn span="12/12">
                <Stack space={2}>
                  <Box
                    display={'flex'}
                    justifyContent={'spaceBetween'}
                    alignItems="flexEnd"
                    marginBottom={3}
                  >
                    <Text variant="h3">{formatMessage(m.rss.rssFeeds)}</Text>
                  </Box>
                </Stack>
              </GridColumn>
            </GridRow>
            <GridRow>
              <GridColumn
                paddingBottom={4}
                span={['12/12', '6/12', '4/12', '12/12']}
              >
                <CategoryCard
                  href={`https://api.stjornartidindi.is/api/v1/rss/a-deild`}
                  heading={'A deild'}
                  text={formatMessage(m.rss.departmentA)}
                />
              </GridColumn>
              <GridColumn
                paddingBottom={4}
                span={['12/12', '6/12', '4/12', '12/12']}
              >
                <CategoryCard
                  href={`https://api.stjornartidindi.is/api/v1/rss/b-deild`}
                  heading={'B deild'}
                  text={formatMessage(m.rss.departmentB)}
                />
              </GridColumn>
              <GridColumn
                paddingBottom={4}
                span={['12/12', '6/12', '4/12', '12/12']}
              >
                <CategoryCard
                  href={`https://api.stjornartidindi.is/api/v1/rss/c-deild`}
                  heading={'C deild'}
                  text={formatMessage(m.rss.departmentC)}
                />
              </GridColumn>
            </GridRow>
          </GridContainer>
        </Box>
      </Stack>
    </OJOIWrapper>
  )
}

interface OJOIRssProps {
  organization?: Query['getOrganization']
  locale: Locale
}

const OJOIHome: CustomScreen<OJOIRssProps> = ({
  organization,
  customPageData,
  locale,
}) => {
  return (
    <OJOIRssPage
      organization={organization}
      locale={locale}
      customPageData={customPageData}
    />
  )
}

OJOIHome.getProps = async ({ apolloClient, locale }) => {
  const [
    {
      data: { getOrganization },
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
  ])

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
    OJOIHome,
  ),
)
