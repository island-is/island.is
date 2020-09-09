import React, { FC } from 'react'
import gql from 'graphql-tag'
import { Screen } from '../../types'
import {
  Query,
  QueryGetLifeEventPageArgs,
  LifeEventPage,
} from '@island.is/api/schema'
import { CustomNextError } from '../../units/ErrorBoundary'
import {
  GridContainer,
  GridRow,
  GridColumn,
  Breadcrumbs,
  Link,
  Tag,
  Typography,
  Box,
} from '@island.is/island-ui/core'
import {
  Image,
  Content,
  ContentContainer,
} from '@island.is/island-ui/contentful'
import { useI18n } from '../../i18n'
import useRouteNames from '../../i18n/useRouteNames'
import { Sidebar, Sticky } from '../../components'
import * as styles from './LifeEvent.treat'
import slugify from '@sindresorhus/slugify'
import { withMainLayout } from '@island.is/web/layouts/main'

interface LifeEventProps {
  lifeEvent: LifeEventPage
}

export const LifeEvent: Screen<LifeEventProps> = ({
  lifeEvent: { image, title, intro, body },
}) => {
  const { activeLocale } = useI18n()
  const { makePath } = useRouteNames(activeLocale)

  return (
    <Box paddingBottom={10}>
      <GridContainer>
        <GridRow>
          <GridColumn span="9/12">
            <Box paddingX={[0, 0, 8]}>
              <Image type="apiImage" image={image} />
            </Box>
            <ContentContainer>
              <Breadcrumbs>
                <Link href={makePath()}>Ísland.is</Link>
                <Tag variant="purple" label>
                  Lífsviðburður
                </Tag>
              </Breadcrumbs>
              <Typography variant="h1" as="h1" paddingTop={3} paddingBottom={2}>
                <span data-sidebar-link={slugify(title)}>{title}</span>
              </Typography>
              <Typography variant="intro" as="p">
                {intro}
              </Typography>
            </ContentContainer>
            <div className={styles.content}>
              <Content document={body} />
            </div>
          </GridColumn>
          <GridColumn span="3/12" paddingTop={10}>
            <Sticky>
              <Sidebar headingLinks bullet="left" title="Efnisyfirlit" />
            </Sticky>
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Box>
  )
}

LifeEvent.getInitialProps = async ({ apolloClient, locale, query }) => {
  const {
    data: { getLifeEventPage: lifeEvent },
  } = await apolloClient.query<Query, QueryGetLifeEventPageArgs>({
    query: gql`
      query GetLifeEventPage($input: GetLifeEventPageInput!) {
        getLifeEventPage(input: $input) {
          title
          slug
          intro
          image {
            title
            url
            width
            height
            contentType
          }
          body
        }
      }
    `,
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
