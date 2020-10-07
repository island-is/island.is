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
  Text,
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
        <Text variant="h4" as="h2">
          {parentPage.title}
        </Text>
        <Divider weight="alternate" />
        <Link href="/um-island-is">
          <Text variant="default">{parentPage.pageHeader.navigationText}</Text>
        </Link>
        {parentPage.pageHeader.links.map(({ text, url }, i) => (
          <Link key={i} href={url}>
            {asPath === url ? (
              <>
                <Bullet align="left" />
                <Text variant="h5" color="blue400">
                  {text}
                </Text>
              </>
            ) : (
              <Text variant="default">{text}</Text>
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
              <Text variant="h1" as="h1">
                {page.title}
              </Text>
              {Boolean(page.description) && (
                <Text variant="intro">{page.description}</Text>
              )}
              {Boolean(page.subDescription) && (
                <Text variant="default">{page.subDescription}</Text>
              )}
            </Stack>
          </GridColumn>
        </GridRow>
        <Box paddingTop={10}>
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
