import {
  buildCustomField,
  buildSection,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { ExternalData } from '../../../lib/types'
import * as m from '../../../lib/messages'
import { Routes } from '../../../lib/constants'
import { ApplicantChildCustodyInformation } from '@island.is/application/types'
import { inRelationshipSubsection } from './inRelationshipSubsection'

export const personalInterestSection = buildSection({
  id: 'personalInterest',
  title: m.section.personalInterest,
  children: [
    inRelationshipSubsection,
    buildSubSection({
      condition: (_, externalData) =>
        (externalData as unknown as ExternalData).nationalRegistrySpouse.data ==
        null,
      title: m.unknownRelationship.general.sectionTitle,
      id: Routes.UNKNOWNRELATIONSHIP,
      children: [
        buildCustomField({
          id: Routes.UNKNOWNRELATIONSHIP,
          title: m.unknownRelationship.general.pageTitle,
          component: 'UnknownRelationshipForm',
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
    buildSubSection({
      id: Routes.HOMECIRCUMSTANCES,
      title: m.homeCircumstancesForm.general.sectionTitle,
      children: [
        buildCustomField({
          id: Routes.HOMECIRCUMSTANCES,
          title: m.homeCircumstancesForm.general.pageTitle,
          component: 'HomeCircumstancesForm',
        }),
      ],
    }),
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
