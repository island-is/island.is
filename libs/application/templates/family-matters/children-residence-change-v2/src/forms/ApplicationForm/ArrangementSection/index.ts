import { buildSection } from '@island.is/application/core'
import * as m from '../../../lib/messages'
import { residenceChangeReasonSubSection } from './residenceChangeSubSection'
import { confirmResidenceChangeInfoSubSection } from './confirmResidenceChangeInfoSubSection'
import { childSupportPaymentsSubSection } from './childSupportPaymentsSubSection'
import { durationSubSection } from './durationSubSection'

export const arrangementSection = buildSection({
  id: 'arrangement',
  title: m.section.arrangement,
  children: [
    residenceChangeReasonSubSection,
    confirmResidenceChangeInfoSubSection,
    childSupportPaymentsSubSection,
    durationSubSection,
  ],
})
