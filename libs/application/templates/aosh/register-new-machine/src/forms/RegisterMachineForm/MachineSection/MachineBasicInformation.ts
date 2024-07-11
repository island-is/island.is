import {
  NO,
  YES,
  buildCustomField,
  buildDescriptionField,
  buildMultiField,
  buildSelectField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { information, machine } from '../../../lib/messages'

export const MachineBasicInformation = buildSubSection({
  id: 'machineBasicInformation',
  title: machine.labels.basicMachineInformation.sectionTitle,
  children: [
    buildMultiField({
      id: 'machineBasicInformationMultiField',
      title: machine.labels.basicMachineInformation.title,
      description: machine.labels.basicMachineInformation.description,
      children: [
        buildDescriptionField({
          id: 'machine.basicInformation.aboutTitle',
          title: machine.labels.basicMachineInformation.aboutTitle,
          titleVariant: 'h5',
        }),
        buildTextField({
          id: 'machine.basicInformation.type',
          title: machine.labels.basicMachineInformation.type,
          width: 'half',
          required: true,
        }),
        buildTextField({
          id: 'machine.basicInformation.model',
          title: machine.labels.basicMachineInformation.model,
          width: 'half',
          required: true,
        }),
        buildSelectField({
          id: 'machine.basicInformation.category',
          title: machine.labels.basicMachineInformation.category,
          width: 'half',
          required: true,
          options: [
            {
              value: 'lyftarar',
              label: 'Lyftarar',
            },
          ],
        }),
        buildSelectField({
          id: 'machine.basicInformation.subcategory',
          title: machine.labels.basicMachineInformation.subcategory,
          width: 'half',
          required: true,
          options: [
            {
              value: 'JF',
              label: 'JF Lyftarar með skotbómu',
            },
          ],
        }),
        buildDescriptionField({
          id: 'machine.basicInformation.basicInformationTitle',
          title: machine.labels.basicMachineInformation.basicInformationTitle,
          titleVariant: 'h5',
          marginTop: 3,
        }),
        buildTextField({
          id: 'machine.basicInformation.productionCountry',
          title: machine.labels.basicMachineInformation.productionCountry,
          width: 'half',
          required: true,
        }),
        buildTextField({
          id: 'machine.basicInformation.productionYear',
          title: machine.labels.basicMachineInformation.productionYear,
          width: 'half',
          required: true,
        }),
        buildTextField({
          id: 'machine.basicInformation.productionNumber',
          title: machine.labels.basicMachineInformation.productionNumber,
          width: 'half',
          required: true,
        }),
        buildSelectField({
          id: 'machine.basicInformation.markedCE',
          title: machine.labels.basicMachineInformation.markedCE,
          width: 'half',
          required: true,
          options: [
            {
              value: YES,
              label: information.labels.radioButtons.radioOptionYes,
            },
            {
              value: NO,
              label: information.labels.radioButtons.radioOptionNo,
            },
          ],
        }),
        buildSelectField({
          id: 'machine.basicInformation.preRegistration',
          title: machine.labels.basicMachineInformation.preRegistration,
          width: 'half',
          required: true,
          options: [
            {
              value: YES,
              label: information.labels.radioButtons.radioOptionYes,
            },
            {
              value: NO,
              label: information.labels.radioButtons.radioOptionNo,
            },
          ],
        }),
        buildSelectField({
          id: 'machine.basicInformation.isUsed',
          title: machine.labels.basicMachineInformation.isUsed,
          width: 'half',
          required: true,
          options: [
            {
              value: 'new',
              label: 'Ný',
            },
            {
              value: 'used',
              label: 'Notuð',
            },
          ],
        }),
        buildDescriptionField({
          id: 'machine.basicInformation.registrationInformationTitle',
          title:
            machine.labels.basicMachineInformation.registrationInformationTitle,
          titleVariant: 'h5',
          marginTop: 3,
        }),
        buildTextField({
          id: 'machine.basicInformation.location',
          title: machine.labels.basicMachineInformation.location,
          width: 'half',
          required: true,
        }),
        buildTextField({
          id: 'machine.basicInformation.cargoFileNumber',
          title: machine.labels.basicMachineInformation.cargoFileNumber,
          width: 'half',
          required: true,
        }),
      ],
    }),
  ],
})
