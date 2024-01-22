import { FieldBaseProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { FC } from 'react'
import { InputController } from '@island.is/shared/form-fields'

export const HiddenTextInput: FC<FieldBaseProps> = ({ field }) => {
  console.log('field', field)
  return (
    <Box hidden={true}>
      <InputController id={field.id} defaultValue="false" />
    </Box>
  )
}
