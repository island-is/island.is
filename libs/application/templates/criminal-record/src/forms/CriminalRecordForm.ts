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
  DefaultEvents,
  StaticText,
  buildDividerField,
  buildKeyValueField,
} from '@island.is/application/core'
import { NationalRegistryUser, UserProfile } from '../types/schema'
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
              id: 'payment',
              type: 'FeeInfoProvider',
              title: '',
            }),
            buildDataProviderItem({
              id: 'criminalRecord',
              type: 'CriminalRecordProvider',
              title: m.criminalRecordInformationTitle,
              subTitle: m.criminalRecordInformationSubTitle,
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
          title: 'Greiðsla',
          space: 1,
          children: [
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              title: 'Áfram',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Áfram',
                  type: 'primary',
                },
              ],
            }),
            buildKeyValueField({
              label: 'Nafn',
              value: ({ externalData: { nationalRegistry } }) =>
                (nationalRegistry.data as NationalRegistryUser).fullName,
            }),
            buildKeyValueField({
              label: m.overviewPaymentCharge,
              value: ({ externalData }) => {
                const item = externalData.payment.data as {
                  priceAmount: number
                  chargeItemName: string
                }

                return [
                  item?.chargeItemName,
                  (item?.priceAmount?.toLocaleString('de-DE') +
                    ' kr.') as StaticText,
                ]
              },
              width: 'half',
            }),
            buildKeyValueField({
              label: '',
              value: ({ externalData }) => {
                const item = externalData.payment.data as {
                  priceAmount: number
                  chargeItemCode: string
                }

                return (item?.priceAmount?.toLocaleString('de-DE') +
                  ' kr.') as StaticText
              },
              width: 'half',
            }),
            buildDividerField({
              title: '',
              color: 'dark400',
            }),
          ],
        }),
        buildDescriptionField({
          id: 'final',
          title: 'Takk',
          description: (application) => {
            const sendApplicationActionResult =
              application.externalData[ApiActions.createApplication]

            let id = 'unknown'
            if (sendApplicationActionResult) {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              id = sendApplicationActionResult.data.id
            }

            return {
              ...m.outroMessage,
              values: {
                id,
              },
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
