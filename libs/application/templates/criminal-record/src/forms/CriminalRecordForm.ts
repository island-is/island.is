import {
  buildCheckboxField,
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSubmitField,
  buildSubSection,
  buildTextField,
  Comparators,
  Form,
  FormModes,
  FormValue,
  buildFileUploadField,
  buildExternalDataProvider,
  buildDataProviderItem,
  buildCustomField,
} from '@island.is/application/core'
import { UserProfile } from '../types/schema'
import { m } from '../lib/messages'

export const CriminalRecordForm: Form = buildForm({
  id: 'CriminalRecordFormDraft',
  title: '',
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'externalData',
      title: m.externalDataSection,
      children: [
        buildExternalDataProvider({
          title: m.externalDataTitle,
          id: 'approveExternalData',
          subTitle: m.externalDataSubTitle,
          checkboxLabel: m.externalDataAgreement,
          dataProviders: [
            buildDataProviderItem({
              id: 'nationalRegistry',
              type: 'NationalRegistryProvider',
              title: m.nationalRegistryTitle,
              subTitle: m.nationalRegistrySubTitle,
            }),
            buildDataProviderItem({
              id: 'userProfile',
              type: 'UserProfileProvider',
              title: m.userProfileInformationTitle,
              subTitle: m.userProfileInformationSubTitle,
            }),
            // buildDataProviderItem({
            //   id: 'currentLicense',
            //   type: 'CurrentLicenseProvider',
            //   title: m.infoFromLicenseRegistry,
            //   subTitle: m.confirmationStatusOfEligability,
            // }),
            // buildDataProviderItem({
            //   id: 'juristictions',
            //   type: 'JuristictionProvider',
            //   title: '',
            // }),
            buildDataProviderItem({
              id: 'payment',
              type: 'FeeInfoProvider',
              title: '',
            }),
          ],
        }),
        buildSubmitField({
          id: 'toDraft',
          title: 'externalData.submit',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: 'SUBMIT',
              name: 'staðfesta',
              type: 'primary',
            },
          ],
        }),
      ],
    }),
    buildSection({
      id: 'payment',
      title: m.payment,
      children: [],
    }),
    buildSection({
      id: 'confirmation',
      title: m.confirmation,
      children: [],
    }),
  ],
})
