import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import {
  formatPhoneNumber,
  removeCountryCode,
} from '@island.is/application/ui-components'
import { TableRepeaterFormField } from '@island.is/application/ui-fields'
import { format as formatKennitala } from 'kennitala'
import React, { FC } from 'react'
import { useFriggOptions } from '../../hooks/useFriggOptions'
import { OptionsType } from '../../lib/constants'
import { newPrimarySchoolMessages } from '../../lib/messages'
import { getSelectedOptionLabel } from '../../lib/newPrimarySchoolUtils'

const ContactsTableRepeater: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  error,
  field,
  application,
}) => {
  const { id, title } = field

  const { options: relationFriggOptions } = useFriggOptions(
    OptionsType.RELATION,
  )

  return (
    <TableRepeaterFormField
      application={application}
      error={error}
      field={{
        type: FieldTypes.TABLE_REPEATER,
        component: FieldComponents.TABLE_REPEATER,
        children: undefined,
        id,
        title,
        formTitle:
          newPrimarySchoolMessages.childrenNGuardians.contactsRegistrationTitle,
        addItemButtonText:
          newPrimarySchoolMessages.childrenNGuardians.contactsAddContact,
        saveItemButtonText:
          newPrimarySchoolMessages.childrenNGuardians.contactsRegisterContact,
        removeButtonTooltipText:
          newPrimarySchoolMessages.childrenNGuardians.contactsDeleteContact,
        marginTop: 0,
        maxRows: 4,
        fields: {
          fullName: {
            component: 'input',
            label: newPrimarySchoolMessages.shared.fullName,
            width: 'half',
            type: 'text',
            dataTestId: 'contact-full-name',
          },
          phoneNumber: {
            component: 'input',
            label: newPrimarySchoolMessages.shared.phoneNumber,
            width: 'half',
            type: 'tel',
            format: '###-####',
            placeholder: '000-0000',
            dataTestId: 'contact-phone-number',
          },
          nationalId: {
            component: 'input',
            label: newPrimarySchoolMessages.shared.nationalId,
            width: 'half',
            type: 'text',
            format: '######-####',
            placeholder: '000000-0000',
            dataTestId: 'contact-national-id',
          },
          relation: {
            component: 'select',
            label: newPrimarySchoolMessages.shared.relation,
            width: 'half',
            placeholder: newPrimarySchoolMessages.shared.relationPlaceholder,
            options: relationFriggOptions,
            dataTestId: 'contact-relation',
          },
        },
        table: {
          format: {
            phoneNumber: (value) =>
              value ? formatPhoneNumber(removeCountryCode(value)) : '',
            nationalId: (value) => (value ? formatKennitala(value) : ''),
            relation: (value) =>
              value
                ? getSelectedOptionLabel(relationFriggOptions, value) ?? ''
                : '',
          },
          header: [
            newPrimarySchoolMessages.shared.fullName,
            newPrimarySchoolMessages.shared.phoneNumber,
            newPrimarySchoolMessages.shared.nationalId,
            newPrimarySchoolMessages.shared.relation,
          ],
        },
      }}
    />
  )
}

export default ContactsTableRepeater
