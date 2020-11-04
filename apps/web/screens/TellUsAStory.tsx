/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import {
  GridContainer,
  Box,
  GridRow,
  GridColumn,
  Breadcrumbs,
  Link,
} from '@island.is/island-ui/core'
import { Screen } from '@island.is/web/types'
import { TellUsAStory } from '@island.is/web/components'
import { withMainLayout } from '@island.is/web/layouts/main'
import { useI18n } from '@island.is/web/i18n'
import routeNames from '@island.is/web/i18n/routeNames'
import {
  GetTellUsAStoryQuery,
  QueryGetTellUsAStoryArgs,
} from '../graphql/schema'
import { GET_TELL_US_A_STORY_DATA } from './queries'
import { CustomNextError } from '../units/errors'

interface TellUsAStoryProps {
  data: GetTellUsAStoryQuery['getTellUsAStory']
}

const TellUsAStoryPage: Screen<TellUsAStoryProps> = ({ data }) => {
  const { activeLocale } = useI18n()
  const { makePath } = routeNames(activeLocale)

  return (
    <Box paddingY={[2, 2, 10]}>
      <GridContainer>
        <GridRow>
          <GridColumn>
            <Box paddingX={[3, 3, 8]}>
              <Breadcrumbs>
                <Link href={makePath()}>Ísland.is</Link>
                <span>{data.introTitle}</span>
              </Breadcrumbs>
            </Box>
          </GridColumn>
        </GridRow>
        <TellUsAStory
          {...data}
          showIntro={true}
          locale={activeLocale as string}
        />
      </GridContainer>
    </Box>
  )
}

TellUsAStoryPage.getInitialProps = async ({ apolloClient, locale }) => {
  const [data] = await Promise.all([
    apolloClient
      .query<GetTellUsAStoryQuery, QueryGetTellUsAStoryArgs>({
        query: GET_TELL_US_A_STORY_DATA,
        variables: {
          input: {
            lang: locale as string,
          },
        },
      })
      .then((response) => response.data.getTellUsAStory),
  ])

  if (!data) {
    throw new CustomNextError(404, 'Could not find form!')
  }

  return {
    data,
  }
}

export default withMainLayout(TellUsAStoryPage)
