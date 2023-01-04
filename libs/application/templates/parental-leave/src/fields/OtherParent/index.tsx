import React, { FC, useState } from 'react'
import { formatText, getErrorViaPath } from '@island.is/application/core'
import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { Box, Text } from '@island.is/island-ui/core'
import { RadioFormField } from '@island.is/application/ui-fields'
import {
  getApplicationAnswers,
  getOtherParentOptions,
} from '../../lib/parentalLeaveUtils'
import { SPOUSE, NO, SINGLE, TransferRightsOption } from '../../constants'
import { useFormContext } from 'react-hook-form'

export const OtherParent: FC<FieldBaseProps> = ({ application, field }) => {
  const { id, title } = field
  const { errors, setValue, register } = useFormContext()
  const { formatMessage } = useLocale()

  // const {
  //   transferRights,
  //   isRequestingRights,
  //   requestDays,
  //   isGivingRights,
  //   giveDays,
  //   otherParentRightOfAccess,
  // } = getApplicationAnswers(application.answers)
  // const [choseTransferRights, setTransferRights] = useState(transferRights)
  // const [choseRequestingRights, setRequestingRights] = useState(
  //   isRequestingRights,
  // )
  // const [choseRequestDays, setRequestDays] = useState(requestDays)
  // const [choseGivingRights, setGivingRights] = useState(isGivingRights)
  // const [choseGiveDays, setGiveDays] = useState(giveDays)
  // const [choseOtherParentRightOfAccess, setOtherParentRightOfAccess] = useState(
  //   otherParentRightOfAccess,
  // )

  return (
    <>
      <Box>
        <Text variant="h4" as="h4">
          {formatText(title, application, formatMessage)}
        </Text>
        <RadioFormField
          error={errors && getErrorViaPath(errors, id)}
          field={{
            id: id,
            type: FieldTypes.RADIO,
            component: FieldComponents.RADIO,
            title,
            children: undefined,
            options: (application) =>
              getOtherParentOptions(application, formatMessage),
            onSelect: async (s: string) => {
              if (s === SPOUSE || s === NO || s === SINGLE) {
                setValue('otherParentObj.otherParentName', '')
                setValue('otherParentObj.otherParentId', '')
                // if (s === NO || s === SINGLE) {
                //   if (isRequestingRights) {
                //     console.log('--- requestright', isRequestingRights)
                //     setRequestingRights(NO)
                //     setRequestDays(0)
                //     // setValue('requestRights.isRequestingRights', NO)
                //     // setValue('requestRights.requestDays', '0')
                //   }
                //   if (isGivingRights) {
                //     console.log('--- giveRight', isGivingRights)
                //     setGivingRights(NO)
                //     setGiveDays(0)
                //     // setValue('giveRights.giveDays', '0')
                //     // setValue('giveRights.isGivingRights', NO)
                //   }
                //   if (transferRights) {
                //     console.log('transfer', transferRights)
                //     setTransferRights(TransferRightsOption.NONE)
                //     // setValue('transferRights', TransferRightsOption.NONE)
                //   }
                //   if (otherParentRightOfAccess) {
                //     console.log('---rightofAccess', otherParentRightOfAccess)
                //     setOtherParentRightOfAccess(NO)
                //     // setValue('otherParentRightOfAccess', NO)
                //   }
                // }
              }
            },
          }}
          application={application}
        />
      </Box>

      {/* { !!isRequestingRights && <input
      type="hidden"
      ref={register}
      name="requestRights.isRequestingRights"
      value={choseRequestingRights}
    /> }
    { !!requestDays && <input
      type="hidden"
      ref={register}
      name="requestRights.requestDays"
      value={choseRequestDays}
    />}
    {!!isGivingRights && <input
      type="hidden"
      ref={register}
      name="giveRights.isGivingRights"
      value={choseGivingRights}
    />}
    {!!giveDays && <input
      type="hidden"
      ref={register}
      name="giveRights.giveDays"
      value={choseGiveDays}
    />}
    <input
      type="hidden"
      ref={register}
      name="transferRights"
      value={choseTransferRights}
    />
    <input
      type="hidden"
      ref={register}
      name="otherParentRightOfAccess"
      value={choseOtherParentRightOfAccess}
    /> */}
    </>
  )
}
