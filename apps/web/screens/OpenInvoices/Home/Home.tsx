import { useIntl } from 'react-intl'

import {
  ArrowLink,
  Box,
  CategoryCard,
  GridColumn,
  GridContainer,
  GridRow,
  Icon,
  LinkV2,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { Locale } from '@island.is/shared/types'
import { ChartsCard, Footer } from '@island.is/web/components'
import {
  CustomPageUniqueIdentifier,
  Organization,
  Query,
  QueryGetOrganizationArgs,
} from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import useLocalLinkTypeResolver from '@island.is/web/hooks/useLocalLinkTypeResolver'
import { withMainLayout } from '@island.is/web/layouts/main'

import { CustomScreen, withCustomPageWrapper } from '../../CustomPage'
import { GET_ORGANIZATION_QUERY } from '../../queries'
import { OpenInvoicesWrapper } from '../components/OpenInvoicesWrapper'
import { ORGANIZATION_SLUG } from '../contants'
import { m } from '../messages'
import * as styles from './Home.css'
import { CHART_MOCK_DATA } from './mockData'

const OpenInvoicesHomePage: CustomScreen<OpenInvoicesHomeProps> = ({
  organization,
  locale,
  customPageData,
}) => {
  useLocalLinkTypeResolver()
  useContentfulId(customPageData?.id)
  const { formatMessage } = useIntl()
  const { linkResolver } = useLinkResolver()

  const baseUrl = linkResolver('openinvoices', [], locale).href

  const breadcrumbItems = [
    {
      title: 'Ísland.is',
      href: linkResolver('homepage', [], locale).href,
    },
    {
      title: formatMessage(m.home.title),
      href: baseUrl,
      isTag: true,
    },
  ]

  return (
    <OpenInvoicesWrapper
      title={formatMessage(m.home.title)}
      description={formatMessage(m.home.description)}
      featuredImage={{
        src: formatMessage(m.home.featuredImage),
        alt: formatMessage(m.home.featuredImageAlt),
      }}
      header={{
        offset: true,
        breadcrumbs: breadcrumbItems,
        shortcuts: {
          variant: 'tags',
          items: [
            {
              title: formatMessage(m.home.invoiceOverview),
              href: linkResolver('openinvoicesoverview', [], locale).href,
            },
            {
              title: formatMessage(m.home.invoices),
              href: 'island.is',
            },
          ],
        },
      }}
      footer={
        organization
          ? {
              organization: organization,
            }
          : undefined
      }
    >
      <Box marginTop="containerGutter">
        <GridContainer>
          <GridRow marginTop={9} marginBottom={13}>
            <GridColumn offset="1/12" span="4/12">
              <Stack space={2}>
                <Text variant="eyebrow" color="purple400">
                  {formatMessage(m.home.categoriesEyebrow)}
                </Text>
                <Text variant="h1">75.319.753.197 kr.</Text>
                <Text>
                  {formatMessage(m.home.categoriesDescription)}
                </Text>
              </Stack>
              <Box
                className={styles.snug}
                background="backgroundBrandSecondaryMinimal"
                display="flex"
                flexDirection="row"
                marginTop={3}
                paddingX={2}
                paddingY="p2"
              >
                <Box display="flex" alignItems="center" marginRight={2}>
                  <Icon icon="arrowDown" color="foregroundBrandSecondary" />
                </Box>
                <Text variant="eyebrow">{formatMessage(m.home.categoriesTotal, {arg: '7.3%'})}</Text>
              </Box>
            </GridColumn>
            <GridColumn offset="1/12" span="3/12">
              <Box padding={3} background="backgroundBrandMinimal">
                <Text marginBottom={1} variant="eyebrow">
                  {formatMessage(m.home.invoiceCountTitle)}
                </Text>
                <Text
                  className={styles.oneline}
                  variant="h1"
                  color="foregroundBrand"
                >
                  649.456
                </Text>
              </Box>
              <Box
                marginTop={3}
                padding={3}
                background="backgroundBrandMinimal"
              >
                <Text marginBottom={1} variant="eyebrow">
                  {formatMessage(m.home.customerCountTitle)}
                </Text>
                <Text
                  className={styles.oneline}
                  variant="h1"
                  color="foregroundBrand"
                >
                  211
                </Text>
              </Box>
            </GridColumn>
            <GridColumn span="3/12">
              <Box padding={3} background="backgroundBrandMinimal">
                <Text marginBottom={1} variant="eyebrow">
                  {formatMessage(m.home.supplierCountTitle)}
                </Text>
                <Text
                  className={styles.oneline}
                  variant="h1"
                  color="foregroundBrand"
                >
                  2.939
                </Text>
              </Box>
              <Box
                marginTop={3}
                padding={3}
                background="backgroundBrandMinimal"
              >
                <Text marginBottom={1} variant="eyebrow">
                  {formatMessage(m.home.medianInvoiceAmountTitle)}
                </Text>
                <Text
                  className={styles.oneline}
                  variant="h1"
                  color="foregroundBrand"
                >
                  26.890 kr.
                </Text>
              </Box>
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Box>
      <Box paddingY={13} background="backgroundBrandMinimal">
        <GridContainer>
          <GridRow>
            <GridColumn offset="1/12" span="10/12">
              <Box>
                <Text variant="h1">{formatMessage(m.home.chartTitle)}</Text>
                <Text marginTop={2} variant="intro">
                  {formatMessage(m.home.chartDescription)}
                </Text>
                <ChartsCard
                  chart={{
                    type: 'Bar',
                    data: JSON.stringify(CHART_MOCK_DATA),
                    datakeys: JSON.stringify({
                      yAxis: {
                        label: 'm.kr.',
                      },
                      xAxis: 'month',
                      bars: [
                        {
                          datakey: '2024',
                          color: '#0061FF',
                        },
                        {
                          datakey: '2025',
                          color: '#D799C7',
                        },
                      ],
                    }),
                  }}
                />
              </Box>
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Box>
      <Box paddingY={13}>
        <GridContainer>
          <GridRow>
            <GridColumn offset="1/12" span="5/12">
              <Box
                display="flex"
                height="full"
                justifyContent="center"
                alignItems="center"
              >
                <img
                  src={formatMessage(m.home.featuredImage)}
                  className={styles.image}
                  alt={'temp'}
                />
              </Box>
            </GridColumn>
            <GridColumn span="5/12">
              <Stack space={2}>
                <Text variant="h1">{formatMessage(m.home.cardOneTitle)}</Text>
                <Text variant="intro">
                  {formatMessage(m.home.cardOneDescription)}
                </Text>
                <Box display="flex" alignItems="center">
                  <ArrowLink href="/temp" color="blue400">
                    Sjá alla kaupendur
                  </ArrowLink>
                </Box>
              </Stack>
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Box>
      <Box paddingY={13}>
        <GridContainer>
          <GridRow>
            <GridColumn offset="1/12" span="5/12">
              <Stack space={2}>
                <Text variant="h1">{formatMessage(m.home.cardTwoTitle)}</Text>
                <Text variant="intro">
                  {formatMessage(m.home.cardTwoDescription)}
                </Text>
                <Box display="flex" alignItems="center">
                  <LinkV2 href={formatMessage(m.home.cardTwoLinkUrl)} color="blue400">
                    {formatMessage(m.home.cardTwoLinkText)}
                  </LinkV2>
                  <Icon icon="arrowForward" color="blue400" />
                </Box>
              </Stack>
            </GridColumn>
            <GridColumn span="5/12">
              <Box
                display="flex"
                height="full"
                justifyContent="center"
                alignItems="center"
              >
                <img
                  src={formatMessage(m.home.featuredImage)}
                  className={styles.image}
                  alt={'temp'}
                />
              </Box>
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Box>
      <Box background="purple100" paddingY={13}>
        <GridContainer>
          <GridRow>
            <GridColumn span="6/12">
              <CategoryCard
                href={formatMessage(m.home.categoryCardOneLink)}
                heading={formatMessage(m.home.categoryCardOneTitle)}
                src={formatMessage(m.home.featuredImage)}
                alt={formatMessage(m.home.featuredImageAlt)}
                text={formatMessage(m.home.categoryCardOneDescription)}
              />
            </GridColumn>
            <GridColumn span="6/12">
              <CategoryCard
              href={formatMessage(m.home.categoryCardTwoLink)}
              heading={formatMessage(m.home.categoryCardTwoTitle)}
              src={formatMessage(m.home.featuredImage)}
              alt={formatMessage(m.home.featuredImageAlt)}
              text={formatMessage(m.home.categoryCardTwoDescription)}
              />
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Box>
    </OpenInvoicesWrapper>
  )
}

interface OpenInvoicesHomeProps {
  organization?: Organization
  locale: Locale
}

const OpenInvoicesHome: CustomScreen<OpenInvoicesHomeProps> = ({
  organization,
  locale,
  customPageData,
}) => {
  return (
    <OpenInvoicesHomePage
      organization={organization}
      locale={locale}
      customPageData={customPageData}
    />
  )
}

OpenInvoicesHome.getProps = async ({ apolloClient, locale }) => {
  const {
    data: { getOrganization },
  } = await apolloClient.query<Query, QueryGetOrganizationArgs>({
    query: GET_ORGANIZATION_QUERY,
    variables: {
      input: {
        slug: ORGANIZATION_SLUG,
        lang: locale,
      },
    },
  })

  return {
    locale: locale as Locale,
    organization: getOrganization ?? undefined
  }
}

export default withMainLayout(
  withCustomPageWrapper(
    CustomPageUniqueIdentifier.OpenInvoices,
    OpenInvoicesHome,
  ),
  {showFooter: false},
)
