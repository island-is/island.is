import React from 'react'
import {
  Text,
  GridContainer,
  Box,
  Link,
  Button,
  TextProps,
} from '@island.is/island-ui/core'
import { GetLifeEventsQuery } from '@island.is/web/graphql/schema'
import { CardsSlider } from '@island.is/web/components'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'

interface LifeEventsSectionProps {
  title?: string
  titleProps?: TextProps
  linkTitle?: string
  lifeEvents: GetLifeEventsQuery['getLifeEvents']
}

export const LifeEventsCardsSection: React.FC<LifeEventsSectionProps> = ({
  title = 'Lífsviðburðir',
  titleProps = {},
  linkTitle,
  lifeEvents = [],
}) => {
  const { linkResolver } = useLinkResolver()

  return (
    <GridContainer>
      <CardsSlider
        title={title}
        titleProps={titleProps}
        cards={lifeEvents
          .filter((x) => x.slug && x.title)
          .map((lifeEvent) => {
            return {
              title: lifeEvent.title,
              description: lifeEvent.intro,
              link: linkResolver('lifeeventpage', [lifeEvent.slug]),
              image: lifeEvent.thumbnail
                ? {
                    title: lifeEvent.thumbnail.title,
                    url: lifeEvent.thumbnail.url,
                  }
                : { title: lifeEvent.image.title, url: lifeEvent.image.url },
            }
          })}
      />
      <Box display={'flex'} justifyContent="flexEnd" marginTop={[3, 3, 4]}>
        <Link {...linkResolver('lifeevents')} skipTab>
          <Text variant="h5" as="p" paddingBottom={2}>
            <Button
              icon="arrowForward"
              iconType="filled"
              type="button"
              variant="text"
            >
              {linkTitle}
            </Button>
          </Text>
        </Link>
      </Box>
    </GridContainer>
  )
}

export default LifeEventsCardsSection
