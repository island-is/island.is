import { YES } from '@island.is/application/core'
import { DataValue, ReviewGroup } from '@island.is/application/ui-components'
import { GridColumn, GridRow, Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useFriggOptions } from '../../../hooks/useFriggOptions'
import { OptionsType } from '../../../lib/constants'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import {
  getApplicationAnswers,
  getSelectOptionLabel,
} from '../../../lib/newPrimarySchoolUtils'
import { ReviewGroupProps } from './props'

export const AllergiesAndIntolerances = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage } = useLocale()
  const {
    hasFoodAllergies,
    hasFoodIntolerances,
    isUsingEpiPen,
    foodAllergies,
    foodIntolerances,
  } = getApplicationAnswers(application.answers)

  const foodAllergiesFriggOptions = useFriggOptions(OptionsType.ALLERGRY)
  const foodIntolerancesFriggOptions = useFriggOptions(OptionsType.INTOLERANCE)

  return (
    <ReviewGroup
      isEditable={editable}
      editAction={() => goToScreen?.('allergiesAndIntolerances')}
    >
      <Stack space={2}>
        {hasFoodAllergies.includes(YES) && (
          <GridRow>
            <GridColumn span="9/12">
              <DataValue
                label={formatMessage(
                  newPrimarySchoolMessages.overview.foodAllergies,
                )}
                value={foodAllergies
                  .map((allergies) => {
                    return getSelectOptionLabel(
                      foodAllergiesFriggOptions,
                      allergies,
                    )
                  })
                  .join(', ')}
              />
            </GridColumn>
          </GridRow>
        )}
        {hasFoodIntolerances.includes(YES) && (
          <GridRow>
            <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
              <DataValue
                label={formatMessage(
                  newPrimarySchoolMessages.overview.foodIntolerances,
                )}
                value={foodIntolerances
                  .map((intolerances) => {
                    return getSelectOptionLabel(
                      foodIntolerancesFriggOptions,
                      intolerances,
                    )
                  })
                  .join(', ')}
              />
            </GridColumn>
          </GridRow>
        )}
        <GridRow>
          <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
            <DataValue
              label={formatMessage(
                newPrimarySchoolMessages.overview.usesEpinephrinePen,
              )}
              value={formatMessage(
                isUsingEpiPen?.includes(YES)
                  ? newPrimarySchoolMessages.shared.yes
                  : newPrimarySchoolMessages.shared.no,
              )}
            />
          </GridColumn>
        </GridRow>
      </Stack>
    </ReviewGroup>
  )
}
