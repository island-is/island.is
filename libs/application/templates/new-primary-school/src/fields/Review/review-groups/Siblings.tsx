import { FieldComponents, FieldTypes } from '@island.is/application/types'
import { Label, ReviewGroup } from '@island.is/application/ui-components'
import { StaticTableFormField } from '@island.is/application/ui-fields'
import { Box, GridColumn, GridRow } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { format as formatKennitala } from 'kennitala'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import { getApplicationAnswers } from '../../../utils/newPrimarySchoolUtils'
import { ReviewGroupProps } from './props'

export const Siblings = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage } = useLocale()
  const { siblings } = getApplicationAnswers(application.answers)

  const rows = siblings.map((s) => {
    return [s.fullName, formatKennitala(s.nationalId)]
  })

  return (
    <ReviewGroup
      isEditable={editable}
      editAction={() => goToScreen?.('siblings')}
    >
      <GridRow>
        <GridColumn span="12/12">
          <Label>
            {formatMessage(
              newPrimarySchoolMessages.primarySchool.siblingsTitle,
            )}
          </Label>
          {siblings?.length > 0 && (
            <Box paddingTop={3}>
              <StaticTableFormField
                application={application}
                field={{
                  type: FieldTypes.STATIC_TABLE,
                  component: FieldComponents.STATIC_TABLE,
                  children: undefined,
                  id: 'siblingsTable',
                  header: [
                    newPrimarySchoolMessages.shared.fullName,
                    newPrimarySchoolMessages.shared.nationalId,
                  ],
                  rows,
                }}
              />
            </Box>
          )}
        </GridColumn>
      </GridRow>
    </ReviewGroup>
  )
}
