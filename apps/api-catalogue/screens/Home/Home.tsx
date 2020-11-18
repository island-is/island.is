import React from 'react'
import { useWindowSize, useIsomorphicLayoutEffect } from 'react-use'
import { Card } from '../../components'
import { Box, Stack, Text, Breadcrumbs } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { HomeLayout } from '../../components'

import * as styles from './Home.treat'
import cn from 'classnames'

import { useNamespace } from '../../hooks'
import { QueryGetNamespaceArgs } from '@island.is/api/schema'
import { GetNamespaceQuery } from '../../graphql/schema'
import { GET_NAMESPACE_QUERY } from '../Queries'
import { Screen } from '../../types'
import initApollo from '../../graphql/client'

interface HomeProps {
  staticContent: GetNamespaceQuery['getNamespace']
}

export const Home: Screen<HomeProps> = ({ staticContent }) => {
  const n = useNamespace(staticContent)
  const { width } = useWindowSize()
  const [isMobile, setIsMobile] = React.useState(false)

  useIsomorphicLayoutEffect(() => {
    if (width < theme.breakpoints.md) {
      return setIsMobile(true)
    }
    setIsMobile(false)
  }, [width])

  return (
    <Box className={cn(isMobile ? styles.homePageMobile : styles.homePage)}>
      <HomeLayout
        left={
          <Box>
            <Box marginBottom={2}>
              <Breadcrumbs>Viskuausan</Breadcrumbs>
            </Box>
            <Box marginBottom={[3, 3, 3, 12]} marginTop={1}>
              <Stack space={1}>
                <Text variant="h1">{n('title')}</Text>
                <Text variant="intro">{n('intro')}</Text>
              </Stack>
            </Box>
          </Box>
        }
        right={
          <Box className={cn(isMobile ? styles.imageMobile : {})}>
            <img src="/frame.png" alt="Viskuausan" />
          </Box>
        }
      />
      <Box
        className={cn(styles.cards)}
        marginTop="gutter"
        marginBottom={[3, 3, 3, 12]}
      >
        <Card
          title={n('cataButtonTitle')}
          slug="services"
          text={n('cataButtonText')}
        />
        <Card
          title={n('dgButtonTitle')}
          slug="design-guide"
          text={n('dgButtonText')}
        />
      </Box>
    </Box>
  )
}

Home.getInitialProps = async (ctx) => {
  if (!ctx.locale) {
    ctx.locale = 'is-IS'
  }
  const client = initApollo({})

  const staticContent = await client
    .query<GetNamespaceQuery, QueryGetNamespaceArgs>({
      query: GET_NAMESPACE_QUERY,
      variables: {
        input: {
          namespace: 'ViskuausanHome',
          lang: ctx.locale,
        },
      },
    })
    .then((res) => JSON.parse(res.data.getNamespace.fields))

  return {
    staticContent,
  }
}
