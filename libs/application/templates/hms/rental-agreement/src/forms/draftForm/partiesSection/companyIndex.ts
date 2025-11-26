import { buildSection } from '@island.is/application/core'
import { companyPartiesSubsection } from './companyPartiesSubsection'
import { Routes } from '../../../utils/enums'
import { personalInformationSubsection } from './personalInformationSubsection'
import * as m from '../../../lib/messages'

export const partiesSection = buildSection({
  id: Routes.PARTIESINFORMATION,
  title: m.partiesDetails.subSectionName,
  children: [personalInformationSubsection, companyPartiesSubsection],
})
