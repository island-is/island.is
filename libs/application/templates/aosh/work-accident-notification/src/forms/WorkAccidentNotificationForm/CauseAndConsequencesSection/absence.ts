import {
  buildAlertMessageField,
  buildMultiField,
  buildSelectField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { sections } from '../../../lib/messages'
import { causeAndConsequences } from '../../../lib/messages'
import { Application } from '@island.is/api/schema'

// TODO Remove type when we get generated types
export type AbsenceDueToAccident = {
  FjarveraV: number
  FK_DaysLostSeverityCode: string | null
  LabelIs: string
  LabelEn: string
}

export const absenceSection = buildSubSection({
  id: 'absence',
  title: sections.draft.absence,
  children: [
    buildMultiField({
      title: causeAndConsequences.absence.title,
      description: causeAndConsequences.absence.description,
      children: [
        buildAlertMessageField({
          id: 'absence.alertMessageField',
          title: causeAndConsequences.absence.alertMessageTitle,
          message: causeAndConsequences.absence.alertMessage,
          alertType: 'info',
        }),
        buildSelectField({
          id: 'absence.absenceDueToAccident',
          title: causeAndConsequences.absence.absenceDueToAccident,
          options: (application) => {
            const absenceDueToAccident = getValueViaPath(
              application.externalData,
              'aoshData.data.absenceDueToAccident',
              [],
            ) as AbsenceDueToAccident[]
            return absenceDueToAccident.map(
              ({ FjarveraV, LabelIs, LabelEn }) => ({
                value: FjarveraV.toString(),
                label: LabelIs, // TODO Add LabelEn logic, where do I get locale inside a section ??
              }),
            )
          },
        }),
      ],
    }),
  ],
})
