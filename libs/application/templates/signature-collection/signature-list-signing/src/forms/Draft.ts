import {
  buildDataProviderItem,
  buildDescriptionField,
  buildExternalDataProvider,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
  buildTextField,
} from '@island.is/application/core'
import {
  Form,
  FormModes,
  NationalRegistryUserApi,
  UserProfileApi,
} from '@island.is/application/types'

import { m } from '../lib/messages'
import { Application } from '@island.is/api/schema'
import { format as formatNationalId } from 'kennitala'

export const Draft: Form = buildForm({
  id: 'SignListDraft',
  title: m.applicationName,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'intro',
      title: m.intoTitle,
      children: [
        buildMultiField({
          id: 'intro',
          title: m.intoTitle,
          description: m.introDescription,
          children: [
            buildDescriptionField({
              id: 'introText',
              title: '',
            }),
          ],
        }),
      ],
    }),
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
      id: 'signeeInfo',
      title: m.information,
      children: [
        buildMultiField({
          id: 'signeeInfo',
          title: m.listName,
          description: m.listDescription,
          children: [
            buildDescriptionField({
              id: 'signeeInfoHeader',
              title: m.signeeInformationHeader,
              titleVariant: 'h3',
            }),
            buildTextField({
              id: 'applicant.name',
              title: m.name,
              width: 'full',
              readOnly: true,
              defaultValue: ({ externalData }: Application) =>
                externalData.nationalRegistry?.data.fullName,
            }),
            buildTextField({
              id: 'applicant.nationalId',
              title: m.nationalId,
              width: 'full',
              readOnly: true,
              defaultValue: (application: Application) =>
                formatNationalId(application.applicant),
            }),
            buildTextField({
              id: 'applicant.area',
              title: m.countryArea,
              width: 'half',
              readOnly: true,
              defaultValue: 'Sunnlendingafjórðungur',
            }),
            buildTextField({
              id: 'applicant.address',
              title: m.countryArea,
              width: 'half',
              readOnly: true,
              defaultValue: ({ externalData }: Application) =>
                externalData.nationalRegistry?.data.address?.streetAddress,
            }),
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              title: m.signList,
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: 'SUBMIT',
                  name: m.signList,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})
