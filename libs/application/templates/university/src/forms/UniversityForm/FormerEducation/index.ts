import { buildSection } from '@island.is/application/core'
import { formerEducation } from '../../../lib/messages/formerEducation'
import { EducationOptionsSubSection } from './EducationOptions'
import { FinishedEducationSubSection } from './EducationDetails/FinishedEducation'
import { NotFinishedEducationSubSection } from './EducationDetails/NotFinishedEducation'
import { ThirdLevelEducationSubSection } from './EducationDetails/ThirdLevelEducation'
import { ExemptionSubSection } from './EducationDetails/Exemption'
import { OtherDocumentsSection } from './OtherDocuments'

export const FormerEducationSection = buildSection({
  id: 'formerEducation',
  title: formerEducation.general.sectionTitle,
  children: [
    EducationOptionsSubSection,
    FinishedEducationSubSection,
    NotFinishedEducationSubSection,
    ThirdLevelEducationSubSection,
    ExemptionSubSection,
    OtherDocumentsSection, //TODO conditionally display section
  ],
})
