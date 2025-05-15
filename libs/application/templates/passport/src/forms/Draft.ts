import {
  buildCustomField,
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import {
  Application,
  DefaultEvents,
  Form,
  FormModes,
  MockablePaymentCatalogApi,
  PassportsApi,
} from '@island.is/application/types'
import {
  UserInfoApi,
  NationalRegistryUser,
  SyslumadurPaymentCatalogApi,
} from '../dataProviders'
import { Services } from '../lib/constants'
import { m } from '../lib/messages'
import { childsPersonalInfo } from './infoSection/childsPersonalInfo'
import { personalInfo } from './infoSection/personalInfo'
import { childsOverview } from './overviewSection/childsOverview'
import { personalOverview } from './overviewSection/personalOverview'
import { getChargeCode, getPrice } from '../lib/utils'

export const Draft: Form = buildForm({
  id: 'PassportApplicationDraftForm',
  title: m.formName,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'externalDataSection',
      title: m.dataCollectionTitle,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: m.dataCollectionTitle,
          subTitle: m.dataCollectionSubtitle,
          checkboxLabel: m.dataCollectionCheckboxLabel,
          dataProviders: [
            buildDataProviderItem({
              provider: NationalRegistryUser,
              title: m.dataCollectionNationalRegistryTitle,
              subTitle: m.dataCollectionNationalRegistrySubtitle,
            }),
            buildDataProviderItem({
              provider: UserInfoApi,
              title: m.dataCollectionUserProfileTitle,
              subTitle: m.dataCollectionUserProfileSubtitle,
            }),
            buildDataProviderItem({
              provider: PassportsApi,
              title: m.dataCollectionIdentityDocumentTitle,
              subTitle: m.dataCollectionIdentityDocumentSubtitle,
            }),
            buildDataProviderItem({
              provider: SyslumadurPaymentCatalogApi,
              title: '',
            }),
            buildDataProviderItem({
              provider: MockablePaymentCatalogApi.configure({
                externalDataId: 'payment',
              }),
              title: '',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'passportSection',
      title: m.selectPassportSectionTitle,
      children: [
        buildMultiField({
          id: 'selectPassport',
          title: m.selectPassportSectionTitle,
          description: m.selectPassportSectionDescription,
          children: [
            buildCustomField({
              id: 'passport',
              component: 'PassportSelection',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'personalInfoSection',
      title: m.infoTitle,
      children: [personalInfo, childsPersonalInfo],
    }),
    buildSection({
      id: 'serviceSection',
      title: m.serviceTypeTitle,
      children: [
        buildMultiField({
          id: 'service',
          title: m.serviceTypeTitle,
          description: m.serviceTypeDescription,
          children: [
            buildRadioField({
              id: 'service.type',
              width: 'half',
              options: ({ answers, externalData }: Application) => {
                const regularCode = getChargeCode(
                  answers,
                  externalData,
                  Services.REGULAR,
                )
                const regularPrices = getPrice(externalData, regularCode)
                const expressCode = getChargeCode(
                  answers,
                  externalData,
                  Services.EXPRESS,
                )
                const expressPrices = getPrice(externalData, expressCode)

                return [
                  {
                    value: Services.REGULAR,
                    label:
                      m.serviceTypeRegular.defaultMessage +
                      ' - ' +
                      regularPrices,
                    subLabel: m.serviceTypeRegularSublabel.defaultMessage,
                  },
                  {
                    value: Services.EXPRESS,
                    label:
                      m.serviceTypeExpress.defaultMessage +
                      ' - ' +
                      expressPrices,
                    subLabel: m.serviceTypeExpressSublabel.defaultMessage,
                  },
                ]
              },
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'overviewSection',
      title: m.overview,
      children: [personalOverview, childsOverview],
    }),
    buildSection({
      id: 'payment',
      title: m.paymentSection,
      children: [
        buildMultiField({
          id: 'payment',
          title: m.paymentSectionTitle,
          children: [
            buildCustomField({
              id: 'paymentCharge',
              component: 'PaymentCharge',
              doesNotRequireAnswer: true,
            }),
            buildSubmitField({
              id: 'payment',
              placement: 'footer',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.PAYMENT,
                  name: m.proceedToPayment,
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
