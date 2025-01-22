import { buildSection } from '@island.is/application/core'
import { inRelationshipSubsection } from './inRelationshipSubsection'
import { unknownRelationshipSubsection } from './unknownRelationshipSubsection'
import { homeCircumstancesSubsection } from './homeCircumstancesSubsection'
import { employmentSubsection } from './employmentSubsection'
import { studentSubsection } from './studentSubsection'
import { childrenSchoolInfoSubsection } from './childrenSchoolInfoSubsection'
import { childrenFilesSubsection } from './childrenFilesSubsection'
import * as m from '../../../lib/messages'

export const personalInterestSection = buildSection({
  id: 'personalInterest',
  title: m.section.personalInterest,
  children: [
    inRelationshipSubsection,
    unknownRelationshipSubsection,
    childrenSchoolInfoSubsection,
    childrenFilesSubsection,
    homeCircumstancesSubsection,
    studentSubsection,
    employmentSubsection,
  ],
})
