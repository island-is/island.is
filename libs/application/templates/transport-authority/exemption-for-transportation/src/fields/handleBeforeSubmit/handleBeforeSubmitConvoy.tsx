import { FC, useEffect, useRef } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { useMutation } from '@apollo/client'
import { useLocale } from '@island.is/localization'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { useFormContext } from 'react-hook-form'
import {
  checkIfConvoyChanged,
  getUpdatedAxleSpacing,
  getUpdatedConvoy,
  getUpdatedFreightPairingList,
  getUpdatedVehicleSpacing,
} from '../../utils'
import { uuid } from 'uuidv4'

export const HandleBeforeSubmitConvoy: FC<FieldBaseProps> = ({
  application,
  setBeforeSubmitCallback,
}) => {
  const { locale } = useLocale()
  const { getValues, setValue } = useFormContext()
  const [updateApplication] = useMutation(UPDATE_APPLICATION)

  // Persist callback ID across renders to prevent duplicate registration
  const callbackIdRef = useRef(`HandleBeforeSubmitConvoy-${uuid()}`)

  useEffect(() => {
    setBeforeSubmitCallback?.(
      async () => {
        try {
          const newAnswers = { ...application.answers, ...getValues() }

          // Make sure if this is short-term, that there is only one convoy
          const updatedConvoy = getUpdatedConvoy(
            newAnswers.exemptionPeriod,
            newAnswers.convoy,
          )
          if (updatedConvoy) {
            newAnswers.convoy = updatedConvoy
          }

          if (!checkIfConvoyChanged(application.answers, newAnswers)) {
            // No need to do anything if nothing of importance changed
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
            updatedConvoy ||
            updatedFreightPairing ||
            updatedVehicleSpacing ||
            updatedAxleSpacing
          ) {
            if (updatedConvoy) setValue('convoy', updatedConvoy)
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
                    ...(updatedConvoy && { convoy: newAnswers.convoy }),
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
          return [false, 'error occurred']
        }
        return [true, null]
      },
      { allowMultiple: true, customCallbackId: callbackIdRef.current },
    )
  }, [
    application.answers,
    application.id,
    getValues,
    locale,
    setBeforeSubmitCallback,
    setValue,
    updateApplication,
  ])

  return null
}
