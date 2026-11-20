import {
  Application,
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import { formatPhoneNumber, removeCountryCode } from '@island.is/shared/utils'
import { TableRepeaterFormField } from '@island.is/application/ui-fields'
import { format as formatKennitala } from 'kennitala'
import React, { FC } from 'react'
import { useFriggOptions } from '../../hooks/useFriggOptions'
import { childrenNGuardiansMessages, sharedMessages } from '../../lib/messages'
import { AgentType, OptionsType } from '../../utils/constants'
import {
  getApplicationAnswers,
  getApplicationExternalData,
  getOtherGuardian,
  getSelectedOptionLabel,
} from '../../utils/newPrimarySchoolUtils'

const RelativesTableRepeater: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  error,
  field,
  application,
  setBeforeSubmitCallback,
}) => {
  const { id, title } = field

  const { options: relationFriggOptions } = useFriggOptions(
    OptionsType.RELATION,
  )

  return (
    <TableRepeaterFormField
      application={application}
      error={error}
      setBeforeSubmitCallback={setBeforeSubmitCallback} // Needed to remove deleted rows
      field={{
        type: FieldTypes.TABLE_REPEATER,
        component: FieldComponents.TABLE_REPEATER,
        children: undefined,
        id,
        title,
        formTitle: childrenNGuardiansMessages.relatives.registrationTitle,
        addItemButtonText: childrenNGuardiansMessages.relatives.addRelative,
        saveItemButtonText:
          childrenNGuardiansMessages.relatives.registerRelative,
        removeButtonTooltipText:
          childrenNGuardiansMessages.relatives.deleteRelative,
        editButtonTooltipText:
          childrenNGuardiansMessages.relatives.editRelative,
        marginTop: 0,
        maxRows: 4,
        editField: true,
        defaultValue: (application: Application) => {
          const { childInformation } = getApplicationExternalData(
            application.externalData,
          )

          return childInformation?.agents
            ?.filter((agent) => agent.type === AgentType.EmergencyContact)
            ?.map((agent) => ({
              nationalIdWithName: {
                name: agent.name,
                nationalId: agent.nationalId,
              },
              phoneNumber: agent.phone,
              relation: agent.relationTypeId,
            }))
        },
        fields: {
          nationalIdWithName: {
            component: 'nationalIdWithName',
            searchPersons: true,
            customNameLabel: sharedMessages.fullName,
          },
          phoneNumber: {
            component: 'input',
            label: sharedMessages.phoneNumber,
            width: 'half',
            type: 'tel',
            format: '###-####',
            placeholder: '000-0000',
            dataTestId: 'relative-phone-number',
          },
          relation: {
            component: 'select',
            label: sharedMessages.relation,
            width: 'half',
            placeholder: sharedMessages.relationPlaceholder,
            options: relationFriggOptions,
            dataTestId: 'relative-relation',
          },
          applicantNationalId: {
            component: 'hiddenInput',
            displayInTable: false,
            defaultValue: ({ application }) => application.applicant,
          },
          otherGuardianNationalId: {
            component: 'hiddenInput',
            displayInTable: false,
            defaultValue: ({ application }) =>
              getOtherGuardian(application.answers, application.externalData)
                ?.nationalId,
          },
          childNationalId: {
            component: 'hiddenInput',
            displayInTable: false,
            defaultValue: ({ application }) =>
              getApplicationAnswers(application.answers).childNationalId,
          },
        },
        table: {
          columns: [
            { header: sharedMessages.fullName, value: 'name' },
            {
              header: sharedMessages.nationalId,
              value: ({ row }) =>
                row.nationalId ? formatKennitala(row.nationalId) : '',
            },
            {
              header: sharedMessages.phoneNumber,
              value: ({ row }) =>
                row.phoneNumber
                  ? formatPhoneNumber(removeCountryCode(row.phoneNumber))
                  : '',
            },
            {
              header: sharedMessages.relation,
              value: ({ row }) =>
                row.relation
                  ? getSelectedOptionLabel(
                      relationFriggOptions,
                      row.relation,
                    ) ?? ''
                  : '',
            },
          ],
        },
      }}
    />
  )
}

export default RelativesTableRepeater
