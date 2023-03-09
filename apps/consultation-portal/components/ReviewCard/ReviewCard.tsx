import {
  Button,
  FocusableBox,
  Icon,
  Inline,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { SimpleCardSkeleton } from '../Card'
import format from 'date-fns/format'
import { useState } from 'react'

export const ReviewCard = ({ advice }) => {
  const [open, setOpen] = useState(false)

  return (
    <SimpleCardSkeleton>
      <Stack space={1}>
        <Inline justifyContent="spaceBetween" flexWrap="nowrap" alignY="center">
          <Text variant="eyebrow" color="purple400">
            {format(new Date(advice.created), 'dd.MM.yyyy')}
          </Text>
          {advice.content.length > 50 && (
            <FocusableBox onClick={() => setOpen(!open)}>
              <Icon
                icon={open ? 'close' : 'open'}
                type="outline"
                size="small"
                color="blue400"
              />
            </FocusableBox>
          )}
        </Inline>
        <Text variant="h3">
          {advice?.number} - {advice?.participantName}
        </Text>
        <Text variant="default" truncate={!open}>
          {advice.content}
        </Text>
        {advice?.attachments && (
          <Button variant="text" icon="document" iconType="outline">
            Viðhengi
          </Button>
        )}
      </Stack>
    </SimpleCardSkeleton>
  )
}

export default ReviewCard
