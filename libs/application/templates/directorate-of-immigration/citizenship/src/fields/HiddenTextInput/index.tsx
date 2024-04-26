import { FieldBaseProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { FC } from 'react'
import { InputController } from '@island.is/shared/form-fields'
import { getSelectedCustodyChild } from '../../utils'

interface HiddenTextInputProps {
  field: {
    props: {
      index: number
    }
  }
}

export const HiddenTextInput: FC<HiddenTextInputProps & FieldBaseProps> = ({
  field,
  application,
}) => {
  const index = field?.props?.index
  const child = getSelectedCustodyChild(
    application.externalData,
    application.answers,
    index,
  )
  const defaultValue = child?.nationalId
  return (
    <Box hidden={true}>
      <InputController id={field.id} defaultValue={defaultValue} />
    </Box>
  )
}
