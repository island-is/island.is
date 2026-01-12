import {
  buildCustomField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import {
  MachineDto,
  MachinesWithTotalCount,
} from '@island.is/clients/work-machines'
import {
  isInvalidRegistrationType,
  isMachineDisabled,
  mustInspectBeforeStreetRegistration,
} from '../../../utils/getSelectedMachine'
import { useLocale } from '@island.is/localization'
import { ExternalData } from '@island.is/application/types'
import { MessageDescriptor } from 'react-intl'

const getTagLabel = (
  externalData: ExternalData,
  machine: MachineDto,
  formatMessage: (message: MessageDescriptor) => string,
): string => {
  if (
    mustInspectBeforeStreetRegistration(externalData, machine?.regNumber || '')
  ) {
    return formatMessage(
      information.labels.pickMachine.inspectBeforeRegistration,
    )
  }
  if (isInvalidRegistrationType(externalData, machine?.regNumber || '')) {
    return formatMessage(information.labels.pickMachine.invalidRegistrationType)
  }
  return machine?.status || ''
}

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
                        label: getTagLabel(
                          externalData,
                          machine,
                          useLocale().formatMessage,
                        ),
                        variant: 'red',
                        outlined: true,
                      }
                    : undefined,
              }
            })
          },
        }),
        buildCustomField({
          id: 'machine',
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
