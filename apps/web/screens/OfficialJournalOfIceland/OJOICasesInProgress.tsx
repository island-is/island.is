import { useIntl } from 'react-intl'

import { Table as T } from '@island.is/island-ui/core'
import { Locale } from '@island.is/shared/types'
import {
  ContentLanguage,
  CustomPageUniqueIdentifier,
  OfficialJournalOfIcelandCaseInProgress,
  Query,
  QueryGetOrganizationArgs,
  QueryOfficialJournalOfIcelandCasesInProgressArgs,
} from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'
import { withMainLayout } from '@island.is/web/layouts/main'
import { CustomNextError } from '@island.is/web/units/errors'

import {
  formatDate,
  OJOIWrapper,
} from '../../components/OfficialJournalOfIceland'
import {
  CustomScreen,
  withCustomPageWrapper,
} from '../CustomPage/CustomPageWrapper'
import { GET_ORGANIZATION_QUERY } from '../queries'
import { CASES_IN_PROGRESS_QUERY } from '../queries/OfficialJournalOfIceland'
import { ORGANIZATION_SLUG } from './constants'
import { m } from './messages'

const OJOICasesInProgressPage: CustomScreen<OJOICasesInProgressProps> = ({
  cases,
  organization,
  locale,
}) => {
  const { formatMessage } = useIntl()
  const { linkResolver } = useLinkResolver()

  const baseUrl = linkResolver('ojoihome', [], locale).href

  const breadcrumbItems = [
    {
      title: formatMessage(m.breadcrumb.frontpage),
      href: linkResolver('homepage', [], locale).href,
    },
    {
      title: organization?.title ?? '',
      href: baseUrl,
    },
    {
      title: formatMessage(m.casesInProgress.title),
    },
  ]

  return (
    <OJOIWrapper
      pageTitle={formatMessage(m.casesInProgress.title)}
      pageDescription={formatMessage(m.casesInProgress.description)}
      organization={organization ?? undefined}
      pageFeaturedImage={formatMessage(m.home.featuredImage)}
      goBackUrl={baseUrl}
      breadcrumbItems={breadcrumbItems}
    >
      {!cases || cases.length === 0 ? (
        <p>{formatMessage(m.casesInProgress.notFoundMessage)}</p>
      ) : (
        <T.Table>
          <T.Head>
            <T.Row>
              <T.HeadData>
                {formatMessage(m.casesInProgress.createdAt)}
              </T.HeadData>
              <T.HeadData>
                {formatMessage(m.casesInProgress.requestedPublicationDate)}
              </T.HeadData>
              <T.HeadData>{formatMessage(m.casesInProgress.status)}</T.HeadData>
              <T.HeadData>
                {formatMessage(m.casesInProgress.advertTitle)}
              </T.HeadData>
              <T.HeadData>
                {formatMessage(m.casesInProgress.involvedParty)}
              </T.HeadData>
            </T.Row>
          </T.Head>
          <T.Body>
            {cases.map((c) => (
              <T.Row key={c.id}>
                <T.Data>{formatDate(c.createdAt ?? '')}</T.Data>
                <T.Data>{formatDate(c.requestedPublicationDate ?? '')}</T.Data>
                <T.Data>{c.status ?? '-'}</T.Data>
                <T.Data>{c.title ?? '-'}</T.Data>
                <T.Data>{c.involvedParty ?? '-'}</T.Data>
              </T.Row>
            ))}
          </T.Body>
        </T.Table>
      )}
    </OJOIWrapper>
  )
}

interface OJOICasesInProgressProps {
  cases?: Array<OfficialJournalOfIcelandCaseInProgress>
  organization?: Query['getOrganization']
  locale: Locale
}

const OJOICasesInProgress: CustomScreen<OJOICasesInProgressProps> = ({
  cases,
  organization,
  customPageData,
  locale,
}) => {
  return (
    <OJOICasesInProgressPage
      cases={cases}
      organization={organization}
      locale={locale}
      customPageData={customPageData}
    />
  )
}

OJOICasesInProgress.getProps = async ({ apolloClient, locale }) => {
  const [
    {
      data: { officialJournalOfIcelandCasesInProgress },
    },
    {
      data: { getOrganization },
    },
  ] = await Promise.all([
    apolloClient.query<Query, QueryOfficialJournalOfIcelandCasesInProgressArgs>(
      {
        query: CASES_IN_PROGRESS_QUERY,
        variables: {
          params: {
            pageSize: 30,
          },
        },
      },
    ),
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
    cases: officialJournalOfIcelandCasesInProgress?.cases,
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
    OJOICasesInProgress,
  ),
)
