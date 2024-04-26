import {
  FieldBaseProps,
  ActionCardListField,
} from '@island.is/application/types'
import { ActionCard, Stack, Box } from '@island.is/island-ui/core'
import { FC } from 'react'

interface Props extends FieldBaseProps {
  field: ActionCardListField
}

export const ActionCardListFormField: FC<Props> = ({ application, field }) => {
  const { items, marginBottom = 4, marginTop = 4, space = 2 } = field

  return (
    <Box marginBottom={marginBottom} marginTop={marginTop}>
      <Stack space={space}>
        {items(application).map((item, index) => (
          <ActionCard key={index} {...item} />
        ))}
      </Stack>
    </Box>
  )
}
