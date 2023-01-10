import {
  DataValue,
  RadioValue,
  ReviewGroup,
  formatPhoneNumber,
} from '@island.is/application/ui-components'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { ReviewGroupProps } from './props'
import { useLocale } from '@island.is/localization'
import { NO, YES, parentalLeaveFormMessages } from '../../..'
import { useStatefulAnswers } from '../../../hooks/useStatefulAnswers'

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
      // TODO: Populate data with employers
      employers,
    },
  ] = useStatefulAnswers(application)

  return (
    <ReviewGroup
      isEditable={editable}
      editAction={() => goToScreen?.('isSelfEmployed.benefits')}
    >
      <GridRow>
        <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
          <RadioValue
            label={formatMessage(parentalLeaveFormMessages.selfEmployed.title)}
            value={isSelfEmployed}
          />
          {isSelfEmployed === NO && isReceivingUnemploymentBenefits === NO && (
            <Box paddingTop={2}>
              <Text variant="default">Wait wait wait!</Text>
            </Box>
          )}
        </GridColumn>

        <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
          {isSelfEmployed === NO && isReceivingUnemploymentBenefits === NO && (
            <Box paddingTop={2}>
              <Text variant="default">Wait wait wait!</Text>
            </Box>
          )}
        </GridColumn>
      </GridRow>
      {isSelfEmployed === NO && ( // only show benefits in review if user had to answer that question
        <GridRow>
          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            <RadioValue
              label={formatMessage(
                parentalLeaveFormMessages.employer
                  .isReceivingUnemploymentBenefitsTitle,
              )}
              value={isReceivingUnemploymentBenefits}
            />
          </GridColumn>

          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            {isReceivingUnemploymentBenefits === YES && (
              <DataValue
                label={formatMessage(
                  parentalLeaveFormMessages.employer.unemploymentBenefits,
                )}
                value={unemploymentBenefits}
              />
            )}
          </GridColumn>
        </GridRow>
      )}
    </ReviewGroup>
  )
}
