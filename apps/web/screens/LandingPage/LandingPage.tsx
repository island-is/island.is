/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useMemo } from 'react'
import { Hyperlink, Image } from '@island.is/island-ui/contentful'
import { Screen } from '@island.is/web/types'
import { GET_LANDING_PAGE_QUERY } from '../queries'
import { CustomNextError } from '../../units/errors'
import Head from 'next/head'
import { useI18n } from '@island.is/web/i18n'
import {
  Stack,
  Button,
  Typography,
  Box,
  Breadcrumbs,
  Link,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import { RichText, SidebarNavigation } from '@island.is/web/components'
import ArticleLayout from '../Layouts/Layouts'
import useRouteNames from '../../i18n/useRouteNames'
import { withMainLayout } from '../../layouts/main'
import {
  QueryGetLandingPageArgs,
  GetLandingPageQuery,
} from '../../graphql/schema'
import { createNavigation, makeId } from '@island.is/web/utils/navigation'

export interface LandingPageProps {
  page?: GetLandingPageQuery['getLandingPage']
}

const LandingPageScreen: Screen<LandingPageProps> = ({ page }) => {
  const { activeLocale } = useI18n()
  const { makePath } = useRouteNames(activeLocale)
  const navigation = useMemo(() => {
    return createNavigation(page.content, { title: page.title })
  }, [page])

  const sidebar = (
    <Stack space={3}>
      {page.actionButton && (
        <Box background="purple100" padding={4} borderRadius="large">
          <Button href={page.actionButton.url} width="fluid">
            {page.actionButton.text}
          </Button>
        </Box>
      )}
      <SidebarNavigation
        title="Efnisyfirlit"
        position="right"
        navigation={navigation}
      />
      {page.links && (
        <Box background="purple100" padding={4} borderRadius="large">
          <Stack space={2}>
            {page.links.title && (
              <Typography variant="p">{page.links.title}</Typography>
            )}
            {page.links.links.map(({ url, text }, index) => (
              <Hyperlink key={index} href={url}>
                {text}
              </Hyperlink>
            ))}
          </Stack>
        </Box>
      )}
    </Stack>
  )

  return (
    <>
      <Head>
        <title>{page.title}</title>
      </Head>
      <ArticleLayout sidebar={sidebar}>
        <GridRow>
          <GridColumn span={['0', '0', '7/9']} offset={['0', '0', '1/9']}>
            <Stack space={[3, 3, 4]}>
              <Breadcrumbs>
                <Link href={makePath()}>Ísland.is</Link>
                <Link href={'/' + page.slug}>{page.title}</Link>
              </Breadcrumbs>
              <Typography id={makeId(page.title)} variant="h1" as="h1">
                {page.title}
              </Typography>
              <Typography variant="intro" as="p">
                {page.introduction}
              </Typography>
              {page.image && (
                <Image type="apiImage" image={page.image} maxWidth={774} />
              )}
            </Stack>
          </GridColumn>
        </GridRow>
        <Box paddingTop={6}>
          <RichText body={page.content} />
        </Box>
      </ArticleLayout>
    </>
  )
}

LandingPageScreen.getInitialProps = async ({ apolloClient, locale, query }) => {
  const result = await apolloClient.query<
    GetLandingPageQuery,
    QueryGetLandingPageArgs
  >({
    query: GET_LANDING_PAGE_QUERY,
    variables: {
      input: {
        lang: locale,
        slug: query.slug as string,
      },
    },
  })

  if (!result.data.getLandingPage) {
    throw new CustomNextError(404, 'Page not found')
  }

  return {
    page: result.data.getLandingPage,
  }
}

export default withMainLayout(LandingPageScreen)
