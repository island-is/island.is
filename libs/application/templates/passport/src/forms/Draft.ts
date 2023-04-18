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
} from '@island.is/application/core'
import {
  Application,
  DefaultEvents,
  Form,
  FormModes,
  NationalRegistryUserApi,
  UserProfileApi,
  YES,
} from '@island.is/application/types'
import {
  DeliveryAddressApi,
  IdentityDocumentApi,
  SyslumadurPaymentCatalogApi,
} from '../dataProviders'
import {
  DistrictCommissionerAgencies,
  Passport,
  PersonalInfo,
  Services,
} from '../lib/constants'
import { m } from '../lib/messages'
import { childsPersonalInfo } from './infoSection/childsPersonalInfo'
import { personalInfo } from './infoSection/personalInfo'
import { childsOverview } from './overviewSection/childsOverview'
import { personalOverview } from './overviewSection/personalOverview'

export const Draft: Form = buildForm({
  id: 'PassportApplicationDraftForm',
  title: m.formName,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'introSection',
      title: m.introTitle,
      children: [
        buildMultiField({
          id: 'introApplicant',
          title: m.passport,
          description: m.introDescription,
          children: [
            buildDescriptionField({
              id: 'introDescription',
              title: '',
              description: '',
            }),
          ],
        }),
      ],
    }),

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
              provider: NationalRegistryUserApi,
              title: m.dataCollectionNationalRegistryTitle,
              subTitle: m.dataCollectionNationalRegistrySubtitle,
            }),
            buildDataProviderItem({
              provider: UserProfileApi,
              title: m.dataCollectionUserProfileTitle,
              subTitle: m.dataCollectionUserProfileSubtitle,
            }),
            buildDataProviderItem({
              provider: IdentityDocumentApi,
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
              options: (application: Application) => {
                const withDiscount =
                  ((application.answers.passport as Passport)?.userPassport !==
                    '' &&
                    (application.answers
                      .personalInfo as PersonalInfo)?.hasDisabilityDiscount.includes(
                      YES,
                    )) ||
                  (application.answers.passport as Passport)?.childPassport !==
                    ''
                return [
                  {
                    value: Services.REGULAR,
                    label:
                      m.serviceTypeRegular.defaultMessage +
                      ' - ' +
                      (withDiscount === true
                        ? m.serviceTypeRegularPriceWithDiscount.defaultMessage
                        : m.serviceTypeRegularPrice.defaultMessage),
                    subLabel: m.serviceTypeRegularSublabel.defaultMessage,
                  },
                  {
                    value: Services.EXPRESS,
                    label:
                      m.serviceTypeExpress.defaultMessage +
                      ' - ' +
                      (withDiscount === true
                        ? m.serviceTypeExpressPriceWithDiscount.defaultMessage
                        : m.serviceTypeExpressPrice.defaultMessage),
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
