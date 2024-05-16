import { FieldComponents, FieldTypes } from '@island.is/application/types'
import {
  Label,
  ReviewGroup,
  formatPhoneNumber,
  removeCountryCode,
} from '@island.is/application/ui-components'
import { StaticTableFormField } from '@island.is/application/ui-fields'
import { Box, GridColumn, GridRow } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { format as formatKennitala } from 'kennitala'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import {
  getApplicationAnswers,
  getRelationOptionLabel,
} from '../../../lib/newPrimarySchoolUtils'
import { ReviewGroupProps } from './props'

export const Relatives = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage } = useLocale()
  const { relatives } = getApplicationAnswers(application.answers)

  const rows = relatives.map((r) => {
    return [
      r.fullName,
      formatPhoneNumber(removeCountryCode(r.phoneNumber ?? '')),
      formatKennitala(r.nationalId),
      getRelationOptionLabel(r.relation),
    ]
  })

  return (
    <ReviewGroup
      isEditable={editable}
      editAction={() => goToScreen?.('relatives')}
    >
      <GridRow>
        <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
          <Label>
            {formatMessage(newPrimarySchoolMessages.relatives.sectionTitle)}
          </Label>
          {relatives?.length > 0 && (
            <Box paddingTop={3}>
              <StaticTableFormField
                application={application}
                field={{
                  type: FieldTypes.STATIC_TABLE,
                  component: FieldComponents.STATIC_TABLE,
                  children: undefined,
                  id: 'relativesTable',
                  title: '',
                  header: [
                    newPrimarySchoolMessages.relatives.fullName,
                    newPrimarySchoolMessages.relatives.phoneNumber,
                    newPrimarySchoolMessages.relatives.nationalId,
                    newPrimarySchoolMessages.relatives.relation,
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
