import {
  buildAlertMessageField,
  buildCheckboxField,
  buildDescriptionField,
  buildMultiField,
  buildSelectField,
  buildSubSection,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { Application } from '@island.is/api/schema'

type SizeOfEnterprise = {
  // TODO REMOVE ME WHEN WE GET GENERATED TYPES FROM API
  Code: number
  LabelIs: string
  LabelEn: string
}

type WorkplaceHealthAndSafety = {
  // TODO REMOVE ME WHEN WE GET GENERATED TYPES FROM API
  Vinnuver: number
  Heiti: string
  Röð: number
}

export const companySection = buildSubSection({
  id: 'company',
  title: information.labels.company.sectionTitle,
  children: [
    buildMultiField({
      id: 'companyInformation',
      title: information.labels.company.title,
      description: information.labels.company.description,
      children: [
        buildDescriptionField({
          id: 'companyInformation.description',
          title: 'Grunnupplysingar',
          titleVariant: 'h5',
        }),
        buildTextField({
          id: 'companyInformation.nationalId',
          title: information.labels.company.nationalId,
          backgroundColor: 'white',
          width: 'half',
          format: '######-####',
          defaultValue: (application: Application) => '',
          //application.externalData?.nationalRegistry?.data?.nationalId,
        }),
        buildTextField({
          id: 'companyInformation.name',
          title: information.labels.company.name,
          backgroundColor: 'white',
          width: 'half',
          defaultValue: (application: Application) => '',
        }),
        buildTextField({
          id: 'companyInformation.address',
          title: information.labels.company.address,
          backgroundColor: 'white',
          width: 'half',
          defaultValue: (application: Application) => '',
        }),
        buildSelectField({
          id: 'companyInformation.postnumber',
          title: information.labels.company.postNumberAndTown,
          width: 'half',
          options: [],
        }),
        buildSelectField({
          id: 'companyInformation.industryClassification',
          title: information.labels.company.industryClassification,
          width: 'half',
          options: [],
        }),
        buildSelectField({
          id: 'companyInformation.numberOfEmployees',
          title: information.labels.company.numberOfEmployees,
          width: 'half',
          required: true,
          options: (application) => {
            const sizeOfEnterprises = getValueViaPath(
              application.externalData,
              'aoshData.data.sizeOfEnterprises',
              [],
            ) as SizeOfEnterprise[]

            return sizeOfEnterprises.map(({ Code, LabelIs, LabelEn }) => ({
              value: Code.toString(),
              label: LabelIs,
            }))
          },
        }),
        buildDescriptionField({
          id: 'companyInformation.ohasw',
          title: information.labels.company.ohasw,
          titleVariant: 'h5',
          marginTop: 3,
        }),
        buildAlertMessageField({
          id: 'companyLaborProtection.alertField',
          alertType: 'info',
          title: '',
          message: information.labels.laborProtection.alertMessageText,
        }),
        buildCheckboxField({
          // TODO Most likely needs to be a custom component to allow 'Engin' option to have special condition
          id: 'companyLaborProtection.checkboxField',
          title: '',
          required: true,
          options: (application) => {
            const workplaceHealthAndSafeties = getValueViaPath(
              application.externalData,
              'aoshData.data.workplaceHealthAndSafety',
            ) as WorkplaceHealthAndSafety[]

            return [...workplaceHealthAndSafeties] // shallow copy
              .sort((a, b) => a.Röð - b.Röð)
              .map(({ Heiti, Vinnuver }) => ({
                value: Vinnuver.toString(),
                label: Heiti,
              }))
          },
        }),
      ],
    }),
  ],
})
