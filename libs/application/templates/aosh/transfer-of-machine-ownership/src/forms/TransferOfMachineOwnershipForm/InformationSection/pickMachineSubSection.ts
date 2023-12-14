import {
  buildAlertMessageField,
  buildAsyncSelectField,
  buildCustomField,
  buildMultiField,
  buildRadioField,
  buildSelectField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { MachineDto } from '@island.is/clients/work-machines'
import { Application } from '@island.is/api/schema'
import { FormValue } from '@island.is/application/types'

export const pickMachineSubSection = buildSubSection({
  id: 'pickMachine',
  title: information.labels.pickMachine.sectionTitle,
  children: [
    buildMultiField({
      id: 'pickMachineMultiField',
      title: information.labels.pickMachine.title,
      description: information.labels.pickMachine.description,
      children: [
        buildRadioField({
          id: 'pickMachine.id',
          title: information.labels.pickMachine.title,
          condition: (_, externalData) => {
            console.log('formValue', externalData)
            const machines = getValueViaPath(
              externalData,
              'machinesList.data',
              [],
            ) as MachineDto[]

            return machines.length <= 5
          },

          options: (application) => {
            const machineList =
              (application?.externalData.machinesList.data as
                | MachineDto[]
                | undefined) || []
            return machineList.map((machine) => {
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
            console.log('formValue', externalData)
            const machines = getValueViaPath(
              externalData,
              'machinesList.data',
              [],
            ) as MachineDto[]
            return machines.length > 5
          },
          component: 'MachinesField',
          title: '',
        }),
      ],
    }),
  ],
})
