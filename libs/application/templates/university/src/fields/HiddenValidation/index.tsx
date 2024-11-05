import { FieldBaseProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { FC } from 'react'
import { Routes } from '../../lib/constants'
import { useFormContext } from 'react-hook-form'

// Special validation to make sure chosenMode is not empty,
// since we sometimes need to set the value to dummy 'EMPTY_MODE_OF_DELIVERY'
// when trying to clear the field in the programSelection step
export const HiddenValidation: FC<FieldBaseProps> = ({
  setBeforeSubmitCallback,
}) => {
  const { getValues } = useFormContext()

  setBeforeSubmitCallback?.(async () => {
    const modeOfDeliveryAnswer = getValues(
      `${Routes.MODEOFDELIVERYINFORMATION}.chosenMode`,
    )

    if (modeOfDeliveryAnswer === 'EMPTY_MODE_OF_DELIVERY') return [false, '']

    return [true, null]
  })

  return <Box hidden={true}></Box>
}
