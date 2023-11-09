import {
  buildDataProviderItem,
  buildDescriptionField,
  buildDividerField,
  buildExternalDataProvider,
  buildForm,
  buildMultiField,
  buildPhoneField,
  buildSection,
  buildTextField,
} from '@island.is/application/core'
import {
  Form,
  FormModes,
  NationalRegistryUserApi,
  UserProfileApi,
} from '@island.is/application/types'
import { Application, UserProfile } from '@island.is/api/schema'
import { format as formatNationalId } from 'kennitala'

import { m } from '../lib/messages'

export const Draft: Form = buildForm({
  id: 'SignatureListCreationDraft',
  title: m.applicationName,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'externalDataSection',
      title: m.dataCollection,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: m.dataCollection,
          subTitle: m.dataCollectionSubtitle,
          checkboxLabel: m.dataCollectionCheckbox,
          dataProviders: [
            buildDataProviderItem({
              provider: NationalRegistryUserApi,
              title: m.nationalRegistryProviderTitle,
              subTitle: m.nationalRegistryProviderSubtitle,
            }),
            buildDataProviderItem({
              provider: UserProfileApi,
              title: m.userProfileProviderTitle,
              subTitle: m.userProfileProviderSubtitle,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'listInformationSection',
      title: m.information,
      children: [
        buildMultiField({
          id: 'listInformation',
          title: m.listInformationSection,
          description: m.listInformationDescription,
          children: [
            buildDescriptionField({
              id: 'applicantHeader',
              title: m.applicantHeader,
              titleVariant: 'h3',
            }),
            buildTextField({
              id: 'applicant.name',
              title: m.name,
              width: 'full',
              readOnly: true,
              defaultValue: ({ externalData }: Application) => {
                return externalData.nationalRegistry?.data.fullName
              },
            }),
            buildTextField({
              id: 'applicant.nationalId',
              title: m.nationalId,
              width: 'full',
              readOnly: true,
              defaultValue: (application: Application) =>
                formatNationalId(application.applicant),
            }),
            buildPhoneField({
              id: 'applicant.phone',
              title: m.phone,
              width: 'half',
              required: true,
              disableDropdown: true,
              allowedCountryCodes: ['IS'],
              defaultValue: (application: Application) => {
                const phone =
                  (
                    application.externalData.userProfile?.data as {
                      mobilePhoneNumber?: string
                    }
                  )?.mobilePhoneNumber ?? ''

                return phone
              },
            }),
            buildTextField({
              id: 'applicant.email',
              title: m.email,
              width: 'half',
              required: true,
              defaultValue: ({ externalData }: Application) => {
                const data = externalData.userProfile?.data as UserProfile
                return data?.email
              },
            }),
            buildDescriptionField({
              id: 'collectionHeader',
              title: m.collectionHeader,
              titleVariant: 'h3',
              space: 'containerGutter',
            }),
            buildTextField({
              id: 'collection.dateFrom',
              title: m.collectionDateFrom,
              width: 'half',
              readOnly: true,
              defaultValue: '19.03.2023',
            }),
            buildTextField({
              id: 'collection.dateTil',
              title: m.collectionDateTil,
              width: 'half',
              readOnly: true,
              defaultValue: '19.05.2023',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'overview',
      title: m.overview,
      children: [
        buildDividerField({})
      ]
    }), 
  ],
})
