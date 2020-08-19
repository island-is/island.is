/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import Link from 'next/link'
import slugify from '@sindresorhus/slugify'
import { Content, Hyperlink, Image } from '@island.is/island-ui/contentful'
import {
  Query,
  LandingPage,
  QueryGetLandingPageArgs,
} from '@island.is/api/schema'
import { Screen } from '@island.is/web/types'
import { GET_LANDING_PAGE_QUERY } from '../queries'
import { CustomNextError } from '../../units/ErrorBoundary'
import Head from 'next/head'
import { useI18n } from '@island.is/web/i18n'
import {
  Stack,
  Button,
  Typography,
  Box,
  ContentBlock,
  Breadcrumbs,
} from '@island.is/island-ui/core'
import { Sidebar } from '@island.is/web/components'
import ArticleLayout from '../Layouts/Layouts'
import { Locale } from '../../i18n/I18n'
import useRouteNames from '../../i18n/useRouteNames'

export interface LandingPageProps {
  page?: LandingPage
}

const LandingPageScreen: Screen<LandingPageProps> = ({ page }) => {
  const { activeLocale } = useI18n()
  const { makePath } = useRouteNames(activeLocale as Locale)

  const sidebar = (
    <Stack space={3}>
      {page.actionButton && (
        <Box background='purple100' padding={4} borderRadius='large'>
          <Button href={page.actionButton.url} width='fluid'>
            {page.actionButton.text}
          </Button>
        </Box>
      )}
      <Sidebar title='Efnisyfirlit' bullet='left' headingLinks />
      {page.links && (
        <Box background='purple100' padding={4} borderRadius='large'>
          <Stack space={2}>
            {page.links.title && (
              <Typography variant='p'>{page.links.title}</Typography>
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
        <Box paddingY='none' paddingX={[3, 3, 6, 0]} marginBottom={[2, 2, 3]}>
          <ContentBlock width='small'>
            <Stack space={[3, 3, 4]}>
              <Breadcrumbs>
                <Link href={makePath()}>
                  <a>Ísland.is</a>
                </Link>
                <Link href={'/' + page.slug}>
                  <a>{page.title}</a>
                </Link>
              </Breadcrumbs>
              <Typography variant='h1' as='h1'>
                <span data-sidebar-link={slugify(page.title)}>
                  {page.title}
                </span>
              </Typography>
              <Typography variant='intro' as='p'>
                {page.introduction}
              </Typography>
              {page.image && (
                <Image type='apiImage' image={page.image} maxWidth={774} />
              )}
            </Stack>
          </ContentBlock>
        </Box>
        <Content document={page.content} />
      </ArticleLayout>
    </>
  )
}

LandingPageScreen.getInitialProps = async ({ apolloClient, locale, query }) => {
  const {
    data: { getLandingPage: page },
  } = await apolloClient.query<Query, QueryGetLandingPageArgs>({
    query: GET_LANDING_PAGE_QUERY,
    variables: {
      input: {
        lang: locale,
        slug: query.slug as string,
      },
    },
  })

  if (!page) {
    throw new CustomNextError(404, 'Page not found')
  }

  return {
    page,
  }
}

export default LandingPageScreen
