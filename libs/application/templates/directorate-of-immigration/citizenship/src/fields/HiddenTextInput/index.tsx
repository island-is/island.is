import { FieldBaseProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { FC } from 'react'
import { InputController } from '@island.is/shared/form-fields'

interface HiddenTextInputProps {
  field: {
    props: {
      nationalId: string
    }
  }
}

export const HiddenTextInput: FC<HiddenTextInputProps & FieldBaseProps> = ({
  field,
}) => {
  const nationalId = field?.props?.nationalId

  return (
    <Box hidden={true}>
      <InputController id={field.id} defaultValue={nationalId} />
    </Box>
  )
}
