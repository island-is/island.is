import { YES } from '@island.is/application/core'
import {
  DataValue,
  RadioValue,
  ReviewGroup,
} from '@island.is/application/ui-components'
import { GridColumn, GridRow, Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import {
  getApplicationAnswers,
  getFoodAllergiesOptionsLabel,
  getFoodIntolerancesOptionsLabel,
} from '../../../lib/newPrimarySchoolUtils'
import { ReviewGroupProps } from './props'

export const SchoolMeal = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage } = useLocale()
  const {
    isRequestingFreeSchoolMeals,
    hasFoodAllergies,
    hasFoodIntolerances,
    isUsingEpiPen,
    foodAllergies,
    foodIntolerances,
  } = getApplicationAnswers(application.answers)

  return (
    // TODO: Skoða betur þegar multiSelect er tilbúið
    <ReviewGroup
      isEditable={editable}
      editAction={() => goToScreen?.('schoolMeal')}
    >
      <Stack space={2}>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
            <RadioValue
              label={formatMessage(
                newPrimarySchoolMessages.differentNeeds.schoolMealFreeMeals,
              )}
              value={isRequestingFreeSchoolMeals}
            />
          </GridColumn>
        </GridRow>
        {hasFoodAllergies.includes(YES) && (
          <GridRow>
            <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
              <DataValue
                label={formatMessage(
                  newPrimarySchoolMessages.confirm.foodAllergies,
                )}
                value={formatMessage(
                  getFoodAllergiesOptionsLabel(foodAllergies),
                )}
              />
            </GridColumn>
          </GridRow>
        )}
        {hasFoodIntolerances.includes(YES) && (
          <GridRow>
            <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
              <DataValue
                label={formatMessage(
                  newPrimarySchoolMessages.confirm.foodIntolerances,
                )}
                value={formatMessage(
                  getFoodIntolerancesOptionsLabel(foodIntolerances),
                )}
              />
            </GridColumn>
          </GridRow>
        )}
        <GridRow>
          <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
            <RadioValue
              label={formatMessage(
                newPrimarySchoolMessages.confirm.usesEpinephrinePen,
              )}
              value={isUsingEpiPen}
            />
          </GridColumn>
        </GridRow>
      </Stack>
    </ReviewGroup>
  )
}
