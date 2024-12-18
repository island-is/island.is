import { FieldBaseProps } from '@island.is/application/types'
import { FC, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { coreErrorMessages } from '@island.is/application/core'
import { AboutMachine } from '../../lib/dataSchema'
import { Box } from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { machine } from '../../lib/messages'

export const LocationInputField: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { field, setBeforeSubmitCallback } = props
  const { formatMessage } = useLocale()
  const { watch } = useFormContext()
  const [displayError, setDisplayError] = useState<boolean>(false)
  const watchMachine = watch('machine.aboutMachine') as AboutMachine
  const location = watch(field.id) as string
  const categoryValue = 'Fólkslyftur og vörulyftur'

  setBeforeSubmitCallback?.(async () => {
    if (
      watchMachine.category?.nameIs === categoryValue &&
      location.length === 0
    ) {
      setDisplayError(true)
      return [false, '']
    }
    return [true, null]
  })

  return (
    <Box paddingTop={2}>
      <InputController
        id={field.id}
        label={formatMessage(machine.labels.basicMachineInformation.location)}
        backgroundColor="blue"
        required={watchMachine.category?.nameIs === categoryValue}
        maxLength={255}
        onChange={() => setDisplayError(false)}
        error={
          displayError && location.length === 0
            ? formatMessage(coreErrorMessages.defaultError)
            : undefined
        }
      />
    </Box>
  )
}
