/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import {
  Text,
  GridContainer,
  Box,
  GridRow,
  GridColumn,
  Breadcrumbs,
  Link,
  Hidden,
} from '@island.is/island-ui/core'
import { Screen } from '@island.is/web/types'
import {
  BackgroundImage,
  RichText,
  TellUsAStory,
} from '@island.is/web/components'
import { withMainLayout } from '@island.is/web/layouts/main'
import { useI18n } from '@island.is/web/i18n'
import routeNames from '@island.is/web/i18n/routeNames'
import {
  GetTellUsAStoryQuery,
  Html,
  QueryGetTellUsAStoryArgs,
} from '../graphql/schema'
import { GET_TELL_US_A_STORY_DATA } from './queries'
import { CustomNextError } from '../units/errors'
import { Slice } from '@island.is/island-ui/contentful'

interface TellUsAStoryProps {
  data: GetTellUsAStoryQuery['getTellUsAStory']
}

type Slices = Slice[] & Slice

const TellUsAStoryPage: Screen<TellUsAStoryProps> = ({ data }) => {
  const { activeLocale } = useI18n()
  const { makePath } = routeNames(activeLocale)

  return (
    <Box paddingY={[2, 2, 10]}>
      <GridContainer>
        <GridRow>
          <GridColumn offset={['0', '0', '0', '0', '1/9']}>
            <Breadcrumbs>
              <Link href={makePath()}>Ísland.is</Link>
              <span>{data.introTitle}</span>
            </Breadcrumbs>
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
