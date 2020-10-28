import React from 'react'
import {
  Text,
  GridContainer,
  GridRow,
  GridColumn,
  Swiper,
} from '@island.is/island-ui/core'
import { useI18n } from '@island.is/web/i18n'
import routeNames from '@island.is/web/i18n/routeNames'
import { GetLifeEventsQuery } from '@island.is/web/graphql/schema'
import { Sleeve } from '@island.is/island-ui/core'
import { Card } from '@island.is/web/components'

interface LifeEventsSectionProps {
  title?: string
  lifeEvents: GetLifeEventsQuery['getLifeEvents']
  showSleeve?: boolean
}

export const LifeEventsCardsSection: React.FC<LifeEventsSectionProps> = ({
  title = 'Lífsviðburðir',
  lifeEvents = [],
  showSleeve = false,
}) => {
  const { activeLocale } = useI18n()
  const { makePath } = routeNames(activeLocale)

  const renderLifeEventCard = (lifeEvent, key) => (
    <Card
      key={key}
      title={lifeEvent.title}
      description={lifeEvent.intro}
      href={makePath('lifeEvent', '[slug]')}
      as={makePath('lifeEvent', lifeEvent.slug)}
      image={lifeEvent.thumbnail ? lifeEvent.thumbnail : lifeEvent.image}
    />
  )

  const renderDesktopView = (lifeEvents) =>
    lifeEvents
      .filter((lifeEvent) => lifeEvent.title && lifeEvent.slug) // life event can be empty in some locales
      .map((lifeEvent, index) => (
        <GridColumn
          key={index}
          hiddenBelow="md"
          span={['12/12', '6/12', '6/12', '6/12', '4/12']}
          paddingBottom={3}
        >
          {renderLifeEventCard(lifeEvent, index)}
        </GridColumn>
      ))

  return (
    <GridContainer>
      <GridRow>
        <GridColumn span="12/12">
          <Text variant="h3" as="h2" paddingBottom={4}>
            {title}
          </Text>
        </GridColumn>
      </GridRow>
      <GridRow>
        {showSleeve ? (
          <Sleeve sleeveShadow="purple">{renderDesktopView(lifeEvents)}</Sleeve>
        ) : (
          renderDesktopView(lifeEvents)
        )}
      </GridRow>
      <GridRow>
        <GridColumn span="12/12" hiddenAbove="sm">
          <Swiper>{lifeEvents.map(renderLifeEventCard)}</Swiper>
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default LifeEventsCardsSection
