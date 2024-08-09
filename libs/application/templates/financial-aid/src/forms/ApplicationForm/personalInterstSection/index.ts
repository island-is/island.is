import { buildSection } from '@island.is/application/core'
import * as m from '../../../lib/messages'
import { inARelationshipSubSection } from './inARelationshipSubSection'
import { Routes } from '../../../lib/constants'
import { unknownRelationshipSubSection } from './unknownRelationshipSubSection'
import { childrenSubSection } from './childrenSubSection'
import { childrenFilesSubSection } from './childrenFilesSubSection'
import { homeCircumstancesSubSection } from './homeCircumstancesSubSection'
import { studentSubSection } from './studentSubSection'
import { employmentSubSection } from './employmentSubSection'

export const personalInterestSection = buildSection({
  id: Routes.PERSONALINTEREST,
  title: m.section.personalInterest,
  children: [
    inARelationshipSubSection,
    unknownRelationshipSubSection,
    childrenSubSection,
    childrenFilesSubSection,
    homeCircumstancesSubSection,
    studentSubSection,
    employmentSubSection,
  ],
})
