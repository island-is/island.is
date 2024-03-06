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
import { NO, PARENTAL_LEAVE, YES } from '../../../constants'
import { parentalLeaveFormMessages } from '../../../lib/messages'
import { getApplicationAnswers } from '../../../lib/parentalLeaveUtils'
import { ReviewGroupProps } from './props'

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

  const rows = employers.map((e) => {
    return [
      e.email,
      formatPhoneNumber(removeCountryCode(e.phoneNumber ?? '')),
      `${e.ratio}%`,
      e.isApproved
        ? parentalLeaveFormMessages.shared.yesOptionLabel
        : parentalLeaveFormMessages.shared.noOptionLabel,
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
      {applicationType === PARENTAL_LEAVE && (
        <>
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
          {isSelfEmployed === NO && ( // only show benefits in review if user had to answer that question
            <GridRow>
              <GridColumn
                span={['12/12', '12/12', '12/12', '5/12']}
                paddingTop={2}
              >
                <RadioValue
                  label={formatMessage(
                    parentalLeaveFormMessages.employer
                      .isReceivingUnemploymentBenefitsTitle,
                  )}
                  value={isReceivingUnemploymentBenefits}
                />
              </GridColumn>

              {isReceivingUnemploymentBenefits === YES && (
                <GridColumn
                  span={['12/12', '12/12', '12/12', '5/12']}
                  paddingTop={2}
                >
                  <DataValue
                    label={formatMessage(
                      parentalLeaveFormMessages.employer.unemploymentBenefits,
                    )}
                    value={unemploymentBenefits}
                  />
                </GridColumn>
              )}
            </GridRow>
          )}
        </>
      )}
      {employerLastSixMonths === YES && (
        <GridRow>
          <GridColumn span={['7/12', '7/12', '7/12', '12/12']} paddingTop={2}>
            <RadioValue
              label={formatMessage(
                parentalLeaveFormMessages.reviewScreen.employerLastSixMonths,
              )}
              value={employerLastSixMonths}
            />
          </GridColumn>
        </GridRow>
      )}
      {((isSelfEmployed === NO && isReceivingUnemploymentBenefits === NO) ||
        employerLastSixMonths === YES) && (
        <GridRow>
          <GridColumn span={['12/12', '12/12', '12/12', '5/12']} paddingTop={2}>
            <Label>
              {formatMessage(parentalLeaveFormMessages.employer.title)}
            </Label>
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
            {employers?.length > 0 && (
              <Box paddingTop={2}>
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
                      parentalLeaveFormMessages.employer.approvedHeader,
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
