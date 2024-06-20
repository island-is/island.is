import {
  buildCustomField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { MachinesWithTotalCount } from '@island.is/clients/work-machines'
import { mustInspectBeforeStreetRegistration } from '../../../utils/getSelectedMachine'
import { useLocale } from '@island.is/localization'
import { Application } from '@island.is/application/types'

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
          id: 'machine.id',
          title: '',
          condition: (_, externalData) => {
            const machines = getValueViaPath(
              externalData,
              'machinesList.data',
              {},
            ) as MachinesWithTotalCount
            return machines.totalCount <= 5
          },
          defaultValue: (application: Application) => {
            const machineList = application?.externalData.machinesList
              .data as MachinesWithTotalCount
            return machineList?.machines[0].id ?? ''
          },
          options: (application) => {
            const machineList = application?.externalData.machinesList
              .data as MachinesWithTotalCount

            return machineList.machines.map((machine) => {
              return {
                value: machine.id || '',
                label: machine?.regNumber || '',
                subLabel: `${machine.category}: ${machine.type} - ${machine.subType}`,
                disabled: machine?.disabled
                  ? true
                  : mustInspectBeforeStreetRegistration(
                      application?.externalData,
                      machine?.regNumber || '',
                    ) || false,
                tag: machine?.disabled
                  ? {
                      label: mustInspectBeforeStreetRegistration(
                        application?.externalData,
                        machine?.regNumber || '',
                      )
                        ? useLocale().formatMessage(
                            information.labels.pickMachine
                              .inspectBeforeRegistration,
                          )
                        : machine?.status || '',
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
