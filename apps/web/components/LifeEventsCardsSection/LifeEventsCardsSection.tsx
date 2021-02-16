import React from 'react'
import {
  Text,
  GridContainer,
  Box,
  Link,
  Button,
} from '@island.is/island-ui/core'
import { GetLifeEventsQuery } from '@island.is/web/graphql/schema'
import { CardsSlider } from '@island.is/web/components'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'

interface LifeEventsSectionProps {
  title?: string
  linkTitle?: string
  lifeEvents: GetLifeEventsQuery['getLifeEvents']
}

export const LifeEventsCardsSection: React.FC<LifeEventsSectionProps> = ({
  title = 'Lífsviðburðir',
  linkTitle,
  lifeEvents = [],
}) => {
  const { linkResolver } = useLinkResolver()

  return (
    <GridContainer>
      <CardsSlider
        title={title}
        cards={lifeEvents.map((lifeEvent) => {
          return {
            title: lifeEvent.title,
            description: lifeEvent.intro,
            link: linkResolver('lifeeventpage', [lifeEvent.slug]),
            image: lifeEvent.thumbnail ? lifeEvent.thumbnail : lifeEvent.image,
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
