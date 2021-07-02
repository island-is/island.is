/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
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
  GridColumns,
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
} from '@island.is/web/components'
import { withMainLayout } from '@island.is/web/layouts/main'
import { useLinkResolver } from '../../hooks/useLinkResolver'

const OpenDataSubPage: Screen = () => {
  const { linkResolver } = useLinkResolver()

  const image = {
    title: 'company',
    url:
      '//images.ctfassets.net/8k0h54kbe6bj/3CpwPzdLqnw65iAv9lPFUJ/bb52802cd0e409cc03f6f0903423894a/company-life-event.svg',
  }

  const dataLinkDescription =
    '[Undanfarin misseri hafa ...] Í þessu samhengi teljast til opinberra gagna öll gögn sem safnað hefur verið saman, vistuð með skipulegum eða kerfisbundnum hætti af opinberum aðilum og eru eða geta verið birt og varðveitt með rafrænum hætti. Hér eru tenglar á helstu vefi sem tengjast opnum gögnum á Íslandi.'

  return (
    <Box id="main-content" style={{ overflow: 'hidden' }}>
      <GridContainer>
        <GridRow>
          <GridColumn span="3/12">
          <Box display={'flex'} justifyContent="flexStart" marginBottom={3}>
                <Link href="/opin-gogn" skipTab>
                  <Button
                    preTextIcon="arrowBack"
                    preTextIconType="filled"
                    variant="text"
                    size="small"
                    as="span"
                  >
                    Til baka
                  </Button>
                </Link>
              </Box>
            <Box padding={[2, 2, 4]} background='purple100' borderRadius="large" marginBottom={3}>
              <Text variant="eyebrow" color="purple600">
                Þjónustuaðili
              </Text>
              <Box display="flex" alignItems="center">
                <Box display="inlineFlex" flexGrow={1}>
                  <Text variant="h3" color="purple600">
                    Rannís
                  </Text>
                </Box>
              </Box>
            </Box>
            <Box padding={[2, 2, 4]} background='blueberry100' borderRadius="large">
              <Text variant="eyebrow" color="blueberry600">
                Tengt efni
              </Text>
              <Box display="flex" alignItems="center">
                <Box display="inlineFlex" flexGrow={1}>
                  <Text color="blueberry600">
                    Tæknisjóður
                  </Text>
                </Box>
              </Box>
            </Box>
          </GridColumn>
          <GridColumn span="8/12" offset="1/12">
          
            <Box marginBottom={3}>
              <Breadcrumbs
                items={[
                  {
                    title: 'Ísland.is',
                    href: '/',
                  },
                  {
                    title: 'Gagnatorg',
                    href: '/opin-gogn'
                  },
                  {
                      title: 'Rannís'
                  }
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
    </Box>
  )
}

export default withMainLayout(OpenDataSubPage)
