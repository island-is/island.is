import { FieldBaseProps } from '@island.is/application/types'
import { FC, useState } from 'react'
import { Box } from '@island.is/island-ui/core'
import { UniversityApplication } from '../../lib/dataSchema'
import { Routes } from '../../lib/constants'
import {
  RadioController,
  SelectController,
} from '@island.is/shared/form-fields'
import { ProgramBase } from '@island.is/clients/university-gateway-api'
import { information } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { getValueViaPath } from '@island.is/application/core'

export const ModeOfDeliverySelection: FC<FieldBaseProps> = ({
  application,
  field,
  goToScreen,
}) => {
  const answers = application.answers as UniversityApplication
  const externalData = application.externalData

  const { formatMessage } = useLocale()
  const programs = externalData.programs.data as Array<ProgramBase>
  const locations: Array<any> = [] // TODO get extra application fields

  const programAnswer = getValueViaPath(
    answers,
    `${Routes.PROGRAMINFORMATION}.program`,
  )

  const modeOfDeliveryAnswer = getValueViaPath(
    answers,
    `${Routes.PROGRAMINFORMATION}.modeOfDelivery`,
  )

  const locationAnswer = getValueViaPath(
    answers,
    `${Routes.PROGRAMINFORMATION}.examLocation`,
  )

  const [chosenModeOfDelivery, setChosenModeOfDelivery] =
    useState(modeOfDeliveryAnswer)

  return (
    <Box>
      <Box marginTop={2}>
        {!!programAnswer &&
          programs.filter((program) => program.id === programAnswer)[0]
            .modeOfDelivery.length > 0 && (
            <RadioController
              id={`${Routes.PROGRAMINFORMATION}.modeOfDelivery`}
              largeButtons
              onSelect={(value) => setChosenModeOfDelivery(value)}
              options={programs
                .filter((program) => program.id === programAnswer)[0]
                .modeOfDelivery.map((deliveryMethod) => {
                  let extraParam = ''
                  switch (deliveryMethod.modeOfDelivery) {
                    case 'ON_SITE':
                      extraParam = formatMessage(
                        information.labels.modeOfDeliverySection.ON_SITE_EXTRA,
                      )
                      break
                    case 'ONLINE':
                      extraParam = formatMessage(
                        information.labels.modeOfDeliverySection.ONLINE_EXTRA,
                      )
                      break
                    case 'MIXED':
                      extraParam = formatMessage(
                        information.labels.modeOfDeliverySection.MIXED_EXTRA,
                      )
                      break
                    case 'REMOTE':
                      extraParam = formatMessage(
                        information.labels.modeOfDeliverySection.REMOTE_EXTRA,
                      )
                      break
                    default:
                      extraParam = ''
                      break
                  }
                  return {
                    label: formatMessage(
                      information.labels.modeOfDeliverySection[
                        deliveryMethod.modeOfDelivery
                      ],
                    ),
                    value: deliveryMethod.modeOfDelivery,
                    subLabel: extraParam,
                  }
                })}
            />
          )}
      </Box>
      <Box marginTop={2}>
        {chosenModeOfDelivery !== 'ON_SITE' &&
          chosenModeOfDelivery !== 'UNDEFINED' &&
          locations.length > 0 && (
            <SelectController
              id={`${Routes.PROGRAMINFORMATION}.examLocation`}
              label={formatMessage(
                information.labels.programSelection
                  .selectExamLocationPlaceholder,
              )}
              defaultValue={locationAnswer}
              options={locations.map((location) => {
                return {
                  label: location,
                  value: location,
                }
              })}
            />
          )}
      </Box>
    </Box>
  )
}
