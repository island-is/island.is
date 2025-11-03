import { useIntl } from 'react-intl'
import NextLink from 'next/link'

import {
  Box,
  Breadcrumbs,
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
import {
  ChartsCard,
  CustomPageLayoutHeader,
  CustomPageLayoutWrapper,
  Footer,
} from '@island.is/web/components'
import {
  CustomPageUniqueIdentifier,
  Query,
} from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import useLocalLinkTypeResolver from '@island.is/web/hooks/useLocalLinkTypeResolver'
import { withMainLayout } from '@island.is/web/layouts/main'

import { CustomScreen, withCustomPageWrapper } from '../../CustomPage'
import { m } from '../messages'
import { CHART_MOCK_DATA } from './mocks/chart'
import * as styles from './Home.css'

const OpenInvoicesHomePage: CustomScreen<OpenInvoicesHomeProps> = ({
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
    <CustomPageLayoutWrapper
      pageTitle={formatMessage(m.home.title)}
      pageDescription={formatMessage(m.home.description)}
      pageFeaturedImage={formatMessage(m.home.featuredImage)}
    >
      <CustomPageLayoutHeader
        title={formatMessage(m.home.title)}
        description={formatMessage(m.home.description)}
        featuredImage={formatMessage(m.home.featuredImage)}
        featuredImageAlt={formatMessage(m.home.featuredImageAlt)}
        offset
        shortcuts={{
          variant: 'tags',
          items: [
            {
              title: 'Yfirlit reikninga',
              href: linkResolver('openinvoicesoverview', [], locale).href,
            },
            {
              title: 'Reikningar',
              href: 'island.is',
            },
          ],
        }}
        breadcrumbs={
          breadcrumbItems && (
            <Breadcrumbs
              items={breadcrumbItems ?? []}
              renderLink={(link, item) => {
                return item?.href ? (
                  <NextLink href={item?.href} legacyBehavior>
                    {link}
                  </NextLink>
                ) : (
                  link
                )
              }}
            />
          )
        }
      />
      <Box marginTop="containerGutter">
        <GridContainer>
          <GridRow marginTop={9} marginBottom={13}>
            <GridColumn offset="1/12" span="4/12">
              <Stack space={2}>
                <Text variant="eyebrow" color="purple400">
                  Samtals greitt síðastliðna þrjá mánuði
                </Text>
                <Text variant="h1">75.319.753.197 kr.</Text>
                <Text>
                  Tölur byggja á greiddum reikningum, án innri viðskipta
                  (reikninga senda milli stofnana). ** Ef sú leið verður farin
                  **
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
                <Text variant="eyebrow">7,3% lækkun</Text>
              </Box>
            </GridColumn>
            <GridColumn offset="1/12" span="3/12">
              <Box padding={3} background="backgroundBrandMinimal">
                <Text marginBottom={1} variant="eyebrow">
                  Fjöldi skráðra reikninga
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
                  Fjöldi kaupenda
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
                  Fjöldi seljenda
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
                  Miðgildi reikningsupphæða
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
                <Text variant="h1">Greiðslur yfirstandandi árs</Text>
                <Text marginTop={2} variant="intro">
                  Grafið sýnir greidda reikninga það sem af er árinu, samanborið
                  við sömu mánuði í fyrra. Allar tölur eru á núvirði.
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
                <Text variant="h1">Um vefinn</Text>
                <Text variant="intro">
                  Markmið með birtingu reikninga er að auka gagnsæi og aðgengi
                  almennings að fjárhagsupplýsingum ríkisins
                </Text>
                <Text>
                  Á vefnum er unnt að skoða upplýsingar um greidda reikninga
                  ráðuneyta og stofnana úr bókhaldi ríkisins.
                </Text>
                <Box display="flex" alignItems="center">
                  <LinkV2 href="/something" color="blue400">
                    Nánar um opna reikninga
                  </LinkV2>
                  <Icon icon="arrowForward" color="blue400" />
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
                <Text variant="h1">Birtingarreglur</Text>
                <Text variant="intro">
                  Vefurinn byggir á greiðslum sem fara í gegnum
                  viðskiptaskuldakerfi stofnana, en þangað fara reikningar fyrir
                  kaup á vörum og þjónustu.
                </Text>
                <Text variant="intro">
                  Vegna persónuverndar eru nöfn ekki birt þegar reikningar
                  tengjast kennitölum einstaklinga. Einnig gildir trúnaður um
                  innihald tiltekinna reikninga vegna eðlis þeirra.
                </Text>
                <Box display="flex" alignItems="center">
                  <LinkV2 href="/something" color="blue400">
                    Sjá nánar
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
                href="/somewhere"
                heading="Yfirlit reikninga"
                src={formatMessage(m.home.featuredImage)}
                alt="temp"
                text="Heildarlisti greiddra reikninga á völdu tímabili. Hægt er að velja leitarskilyrði og afmarka þannig hvaða reikningar eru birtir."
              />
            </GridColumn>
            <GridColumn span="6/12">
              <CategoryCard
                href="/somewhere"
                heading="Samtölur reikninga"
                src={formatMessage(m.home.featuredImage)}
                alt="temp"
                text="Lykiltölfræði á borð við stærstu kaupendur og seljendur á völdu tímabili. Hægt er að kafa frá samtölum niður í einstaka reikninga."
              />
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Box>
      <Footer heading="Opinberir reikningar" columns={[]} />
    </CustomPageLayoutWrapper>
  )
}

interface OpenInvoicesHomeProps {
  organization?: Query['getOrganization']
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

OpenInvoicesHome.getProps = async ({ locale }) => {
  return {
    locale: locale as Locale,
    showSearchInHeader: false,
    themeConfig: {
      footerVersion: 'organization',
    },
  }
}

export default withMainLayout(
  withCustomPageWrapper(
    CustomPageUniqueIdentifier.OpenInvoices,
    OpenInvoicesHome,
  ),
)
