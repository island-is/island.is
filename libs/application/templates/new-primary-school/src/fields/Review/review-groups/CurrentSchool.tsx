import { DataValue, ReviewGroup } from '@island.is/application/ui-components'
import { GridColumn, GridRow, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import { getCurrentSchoolName } from '../../../lib/newPrimarySchoolUtils'
import { ReviewGroupProps } from './props'

export const CurrentSchool = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage } = useLocale()

  return (
    <ReviewGroup
      isEditable={editable}
      editAction={() => goToScreen?.('currentSchool')}
    >
      <Stack space={2}>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
            <Text variant="h3" as="h3">
              {formatMessage(
                newPrimarySchoolMessages.primarySchool
                  .currentSchoolSubSectionTitle,
              )}
            </Text>
          </GridColumn>
        </GridRow>
        <GridRow rowGap={2}>
          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            <DataValue
              label={formatMessage(
                newPrimarySchoolMessages.primarySchool.currentSchoolInfo,
              )}
              value={getCurrentSchoolName(application)}
            />
          </GridColumn>
        </GridRow>
      </Stack>
    </ReviewGroup>
  )
}
