import {
  buildForm,
  buildSection,
  buildExternalDataProvider,
  buildDataProviderItem,
  buildCustomField,
  buildSubmitField,
  buildSubSection,
  buildMultiField,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messagesx'
import { payment } from '../lib/messages'

export const DigitalTachographDriversCardForm: Form = buildForm({
  id: 'DigitalTachographDriversCardFormDraft',
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
            buildDataProviderItem({
              id: 'payment',
              type: 'PaymentChargeInfoProvider',
              title: '',
            }),
            buildDataProviderItem({
              id: 'drivingLicense',
              type: 'DrivingLicenseProvider',
              title: m.drivingLicenseProviderTitle,
              subTitle: m.drivingLicenseProviderSubTitle,
            }),
            buildDataProviderItem({
              id: 'qualityPhoto',
              type: 'QualityPhotoProvider',
              title: '',
              subTitle: '',
            }),
            buildDataProviderItem({
              id: 'qualitySignature',
              type: 'QualitySignatureProvider',
              title: '',
              subTitle: '',
            }),
            buildDataProviderItem({
              id: 'nationalRegistryBirthplace',
              type: 'NationalRegistryBirthplaceProvider',
              title: '',
              subTitle: '',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'payment',
      title: payment.general.sectionTitle,
      children: [
        buildMultiField({
          id: 'paymentMultiField',
          title: payment.general.pageTitle,
          space: 1,
          children: [
            buildCustomField({
              id: 'PaymentChargeOverview',
              title: '',
              component: 'PaymentChargeOverview',
            }),
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              title: m.confirm,
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: m.confirm,
                  type: 'primary',
                },
                //TODOx remove:
                {
                  event: DefaultEvents.ABORT,
                  name: 'Staðfesta án greiðslu',
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'confirmation',
      title: m.confirmation,
      children: [
        buildCustomField({
          component: 'ConfirmationField',
          id: 'ConfirmationField',
          title: '',
          description: '',
        }),
      ],
    }),
  ],
})
