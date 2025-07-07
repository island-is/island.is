import { useIntl } from 'react-intl'

import {
  Box,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  Link,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { Locale } from '@island.is/shared/types'
import { SimpleSlider } from '@island.is/web/components'
import {
  ContentLanguage,
  CustomPageUniqueIdentifier,
  OfficialJournalOfIcelandAdvertResponse,
  OfficialJournalOfIcelandAdvertSimilarResponse,
  Query,
  QueryGetOrganizationArgs,
  QueryOfficialJournalOfIcelandAdvertArgs,
  QueryOfficialJournalOfIcelandAdvertsSimilarArgs,
} from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'
import { withMainLayout } from '@island.is/web/layouts/main'
import { CustomNextError } from '@island.is/web/units/errors'

import {
  formatDate,
  OJOIAdvertCard,
  OJOIAdvertDisplay,
  OJOIWrapper,
} from '../../components/OfficialJournalOfIceland'
import {
  CustomScreen,
  withCustomPageWrapper,
} from '../CustomPage/CustomPageWrapper'
import { GET_ORGANIZATION_QUERY } from '../queries'
import {
  ADVERT_QUERY,
  ADVERT_SIMILAR_QUERY,
} from '../queries/OfficialJournalOfIceland'
import { ORGANIZATION_SLUG } from './constants'
import { m } from './messages'

const OJOIAdvertPage: CustomScreen<OJOIAdvertProps> = ({
  advert,
  locale,
  similar,
  organization,
}) => {
  const { formatMessage } = useIntl()
  const { linkResolver } = useLinkResolver()

  const baseUrl = linkResolver('ojoihome', [], locale).href
  const searchUrl = linkResolver('ojoisearch', [], locale).href

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
      title: formatMessage(m.advert.title),
    },
  ]

  const isAdvertHtmlEmpty =
    !advert.document.html || advert.document.html.trim() === ''

  return (
    <OJOIWrapper
      pageTitle={advert.title}
      hideTitle
      organization={organization ?? undefined}
      pageDescription={
        isAdvertHtmlEmpty
          ? formatMessage(m.advert.descriptionEmpty)
          : formatMessage(m.advert.description)
      }
      pageFeaturedImage={formatMessage(m.home.featuredImage)}
      breadcrumbItems={breadcrumbItems}
      goBackUrl={searchUrl}
      sidebarContent={
        <Stack space={[2]}>
          <Box background="blue100" padding={[2, 2, 3]} borderRadius="large">
            <Stack space={[1, 1, 2]}>
              <Text variant="h4">{formatMessage(m.advert.sidebarTitle)}</Text>

              <Box>
                <Text variant="h5">
                  {formatMessage(m.advert.sidebarDepartment)}
                </Text>
                <Text variant="small">{advert.department.title}</Text>
              </Box>

              <Box>
                <Text variant="h5">
                  {formatMessage(m.advert.sidebarInstitution)}
                </Text>
                <Text variant="small">{advert.involvedParty.title}</Text>
              </Box>

              <Box>
                <Text variant="h5">
                  {formatMessage(m.advert.sidebarCategory)}
                </Text>
                <Text variant="small">
                  {advert.categories.map((c) => c.title).join(', ')}
                </Text>
              </Box>

              <Box>
                <Text variant="h5">
                  {formatMessage(m.advert.signatureDate)}
                </Text>
                <Text variant="small">
                  {formatDate(advert.signatureDate, 'd. MMMM yyyy')}
                </Text>
              </Box>

              <Box>
                <Text variant="h5">
                  {formatMessage(m.advert.publicationDate)}
                </Text>
                <Text variant="small">
                  {formatDate(advert.publicationDate, 'd. MMMM yyyy')}
                </Text>
              </Box>
            </Stack>
          </Box>

          {advert.document.pdfUrl && (
            <Box
              background="blueberry100"
              padding={[2, 2, 3]}
              borderRadius="large"
            >
              <Stack space={[1, 1, 2]}>
                <Box href={advert.document.pdfUrl} component={Link}>
                  <Button
                    variant="text"
                    as="span"
                    icon="download"
                    iconType="outline"
                    size="small"
                  >
                    {formatMessage(m.advert.getPdf)}
                  </Button>
                </Box>
              </Stack>
            </Box>
          )}
          {advert.corrections && advert.corrections.length > 0 ? (
            <Box
              background="purple100"
              padding={[2, 2, 3]}
              borderRadius="large"
            >
              <Box marginBottom={2}>
                <Text variant="h4">
                  {formatMessage(m.advert.sidebarCorrectionTitle)}
                </Text>
              </Box>

              <Stack space={[1, 1, 2]} dividers>
                {advert.corrections.map((correction, index) => (
                  <Box key={correction.id || index}>
                    {correction.legacyDate ||
                    (correction.createdDate && !correction.isLegacy) ? (
                      <Box marginBottom={1}>
                        {correction.isLegacy ? (
                          <Text variant="eyebrow">
                            {correction.legacyDate
                              ? formatDate(
                                  correction.legacyDate,
                                  'd. MMMM yyyy',
                                )
                              : ''}
                          </Text>
                        ) : (
                          <Text variant="eyebrow">
                            {formatDate(correction.createdDate, 'd. MMMM yyyy')}
                          </Text>
                        )}
                      </Box>
                    ) : undefined}
                    <Box>
                      <Text variant="small">{correction.description}</Text>
                    </Box>
                    {correction.documentPdfUrl ? (
                      <Box>
                        <Link href={correction.documentPdfUrl}>
                          <Button
                            variant="text"
                            as="span"
                            icon="download"
                            iconType="outline"
                            size="small"
                          >
                            {formatMessage(m.advert.correctionDoc)}
                          </Button>
                        </Link>
                      </Box>
                    ) : undefined}
                  </Box>
                ))}
              </Stack>
            </Box>
          ) : undefined}
        </Stack>
      }
      preFooter={
        similar?.length ? (
          <Box
            overflow="hidden"
            paddingTop={8}
            paddingBottom={10}
            background="purple100"
          >
            <Box paddingBottom={2} marginTop={4}>
              <GridContainer>
                <GridRow>
                  <GridColumn span="12/12">
                    <SimpleSlider
                      title={formatMessage(m.advert.similarTitle)}
                      breakpoints={{
                        0: {
                          gutterWidth: theme.grid.gutter.mobile,
                          slideCount: 1,
                        },
                        [theme.breakpoints.sm]: {
                          gutterWidth: theme.grid.gutter.mobile,
                          slideCount: 2,
                        },
                        [theme.breakpoints.md]: {
                          gutterWidth: theme.spacing[3],
                          slideCount: 2,
                        },
                        [theme.breakpoints.lg]: {
                          gutterWidth: theme.spacing[3],
                          slideCount: 2,
                        },
                        [theme.breakpoints.xl]: {
                          gutterWidth: theme.spacing[3],
                          slideCount: 2,
                          slideWidthOffset: theme.spacing[12],
                        },
                      }}
                      items={(similar ?? []).map((ad) => {
                        return (
                          <OJOIAdvertCard
                            key={ad.id}
                            institution={ad.involvedParty?.title}
                            department={ad.department?.title}
                            publicationNumber={ad.publicationNumber?.full}
                            publicationDate={ad.publicationDate}
                            title={ad.title}
                            categories={ad.categories?.map((cat) => cat.title)}
                            link={
                              linkResolver('ojoiadvert', [ad.id], locale).href
                            }
                          />
                        )
                      })}
                    />
                  </GridColumn>
                </GridRow>
              </GridContainer>
            </Box>
          </Box>
        ) : undefined
      }
    >
      <OJOIAdvertDisplay
        advertNumber={advert.publicationNumber.full}
        signatureDate={formatDate(advert.signatureDate, 'd. MMMM yyyy')}
        advertType={advert.type.title}
        advertSubject={advert.subject}
        advertText={advert.document.html}
        isLegacy={advert.document.isLegacy ?? false}
        additions={advert.additions ?? []}
      />
    </OJOIWrapper>
  )
}

interface OJOIAdvertProps {
  advert: OfficialJournalOfIcelandAdvertResponse['advert']
  locale: Locale
  similar?: OfficialJournalOfIcelandAdvertSimilarResponse['adverts']
  organization?: Query['getOrganization']
}

const OJOIAdvert: CustomScreen<OJOIAdvertProps> = ({
  advert,
  locale,
  similar,
  organization,
  customPageData,
}) => {
  return (
    <OJOIAdvertPage
      advert={advert}
      locale={locale}
      similar={similar}
      organization={organization}
      customPageData={customPageData}
    />
  )
}

OJOIAdvert.getProps = async ({
  apolloClient,
  locale,
  query,
  customPageData,
}) => {
  const [
    {
      data: { officialJournalOfIcelandAdvert },
    },
    {
      data: { officialJournalOfIcelandAdvertsSimilar },
    },
    {
      data: { getOrganization },
    },
  ] = await Promise.all([
    apolloClient.query<Query, QueryOfficialJournalOfIcelandAdvertArgs>({
      query: ADVERT_QUERY,
      variables: {
        params: {
          id: query.nr as string,
        },
      },
    }),
    apolloClient.query<Query, QueryOfficialJournalOfIcelandAdvertsSimilarArgs>({
      query: ADVERT_SIMILAR_QUERY,
      variables: {
        params: {
          id: query.nr as string,
        },
      },
    }),
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

  if (!officialJournalOfIcelandAdvert?.advert) {
    throw new CustomNextError(404, 'OJOI advert not found')
  }

  return {
    advert: officialJournalOfIcelandAdvert.advert,
    organization: getOrganization,
    similar: officialJournalOfIcelandAdvertsSimilar.adverts,
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
    OJOIAdvert,
  ),
)
