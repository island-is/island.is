import {
  buildCustomField,
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubSection,
  Form,
  FormModes,
} from '@island.is/application/core'
import { DataProviderTypes, ExternalData } from '../lib/types'

import * as m from '../lib/messages'

export const Application: Form = buildForm({
  id: 'FinancialAidApplication',
  title: m.application.name,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'externalData',
      title: m.section.dataGathering,
      children: [
        buildExternalDataProvider({
          title: m.externalData.general.pageTitle,
          id: 'approveExternalData',
          subTitle: m.externalData.general.subTitle,
          description: m.externalData.general.description,
          checkboxLabel: m.externalData.general.checkboxLabel,
          dataProviders: [
            buildDataProviderItem({
              id: 'nationalRegistry',
              type: DataProviderTypes.NationalRegistry,
              title: m.externalData.applicant.title,
              subTitle: m.externalData.applicant.subTitle,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'aboutForm',
      title: m.aboutForm.general.sectionTitle,
      children: [
        buildCustomField({
          id: 'acceptContract',
          title: m.aboutForm.general.pageTitle,
          component: 'AboutForm',
        }),
      ],
    }),
    buildSection({
      condition: (_, externalData) =>
        ((externalData as unknown) as ExternalData).nationalRegistry?.data
          ?.spouse !== undefined,
      id: 'personalInterest',
      title: m.section.personalInterest,
      children: [
        buildSubSection({
          title: m.inRelationship.general.sectionTitle,
          children: [
            buildCustomField({
              id: 'inRelationship',
              title: m.inRelationship.general.pageTitle,
              component: 'InRelationship',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'studentForm',
      title: m.studentForm.general.sectionTitle,
      children: [
        buildCustomField({
          id: 'student',
          title: m.studentForm.general.pageTitle,
          component: 'StudentForm',
        }),
      ],
    }),
  ],
})
