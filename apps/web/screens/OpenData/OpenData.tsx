/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { GET_OPEN_DATA_PAGE_QUERY } from '../queries'
import {
  GetOpenDataPageQuery,
  QueryGetOpenDataPageArgs,
} from '@island.is/web/graphql/schema'
import {
  GridContainer,
  Box,
  GridRow,
  GridColumn,
  Breadcrumbs,
  Text,
  Link,
  Button,
  ColorSchemeContext,
} from '@island.is/island-ui/core'
import NextLink from 'next/link'
import { Screen } from '@island.is/web/types'
import {
  Section,
  StatisticsCardsSection,
  DataLinkSection,
  SimpleLineChart,
  ChartsCard,
  SectionTitle,
  Header,
} from '@island.is/web/components'
import { withMainLayout } from '@island.is/web/layouts/main'
import { useLinkResolver } from '../../hooks/useLinkResolver'
import { Locale } from '@island.is/shared/types'
import Head from 'next/head'

interface OpenDataProps {
  page: GetOpenDataPageQuery['getOpenDataPage']
}

const OpenDataPage: Screen<OpenDataProps> = ({ page }) => {
  const { linkResolver } = useLinkResolver()
  const {
    pageTitle,
    pageDescription,
    pageHeaderGraph,
    link,
    linkTitle,
    statisticsCardsSection,
    chartSectionTitle,
    graphCards,
    externalLinkCardSelection,
    externalLinkSectionTitle,
    externalLinkSectionDescription,
    externalLinkSectionImage,
  } = page

  const megaMenuData = {
    asideTopLinks: [
      {
        text: 'Stafrænt Ísland',
        href: 'https://island.is/s/stafraent-island',
        sub: [],
      },
      {
        text: 'Þjónusta Ísland.is',
        href: 'https://island.is/s/stafraent-island/thjonustur',
        sub: [],
      },
      {
        text: 'Opinberir aðilar',
        href: 'https://island.is/stofnanir',
        sub: [],
      },
      {
        text: 'Þróun',
        href: 'https://island.is/stofnanir/stafraent-island/throun',
        sub: [
          {
            text: 'Vefþjónustur ',
            href: 'https://island.is/s/stafraent-island/vefthjonustur',
            sub: null,
          },
          {
            text: 'Þróunarhandbók',
            href: 'https://island.is/s/stafraent-island/throunarhandbok',
            sub: null,
          },
          {
            text: 'Ísland UI',
            href: 'https://ui.devland.is/',
            sub: null,
          },
          {
            text: 'Hönnunarkerfi',
            href: 'https://www.figma.com/@islandis',
            sub: null,
          },
        ],
      },
    ],
    asideBottomTitle: 'Aðrir opinberir vefir',
    asideBottomLinks: [
      {
        text: 'Opinber nýsköpun',
        href: 'https://opinbernyskopun.island.is/',
        sub: [],
      },
      {
        text: 'Samráðsgátt',
        href: 'https://samradsgatt.island.is',
        sub: [],
      },
      {
        text: 'Mannanöfn',
        href: 'https://vefur.island.is/mannanofn/',
        sub: [],
      },
      {
        text: 'Undirskriftarlistar',
        href: 'https://island.is/undirskriftalistar-stofna-nyjan-lista',
        sub: [],
      },
      {
        text: 'Opnir reikningar ríkisins',
        href: 'http://www.opnirreikningar.is/',
        sub: [],
      },
      {
        text: 'Tekjusagan',
        href: 'https://tekjusagan.is/',
        sub: [],
      },
    ],
    mainLinks: [
      {
        text: 'Akstur og bifreiðar',
        href: '/flokkur/akstur-og-bifreidar',
      },
      {
        text: 'Atvinnurekstur og sjálfstætt starfandi',
        href: '/flokkur/atvinnurekstur-og-sjalfstaett-starfandi',
      },
      {
        text: 'Dómstólar og réttarfar',
        href: '/flokkur/domstolar-og-rettarfar',
      },
      {
        text: 'Fjármál og skattar',
        href: '/flokkur/fjarmal-og-skattar',
      },
      {
        text: 'Fjölskylda og velferð',
        href: '/flokkur/fjolskylda-og-velferd',
      },
      {
        text: 'Heilbrigðismál',
        href: '/flokkur/heilbrigdismal',
      },
      {
        text: 'Húsnæðismál',
        href: '/flokkur/husnaedismal',
      },
      {
        text: 'Iðnaður',
        href: '/flokkur/idnadur',
      },
      {
        text: 'Innflytjendamál',
        href: '/flokkur/innflytjendamal',
      },
      {
        text: 'Launþegi, réttindi og lífeyrir',
        href: '/flokkur/launthegi-rettindi-og-lifeyrir',
      },
      {
        text: 'Málefni fatlaðs fólks',
        href: '/flokkur/malefni-fatlads-folks',
      },
      {
        text: 'Menntun',
        href: '/flokkur/menntun',
      },
      {
        text: 'Neytendamál',
        href: '/flokkur/neytendamal',
      },
      {
        text: 'Samfélag og réttindi',
        href: '/flokkur/samfelag-og-rettindi',
      },
      {
        text: 'Samgöngur',
        href: '/flokkur/samgongur',
      },
      {
        text: 'Umhverfismál',
        href: '/flokkur/umhverfismal',
      },
      {
        text: 'Vegabréf, ferðalög og búseta erlendis',
        href: '/flokkur/vegabref-ferdalog-og-buseta-erlendis',
      },
      {
        text: 'Þjónusta Ísland.is',
        href: '/flokkur/thjonusta-island-is',
      },
    ],
  }
  return (
    <>
      <Head>
        <title>Gagnatorg</title>
        <meta name="description" content={pageDescription} />
      </Head>
      <Box id="main-content" position="relative" style={{ overflow: 'hidden' }}>
        <Box background="blue100">
          <Header megaMenuData={megaMenuData} />
        </Box>
        <Section
          aria-labelledby="openDataHeroTitle"
          background="blue100"
          paddingBottom={6}
        >
          <GridContainer>
            <GridRow>
              <GridColumn span={['12/12', '5/12', '5/12']} paddingBottom={2}>
                <Box marginBottom={3}>
                  <Breadcrumbs
                    items={[
                      {
                        title: 'Ísland.is',
                        href: '/',
                      },
                      {
                        title: 'Gagnatorg',
                      },
                    ]}
                    renderLink={(link) => {
                      return (
                        <NextLink {...linkResolver('opendatapage')} passHref>
                          {link}
                        </NextLink>
                      )
                    }}
                  />
                </Box>
                <Text variant="h1" as="h1" paddingBottom={4}>
                  {pageTitle}
                </Text>
                <Text paddingBottom={4}>{pageDescription}</Text>
                <Box display={'flex'} justifyContent="flexStart" marginTop={3}>
                  <Link href={link} skipTab>
                    <Button
                      icon="arrowForward"
                      iconType="filled"
                      variant="text"
                      as="span"
                    >
                      {linkTitle}
                    </Button>
                  </Link>
                </Box>
              </GridColumn>
              <GridColumn span={['12/12', '7/12', '7/12']}>
                <SimpleLineChart graphData={pageHeaderGraph} />
              </GridColumn>
            </GridRow>
          </GridContainer>
        </Section>
        <Section aria-labelledby="factsCardsTitle" paddingBottom={8}>
          <StatisticsCardsSection
            title="Stafrænt Ísland"
            cards={statisticsCardsSection}
          />
        </Section>
        <Section paddingBottom={8}>
          <GridContainer>
            <GridRow>
              <GridColumn span="12/12">
                <SectionTitle title={chartSectionTitle} icon="business" />
              </GridColumn>
            </GridRow>
            <GridRow>
              <GridColumn span={['12/12', '4/12', '4/12']}>
                <ChartsCard data={graphCards[1]} />
              </GridColumn>
              <GridColumn span={['12/12', '8/12', '8/12']}>
                <ChartsCard data={graphCards[0]} />
              </GridColumn>
            </GridRow>
          </GridContainer>
        </Section>
        <Section
          paddingTop={[8, 8, 6]}
          paddingBottom={[8, 8, 6]}
          aria-labelledby="dataLinksSection"
        >
          <DataLinkSection
            title={externalLinkSectionTitle}
            titleId="OpenDataLinksTitle"
            image={externalLinkSectionImage}
            description={externalLinkSectionDescription}
            cards={externalLinkCardSelection.cards}
          />
        </Section>
      </Box>
    </>
  )
}

OpenDataPage.getInitialProps = async ({ apolloClient, locale }) => {
  const [
    {
      data: { getOpenDataPage: page },
    },
  ] = await Promise.all([
    apolloClient.query<GetOpenDataPageQuery, QueryGetOpenDataPageArgs>({
      query: GET_OPEN_DATA_PAGE_QUERY,
      variables: {
        input: {
          lang: locale,
        },
      },
    }),
  ])

  return {
    page,
  }
}

export default withMainLayout(OpenDataPage, {
  showHeader: false,
})
