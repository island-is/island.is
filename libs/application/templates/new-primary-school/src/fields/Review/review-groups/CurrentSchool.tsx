import { DataValue, ReviewGroup } from '@island.is/application/ui-components'
import { GridColumn, GridRow, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import {
  formatGrade,
  getApplicationExternalData,
  getCurrentSchoolName,
} from '../../../lib/newPrimarySchoolUtils'
import { ReviewGroupProps } from './props'

export const CurrentSchool = ({ application, editable }: ReviewGroupProps) => {
  const { formatMessage, lang } = useLocale()

  const { childGradeLevel } = getApplicationExternalData(
    application.externalData,
  )

  return (
    <ReviewGroup isEditable={editable}>
      <Stack space={2}>
        <GridRow>
          <GridColumn span="10/12">
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
                newPrimarySchoolMessages.primarySchool.currentSchool,
              )}
              value={getCurrentSchoolName(application)}
            />
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            <DataValue
              label={formatMessage(
                newPrimarySchoolMessages.primarySchool.grade,
              )}
              value={formatMessage(
                newPrimarySchoolMessages.primarySchool.currentGrade,
                {
                  grade: formatGrade(childGradeLevel, lang),
                },
              )}
            />
          </GridColumn>
        </GridRow>
      </Stack>
    </ReviewGroup>
  )
}
