import { buildSection } from '@island.is/application/core'
import { messages } from '../../../lib/messages'
import { generalInformationSubSection } from './generalInformationSubSection'
import { chiefExecutiveSubSection } from './chiefExecutiveSubSection'
import { contactPersonSubSection } from './contactPersonSubSection'
import { employeeCountSubSection } from './employeeCountSubSection'
import { subsidiariesSubSection } from './subsidiariesSubSection'

export const aboutTheCompanySection = buildSection({
  id: 'aboutTheCompany',
  title: messages.aboutTheCompany.section.sectionTitle,
  children: [
    generalInformationSubSection,
    chiefExecutiveSubSection,
    contactPersonSubSection,
    employeeCountSubSection,
    subsidiariesSubSection,
  ],
})
