import {
  buildCustomField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { MachinesWithTotalCount } from '@island.is/clients/work-machines'
import {
  isInvalidRegistrationType,
  isMachineDisabled,
  mustInspectBeforeStreetRegistration,
} from '../../../utils/getSelectedMachine'
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

          options: (application) => {
            const machineList = application?.externalData.machinesList
              .data as MachinesWithTotalCount
            const externalData = application.externalData

            return machineList.machines.map((machine) => {
              return {
                value: machine.id || '',
                label: machine?.regNumber || '',
                subLabel: `${machine.category}: ${machine.type} - ${machine.subType}`,
                disabled: machine?.disabled
                  ? true
                  : isMachineDisabled(externalData, machine?.regNumber || '') ||
                    false,
                tag:
                  machine?.disabled ||
                  isMachineDisabled(externalData, machine?.regNumber || '')
                    ? {
                        label: mustInspectBeforeStreetRegistration(
                          application?.externalData,
                          machine?.regNumber || '',
                        )
                          ? useLocale().formatMessage(
                              information.labels.pickMachine
                                .inspectBeforeRegistration,
                            )
                          : isInvalidRegistrationType(
                              externalData,
                              machine?.regNumber || '',
                            )
                          ? useLocale().formatMessage(
                              information.labels.pickMachine
                                .invalidRegistrationType,
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
