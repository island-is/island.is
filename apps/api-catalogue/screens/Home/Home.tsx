import React from 'react'
import { useWindowSize, useIsomorphicLayoutEffect } from 'react-use'
import { Card } from '../../components'
import {
  Box,
  Stack,
  Typography,
  Breadcrumbs,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'

import { HomeLayout } from '../../components'

import * as styles from './Home.treat'
import cn from 'classnames'

import { Page } from '../../services/contentful.types'

export interface HomeProps {
  pageContent: Page
}

function Home(props: HomeProps) {
  const { width } = useWindowSize()
  const [isMobile, setIsMobile] = React.useState(false)

  useIsomorphicLayoutEffect(() => {
    //if (width < 771) {
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
              <Breadcrumbs>Vefþjónustur</Breadcrumbs>
            </Box>
            <Box marginBottom={[3, 3, 3, 12]} marginTop={1}>
              <Stack space={3}>
                <Typography variant="h1">
                  {
                    props.pageContent.strings.find((s) => s.id === 'home-title')
                      .text
                  }
                </Typography>
                <Typography variant="intro">
                  {
                    props.pageContent.strings.find((s) => s.id === 'home-intro')
                      .text
                  }
                </Typography>
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
          title={
            props.pageContent.strings.find(
              (s) => s.id === 'home-catalog-button',
            ).text
          }
          slug="services"
          text={
            props.pageContent.strings.find((s) => s.id === 'home-cata-btn-txt')
              .text
          }
        />
        {/*<Card
          title={
            props.pageContent.strings.find((s) => s.id === 'home-dm-button')
              .text
          }
          slug="data-models"
          text={
            props.pageContent.strings.find((s) => s.id === 'home-dm-btn-txt')
              .text
          }
        />*/}
        <Card
          title={
            props.pageContent.strings.find((s) => s.id === 'home-dg-button')
              .text
          }
          slug="design-guide"
          text={
            props.pageContent.strings.find((s) => s.id === 'home-dg-btn-txt')
              .text
          }
        />
      </Box>
    </Box>
  )
}

// Home.getInitialProps = async (ctx) => {
//   const client = new ContentfulApi()
//   let locale = 'is-IS'

//   const pathLocale = ctx.pathname.split('/')[1]
//   if (pathLocale === 'en') {
//     locale = 'en-GB'
//   }

//   const pageContent = await client.fetchPageBySlug('home', locale)

//   return {
//     pageContent: pageContent,
//   }
// }

export default Home
