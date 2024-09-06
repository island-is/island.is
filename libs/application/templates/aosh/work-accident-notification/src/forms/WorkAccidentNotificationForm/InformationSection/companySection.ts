import {
  buildAlertMessageField,
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

export const companySection = buildSubSection({
  id: 'company',
  title: information.labels.company.sectionTitle,
  children: [
    buildMultiField({
      id: 'companyInformation',
      title: information.general.pageTitle,
      description: information.general.description,
      children: [
        buildDescriptionField({
          id: 'companyInformation.description',
          title: information.labels.company.descriptionField,
          titleVariant: 'h5',
        }),
        buildTextField({
          id: 'companyInformation.nationalId',
          title: information.labels.company.nationalId,
          backgroundColor: 'white',
          width: 'half',
          format: '######-####',
          readOnly: true,
          defaultValue: (application: Application) => {
            const nationalId = getValueViaPath(
              application.externalData,
              'identity.data.nationalId',
              undefined,
            ) as string | undefined

            return nationalId
          },
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
        buildAlertMessageField({
          id: 'company.alertMessageField',
          title: '',
          message: information.labels.company.alertMessage,
          alertType: 'info',
        }),
        buildTextField({
          id: 'companyInformation.nameOfbranch',
          title: information.labels.company.nameOfbranch,
          backgroundColor: 'blue',
          width: 'half',
          defaultValue: (application: Application) => '',
        }),
        buildTextField({
          id: 'companyInformation.addressOfBranch',
          title: information.labels.company.addressOfbranch,
          backgroundColor: 'blue',
          width: 'half',
          defaultValue: (application: Application) => '',
        }),
        buildSelectField({
          id: 'companyInformation.postnumberOfBranch',
          title: information.labels.company.postNumberAndTown,
          width: 'half',
          options: [],
        }),
      ],
    }),
  ],
})
