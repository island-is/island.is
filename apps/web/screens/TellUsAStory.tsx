/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import {
  Box,
  GridRow,
  GridColumn,
  Breadcrumbs,
} from '@island.is/island-ui/core'
import NextLink from 'next/link'
import { Screen } from '@island.is/web/types'
import { TellUsAStory, GridContainer } from '@island.is/web/components'
import { withMainLayout } from '@island.is/web/layouts/main'
import { useI18n } from '@island.is/web/i18n'
import {
  GetTellUsAStoryQuery,
  QueryGetTellUsAStoryArgs,
} from '../graphql/schema'
import { GET_TELL_US_A_STORY_DATA } from './queries'
import { CustomNextError } from '../units/errors'
import { useLinkResolver } from '../hooks/useLinkResolver'

interface TellUsAStoryProps {
  data: GetTellUsAStoryQuery['getTellUsAStory']
}

const TellUsAStoryPage: Screen<TellUsAStoryProps> = ({ data }) => {
  const { activeLocale } = useI18n()
  const { linkResolver } = useLinkResolver()

  return (
    <Box paddingY={[2, 2, 10]} id="main-content">
      <GridContainer>
        <GridRow>
          <GridColumn>
            <Box paddingX={[3, 3, 8]}>
              <Breadcrumbs
                items={[
                  {
                    title: 'Ísland.is',
                    href: '/',
                  },
                  {
                    title: data.introTitle,
                  },
                ]}
                renderLink={(link) => {
                  return (
                    <NextLink {...linkResolver('homepage')} passHref>
                      {link}
                    </NextLink>
                  )
                }}
              />
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
