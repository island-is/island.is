import React from 'react'
import {
  Typography,
  GridContainer,
  GridRow,
  GridColumn,
  Swiper,
  Hidden,
} from '@island.is/island-ui/core'
import { useI18n } from '@island.is/web/i18n'
import useRouteNames from '@island.is/web/i18n/useRouteNames'
import { LifeEventCard } from './components/LifeEventCard'
import { GetLifeEventsQuery } from '../../graphql/schema'

interface LifeEventsSectionProps {
  title?: string
  lifeEvents: GetLifeEventsQuery['getLifeEvents']
}

const LifeEventsCardsSection: React.FC<LifeEventsSectionProps> = ({
  title = 'Lífsviðburðir',
  lifeEvents = [],
}) => {
  const { activeLocale } = useI18n()
  const { makePath } = useRouteNames(activeLocale)
  return (
    <GridContainer>
      <GridRow>
        <GridColumn span={['6/12', '6/12', '12/12']}>
          <Typography variant="h3" as="h3" paddingBottom={4}>
            {title}
          </Typography>
        </GridColumn>
      </GridRow>
      <Hidden below="md">
        <GridRow>
          {lifeEvents.map((lifeEvent) => (
            <GridColumn
              span={['12/12', '12/12', '6/12', '6/12', '4/12']}
              paddingBottom={3}
              key={lifeEvent.title}
            >
              <LifeEventCard
                title={lifeEvent.title}
                intro={lifeEvent.intro}
                url={makePath('lifeEvent', lifeEvent.slug)}
                image={
                  lifeEvent.thumbnail
                    ? lifeEvent.thumbnail.url
                    : lifeEvent.image.url
                }
              />
            </GridColumn>
          ))}
        </GridRow>
      </Hidden>
      <Hidden above="md">
        <Swiper>
          {lifeEvents.map((lifeEvent) => (
            <LifeEventCard
              key={lifeEvent.title}
              title={lifeEvent.title}
              intro={lifeEvent.intro}
              url={lifeEvent.slug}
              image={
                lifeEvent.thumbnail
                  ? lifeEvent.thumbnail.url
                  : lifeEvent.image.url
              }
            />
          ))}
        </Swiper>
      </Hidden>
    </GridContainer>
  )
}

export default LifeEventsCardsSection
