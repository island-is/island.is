/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import NextLink from 'next/link'

import {
  Box,
  Breadcrumbs,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  Icon,
  Inline,
  Link,
  Text,
} from '@island.is/island-ui/core'
import { ChartsCard, StatisticsCard } from '@island.is/web/components'
import {
  ContentLanguage,
  GetOpenDataSubpageQuery,
  QueryGetOpenDataSubpageArgs,
} from '@island.is/web/graphql/schema'
import { withMainLayout } from '@island.is/web/layouts/main'
import { Screen } from '@island.is/web/types'

import { useLinkResolver } from '../../hooks/useLinkResolver'
import { GET_OPEN_DATA_SUBPAGE_QUERY } from '../queries'

interface OpenDataSubpageProps {
  page: GetOpenDataSubpageQuery['getOpenDataSubpage']
}

const OpenDataSubPage: Screen<OpenDataSubpageProps> = ({ page }) => {
  // Contentful currently has no available content types, so this is a teporary solution for a demo
  const { linkResolver } = useLinkResolver()
  const {
    pageTitle,
    fundTitle,
    fundDescription,
    statisticsCards,
    graphCards,
    organizationLogo,
  } = page
  return (
    <Box id="main-content" style={{ overflow: 'hidden' }}>
      <GridContainer>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '3/12']}>
            <Box display={'flex'} justifyContent="flexStart" marginBottom={3}>
              <Link {...linkResolver('opendatapage')} skipTab>
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
            <Box
              padding={[2, 2, 2]}
              background="purple100"
              borderRadius="large"
              marginBottom={3}
              display="flex"
              flexDirection="row"
              alignItems="center"
            >
              {organizationLogo && (
                <img src={organizationLogo.url} width={80} />
              )}
              <Box padding={1}>
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
            </Box>

            <Link
              href="https://www.rannis.is/sjodir/rannsoknir/taeknithrounarsjodur/"
              skipTab
            >
              <Box
                padding={[2, 2, 4]}
                background="blueberry100"
                borderRadius="large"
              >
                <Text variant="eyebrow" color="blueberry600">
                  Tengt efni
                </Text>
                <Box display="flex" alignItems="center">
                  <Box display="inlineFlex" flexGrow={1}>
                    <Text color="blueberry600">Tækniþróunarsjóður</Text>
                  </Box>
                </Box>
              </Box>
            </Link>
          </GridColumn>
          <GridColumn
            span={['12/12', '12/12', '8/12']}
            offset={['0', '0', '1/12']}
          >
            <Box marginBottom={3}>
              <Breadcrumbs
                items={[
                  {
                    title: 'Ísland.is',
                    href: '/',
                  },
                  {
                    title: 'Gagnatorg',
                    href: '/gagnatorg',
                  },
                  {
                    title: 'Rannís',
                  },
                ]}
                renderLink={(link) => {
                  return (
                    <NextLink
                      {...linkResolver('opendatapage')}
                      passHref
                      legacyBehavior
                    >
                      {link}
                    </NextLink>
                  )
                }}
              />
            </Box>
            <Box marginBottom={8}>
              <Text variant="h1">{pageTitle}</Text>
            </Box>
            <Box
              background="roseTinted100"
              padding={[2, 2, 4]}
              borderRadius="large"
              marginBottom={3}
            >
              <Inline space={2}>
                <Icon
                  color="purple400"
                  icon="cellular"
                  size="small"
                  type="outline"
                />
                <Text variant="eyebrow">Sjóðir Rannís</Text>
              </Inline>
              <Text variant="h3">{fundTitle}</Text>
              <Text>{fundDescription}</Text>
            </Box>
            <GridRow>
              {statisticsCards.map((card, index) => (
                <GridColumn span={['12/12', '12/12', '6/12']} key={index}>
                  <Box marginBottom={3}>
                    <StatisticsCard
                      title={card.title}
                      description={card.statistic}
                    />
                  </Box>
                </GridColumn>
              ))}
            </GridRow>
            <GridRow>
              <GridColumn span={'12/12'}>
                {graphCards.map((item, index) => (
                  <Box marginBottom={3} key={index}>
                    <ChartsCard
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore make web strict
                      chart={item}
                      subPage
                    />
                  </Box>
                ))}
              </GridColumn>
            </GridRow>
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Box>
  )
}

OpenDataSubPage.getProps = async ({ apolloClient, locale }) => {
  const [
    {
      data: { getOpenDataSubpage: page },
    },
  ] = await Promise.all([
    apolloClient.query<GetOpenDataSubpageQuery, QueryGetOpenDataSubpageArgs>({
      query: GET_OPEN_DATA_SUBPAGE_QUERY,
      variables: {
        input: {
          lang: locale as ContentLanguage,
        },
      },
    }),
  ])

  return {
    page,
  }
}

export default withMainLayout(OpenDataSubPage)
