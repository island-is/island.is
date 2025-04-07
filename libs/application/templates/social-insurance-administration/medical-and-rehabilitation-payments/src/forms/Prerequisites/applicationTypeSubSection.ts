import { buildSubSection } from '@island.is/application/core'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../lib/messages'

export const applicationTypeSubSection = buildSubSection({
  id: 'applicationTypeSubSection',
  title:
    medicalAndRehabilitationPaymentsFormMessage.pre
      .applicationTypeSubSectionTitle,
  children: [],
})
