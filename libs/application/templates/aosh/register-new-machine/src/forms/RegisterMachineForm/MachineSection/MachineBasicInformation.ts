import {
  NO,
  YES,
  buildAlertMessageField,
  buildCustomField,
  buildDescriptionField,
  buildMultiField,
  buildSelectField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { information, machine } from '../../../lib/messages'
import { NEW, USED } from '../../../shared/types'
import { getAllCountryCodes } from '@island.is/shared/utils'
import { isNotCEmarked } from '../../../utils'
import { FormValue } from '@island.is/application/types'

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
        buildCustomField({
          id: 'machine.aboutMachine',
          component: 'AboutMachine',
        }),
        buildDescriptionField({
          id: 'machine.basicInformation.basicInformationTitle',
          title: machine.labels.basicMachineInformation.basicInformationTitle,
          titleVariant: 'h5',
          marginTop: 3,
        }),
        buildSelectField({
          id: 'machine.basicInformation.productionCountry',
          title: machine.labels.basicMachineInformation.productionCountry,
          width: 'half',
          required: true,
          options: () => {
            return getAllCountryCodes().map(({ name_is }) => {
              return { value: `${name_is}`, label: `${name_is}` }
            })
          },
        }),
        buildTextField({
          id: 'machine.basicInformation.productionYear',
          title: machine.labels.basicMachineInformation.productionYear,
          width: 'half',
          required: true,
          variant: 'number',
          min: 1900,
          max: new Date().getFullYear(),
        }),
        buildTextField({
          id: 'machine.basicInformation.productionNumber',
          title: machine.labels.basicMachineInformation.productionNumber,
          width: 'half',
          maxLength: 50,
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
              value: NEW,
              label: machine.labels.basicMachineInformation.new,
            },
            {
              value: USED,
              label: machine.labels.basicMachineInformation.used,
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
        buildCustomField({
          id: 'machine.basicInformation.location',
          width: 'half',
          component: 'LocationInputField',
        }),
        buildTextField({
          id: 'machine.basicInformation.cargoFileNumber',
          title: machine.labels.basicMachineInformation.cargoFileNumber,
          width: 'half',
          maxLength: 50,
        }),
        buildAlertMessageField({
          id: 'machine.basicInformation.alert',
          title: machine.labels.basicMachineInformation.alertTitle,
          message: machine.labels.basicMachineInformation.alertMessage,
          alertType: 'warning',
          condition: (answer: FormValue) => isNotCEmarked(answer),
        }),
      ],
    }),
  ],
})
