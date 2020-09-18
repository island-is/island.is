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
import routeNames from '@island.is/web/i18n/routeNames'
import { LifeEventCard } from './components/LifeEventCard'
import { GetLifeEventsQuery } from '../../graphql/schema'
import { Sleeve } from '@island.is/island-ui/core'

interface LifeEventsSectionProps {
  title?: string
  lifeEvents: GetLifeEventsQuery['getLifeEvents']
}

export const LifeEventsCardsSection: React.FC<LifeEventsSectionProps> = ({
  title = 'Lífsviðburðir',
  lifeEvents = [],
}) => {
  const { activeLocale } = useI18n()
  const { makePath } = routeNames(activeLocale)

  const renderLifeEventCard = (lifeEvent) => (
    <LifeEventCard
      title={lifeEvent.title}
      intro={lifeEvent.intro}
      href={makePath('lifeEvent', '[slug]')}
      as={makePath('lifeEvent', lifeEvent.slug)}
      image={
        lifeEvent.thumbnail ? lifeEvent.thumbnail.url : lifeEvent.image.url
      }
    />
  )

  const renderDesktopView = (lifeEvents) => (
    <GridContainer>
      <GridRow>
        <GridColumn span={['6/12', '6/12', '12/12']}>
          <Typography variant="h3" as="h3" paddingBottom={4}>
            {title}
          </Typography>
        </GridColumn>
      </GridRow>
      <GridRow>
        {lifeEvents.map((lifeEvent) => (
          <GridColumn
            span={['12/12', '12/12', '6/12', '6/12', '4/12']}
            paddingBottom={3}
            key={lifeEvent.title}
          >
            {renderLifeEventCard(lifeEvent)}
          </GridColumn>
        ))}
      </GridRow>
    </GridContainer>
  )

  return (
    <>
      <Hidden below="sm">
        {lifeEvents.length > 6 ? (
          <Sleeve sleeveShadow="purple">{renderDesktopView(lifeEvents)}</Sleeve>
        ) : (
          renderDesktopView(lifeEvents)
        )}
      </Hidden>
      <GridContainer>
        <Hidden above="xs">
          <Swiper>
            {lifeEvents.map((lifeEvent) => renderLifeEventCard(lifeEvent))}
          </Swiper>
        </Hidden>
      </GridContainer>
    </>
  )
}

export default LifeEventsCardsSection
