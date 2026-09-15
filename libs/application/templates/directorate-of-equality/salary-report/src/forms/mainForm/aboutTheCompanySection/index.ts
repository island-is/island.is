import { buildSection } from '@island.is/application/core'
import { messages } from '../../../lib/messages'
import { generalInformationSubSection } from './generalInformationSubSection'
import { chiefExecutiveSubSection } from './chiefExecutiveSubSection'
import { contactPersonSubSection } from './contactPersonSubSection'
import { subsidiariesSubSection } from './subsidiariesSubSection'
import { periodSubSection } from './periodSubSection'

export const aboutTheCompanySection = buildSection({
  id: 'aboutTheCompany',
  title: messages.aboutTheCompany.section.sectionTitle,
  children: [
    generalInformationSubSection,
    chiefExecutiveSubSection,
    contactPersonSubSection,
    subsidiariesSubSection,
    periodSubSection,
  ],
})
