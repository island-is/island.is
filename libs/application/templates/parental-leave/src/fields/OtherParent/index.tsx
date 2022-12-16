import React, { FC } from 'react'
import { formatText, getErrorViaPath } from '@island.is/application/core'
import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import { useMutation, useQuery } from '@apollo/client'
import { useLocale } from '@island.is/localization'
import { Box, Text } from '@island.is/island-ui/core'
import { RadioFormField } from '@island.is/application/ui-fields'
import { getApplicationAnswers, getOtherParentOptions } from '../../lib/parentalLeaveUtils'
import { SPOUSE, NO, SINGLE, TransferRightsOption } from '../../constants'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { useFormContext } from 'react-hook-form'

export const OtherParent: FC<FieldBaseProps> = ({ application, field }) => {
  const { id, title } = field
  // const { formatMessage } = useLocale()
  const { errors, setValue } = useFormContext()
  const [updateApplication, { loading }] = useMutation(UPDATE_APPLICATION)
  const { locale, formatMessage } = useLocale()
  return (
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
              const { otherParentEmail, otherParentPhoneNumber, transferRights, isRequestingRights, isGivingRights, otherParentRightOfAccess } = getApplicationAnswers(application.answers)
              setValue('otherParentObj.otherParentName', '')
              setValue('otherParentObj.otherParentId', '')
              if (s === NO || s === SINGLE) {
                // if (otherParentEmail) {
                //   setValue('otherParentEmail', '')
                // }
                // if (otherParentPhoneNumber) {
                //   setValue('otherParentPhoneNumber', '')
                // }
                if (isRequestingRights){
                  console.log('--- requestright', isRequestingRights)
                  setValue('requestRights.isRequestingRights', NO)
                  setValue('requestRights.requestDays', '0')
                }
                if (isGivingRights) {
                  console.log('--- giveRight', isGivingRights)
                  setValue('giveRights.giveDays', '0')
                  setValue('giveRights.isGivingRights', NO)
                }
                if ( transferRights) {
                  console.log('transfer', transferRights)
                  setValue('transferRights', TransferRightsOption.NONE)
                }
                if (otherParentRightOfAccess) {
                  console.log('---rightofAccess', otherParentRightOfAccess)
                  setValue('otherParentRightOfAccess', NO)
                }
                // if (s === SINGLE){
                //   setValue('otherParentObj.chooseOtherParent', SINGLE)
                // }
                // else {
                //   setValue('otherParentObj.chooseOtherParent', NO)
                // }
                await updateApplication({
                  variables: {
                    input: {
                      id: application.id,
                      answers: {
                        ...application.answers,
                        isRequestingRights,
                        isGivingRights,
                        transferRights,
                        otherParentRightOfAccess
                      },
                    },
                    locale,
                  }
                })
              }
            }
          },
        }}
        application={application}
      />
    </Box>
  )
}
