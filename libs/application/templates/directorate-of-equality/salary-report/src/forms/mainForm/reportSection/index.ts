import { buildSection } from '@island.is/application/core'
import { messages } from '../../../lib/messages'
import { dataEntrySubSection } from './dataEntrySubSection'
import { criteriaSubSection } from './criteriaSubSection'
import { subCriteriaSubSection } from './subCriteriaSubSection'
import { employeesSubSection } from './employeesSubSection'
import { jobClassificationSubSection } from './jobClassificationSubSection'
import { employeeClassificationSubSection } from './employeeClassificationSubSection'

export const reportSection = buildSection({
  id: 'report',
  title: messages.report.section.sectionTitle,
  children: [
    dataEntrySubSection,
    criteriaSubSection,
    subCriteriaSubSection,
    employeesSubSection,
    jobClassificationSubSection,
    employeeClassificationSubSection,
  ],
})
