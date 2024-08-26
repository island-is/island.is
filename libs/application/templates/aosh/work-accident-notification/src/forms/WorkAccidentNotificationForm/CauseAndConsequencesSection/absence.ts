import {
  buildAlertMessageField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { sections } from '../../../lib/messages'
import { causeAndConsequences } from '../../../lib/messages'

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
      ],
    }),
  ],
})
