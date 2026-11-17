import React, { FC, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import { RadioFormField } from '@island.is/application/ui-fields'
import {
  FieldBaseProps,
  FieldComponents,
  CustomField,
  FieldTypes,
} from '@island.is/application/types'
import { useLocale } from '@island.is/localization'

import { parentalLeaveFormMessages } from '../../lib/messages'
import {
  allowOtherParent,
  getApplicationAnswers,
  getMaxMultipleBirthsDays,
  getMultipleBirthRequestDays,
} from '../../lib/parentalLeaveUtils'
import { maxDaysToGiveOrReceive } from '../../config'
import { TransferRightsOption } from '../../constants'
import { NO, YES, YesOrNo } from '@island.is/application/core'

const getDefaultValue = (
  isRequestingRights: YesOrNo,
  isGivingRights: YesOrNo,
) => {
  if (isRequestingRights === YES && isGivingRights === YES) {
    return undefined
  }

  if (isRequestingRights === YES) {
    return TransferRightsOption.REQUEST
  }

  if (isGivingRights === YES) {
    return TransferRightsOption.GIVE
  }

  if (isRequestingRights === NO && isGivingRights === NO) {
    return TransferRightsOption.NONE
  }

  return undefined
}

const clampDayValue = (value: number, min: number, max: number) => {
  return Math.min(Math.max(min, value), max)
}

interface HiddenValues {
  isRequestingRights: YesOrNo
  requestDays: number
  isGivingRights: YesOrNo
  giveDays: number
}

const calculateHiddenValues = (
  selectedOption: TransferRightsOption | undefined,
  requestDays: number,
  giveDays: number,
): HiddenValues => {
  if (selectedOption === TransferRightsOption.REQUEST) {
    return {
      isRequestingRights: YES,
      requestDays: clampDayValue(requestDays, 1, maxDaysToGiveOrReceive),
      isGivingRights: NO,
      giveDays: 0,
    }
  } else if (selectedOption === TransferRightsOption.GIVE) {
    return {
      isGivingRights: YES,
      giveDays: clampDayValue(giveDays, 1, maxDaysToGiveOrReceive),
      isRequestingRights: NO,
      requestDays: 0,
    }
  }

  return {
    isRequestingRights: NO,
    requestDays: 0,
    isGivingRights: NO,
    giveDays: 0,
  }
}

export const TransferRights: FC<
  React.PropsWithChildren<FieldBaseProps & CustomField>
> = ({ field, application, error }) => {
  const {
    transferRights,
    isRequestingRights,
    requestDays,
    isGivingRights,
    giveDays,
    hasMultipleBirths,
  } = getApplicationAnswers(application.answers)

  const canTransferRights = allowOtherParent(application.answers)

  const multipleBirthsRequestDays = getMultipleBirthRequestDays(
    application.answers,
  )
  const maxMultipleBirthsDays = getMaxMultipleBirthsDays(application.answers)

  const defaultValue =
    transferRights !== undefined
      ? transferRights
      : getDefaultValue(isRequestingRights, isGivingRights)

  const { setValue } = useFormContext()
  const { formatMessage } = useLocale()
  const [hiddenValues, setHiddenValues] = useState(
    calculateHiddenValues(defaultValue, requestDays, giveDays),
  )
  const onSelect = (selected: string) => {
    const option = selected as TransferRightsOption

    setHiddenValues(calculateHiddenValues(option, requestDays, giveDays))
  }

  useEffect(() => {
    setValue(
      'requestRights.isRequestingRights',
      hiddenValues.isRequestingRights,
    )
    setValue('requestRights.requestDays', hiddenValues.requestDays.toString())
    setValue('giveRights.isGivingRights', hiddenValues.isGivingRights)
    setValue('giveRights.giveDays', hiddenValues.giveDays.toString())
  }, [hiddenValues, setValue])

  return (
    <RadioFormField
      application={application}
      error={error}
      field={{
        ...field,
        type: FieldTypes.RADIO,
        component: FieldComponents.RADIO,
        children: undefined,
        onSelect,
        options: [
          {
            label: formatMessage(
              parentalLeaveFormMessages.shared.transferRightsNone,
            ),
            value: TransferRightsOption.NONE,
          },
          {
            label: formatMessage(
              parentalLeaveFormMessages.shared.transferRightsRequest,
            ),
            value: TransferRightsOption.REQUEST,
            disabled:
              hasMultipleBirths === YES && multipleBirthsRequestDays === 0,
          },
          {
            label: formatMessage(
              parentalLeaveFormMessages.shared.transferRightsGive,
            ),
            value: TransferRightsOption.GIVE,
            disabled:
              (hasMultipleBirths === YES &&
                multipleBirthsRequestDays === maxMultipleBirthsDays) ||
              !canTransferRights,
          },
        ],
        backgroundColor: 'blue',
        defaultValue,
      }}
    />
  )
}
