import { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { useMutation } from '@apollo/client'
import { useLocale } from '@island.is/localization'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { useFormContext } from 'react-hook-form'
import {
  checkIfFreightChanged,
  getUpdatedFreightPairingList,
} from '../../utils'

export const HandleBeforeSubmitFreight: FC<FieldBaseProps> = ({
  application,
  setBeforeSubmitCallback,
}) => {
  const { locale } = useLocale()
  const { setValue, getValues } = useFormContext()
  const [updateApplication] = useMutation(UPDATE_APPLICATION)

  setBeforeSubmitCallback?.(async () => {
    try {
      const newAnswers = getValues()

      // No need to do anything if nothing of importance changed
      if (!checkIfFreightChanged(application.answers, newAnswers)) {
        return [true, null]
      }

      const updatedFreightPairing = getUpdatedFreightPairingList(
        newAnswers.freightPairing,
        newAnswers.freight,
        newAnswers.convoy,
      )

      if (updatedFreightPairing) {
        setValue('freightPairing', updatedFreightPairing)

        await updateApplication({
          variables: {
            input: {
              id: application.id,
              answers: {
                ...(updatedFreightPairing && {
                  freightPairing: updatedFreightPairing,
                }),
              },
            },
            locale,
          },
        })
      }
    } catch (e) {
      return [false, 'error occured']
    }
    return [true, null]
  })

  return null
}
