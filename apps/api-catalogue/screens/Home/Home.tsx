import React from 'react'
import { useWindowSize, useIsomorphicLayoutEffect } from 'react-use'
import { Card } from '../../components'
import { Box, Stack, Text, Breadcrumbs } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { HomeLayout } from '../../components'
import * as styles from './Home.treat'
import cn from 'classnames'
import { Page } from '../../services/contentful.types'

export interface HomeProps {
  pageContent: Page
}

export function Home({ pageContent }: HomeProps) {
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
                <Text variant="h1">
                  {pageContent.strings.find((s) => s.id === 'home-title').text}
                </Text>
                <Text variant="intro">
                  {pageContent.strings.find((s) => s.id === 'home-intro').text}
                </Text>
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
            pageContent.strings.find((s) => s.id === 'home-catalog-button').text
          }
          slug="services"
          text={
            pageContent.strings.find((s) => s.id === 'home-cata-btn-txt').text
          }
        />
        {/* <Card
          title={
            pageContent.strings.find((s) => s.id === 'home-dm-button')
              .text
          }
          slug="data-models"
          text={
            pageContent.strings.find((s) => s.id === 'home-dm-btn-txt')
              .text
          }
        /> */}
        <Card
          title={
            pageContent.strings.find((s) => s.id === 'home-dg-button').text
          }
          slug="design-guide"
          text={
            pageContent.strings.find((s) => s.id === 'home-dg-btn-txt').text
          }
        />
      </Box>
    </Box>
  )
}
