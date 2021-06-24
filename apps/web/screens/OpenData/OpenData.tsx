/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import {
  GridContainer,
  Box,
  GridRow,
  GridColumn,
  Breadcrumbs,
  Inline,
  Stack,
} from '@island.is/island-ui/core'
import NextLink from 'next/link'
import { Screen } from '@island.is/web/types'
import {
  Section,
  FactsCardsSection,
  DataLinkSection,
} from '@island.is/web/components'
import { withMainLayout } from '@island.is/web/layouts/main'
import { useLinkResolver } from '../../hooks/useLinkResolver'

const OpenDataPage: Screen = () => {
  const { linkResolver } = useLinkResolver()

  // Hard coded values for now
  const cards = [
    {
      title: 'CLARIN á Íslandi',
      description:
        'Árnastofnun',
      link: {
        href: '/flokkur/akstur-og-bifreidar',
      },
    },
    {
      title: 'Gagnasöfn Orkustofunar',
      description:
        'Gögn um orkurannsóknir og orkunýtingu',
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
      description:
        'Talnaefni og tilraunatölfræði',
      link: {
        href: '/flokkur/fjolskylda-og-velferd',
      },
    },
    {
      title: 'Landupplýsingagátt',
      description:
        'Landmælingar Íslands',
      link: {
        href: '/flokkur/heilbrigdismal',
      },
    },
    {
      title: 'Loftgæði á Íslandi',
      description:
        'Umhverfisstofnun',
      link: {
        href: '/flokkur/husnaedismal',
      },
    },
    {
      title: 'Lýðheilsuvísir Landlæknis',
      description:
        '',
      link: {
        href: '/flokkur/idnadur',
      },
    },
    {
      title: 'Mælaborð ferðaþjónustunnar',
      description:
        'Ferðamálastofa',
      link: {
        href: '/flokkur/innflytjendamal',
      },
    },
    {
      title: 'Mælaborð Tryggingastofnunar',
      description:
        '',
      link: {
        href: '/flokkur/launthegi-rettindi-og-lifeyrir',
      },
    },
    {
      title: 'Mælaborð Vinnumálastofnunar',
      description:
        '',
      link: {
        href: '/flokkur/malefni-fatlads-folks',
      },
    },
    {
      title: 'Opingogn.is',
      description:
        'Opin gögn frá opinberum aðilum á Íslandi',
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
    url: "//images.ctfassets.net/8k0h54kbe6bj/3CpwPzdLqnw65iAv9lPFUJ/bb52802cd0e409cc03f6f0903423894a/company-life-event.svg"
  }

  const dataLinkDescription = "[Undanfarin misseri hafa ...] Í þessu samhengi teljast til opinberra gagna öll gögn sem safnað hefur verið saman, vistuð með skipulegum eða kerfisbundnum hætti af opinberum aðilum og eru eða geta verið birt og varðveitt með rafrænum hætti. Hér eru tenglar á helstu vefi sem tengjast opnum gögnum á Íslandi."

  return (
    <Box paddingY={[2, 2, 10]} id="main-content">
      <Section aria-labelledby="lifeEventsTitle" background="purple100">
        {/* <Inline space={4}>
          <Stack space={2}> */}
        <GridContainer>
          <GridRow>
            <GridColumn>
              <Box paddingX={[3, 3, 8]}>
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
                      <NextLink {...linkResolver('homepage')} passHref>
                        {link}
                      </NextLink>
                    )
                  }}
                />
              </Box>
            </GridColumn>
          </GridRow>
        </GridContainer>
        {/* </Stack>
        </Inline> */}
      </Section>
      <Section aria-labelledby="factsCardsTitle">
        <FactsCardsSection
          title="Stafrænt Ísland"
          linkTitle="hér kemur linkur"
        />
      </Section>
      <Section
        paddingTop={[8, 8, 6]}
        paddingBottom={[8, 8, 6]}
        aria-labelledby="serviceCategoriesTitle"
      >
        <DataLinkSection
          title={'Oping gögn á Íslandi'}
          titleId="OpenDataLinksTitle"
          image={image}
          description={dataLinkDescription}
          cards={cards}
        />
      </Section>
    </Box>
  )
}

export default withMainLayout(OpenDataPage)
