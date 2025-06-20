import { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { useMutation } from '@apollo/client'
import { useLocale } from '@island.is/localization'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { useFormContext } from 'react-hook-form'
import {
  checkIfConvoyChanged,
  getUpdatedAxleSpacing,
  getUpdatedFreightPairingList,
  getUpdatedVehicleSpacing,
} from '../../utils'

export const HandleBeforeSubmitConvoy: FC<FieldBaseProps> = ({
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
      if (!checkIfConvoyChanged(application.answers, newAnswers)) {
        return [true, null]
      }

      const updatedFreightPairing = getUpdatedFreightPairingList(
        newAnswers.freightPairing,
        newAnswers.freight,
        newAnswers.convoy,
      )
      const updatedVehicleSpacing = getUpdatedVehicleSpacing(
        newAnswers.vehicleSpacing,
        newAnswers.convoy,
      )
      const updatedAxleSpacing = getUpdatedAxleSpacing(
        newAnswers.axleSpacing,
        newAnswers.convoy,
      )

      if (
        updatedFreightPairing ||
        updatedVehicleSpacing ||
        updatedAxleSpacing
      ) {
        if (updatedFreightPairing)
          setValue('freightPairing', updatedFreightPairing)
        if (updatedVehicleSpacing)
          setValue('vehicleSpacing', updatedVehicleSpacing)
        if (updatedAxleSpacing) setValue('axleSpacing', updatedAxleSpacing)

        await updateApplication({
          variables: {
            input: {
              id: application.id,
              answers: {
                ...(updatedFreightPairing && {
                  freightPairing: updatedFreightPairing,
                }),
                ...(updatedVehicleSpacing && {
                  vehicleSpacing: updatedVehicleSpacing,
                }),
                ...(updatedAxleSpacing && {
                  axleSpacing: updatedAxleSpacing,
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
