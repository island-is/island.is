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
  Icon,
} from '@island.is/island-ui/core'
import NextLink from 'next/link'
import { Screen } from '@island.is/web/types'
import { StatisticsCard, ChartsCard } from '@island.is/web/components'
import { withMainLayout } from '@island.is/web/layouts/main'
import { useLinkResolver } from '../../hooks/useLinkResolver'
import { area, gender, applications, category } from './data'

const OpenDataSubPage: Screen = () => {
  // Contentful currently has no available content types, so this is a teporary solution for a demo
  const { linkResolver } = useLinkResolver()
  const data = [area, gender, category, applications]
  return (
    <Box id="main-content" style={{ overflow: 'hidden' }}>
      <GridContainer>
        <GridRow>
          <GridColumn span={["12/12", "12/12", "3/12"]}>
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
              padding={[2, 2, 4]}
              background="purple100"
              borderRadius="large"
              marginBottom={3}
            >
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
                    <Text color="blueberry600">Tæknisjóður</Text>
                  </Box>
                </Box>
              </Box>
            </Link>
          </GridColumn>
          <GridColumn span={["12/12", "12/12", "8/12"]} offset={["0", "0", "1/12"]}>
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
                    <NextLink {...linkResolver('opendatapage')} passHref>
                      {link}
                    </NextLink>
                  )
                }}
              />
            </Box>
            <Box marginBottom={8}>
              <Text variant="h1">Mælaborð</Text>
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
              <Text variant="h3">Tæknisjóður</Text>
            </Box>
            <GridRow>
              <GridColumn span={['12/12', '12/12', '6/12']}>
                <Box marginBottom={3}>
                  <StatisticsCard
                    title="Samningar/umsóknir 2020-21"
                    description="127/745"
                  />
                </Box>
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '6/12']}>
                <Box marginBottom={3}>
                  <StatisticsCard
                    title="Heildarupphæð styrkja 2020-21"
                    description="19.536 m.kr"
                  />
                </Box>
              </GridColumn>
            </GridRow>
            <GridRow>
              <GridColumn span={'12/12'}>
                {data.map((item, index) => (
                  <Box marginBottom={3} key={index}>
                    <ChartsCard data={item} />
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

export default withMainLayout(OpenDataSubPage)
