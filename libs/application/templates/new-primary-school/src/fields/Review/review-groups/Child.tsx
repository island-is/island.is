import { YES } from '@island.is/application/types'
import { DataValue, ReviewGroup } from '@island.is/application/ui-components'
import { GridColumn, GridRow, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { format as formatKennitala } from 'kennitala'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import {
  getApplicationAnswers,
  getGenderOptionLabel,
} from '../../../lib/newPrimarySchoolUtils'
import { ReviewGroupProps } from './props'

export const Child = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage } = useLocale()
  const { childInfo, differentPlaceOfResidence } = getApplicationAnswers(
    application.answers,
  )

  return (
    <ReviewGroup
      isEditable={editable}
      editAction={() => goToScreen?.('childrenMultiField')}
    >
      <Stack space={2}>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
            <Text variant="h3" as="h3">
              {formatMessage(newPrimarySchoolMessages.overview.child)}
            </Text>
          </GridColumn>
        </GridRow>
        <GridRow rowGap={2}>
          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            <DataValue
              label={formatMessage(newPrimarySchoolMessages.shared.fullName)}
              value={childInfo.name}
            />
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            <DataValue
              label={formatMessage(newPrimarySchoolMessages.shared.nationalId)}
              value={formatKennitala(childInfo.nationalId)}
            />
          </GridColumn>
        </GridRow>
        <GridRow rowGap={2}>
          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            <DataValue
              label={formatMessage(newPrimarySchoolMessages.shared.address)}
              value={childInfo.address.streetAddress}
            />
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            <DataValue
              label={formatMessage(
                newPrimarySchoolMessages.shared.municipality,
              )}
              value={`${childInfo.address.postalCode}, ${childInfo.address.city}`}
            />
          </GridColumn>
        </GridRow>
        {(childInfo.gender ||
          childInfo.chosenName ||
          differentPlaceOfResidence === YES) && (
          <GridRow rowGap={2}>
            {childInfo.chosenName && (
              <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                <DataValue
                  label={formatMessage(
                    newPrimarySchoolMessages.childrenNParents
                      .childInfoChosenName,
                  )}
                  value={childInfo.chosenName}
                />
              </GridColumn>
            )}
            {childInfo.gender && (
              <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                <DataValue
                  label={formatMessage(
                    newPrimarySchoolMessages.childrenNParents.childInfoGender,
                  )}
                  value={formatMessage(getGenderOptionLabel(childInfo.gender))}
                />
              </GridColumn>
            )}
            {differentPlaceOfResidence === YES && (
              <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                <DataValue
                  label={formatMessage(
                    newPrimarySchoolMessages.childrenNParents
                      .childInfoPlaceOfResidence,
                  )}
                  value={`${childInfo.placeOfResidence?.streetAddress}, ${childInfo.placeOfResidence?.postalCode}`}
                />
              </GridColumn>
            )}
          </GridRow>
        )}
      </Stack>
    </ReviewGroup>
  )
}
