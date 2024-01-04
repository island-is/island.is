import {
  buildCheckboxField,
  buildMultiField,
  buildNationalIdWithNameField,
  buildPhoneField,
  buildSubSection,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { MachineDto } from '@island.is/clients/work-machines'

export const supervisorSubSection = buildSubSection({
  id: 'supervisorSection',
  title: 'Supervisor',
  children: [
    buildMultiField({
      id: 'supervisorMultiField',
      title: 'Supervisor',
      description: 'Supervisor',
      children: [
        buildCheckboxField({
          id: 'supervisor.isOwner',
          title: 'Supervisor',
          width: 'half',
          options: [
            { value: 'ownerIsSupervisor', label: 'Eigandi er umráðamaður' },
          ],
        }),
        buildNationalIdWithNameField({
          id: 'supervisor.nationalId',
          title: 'nationalId',
          condition: (answers) => {
            const isOwner = getValueViaPath(
              answers,
              'supervisor.isOwner',
              false,
            ) as boolean
            //answers.answers.supervisor.isOwner === 'ownerIsSupervisor'
            return isOwner
          },
          width: 'full',
        }),
        buildPhoneField({
          id: 'supervisor.phoneNumber',
          title: 'phoneNumber',
          description: information.labels.supervisor.phone,
          width: 'half',
          condition: (answers) => {
            const isOwner = getValueViaPath(
              answers,
              'supervisor.isOwner',
              false,
            ) as boolean
            //answers.answers.supervisor.isOwner === 'ownerIsSupervisor'
            return isOwner
          },
          required: true,
        }),
        buildTextField({
          id: 'supervisor.email',
          title: information.labels.supervisor.email,
          description: information.labels.supervisor.email,
          width: 'half',
          variant: 'email',
          condition: (answers) => {
            const isOwner = getValueViaPath(
              answers,
              'supervisor.isOwner',
              false,
            ) as boolean
            //answers.answers.supervisor.isOwner === 'ownerIsSupervisor'
            return isOwner
          },
          required: true,
        }),
      ],
    }),
    buildMultiField({
      id: 'locationMultiField',
      title: 'Location',
      description: 'Location',
      children: [
        buildTextField({
          id: 'location.address',
          title: 'address',
          width: 'half',
        }),
        buildTextField({
          id: 'location.postalCode',
          title: 'postalCode',
          width: 'half',
        }),
        buildTextField({
          id: 'location.moreInfo',
          title: 'city',
          width: 'half',
        }),
      ],
    }),
  ],
})
