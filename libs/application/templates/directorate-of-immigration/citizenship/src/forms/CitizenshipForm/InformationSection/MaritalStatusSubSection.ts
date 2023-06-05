import {
  buildMultiField,
  buildTextField,
  buildSubSection,
  buildDescriptionField,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { Application } from '@island.is/api/schema'
import { Answer } from '@island.is/application/types'
import { Citizenship } from '../../../lib/dataSchema'

export const MaritalStatusSubSection = buildSubSection({
  id: 'maritalStatus',
  title: information.labels.maritalStatus.subSectionTitle,
  children: [
    buildMultiField({
      id: 'maritalStatusMultiField',
      title: information.labels.maritalStatus.pageTitle,
      condition: (answer: Answer) => {
        const answers = answer as Citizenship
        if(answers.residenceCondition?.radio === 'marriedToIcelander' || answers.residenceCondition?.radio === 'cohabitWithIcelander'){
          return true
        }
        return false
      },
      children: [
        buildDescriptionField({
          id: 'maritalStatus.title',
          title: information.labels.maritalStatus.titleStatus,
          titleVariant: 'h5',
        }),
        buildTextField({
          id: 'maritalStatus.status',
          title: information.labels.maritalStatus.status,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => application.externalData?.nationalRegistrySpouse?.data?.maritalTitle?.description,
        }),
        buildDescriptionField({
          id: 'maritalStatus.titleSpouse',
          title: information.labels.maritalStatus.titleSpouse,
          titleVariant: 'h5',
          space: 3,
        }),
        buildTextField({
          id: 'maritalStatus.nationalId',
          title: information.labels.maritalStatus.nationalId,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          format: '######-####',
          defaultValue: (application: Application) => application.externalData?.nationalRegistrySpouse?.data?.nationalId,
        }),
        buildTextField({
          id: 'maritalStatus.name',
          title: information.labels.maritalStatus.name,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => application.externalData?.nationalRegistrySpouse?.data?.name,
        }),
      ],
    }),
  ],
})
