import { buildSection } from '@island.is/application/core'
import { assignApplicantPatySubsection } from './assignApplicantPatySubsection'
import { partiesSubsection } from './partiesSubsection'
import * as m from '../../../lib/messages'
import { Routes } from '../../../utils/enums'

export const partiesSection = buildSection({
  id: Routes.PARTIESINFORMATION,
  title: m.partiesDetails.subSectionName,
  children: [assignApplicantPatySubsection, partiesSubsection],
})
