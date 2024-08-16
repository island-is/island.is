import {
  buildAlertMessageField,
  buildDescriptionField,
  buildMultiField,
  buildSelectField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { information } from '../../../lib/messages/information'
import { Application } from '@island.is/api/schema'

export const companySection = buildSubSection({
  id: 'company',
  title: information.labels.company.sectionTitle,
  children: [
    buildMultiField({
      id: 'companyBaseInformation',
      title: information.labels.company.title,
      description: information.labels.company.description,
      children: [
        buildDescriptionField({
          id: 'companyBaseInformation.description',
          title: 'Grunnupplysingar',
          titleVariant: 'h5',
        }),
        buildTextField({
          id: 'companyBaseInformation.nationalId',
          title: information.labels.company.nationalId,
          backgroundColor: 'white',
          width: 'half',
          format: '######-####',
          defaultValue: (application: Application) => '',
          //application.externalData?.nationalRegistry?.data?.nationalId,
        }),
        buildTextField({
          id: 'companyBaseInformation.name',
          title: information.labels.company.name,
          backgroundColor: 'white',
          width: 'half',
          defaultValue: (application: Application) => '',
        }),
        buildTextField({
          id: 'companyBaseInformation.address',
          title: information.labels.company.address,
          backgroundColor: 'white',
          width: 'half',
          defaultValue: (application: Application) => '',
        }),
        buildSelectField({
          id: 'companyBaseInformation.postnumber',
          title: information.labels.company.postNumberAndTown,
          width: 'half',
          options: [],
        }),
        buildSelectField({
          id: 'companyBaseInformation.industryClassification',
          title: information.labels.company.industryClassification,
          width: 'half',
          options: [],
        }),
        buildSelectField({
          id: 'companyBaseInformation.numberOfEmployees',
          title: information.labels.company.numberOfEmployees,
          width: 'half',
          options: [],
        }),
        buildDescriptionField({
          id: 'companyBaseInformation.description',
          title: 'Grunnupplysingar',
          titleVariant: 'h5',
        }),
        buildAlertMessageField({
          id: 'companyLaborProtection.alertField',
          alertType: 'info',
          title: '',
          message: information.labels.laborProtection.alertMessageText,
        }),
      ],
    }),
  ],
})
