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
import { ApiActions } from '../shared'
import { m } from '../lib/messages'

export const CriminalRecordForm: Form = buildForm({
  id: 'ExampleFormDraft',
  title: 'Atvinnuleysisbætur',
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
      ],
    }),
    buildSection({
      id: 'awaitingPayment',
      title: m.paymentCapital,
      children: [
        // TODO: ekki tókst að stofna til greiðslu skjár - condition
        buildDescriptionField({
          id: 'infoAwaitingPayment',
          title: m.paymentCapital,
          condition: () => {
            return !window.document.location.href.match(/\?done$/)
          },
          description: (application) => {
            const { paymentUrl } = application.externalData.createCharge
              .data as { paymentUrl: string }

            if (!paymentUrl) {
              throw new Error()
            }

            const returnUrl = window.document.location.href
            const redirectUrl = `${paymentUrl}&returnURL=${encodeURIComponent(
              returnUrl + '?done',
            )}`
            window.document.location.href = redirectUrl

            return m.forwardingToPayment
          },
        }),
        buildMultiField({
          condition: () => {
            return !!window.document.location.href.match(/\?done$/)
          },
          id: 'overviewAwaitingPayment',
          title: '',
          space: 1,
          description: '',
          children: [
            buildCustomField({
              component: 'ExamplePaymentPendingField',
              id: 'paymentPendingField',
              title: '',
            }),
          ],
        }),
      ],
    }),
  ],
})
