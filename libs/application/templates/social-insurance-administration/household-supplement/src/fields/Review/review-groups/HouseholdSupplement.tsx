import {
  DataValue,
  ReviewGroup,
  RadioValue,
} from '@island.is/application/ui-components'
import { GridColumn, GridRow } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { householdSupplementFormMessage } from '../../../lib/messages'
import { HouseholdSupplementHousing } from '../../../lib/constants'
import { ReviewGroupProps } from './props'
import { getApplicationAnswers } from '../../../lib/householdSupplementUtils'

export const HouseholdSupplement = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { householdSupplementHousing, householdSupplementChildren } =
    getApplicationAnswers(application.answers)

  const { formatMessage } = useLocale()

  const householdSupplementHousingValue =
    householdSupplementHousing === HouseholdSupplementHousing.HOUSEOWNER
      ? formatMessage(
          householdSupplementFormMessage.info.householdSupplementHousingOwner,
        )
      : householdSupplementHousing === HouseholdSupplementHousing.RENTER
      ? formatMessage(
          householdSupplementFormMessage.info.householdSupplementHousingRenter,
        )
      : undefined

  return (
    <ReviewGroup
      isEditable={editable}
      editAction={() => goToScreen?.('householdSupplement')}
    >
      <GridRow marginBottom={3}>
        <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
          <DataValue
            label={formatMessage(
              householdSupplementFormMessage.info.householdSupplementHousing,
            )}
            value={householdSupplementHousingValue}
          />
        </GridColumn>
      </GridRow>
      <GridRow>
        <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
          <RadioValue
            label={formatMessage(
              householdSupplementFormMessage.info
                .householdSupplementChildrenBetween18And25,
            )}
            value={householdSupplementChildren}
          />
        </GridColumn>
      </GridRow>
    </ReviewGroup>
  )
}
