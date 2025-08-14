import {
  buildMultiField,
  buildTextField,
  buildSubSection,
  buildDescriptionField,
  getValueViaPath,
  buildDateField,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { Application } from '@island.is/api/schema'
import { Routes } from '../../../lib/constants'
import {
  ExternalData,
  NationalRegistrySpouseV3,
} from '@island.is/application/types'

export const MaritalStatusSubSection = buildSubSection({
  id: Routes.MARITALSTATUS,
  title: information.labels.maritalStatus.subSectionTitle,
  condition: (_, externalData) => {
    const spouseDetails = getValueViaPath(
      externalData,
      'spouseDetails.data',
      undefined,
    ) as NationalRegistrySpouseV3 | undefined

    const hasSpouse = !!spouseDetails?.nationalId

    return hasSpouse
  },
  children: [
    buildMultiField({
      id: Routes.MARITALSTATUS,
      title: information.labels.maritalStatus.pageTitle,
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
          defaultValue: (application: Application) => {
            const spouseInformation = getValueViaPath<NationalRegistrySpouseV3>(
              application.externalData,
              'spouseDetails.data',
              undefined,
            )

            return spouseInformation?.maritalDescription
          },
        }),
        buildDateField({
          id: 'maritalStatus.dateOfMaritalStatusStr',
          title: information.labels.maritalStatus.marriedStatusDate,
          width: 'half',
          readOnly: (_, externalData: ExternalData) => {
            const spouseDetails = getValueViaPath<NationalRegistrySpouseV3>(
              externalData,
              'spouseDetails.data',
              undefined,
            )
            return spouseDetails?.lastModified ? true : false
          },
          defaultValue: (application: Application) => {
            const spouseDetails = getValueViaPath<NationalRegistrySpouseV3>(
              application.externalData,
              'spouseDetails.data',
              undefined,
            )

            return spouseDetails?.lastModified ? spouseDetails.lastModified : ''
          },
        }),
        buildTextField({
          id: 'maritalStatus.nationalId',
          title: information.labels.maritalStatus.nationalId,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          format: '######-####',
          required: true,
          defaultValue: (application: Application) => {
            const spouseDetails = getValueViaPath<NationalRegistrySpouseV3>(
              application.externalData,
              'spouseDetails.data',
              undefined,
            )

            return spouseDetails?.nationalId
          },
        }),
        buildTextField({
          id: 'maritalStatus.name',
          title: information.labels.maritalStatus.name,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            const spouseDetails = getValueViaPath<NationalRegistrySpouseV3>(
              application.externalData,
              'spouseDetails.data',
              undefined,
            )

            return spouseDetails?.name
          },
        }),
        buildTextField({
          id: 'maritalStatus.citizenship',
          title: information.labels.maritalStatus.spouseCitizenship,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            const spouseDetails = getValueViaPath<NationalRegistrySpouseV3>(
              application.externalData,
              'spouseDetails.data',
              undefined,
            )

            return spouseDetails?.citizenship?.name
              ? spouseDetails?.citizenship?.name
              : ''
          },
        }),
      ],
    }),
  ],
})
