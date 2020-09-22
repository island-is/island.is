import React from 'react'
import { Screen } from '@island.is/web/types'
import { QueryGetAboutSubPageArgs } from '@island.is/api/schema'
import {
  GetAboutSubPageQuery,
  GetAboutPageNavigationQuery,
  QueryGetAboutPageArgs,
} from '@island.is/web/graphql/schema'
import { GET_ABOUT_SUB_PAGE_QUERY, GET_ABOUT_PAGE_NAVIGATION } from '../queries'
import { StandardLayout } from '../Layouts/Layouts'
import {
  Breadcrumbs,
  Link,
  Stack,
  Divider,
  Typography,
  GridRow,
  GridColumn,
  Box,
} from '@island.is/island-ui/core'
import { withMainLayout } from '@island.is/web/layouts/main'
import { SidebarBox, Bullet, RichText } from '@island.is/web/components'
import { useRouter } from 'next/router'
import { CustomNextError } from '@island.is/web/units/errors'
import Head from 'next/head'

export interface AboutSubPageProps {
  page: GetAboutSubPageQuery['getAboutSubPage']
  parentPage: GetAboutPageNavigationQuery['getAboutPage']
}

export const AboutSubPage: Screen<AboutSubPageProps> = ({
  page,
  parentPage,
}) => {
  const { asPath } = useRouter()

  const sidebar = (
    <SidebarBox background="blue100">
      <Stack space={[1, 1, 2]}>
        <Typography variant="h4" as="h2">
          {parentPage.title}
        </Typography>
        <Divider weight="alternate" />
        <Link href="/um-island-is">
          <Typography variant="p">
            {parentPage.pageHeader.navigationText}
          </Typography>
        </Link>
        {parentPage.pageHeader.links.map(({ text, url }, i) => (
          <Link key={i} href={url}>
            {asPath === url ? (
              <>
                <Bullet align="left" />
                <Typography variant="h5" color="blue400">
                  {text}
                </Typography>
              </>
            ) : (
              <Typography variant="p">{text}</Typography>
            )}
          </Link>
        ))}
      </Stack>
    </SidebarBox>
  )

  return (
    <>
      <Head>
        <title>{page.title}</title>
      </Head>
      <StandardLayout sidebar={{ position: 'right', node: sidebar }}>
        <GridRow>
          <GridColumn
            span={['9/9', '9/9', '7/8', '7/8', '7/9']}
            offset={['0', '0', '0', '0', '1/9']}
          >
            <Box paddingBottom={1}>
              <Breadcrumbs>
                <Link href="/">Ísland.is</Link>
                <Link href="/um-island-is">{parentPage.title}</Link>
              </Breadcrumbs>
            </Box>
            <Stack space={2}>
              <Typography variant="h1" as="h1">
                {page.title}
              </Typography>
              {Boolean(page.description) && (
                <Typography variant="intro">{page.description}</Typography>
              )}
              {Boolean(page.subDescription) && (
                <Typography variant="p">{page.subDescription}</Typography>
              )}
            </Stack>
          </GridColumn>
        </GridRow>
        <Box paddingTop={8}>
          <RichText body={page.slices} />
        </Box>
      </StandardLayout>
    </>
  )
}

AboutSubPage.getInitialProps = async ({ apolloClient, locale, query }) => {
  const [page, parentPage] = await Promise.all([
    apolloClient
      .query<GetAboutSubPageQuery, QueryGetAboutSubPageArgs>({
        query: GET_ABOUT_SUB_PAGE_QUERY,
        variables: {
          input: {
            slug: String(query.slug),
            lang: locale,
          },
        },
      })
      .then((r) => r.data.getAboutSubPage),
    apolloClient
      .query<GetAboutPageNavigationQuery, QueryGetAboutPageArgs>({
        query: GET_ABOUT_PAGE_NAVIGATION,
        variables: {
          input: {
            lang: locale,
          },
        },
      })
      .then((r) => r.data.getAboutPage),
  ])

  if (!page) {
    throw new CustomNextError(404, 'subpage not found')
  }

  return {
    page,
    parentPage,
  }
}

export default withMainLayout(AboutSubPage)
