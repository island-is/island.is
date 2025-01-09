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
import { useFriggOptions } from '../../../hooks/useFriggOptions'
import { OptionsType } from '../../../lib/constants'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import {
  getApplicationAnswers,
  getSelectedOptionLabel,
} from '../../../lib/newPrimarySchoolUtils'
import { ReviewGroupProps } from './props'

export const Contacts = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage } = useLocale()
  const { contacts } = getApplicationAnswers(application.answers)

  const relationFriggOptions = useFriggOptions(OptionsType.RELATION)

  const rows = contacts.map((r) => {
    return [
      r.fullName,
      formatPhoneNumber(removeCountryCode(r.phoneNumber ?? '')),
      formatKennitala(r.nationalId),
      getSelectedOptionLabel(relationFriggOptions, r.relation) ?? '',
    ]
  })

  return (
    <ReviewGroup
      isEditable={editable}
      editAction={() => goToScreen?.('contacts')}
    >
      <GridRow>
        <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
          <Label>
            {formatMessage(
              newPrimarySchoolMessages.childrenNParents.contactsSubSectionTitle,
            )}
          </Label>
          {contacts?.length > 0 && (
            <Box paddingTop={3}>
              <StaticTableFormField
                application={application}
                field={{
                  type: FieldTypes.STATIC_TABLE,
                  component: FieldComponents.STATIC_TABLE,
                  children: undefined,
                  id: 'contactsTable',
                  title: '',
                  header: [
                    newPrimarySchoolMessages.shared.fullName,
                    newPrimarySchoolMessages.shared.phoneNumber,
                    newPrimarySchoolMessages.shared.nationalId,
                    newPrimarySchoolMessages.shared.relation,
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
