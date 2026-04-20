import {
  buildCheckboxField,
  buildMultiField,
  buildNationalIdWithNameField,
  buildPhoneField,
  buildSubSection,
  buildSubmitField,
  buildTextField,
  buildTitleField,
  getValueViaPath,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { location, supervisor } from '../../../lib/messages'
import { DefaultEvents } from '@island.is/application/types'

export const supervisorSubSection = buildSubSection({
  id: 'supervisorSubSection',
  title: supervisor.general.title,
  children: [
    buildMultiField({
      id: 'supervisor',
      title: supervisor.general.newSupervisorTitle,
      description: supervisor.general.description,
      children: [
        buildCheckboxField({
          id: 'supervisor.isOwner',
          title: supervisor.general.title,
          width: 'full',
          options: [
            { value: 'ownerIsSupervisor', label: 'Eigandi er umráðamaður' },
          ],
        }),
        buildNationalIdWithNameField({
          id: 'supervisor',
          title: 'nationalId',
          searchCompanies: true,
          condition: (answers) => {
            const isOwner = getValueViaPath(
              answers,
              'supervisor.isOwner',
              [],
            ) as string[]
            return isOwner[0] !== 'ownerIsSupervisor'
          },
          required: false,
          width: 'full',
        }),
        buildPhoneField({
          id: 'supervisor.phone',
          title: information.labels.supervisor.phone,
          width: 'half',
          condition: (answers) => {
            const isOwner = getValueViaPath(
              answers,
              'supervisor.isOwner',
              [],
            ) as string[]
            return isOwner[0] !== 'ownerIsSupervisor'
          },
          required: true,
        }),
        buildTextField({
          id: 'supervisor.email',
          title: information.labels.supervisor.email,
          width: 'half',
          variant: 'email',
          condition: (answers) => {
            const isOwner = getValueViaPath(
              answers,
              'supervisor.isOwner',
              [],
            ) as string[]
            return isOwner[0] !== 'ownerIsSupervisor'
          },
          required: true,
        }),
        buildTitleField({
          title: location.general.title,
          color: 'black',
        }),
        buildTextField({
          id: 'location.address',
          title: location.labels.addressLabel,
          width: 'half',
          variant: 'text',
          required: false,
        }),
        buildTextField({
          id: 'location.postalCode',
          title: location.labels.postCodeLabel,
          width: 'half',
          variant: 'number',
          maxLength: 3,
          required: false,
        }),
        buildTextField({
          id: 'location.moreInfo',
          title: location.labels.moreInfoLabel,
          width: 'full',
          variant: 'textarea',
          required: false,
        }),
        buildSubmitField({
          id: 'submit',
          placement: 'footer',
          title: location.labels.approveButton,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: supervisor.labels.approveButton,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
