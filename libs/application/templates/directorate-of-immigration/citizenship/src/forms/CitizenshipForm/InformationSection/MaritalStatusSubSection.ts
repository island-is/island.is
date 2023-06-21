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
import { ExternalData } from '../../../types'

export const MaritalStatusSubSection = buildSubSection({
  id: 'maritalStatus',
  title: information.labels.maritalStatus.subSectionTitle,
  children: [
    buildMultiField({
      id: 'maritalStatusMultiField',
      title: information.labels.maritalStatus.pageTitle,
      condition: (answer: Answer) => {
        const answers = answer as Citizenship
        if (
          answers.residenceCondition?.radio === 'marriedToIcelander' ||
          answers.residenceCondition?.radio === 'cohabitWithIcelander'
        ) {
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
          defaultValue: (application: Application) =>
            application.externalData?.spouseDetails?.data?.maritalTitle
              ?.description,
        }),
        buildTextField({
          id: 'maritalStatus.dateOfMarritalStatus',
          title: information.labels.maritalStatus.marritalStatusDate,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => 'date here',
        }),
        buildTextField({
          id: 'maritalStatus.nationalId',
          title: information.labels.maritalStatus.nationalId,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          format: '######-####',
          required: true,
          defaultValue: (application: Application) =>
            application.externalData?.spouseDetails?.data?.nationalId,
        }),
        buildTextField({
          id: 'maritalStatus.name',
          title: information.labels.maritalStatus.name,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) =>
            application.externalData?.spouseDetails?.data?.name,
        }),
        buildTextField({
          id: 'maritalStatus.birthCountry',
          title: information.labels.maritalStatus.spouseBirthCountry,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) =>
            'Spouse Birth country here',
        }),
        buildTextField({
          id: 'maritalStatus.citizenship',
          title: information.labels.maritalStatus.spouseCitizenship,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            console.log('application', application)
            return application.externalData?.spouseDetails?.data?.spouse
              ?.citizenship?.name
          },
        }),
        buildTextField({
          id: 'maritalStatus.applicantAddress',
          title: information.labels.maritalStatus.applicantAddress,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) =>
            `${application.externalData?.individual?.data?.address?.streetAddress}, ${application.externalData?.individual?.data?.address?.postalCode} ${application.externalData?.individual?.data?.address?.city}`,
          condition: (_, externalData: any) => {
            const externalCustomData = externalData as ExternalData
            const myAddressCombination = `${externalCustomData.individual?.data?.address?.streetAddress}, ${externalCustomData.individual?.data?.address?.postalCode} ${externalCustomData.individual?.data?.address?.city}`
            const mySpouseAddressCombination = `${externalCustomData.spouseDetails?.data?.spouse?.address?.streetAddress}, ${externalCustomData.spouseDetails?.data?.spouse?.address?.postalCode} ${externalCustomData.spouseDetails?.data?.spouse?.address?.city}`
            return myAddressCombination !== mySpouseAddressCombination
          },
        }),
        buildTextField({
          id: 'maritalStatus.spouseAddress',
          title: information.labels.maritalStatus.spouseAddress,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) =>
            `${application.externalData?.spouseDetails?.data?.spouse?.address?.streetAddress}, ${application.externalData?.spouseDetails?.data?.spouse?.address?.postalCode} ${application.externalData?.spouseDetails?.data?.spouse?.address?.city}`,
          condition: (_, externalData: any) => {
            const externalCustomData = externalData as ExternalData
            const myAddressCombination = `${externalCustomData.individual?.data?.address?.streetAddress}, ${externalCustomData.individual?.data?.address?.postalCode} ${externalCustomData.individual?.data?.address?.city}`
            const mySpouseAddressCombination = `${externalCustomData.spouseDetails?.data?.spouse?.address?.streetAddress}, ${externalCustomData.spouseDetails?.data?.spouse?.address?.postalCode} ${externalCustomData.spouseDetails?.data?.spouse?.address?.city}`
            return myAddressCombination !== mySpouseAddressCombination
          },
        }),
        buildDescriptionField({
          id: 'maritalStatus.explanationTitle',
          title: information.labels.maritalStatus.explanationTitle,
          titleVariant: 'h5',
          space: 'gutter',
          condition: (_, externalData: any) => {
            const externalCustomData = externalData as ExternalData
            const myAddressCombination = `${externalCustomData.individual?.data?.address?.streetAddress}, ${externalCustomData.individual?.data?.address?.postalCode} ${externalCustomData.individual?.data?.address?.city}`
            const mySpouseAddressCombination = `${externalCustomData.spouseDetails?.data?.spouse?.address?.streetAddress}, ${externalCustomData.spouseDetails?.data?.spouse?.address?.postalCode} ${externalCustomData.spouseDetails?.data?.spouse?.address?.city}`
            return myAddressCombination !== mySpouseAddressCombination
          },
        }),
        buildTextField({
          id: 'maritalStatus.explanation',
          title: information.labels.maritalStatus.explanation,
          backgroundColor: 'blue',
          width: 'full',
          variant: 'textarea',
          condition: (_, externalData: any) => {
            const externalCustomData = externalData as ExternalData
            const myAddressCombination = `${externalCustomData.individual?.data?.address?.streetAddress}, ${externalCustomData.individual?.data?.address?.postalCode} ${externalCustomData.individual?.data?.address?.city}`
            const mySpouseAddressCombination = `${externalCustomData.spouseDetails?.data?.spouse?.address?.streetAddress}, ${externalCustomData.spouseDetails?.data?.spouse?.address?.postalCode} ${externalCustomData.spouseDetails?.data?.spouse?.address?.city}`
            return myAddressCombination !== mySpouseAddressCombination
          },
        }),
      ],
    }),
  ],
})
