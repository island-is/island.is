import {
  buildMultiField,
  buildTextField,
  buildSubSection,
  //   buildDescriptionField,
  buildPhoneField,
  buildDescriptionField,
  buildRadioField,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { Application } from '@island.is/api/schema'
import { Answer, NO, YES } from '@island.is/application/types'
import { NewMachineAnswers } from '../../..'

export const ImporterInformationSubSection = buildSubSection({
  id: 'importerInformation',
  title: information.labels.importer.sectionTitle,
  children: [
    buildMultiField({
      id: 'importerInformationMultiField',
      title: information.labels.importer.title,
      description: information.labels.importer.description,
      children: [
        buildTextField({
          id: 'importerInformation.name',
          title: information.labels.importer.name,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) =>
            application.externalData?.identity?.data?.name,
        }),
        buildTextField({
          id: 'importerInformation.nationalId',
          title: information.labels.importer.nationalId,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          format: '######-####',
          defaultValue: (application: Application) =>
            application.externalData?.identity?.data?.nationalId,
        }),
        buildTextField({
          id: 'importerInformation.address',
          title: information.labels.importer.address,
          width: 'half',
          defaultValue: (application: Application) =>
            application.externalData?.identity?.data?.nationalId,
        }),
        buildTextField({
          id: 'importerInformation.postCode',
          title: information.labels.importer.postCode,
          width: 'half',
          defaultValue: (application: Application) =>
            application.externalData?.identity?.data?.nationalId,
        }),
        buildPhoneField({
          id: 'importerInformation.phone',
          title: information.labels.importer.phone,
          width: 'half',
          required: true,
          defaultValue: (application: Application) =>
            application.externalData?.userProfile?.data?.phone,
        }),
        buildTextField({
          id: 'importerInformation.email',
          title: information.labels.importer.email,
          width: 'half',
          variant: 'email',
          defaultValue: (application: Application) =>
            application.externalData?.userProfile?.data?.email,
        }),
        buildRadioField({
          id: 'importerInformation.isOwnerOtherThanImporter',
          title: information.labels.importer.isOwnerOtherThenImporter,
          width: 'half',
          space: 'gutter',
          options: [
            {
              value: YES,
              label: information.labels.radioButtons.radioOptionYes,
            },
            {
              value: NO,
              label: information.labels.radioButtons.radioOptionNo,
            },
          ],
        }),
        buildTextField({
          id: 'importerInformation.otherOwnerName',
          title: information.labels.otherOwner.name,
          condition: (answer: Answer) => {
            const answers = answer as NewMachineAnswers
            return (
              answers?.importerInformation.isOwnerOtherThanImporter &&
              answers?.importerInformation.isOwnerOtherThanImporter !== YES
            )
          },
        }),
        buildTextField({
          id: 'importerInformation.otherOwnerNationalId',
          title: information.labels.otherOwner.nationalId,
          condition: (answer: Answer) => {
            const answers = answer as NewMachineAnswers
            return (
              answers?.importerInformation.isOwnerOtherThanImporter &&
              answers?.importerInformation.isOwnerOtherThanImporter !== YES
            )
          },
        }),
        buildTextField({
          id: 'importerInformation.otherOwnerAddress',
          title: information.labels.otherOwner.address,
          condition: (answer: Answer) => {
            const answers = answer as NewMachineAnswers
            return (
              answers?.importerInformation.isOwnerOtherThanImporter &&
              answers?.importerInformation.isOwnerOtherThanImporter !== YES
            )
          },
        }),
        buildTextField({
          id: 'importerInformation.otherOwnerPostCode',
          title: information.labels.otherOwner.postCode,
          condition: (answer: Answer) => {
            const answers = answer as NewMachineAnswers
            return (
              answers?.importerInformation.isOwnerOtherThanImporter &&
              answers?.importerInformation.isOwnerOtherThanImporter !== YES
            )
          },
        }),
        buildTextField({
          id: 'importerInformation.otherOwnerPhoneNumber',
          title: information.labels.otherOwner.phone,
          condition: (answer: Answer) => {
            const answers = answer as NewMachineAnswers
            return (
              answers?.importerInformation.isOwnerOtherThanImporter &&
              answers?.importerInformation.isOwnerOtherThanImporter !== YES
            )
          },
        }),
        buildTextField({
          id: 'importerInformation.otherOwnerEmail',
          title: information.labels.otherOwner.email,
          condition: (answer: Answer) => {
            const answers = answer as NewMachineAnswers
            return (
              answers?.importerInformation.isOwnerOtherThanImporter &&
              answers?.importerInformation.isOwnerOtherThanImporter !== YES
            )
          },
        }),
      ],
    }),
  ],
})
