import { BLOCKS } from '@contentful/rich-text-types'

import { Text } from '@island.is/island-ui/core'
import { EventList } from '@island.is/web/components'
import { FeaturedEvents as FeaturedEventsSchema } from '@island.is/web/graphql/schema'
import { webRichText } from '@island.is/web/utils/richText'

interface FeaturedEventsProps {
  slice: FeaturedEventsSchema
}

const FeaturedEvents = ({ slice }: FeaturedEventsProps) => {
  return (
    <EventList
      eventList={slice.resolvedEventList.items}
      namespace={slice.namespace}
      noEventsFoundText={slice.noEventsFoundText && webRichText(slice.noEventsFoundText, {
        renderNode: {
          [BLOCKS.PARAGRAPH]: (_node, children) => (
            <Text variant="h4">{children}</Text>
          ),
        },
      })}
      parentPageSlug={
        slice.resolvedEventList.items.find(
          (eventItem) => eventItem.organization?.slug,
        )?.organization?.slug as string
      }
    />
  )
}

export default FeaturedEvents
