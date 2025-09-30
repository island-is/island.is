import { buildSection } from '@island.is/application/core'
import { assignApplicantPartySubsection } from './assignApplicantPartySubsection'
import { partiesSubsection } from './partiesSubsection'
import { Routes } from '../../../utils/enums'
import { personalInformationSubsection } from './personalInformationSubsection'
import * as m from '../../../lib/messages'

export const partiesSection = buildSection({
  id: Routes.PARTIESINFORMATION,
  title: m.partiesDetails.subSectionName,
  children: [
    personalInformationSubsection,
    assignApplicantPartySubsection,
    partiesSubsection,
  ],
})
