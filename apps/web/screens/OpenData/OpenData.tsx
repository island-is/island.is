/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import {
  GET_OPEN_DATA_PAGE_QUERY
} from '../queries'
import {
  GetOpenDataPageQuery,
  QueryGetOpenDataPageArgs
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
  Inline,
  Logo,
  ColorSchemeContext
} from '@island.is/island-ui/core'
import NextLink from 'next/link'
import { Screen } from '@island.is/web/types'
import {
  Section,
  StatisticsCardsSection,
  DataLinkSection,
  MixedChart,
  SimplePieChart,
  SimpleLineChart,
  ChartsCard,
  SectionTitle,
  Header,
} from '@island.is/web/components'
import { withMainLayout } from '@island.is/web/layouts/main'
import { useLinkResolver } from '../../hooks/useLinkResolver'
import { Locale } from '@island.is/shared/types'

interface OpenDataProps {
  page: GetOpenDataPageQuery['getOpenDataPage']
}

const OpenDataPage: Screen<OpenDataProps> = ({page}) => {
  const { linkResolver } = useLinkResolver()
  console.log(page)
  const {  pageTitle,
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
    externalLinkSectionImage } = page
  

  // Hard coded values for the data links cards section, will be removed once connected to contentful
  const cards = [
    {
      title: 'CLARIN á Íslandi',
      description: 'Árnastofnun',
      link: {
        href: '/flokkur/akstur-og-bifreidar',
      },
    },
    {
      title: 'Gagnasöfn Orkustofunar',
      description: 'Gögn um orkurannsóknir og orkunýtingu',
      link: {
        href: '/flokkur/atvinnurekstur-og-sjalfstaett-starfandi',
      },
    },
    {
      title: 'Gagnagátt Umhverfisstofnunar',
      description: '',
      link: {
        href: '/flokkur/domstolar-og-rettarfar',
      },
    },
    {
      title: 'Gagnabrunnur Veðurstofunnar',
      description: 'Veðurstofa Íslands',
      link: {
        href: '/flokkur/fjarmal-og-skattar',
      },
    },
    {
      title: 'Hagstofa Íslands',
      description: 'Talnaefni og tilraunatölfræði',
      link: {
        href: '/flokkur/fjolskylda-og-velferd',
      },
    },
    {
      title: 'Landupplýsingagátt',
      description: 'Landmælingar Íslands',
      link: {
        href: '/flokkur/heilbrigdismal',
      },
    },
    {
      title: 'Loftgæði á Íslandi',
      description: 'Umhverfisstofnun',
      link: {
        href: '/flokkur/husnaedismal',
      },
    },
    {
      title: 'Lýðheilsuvísir Landlæknis',
      description: '',
      link: {
        href: '/flokkur/idnadur',
      },
    },
    {
      title: 'Mælaborð ferðaþjónustunnar',
      description: 'Ferðamálastofa',
      link: {
        href: '/flokkur/innflytjendamal',
      },
    },
    {
      title: 'Mælaborð Tryggingastofnunar',
      description: '',
      link: {
        href: '/flokkur/launthegi-rettindi-og-lifeyrir',
      },
    },
    {
      title: 'Mælaborð Vinnumálastofnunar',
      description: '',
      link: {
        href: '/flokkur/malefni-fatlads-folks',
      },
    },
    {
      title: 'Opingogn.is',
      description: 'Opin gögn frá opinberum aðilum á Íslandi',
      link: {
        href: '/flokkur/samfelag-og-rettindi',
      },
    },
    {
      title: 'Opin gögn Reykjavíkurborgar',
      description: '',
      link: {
        href: '/flokkur/samgongur',
      },
    },
  ]

  const image = {
    title: 'company',
    url:
      '//images.ctfassets.net/8k0h54kbe6bj/3CpwPzdLqnw65iAv9lPFUJ/bb52802cd0e409cc03f6f0903423894a/company-life-event.svg',
  }

  const dataLinkDescription =
    '[Undanfarin misseri hafa ...] Í þessu samhengi teljast til opinberra gagna öll gögn sem safnað hefur verið saman, vistuð með skipulegum eða kerfisbundnum hætti af opinberum aðilum og eru eða geta verið birt og varðveitt með rafrænum hætti. Hér eru tenglar á helstu vefi sem tengjast opnum gögnum á Íslandi.'

  return (
    <Box id="main-content" style={{ overflow: 'hidden', top: 0 }}>
      <Section
        aria-labelledby="openDataHeroTitle"
        background="blue100"
        paddingBottom={6}
      >
        <GridContainer>
          <GridRow>
            <GridColumn span={["12/12", "5/12", "5/12"]} paddingBottom={2}>
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
              <Text paddingBottom={4}>
                {pageDescription}
              </Text>
              <Box display={'flex'} justifyContent="flexStart" marginTop={3}>
                <Link {...linkResolver('lifeevents')} skipTab>
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
            <GridColumn span={["12/12", "7/12", "7/12"]}>
              <SimpleLineChart />
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Section>
      {/* TODO: Will need to change the props so facts card get their data from a query */}
      <Section aria-labelledby="factsCardsTitle">
        <StatisticsCardsSection title="Stafrænt Ísland" cards={statisticsCardsSection} />
      </Section>
      <Section>
        <GridContainer>
          <GridRow>
            <GridColumn span="12/12">
              <SectionTitle title="Stofnanir" icon="business"/>
            </GridColumn>
          </GridRow>
          <GridRow>
            <GridColumn span={["12/12", "4/12","4/12"]}>
              <ChartsCard title="Rannís" description="Þjónustuaðili">
                <SimplePieChart />
              </ChartsCard>
            </GridColumn>
            <GridColumn span={["12/12", "8/12","8/12"]}>
              <ChartsCard
                title="Rannís"
                description="Þjónustuaðili"
                subTitle="Fjöldi sóttra og veittra styrkja seinustu tíu árin og heildarupphæð úthlutuna"
              >
                <MixedChart />
              </ChartsCard>
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
          title={'Opin gögn á Íslandi'}
          titleId="OpenDataLinksTitle"
          image={image}
          description={dataLinkDescription}
          cards={cards}
        />
      </Section>
    </Box>
  )
}

OpenDataPage.getInitialProps = async ({ apolloClient, locale}) => {
  const [
    {
      data: { getOpenDataPage: page},
    }
  ] = await Promise.all([
    apolloClient.query<GetOpenDataPageQuery, QueryGetOpenDataPageArgs>({
      query: GET_OPEN_DATA_PAGE_QUERY,
      variables: {
        input: {
          lang: locale
        }
      }
    })
  ])

  return {
    page
  }
}

export default withMainLayout(OpenDataPage)
