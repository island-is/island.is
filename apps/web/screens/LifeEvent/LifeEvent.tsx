import React, { useMemo } from 'react'
import Head from 'next/head'
import { Screen } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'
import slugify from '@sindresorhus/slugify'
import {
  GridRow,
  GridColumn,
  Breadcrumbs,
  Link,
  Tag,
  Typography,
  Box,
} from '@island.is/island-ui/core'
import { withMainLayout } from '@island.is/web/layouts/main'
import { Image } from '@island.is/island-ui/contentful'
import { useI18n } from '@island.is/web/i18n'
import routeNames from '@island.is/web/i18n/routeNames'
import {
  RichText,
  SidebarNavigation,
  DrawerMenu,
  BackgroundImage,
} from '@island.is/web/components'
import { GET_LIFE_EVENT_QUERY } from '@island.is/web/screens/queries'
import {
  GetLifeEventQuery,
  QueryGetLifeEventPageArgs,
} from '@island.is/web/graphql/schema'
import { createNavigation, makeId } from '@island.is/web/utils/navigation'
import ArticleLayout from '../Layouts/Layouts'

interface LifeEventProps {
  lifeEvent: GetLifeEventQuery['getLifeEventPage']
}

export const LifeEvent: Screen<LifeEventProps> = ({
  lifeEvent: { image, title, intro, content },
}) => {
  const { activeLocale } = useI18n()
  const { makePath } = routeNames(activeLocale)

  const navigation = useMemo(() => {
    return createNavigation(content, { title })
  }, [content, title])

  const metaTitle = `${title} | Ísland.is`
  const metaDescription =
    intro ||
    'Ísland.is er upplýsinga- og þjónustuveita opinberra aðila á Íslandi. Þar getur fólk og fyrirtæki fengið upplýsingar og notið margvíslegrar þjónustu hjá opinberum aðilum á einum stað í gegnum eina gátt.'

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="title" property="og:title" content={metaTitle} />
        <meta
          name="description"
          property="og:description"
          content={metaDescription}
        />
      </Head>
      <ArticleLayout
        sidebar={
          <SidebarNavigation
            title="Efnisyfirlit"
            navigation={navigation}
            position="right"
          />
        }
      >
        <>
          <GridRow>
            <GridColumn
              offset={['0', '0', '0', '0', '1/9']}
              span={['9/9', '9/9', '9/9', '9/9', '7/9']}
              paddingBottom={2}
            >
              <Box marginBottom={2} display="inlineBlock" width="full">
                <BackgroundImage
                  ratio="12:4"
                  background="transparent"
                  boxProps={{ background: 'white' }}
                  image={image}
                />
              </Box>
              <Breadcrumbs>
                <Link href={makePath()}>Ísland.is</Link>
                <Tag variant="blue" label>
                  Lífsviðburður
                </Tag>
              </Breadcrumbs>
            </GridColumn>
          </GridRow>
          <GridRow>
            <GridColumn
              offset={['0', '0', '0', '0', '1/9']}
              span={['9/9', '9/9', '9/9', '9/9', '7/9']}
            >
              <Typography variant="h1" as="h1">
                <span id={slugify(title)}>{title}</span>
              </Typography>
              {intro && (
                <Typography variant="intro" as="p" paddingTop={2}>
                  <span id={slugify(intro)}>{intro}</span>
                </Typography>
              )}
            </GridColumn>
          </GridRow>
          <Box paddingTop={12}>
            <RichText body={content} config={{ defaultPadding: 12 }} />
          </Box>
        </>
      </ArticleLayout>
    </>
  )
}

LifeEvent.getInitialProps = async ({ apolloClient, locale, query }) => {
  const {
    data: { getLifeEventPage: lifeEvent },
  } = await apolloClient.query<GetLifeEventQuery, QueryGetLifeEventPageArgs>({
    query: GET_LIFE_EVENT_QUERY,
    fetchPolicy: 'no-cache',
    variables: {
      input: { lang: locale, slug: String(query.slug) },
    },
  })

  if (!lifeEvent) {
    throw new CustomNextError(404, 'Life Event not found')
  }

  return { lifeEvent }
}

export default withMainLayout(LifeEvent)
