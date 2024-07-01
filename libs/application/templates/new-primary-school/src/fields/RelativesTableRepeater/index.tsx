import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
  YES,
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

const RelativesTableRepeater: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ error, field, application }) => {
  const { title } = field

  const relationFriggOptions = useFriggOptions(OptionsType.RELATION)

  return (
    <TableRepeaterFormField
      application={application}
      error={error}
      field={{
        type: FieldTypes.TABLE_REPEATER,
        component: FieldComponents.TABLE_REPEATER,
        children: undefined,
        id: field.id,
        title,
        formTitle:
          newPrimarySchoolMessages.childrenNParents.relativesRegistrationTitle,
        addItemButtonText:
          newPrimarySchoolMessages.childrenNParents.relativesAddRelative,
        saveItemButtonText:
          newPrimarySchoolMessages.childrenNParents.relativesRegisterRelative,
        removeButtonTooltipText:
          newPrimarySchoolMessages.childrenNParents.relativesDeleteRelative,
        marginTop: 0,
        maxRows: 6,
        fields: {
          fullName: {
            component: 'input',
            label: newPrimarySchoolMessages.shared.fullName,
            width: 'half',
            type: 'text',
            dataTestId: 'relative-full-name',
          },
          phoneNumber: {
            component: 'input',
            label: newPrimarySchoolMessages.shared.phoneNumber,
            width: 'half',
            type: 'tel',
            format: '###-####',
            placeholder: '000-0000',
            dataTestId: 'relative-phone-number',
          },
          nationalId: {
            component: 'input',
            label: newPrimarySchoolMessages.shared.nationalId,
            width: 'half',
            type: 'text',
            format: '######-####',
            placeholder: '000000-0000',
            dataTestId: 'relative-national-id',
          },
          relation: {
            component: 'select',
            label: newPrimarySchoolMessages.shared.relation,
            width: 'half',
            placeholder: newPrimarySchoolMessages.shared.relationPlaceholder,
            options: relationFriggOptions,
            dataTestId: 'relative-relation',
          },
          canPickUpChild: {
            component: 'checkbox',
            width: 'full',
            large: true,
            options: [
              {
                label:
                  newPrimarySchoolMessages.childrenNParents
                    .relativesCanPickUpChild,
                value: YES,
              },
            ],
            dataTestId: 'relative-can-pick-up-child',
          },
        },
        table: {
          format: {
            phoneNumber: (value) =>
              formatPhoneNumber(removeCountryCode(value ?? '')),
            nationalId: (value) => formatKennitala(value),
            relation: (value) =>
              getSelectedOptionLabel(relationFriggOptions, value) ?? '',
            canPickUpChild: (value) =>
              value?.includes(YES)
                ? newPrimarySchoolMessages.shared.yes
                : newPrimarySchoolMessages.shared.no,
          },
          header: [
            newPrimarySchoolMessages.shared.fullName,
            newPrimarySchoolMessages.shared.phoneNumber,
            newPrimarySchoolMessages.shared.nationalId,
            newPrimarySchoolMessages.shared.relation,
            newPrimarySchoolMessages.childrenNParents
              .relativesCanPickUpChildTableHeader,
          ],
        },
      }}
    />
  )
}

export default RelativesTableRepeater
