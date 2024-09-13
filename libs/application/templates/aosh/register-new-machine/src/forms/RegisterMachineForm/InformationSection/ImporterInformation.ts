import {
  buildMultiField,
  buildTextField,
  buildSubSection,
  buildPhoneField,
  getValueViaPath,
  buildSelectField,
  buildCustomField,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { Application } from '@island.is/api/schema'
import { postalCodes } from '@island.is/shared/utils'

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
          id: 'importerInformation.importer.name',
          title: information.labels.importer.name,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          maxLength: 100,
          defaultValue: (application: Application) =>
            getValueViaPath(
              application.externalData,
              'identity.data.name',
              '',
            ) as string,
        }),
        buildTextField({
          id: 'importerInformation.importer.nationalId',
          title: information.labels.importer.nationalId,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          format: '######-####',
          defaultValue: (application: Application) =>
            getValueViaPath(
              application.externalData,
              'identity.data.nationalId',
              '',
            ) as string,
        }),
        buildTextField({
          id: 'importerInformation.importer.address',
          title: information.labels.importer.address,
          width: 'half',
          required: true,
          maxLength: 50,
          defaultValue: (application: Application) =>
            getValueViaPath(
              application.externalData,
              'identity.data.address.streetAddress',
              '',
            ) as string,
        }),
        buildSelectField({
          id: 'importerInformation.importer.postCode',
          title: information.labels.importer.postCode,
          width: 'half',
          required: true,
          options: () => {
            return postalCodes.map((code) => {
              return { value: `${code}`, label: `${code}` }
            })
          },
          defaultValue: (application: Application) =>
            getValueViaPath(
              application.externalData,
              'identity.data.address.postalCode',
              '',
            ) as string,
        }),
        buildPhoneField({
          id: 'importerInformation.importer.phone',
          title: information.labels.importer.phone,
          width: 'half',
          required: true,
          defaultValue: (application: Application) =>
            getValueViaPath(
              application.externalData,
              'userProfile.data.mobilePhoneNumber',
              '',
            ) as string,
        }),
        buildTextField({
          id: 'importerInformation.importer.email',
          title: information.labels.importer.email,
          width: 'half',
          variant: 'email',
          maxLength: 250,
          required: true,
          defaultValue: (application: Application) =>
            getValueViaPath(
              application.externalData,
              'userProfile.data.email',
              '',
            ) as string,
        }),
        buildCustomField(
          {
            id: 'importerInformation.custom',
            title: '',
            component: 'ChangeAnswers',
          },
          {
            sectionName: 'ownerInformation',
            questionName: 'isOwnerOtherThanImporter',
            person: 'owner',
          },
        ),
        buildCustomField(
          {
            id: 'importerInformation.custom2',
            title: '',
            component: 'ChangeAnswers',
          },
          {
            sectionName: 'operatorInformation',
            questionName: 'hasOperator',
            person: 'operator',
          },
        ),
      ],
    }),
  ],
})
