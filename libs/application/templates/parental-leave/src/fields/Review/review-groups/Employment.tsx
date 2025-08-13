import { FieldComponents, FieldTypes } from '@island.is/application/types'
import {
  DataValue,
  Label,
  RadioValue,
  ReviewGroup,
  formatPhoneNumber,
  removeCountryCode,
} from '@island.is/application/ui-components'
import { StaticTableFormField } from '@island.is/application/ui-fields'
import { Box, GridColumn, GridRow } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { PARENTAL_LEAVE, States } from '../../../constants'
import { parentalLeaveFormMessages } from '../../../lib/messages'
import { getApplicationAnswers } from '../../../lib/parentalLeaveUtils'
import { ReviewGroupProps } from './props'
import { NO, YES } from '@island.is/application/core'

export const Employment = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage } = useLocale()
  const {
    isSelfEmployed,
    isReceivingUnemploymentBenefits,
    unemploymentBenefits,
    employers,
    employerLastSixMonths,
    applicationType,
  } = getApplicationAnswers(application.answers)

  const shouldShowApproved = application.state !== States.DRAFT

  const rows = employers.map((e) => {
    return [
      e.email,
      formatPhoneNumber(removeCountryCode(e.phoneNumber ?? '')),
      `${e.ratio}%`,
      // Only display employer approval after application submit
      ...(shouldShowApproved
        ? [
            e.isApproved
              ? parentalLeaveFormMessages.shared.yesOptionLabel
              : parentalLeaveFormMessages.shared.noOptionLabel,
          ]
        : []),
    ]
  })

  return (
    <ReviewGroup
      isEditable={editable}
      editAction={() =>
        goToScreen?.(
          applicationType === PARENTAL_LEAVE
            ? 'employment'
            : 'employerLastSixMonths',
        )
      }
    >
      {applicationType === PARENTAL_LEAVE &&
        (isSelfEmployed === YES ? (
          <GridRow>
            <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
              <RadioValue
                label={formatMessage(
                  parentalLeaveFormMessages.selfEmployed.title,
                )}
                value={isSelfEmployed}
              />
            </GridColumn>
          </GridRow>
        ) : (
          isReceivingUnemploymentBenefits === YES && (
            <GridRow>
              <GridColumn span={['7/12', '7/12', '7/12', '12/12']}>
                <DataValue
                  label={formatMessage(
                    parentalLeaveFormMessages.reviewScreen.benefits,
                  )}
                  value={unemploymentBenefits ?? ''}
                />
              </GridColumn>
            </GridRow>
          )
        ))}
      {((isSelfEmployed === NO && isReceivingUnemploymentBenefits === NO) ||
        employerLastSixMonths === YES) && (
        <GridRow>
          <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
            <Label>
              {formatMessage(parentalLeaveFormMessages.employer.title)}
            </Label>
            {employers?.length > 0 && (
              <Box paddingTop={3}>
                <StaticTableFormField
                  application={application}
                  field={{
                    type: FieldTypes.STATIC_TABLE,
                    component: FieldComponents.STATIC_TABLE,
                    children: undefined,
                    id: 'employersTable',
                    title: '',
                    header: [
                      parentalLeaveFormMessages.employer.emailHeader,
                      parentalLeaveFormMessages.employer.phoneNumberHeader,
                      parentalLeaveFormMessages.employer.ratioHeader,
                      // Only display employer approval after application submit
                      ...(shouldShowApproved
                        ? [parentalLeaveFormMessages.employer.approvedHeader]
                        : []),
                    ],
                    rows,
                  }}
                />
              </Box>
            )}
          </GridColumn>
        </GridRow>
      )}
    </ReviewGroup>
  )
}
