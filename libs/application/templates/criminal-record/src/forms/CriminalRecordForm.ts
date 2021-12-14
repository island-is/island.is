import {
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  Form,
  FormModes,
  buildExternalDataProvider,
  buildDataProviderItem,
  buildCustomField,
  DefaultEvents,
} from '@island.is/application/core'
import { m } from '../lib/messages'
import { ApiActions } from '../shared'

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
            buildDataProviderItem({
              id: 'criminalRecord',
              type: 'CriminalRecordProvider',
              title: m.criminalRecordInformationTitle,
              subTitle: m.criminalRecordInformationSubTitle,
            }),
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
      id: 'payment',
      title: m.payment,
      children: [
        buildMultiField({
          id: 'payment.info',
          title: m.payment,
          space: 1,
          children: [
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
              ],
            }),
            buildCustomField({
              id: 'payment.over',
              title: '',
              component: 'OverviewPaymentCharge',
            }),
          ],
        }),
        buildDescriptionField({
          id: 'final',
          title: 'Takk',
          description: () => {
            return {
              ...m.outroMessage,
            }
          },
        }),
      ],
    }),
    buildSection({
      id: 'confirmation',
      title: m.confirmation,
      children: [],
    }),
  ],
})
