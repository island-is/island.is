import { DataValue, ReviewGroup } from '@island.is/application/ui-components'
import { GridColumn, GridRow, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import {
  formatGrade,
  getApplicationAnswers,
  getApplicationExternalData,
} from '../../../lib/newPrimarySchoolUtils'
import { ReviewGroupProps } from './props'

export const School = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage, formatDate, lang } = useLocale()
  const { startDate, selectedSchool } = getApplicationAnswers(
    application.answers,
  )
  const { childGradeLevel } = getApplicationExternalData(
    application.externalData,
  )

  return (
    <ReviewGroup
      isEditable={editable}
      editAction={() => goToScreen?.('school')}
    >
      <Stack space={2}>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
            <Text variant="h3" as="h3">
              {formatMessage(newPrimarySchoolMessages.overview.schoolTitle)}
            </Text>
          </GridColumn>
        </GridRow>
        <GridRow rowGap={2}>
          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            {/* TODO: Bæta við núverandi skóla */}
            <DataValue
              label={formatMessage(
                newPrimarySchoolMessages.overview.currentSchool,
              )}
              value={'- TBA -'}
            />
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            <DataValue
              label={formatMessage(
                newPrimarySchoolMessages.overview.selectedSchool,
              )}
              value={selectedSchool}
            />
          </GridColumn>
        </GridRow>
        <GridRow rowGap={2}>
          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            <DataValue
              label={formatMessage(newPrimarySchoolMessages.overview.grade)}
              value={formatMessage(
                newPrimarySchoolMessages.overview.currentGrade,
                {
                  grade: formatGrade(childGradeLevel, lang),
                },
              )}
            />
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            <DataValue
              label={formatMessage(newPrimarySchoolMessages.shared.date)}
              value={formatDate(startDate)}
            />
          </GridColumn>
        </GridRow>
      </Stack>
    </ReviewGroup>
  )
}
