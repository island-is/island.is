import React, { useState } from 'react'
import { useFormContext } from 'react-hook-form'

import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
  RadioField,
} from '@island.is/application/core'
import { RadioFormField } from '@island.is/application/ui-fields'

import { getApplicationAnswers } from '../../lib/parentalLeaveUtils'
import { parentalLeaveFormMessages } from '../../lib/messages'
import { NO, YES } from '../../constants'
import { YesOrNo } from '../../types'
import { maxDaysToGiveOrReceive } from '../../config'

interface GiveRightsRadioProps extends FieldBaseProps {
  field: RadioField
}

const GiveRightsRadio = ({ field, application }: GiveRightsRadioProps) => {
  const {
    isGivingRights,
    giveDays,
    isRequestingRights,
    requestDays,
  } = getApplicationAnswers(application.answers)
  const { register } = useFormContext()
  const [radio, setRadio] = useState<YesOrNo | undefined>(
    isGivingRights ?? undefined,
  )

  return (
    <>
      <RadioFormField
        application={application}
        field={{
          id: `${field.id}.isGivingRights`,
          title: field.title,
          description: field.description,
          type: FieldTypes.RADIO,
          children: undefined,
          component: FieldComponents.RADIO,
          width: 'half',
          onSelect: (value: string) => setRadio(value as YesOrNo),
          options: [
            {
              label: parentalLeaveFormMessages.shared.yesOptionLabel,
              value: YES,
            },
            {
              label: parentalLeaveFormMessages.shared.noOptionLabel,
              value: NO,
            },
          ],
        }}
      />

      <input
        ref={register}
        type="hidden"
        value={
          radio === YES
            ? Math.min(Math.max(giveDays, 1), maxDaysToGiveOrReceive)
            : 0
        }
        name={`${field.id}.giveDays`}
      />

      <input
        ref={register}
        type="hidden"
        name="requestRights.isRequestingRights"
        value={radio === YES ? NO : isRequestingRights}
      />

      <input
        ref={register}
        type="hidden"
        name="requestRights.requestDays"
        value={radio === YES ? 0 : requestDays}
      />
    </>
  )
}

export default GiveRightsRadio
