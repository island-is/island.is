import React, { useMemo } from 'react'
import { Screen } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'
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
import { withMainLayout } from '@island.is/web/layouts/main'
import { Image, ContentContainer } from '@island.is/island-ui/contentful'
import { useI18n } from '@island.is/web/i18n'
import routeNames from '@island.is/web/i18n/routeNames'
import { Sticky, RichText, SidebarNavigation } from '@island.is/web/components'
import { GET_LIFE_EVENT_QUERY } from '@island.is/web/screens/queries'
import {
  GetLifeEventQuery,
  QueryGetLifeEventPageArgs,
} from '@island.is/web/graphql/schema'
import { createNavigation, makeId } from '@island.is/web/utils/navigation'

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

  return (
    <Box paddingBottom={10}>
      <GridContainer>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '12/12', '8/12', '9/12']}>
            <Box paddingX={[0, 0, 8]}>
              <Image type="apiImage" image={image} />
            </Box>
            <ContentContainer>
              <Breadcrumbs>
                <Link href={makePath()}>Ísland.is</Link>
                <Tag variant="blue" label>
                  Lífsviðburður
                </Tag>
              </Breadcrumbs>
              <Typography
                id={makeId(title)}
                variant="h1"
                as="h1"
                paddingTop={3}
                paddingBottom={2}
              >
                {title}
              </Typography>
              <Typography variant="intro" as="p">
                {intro}
              </Typography>
            </ContentContainer>
            <Box paddingTop={12}>
              <RichText body={content} config={{ defaultPadding: 12 }} />
            </Box>
          </GridColumn>
          <GridColumn span={[null, null, null, '4/12', '3/12']} paddingTop={10}>
            <Sticky>
              <SidebarNavigation
                title="Efnisyfirlit"
                navigation={navigation}
                position="right"
              />
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
