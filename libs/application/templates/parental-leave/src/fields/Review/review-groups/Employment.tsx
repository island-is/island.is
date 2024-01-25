import {
  DataValue,
  Label,
  RadioValue,
  ReviewGroup,
} from '@island.is/application/ui-components'
import { Box, GridColumn, GridRow } from '@island.is/island-ui/core'
import { ReviewGroupProps } from './props'
import { useLocale } from '@island.is/localization'
import { NO, YES, parentalLeaveFormMessages, PARENTAL_LEAVE } from '../../..'
import { useStatefulAnswers } from '../../../hooks/useStatefulAnswers'
import { EmployersTable } from '../../components/EmployersTable'

export const Employment = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage } = useLocale()
  const [
    {
      isSelfEmployed,
      isReceivingUnemploymentBenefits,
      unemploymentBenefits,
      employers,
      employerLastSixMonths,
      applicationType,
    },
  ] = useStatefulAnswers(application)

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
                <EmployersTable employers={employers} />
              </Box>
            )}
          </GridColumn>
        </GridRow>
      )}
    </ReviewGroup>
  )
}
