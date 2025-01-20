import {
  buildCustomField,
  buildSection,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import * as m from '../../../lib/messages'
import { Routes } from '../../../lib/constants'
import { ApplicantChildCustodyInformation } from '@island.is/application/types'
import { inRelationshipSubsection } from './inRelationshipSubsection'
import { unknownRelationshipSubsection } from './unknownRelationshipSubsection'
import { homeCircumstancesSubsection } from './homeCircumstancesSubsection'

export const personalInterestSection = buildSection({
  id: 'personalInterest',
  title: m.section.personalInterest,
  children: [
    inRelationshipSubsection,
    unknownRelationshipSubsection,
    buildSubSection({
      condition: (_, externalData) => {
        const childWithInfo = getValueViaPath(
          externalData,
          'childrenCustodyInformation.data',
          [],
        ) as ApplicantChildCustodyInformation[]

        return Boolean(childWithInfo?.length)
      },
      id: Routes.CHILDRENSCHOOLINFO,
      title: m.childrenForm.general.sectionTitle,
      children: [
        buildCustomField({
          id: Routes.CHILDRENSCHOOLINFO,
          title: m.childrenForm.general.pageTitle,
          component: 'ChildrenForm',
        }),
      ],
    }),
    buildSubSection({
      condition: (_, externalData) => {
        const childWithInfo = getValueViaPath(
          externalData,
          'childrenCustodyInformation.data',
          [],
        ) as ApplicantChildCustodyInformation[]

        return Boolean(childWithInfo?.length)
      },
      id: Routes.CHILDRENFILES,
      title: m.childrenFilesForm.general.sectionTitle,
      children: [
        buildCustomField({
          id: Routes.CHILDRENFILES,
          title: m.childrenFilesForm.general.pageTitle,
          component: 'ChildrenFilesForm',
        }),
      ],
    }),
    homeCircumstancesSubsection,
    buildSubSection({
      id: Routes.STUDENT,
      title: m.studentForm.general.sectionTitle,
      children: [
        buildCustomField({
          id: Routes.STUDENT,
          title: m.studentForm.general.pageTitle,
          component: 'StudentForm',
        }),
      ],
    }),
    buildSubSection({
      id: Routes.EMPLOYMENT,
      title: m.employmentForm.general.sectionTitle,
      children: [
        buildCustomField({
          id: Routes.EMPLOYMENT,
          title: m.employmentForm.general.pageTitle,
          component: 'EmploymentForm',
        }),
      ],
    }),
  ],
})
