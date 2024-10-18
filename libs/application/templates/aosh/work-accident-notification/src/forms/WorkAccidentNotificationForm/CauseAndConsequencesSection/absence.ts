import {
  buildAlertMessageField,
  buildMultiField,
  buildSelectField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { sections } from '../../../lib/messages'
import { causeAndConsequences } from '../../../lib/messages'
import { AbsenceDueToAccidentDto } from '@island.is/clients/work-accident-ver'

export const absenceSection = (index: number) =>
  buildSubSection({
    id: `absenceSection[${index}]`,
    title: sections.draft.absence,
    children: [
      buildMultiField({
        title: causeAndConsequences.absence.title,
        description: causeAndConsequences.absence.description,
        id: `absenceMultiField[${index}]`,
        children: [
          buildAlertMessageField({
            id: `absence[${index}].alertMessageField`,
            title: causeAndConsequences.absence.alertMessageTitle,
            message: causeAndConsequences.absence.alertMessage,
            alertType: 'info',
          }),
          buildSelectField({
            id: `absence[${index}]`,
            title: causeAndConsequences.absence.absenceDueToAccident,
            options: (application) => {
              const absenceDueToAccident = getValueViaPath(
                application.externalData,
                'aoshData.data.absenceDueToAccident',
                [],
              ) as AbsenceDueToAccidentDto[]
              return absenceDueToAccident
                .filter((absence) => absence?.code && absence?.name)
                .map(({ name, code }) => ({
                  label: name || '',
                  value: code || '',
                }))
            },
          }),
        ],
      }),
    ],
  })
