import {
  buildAlertMessageField,
  buildCustomField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { MachinesWithTotalCount } from '@island.is/clients/work-machines'

export const pickMachineSubSection = buildSubSection({
  id: 'pickMachine',
  title: information.labels.pickMachine.sectionTitle,
  children: [
    buildMultiField({
      id: 'pickMachineMultiField',
      title: information.labels.pickMachine.title,
      description: information.labels.pickMachine.description,
      children: [
        buildAlertMessageField({
          id: 'pickMachineAlertMessage',
          title: information.labels.pickMachine.infoTitle,
          message: information.labels.pickMachine.infoMessage,
          alertType: 'info',
        }),
        buildRadioField({
          id: 'pickMachine.id',
          title: information.labels.pickMachine.title,
          condition: (_, externalData) => {
            const machines = getValueViaPath(
              externalData,
              'machinesList.data',
              {},
            ) as MachinesWithTotalCount

            return machines.totalCount <= 5
          },

          options: (application) => {
            const machineList = application?.externalData.machinesList
              .data as MachinesWithTotalCount
            return machineList.machines.map((machine) => {
              return {
                value: machine.id || '',
                label: machine?.regNumber || '',
                subLabel: `${machine.category}: ${machine.type} - ${machine.subType}`,
                disabled: machine?.disabled || false,
                tag: machine?.disabled
                  ? {
                      label: machine?.status || '',
                      variant: 'red',
                      outlined: true,
                    }
                  : undefined,
              }
            })
          },
        }),
        buildCustomField({
          id: 'pickMachine',
          condition: (_, externalData) => {
            const machines = getValueViaPath(
              externalData,
              'machinesList.data',
              {},
            ) as MachinesWithTotalCount
            return machines.totalCount > 5
          },
          component: 'MachinesField',
          title: '',
        }),
      ],
    }),
  ],
})
