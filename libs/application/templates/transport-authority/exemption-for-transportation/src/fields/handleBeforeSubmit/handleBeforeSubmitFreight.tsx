import { FC, useEffect, useRef } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { useMutation } from '@apollo/client'
import { useLocale } from '@island.is/localization'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { useFormContext } from 'react-hook-form'
import {
  checkIfFreightChanged,
  getUpdatedFreight,
  getUpdatedFreightPairingList,
} from '../../utils'
import { uuid } from 'uuidv4'

export const HandleBeforeSubmitFreight: FC<FieldBaseProps> = ({
  application,
  setBeforeSubmitCallback,
}) => {
  const { locale } = useLocale()
  const { setValue, getValues } = useFormContext()
  const [updateApplication] = useMutation(UPDATE_APPLICATION)

  // Persist callback ID across renders to prevent duplicate registration
  const callbackIdRef = useRef(`HandleBeforeSubmitFreight-${uuid()}`)

  useEffect(() => {
    setBeforeSubmitCallback?.(
      async () => {
        try {
          const newAnswers = { ...application.answers, ...getValues() }

          // Make sure if this is short-term, that there is only one freight
          const updatedFreight = getUpdatedFreight(
            newAnswers.exemptionPeriod,
            newAnswers.freight,
          )
          if (updatedFreight) {
            newAnswers.freight = updatedFreight
          }

          // No need to do anything if nothing of importance changed
          if (!checkIfFreightChanged(application.answers, newAnswers)) {
            return [true, null]
          }

          const updatedFreightPairing = getUpdatedFreightPairingList(
            newAnswers.freightPairing,
            newAnswers.freight,
            newAnswers.convoy,
          )

          if (updatedFreight || updatedFreightPairing) {
            if (updatedFreight) setValue('freight', updatedFreight)
            if (updatedFreightPairing)
              setValue('freightPairing', updatedFreightPairing)

            await updateApplication({
              variables: {
                input: {
                  id: application.id,
                  answers: {
                    ...(updatedFreight && { freight: newAnswers.freight }),
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
