import {
  buildCustomField,
  buildDataProviderItem,
  buildDescriptionField,
  buildExternalDataProvider,
  buildForm,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSelectField,
  buildSubmitField,
  getValueViaPath,
} from '@island.is/application/core'
import {
  Application,
  DefaultEvents,
  Form,
  FormModes,
  PassportsApi,
} from '@island.is/application/types'
import {
  DeliveryAddressApi,
  SyslumadurPaymentCatalogApi,
  UserInfoApi,
  NationalRegistryUser,
} from '../dataProviders'
import {
  DistrictCommissionerAgencies,
  Passport,
  Services,
} from '../lib/constants'
import { m } from '../lib/messages'
import { childsPersonalInfo } from './infoSection/childsPersonalInfo'
import { personalInfo } from './infoSection/personalInfo'
import { childsOverview } from './overviewSection/childsOverview'
import { personalOverview } from './overviewSection/personalOverview'
import {
  getChargeCode,
  getPrice,
  hasSecondGuardian,
  needAssignment,
} from '../lib/utils'

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
              provider: DeliveryAddressApi,
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
              title: '',
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
      title: m.serviceTitle,
      children: [
        buildMultiField({
          id: 'service',
          title: m.serviceTitle,
          children: [
            buildDescriptionField({
              id: 'service.dropTypeDescription',
              title: m.serviceTypeTitle,
              titleVariant: 'h3',
              description: m.serviceTypeDescription,
            }),
            buildRadioField({
              id: 'service.type',
              title: '',
              width: 'half',
              space: 'none',
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
            buildDescriptionField({
              id: 'service.dropLocationDescription',
              title: m.dropLocation,
              titleVariant: 'h3',
              space: 2,
              description: m.dropLocationDescription,
              marginBottom: 'gutter',
            }),
            buildSelectField({
              id: 'service.dropLocation',
              title: m.dropLocation,
              placeholder: m.dropLocationPlaceholder.defaultMessage,
              options: ({
                externalData: {
                  deliveryAddress: { data },
                },
              }) => {
                return (data as DistrictCommissionerAgencies[])?.map(
                  ({ key, name }) => ({
                    value: key,
                    label: name,
                  }),
                )
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
              title: '',
              component: 'PaymentCharge',
              doesNotRequireAnswer: true,
            }),
            buildSubmitField({
              id: 'payment',
              placement: 'footer',
              title: '',
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
