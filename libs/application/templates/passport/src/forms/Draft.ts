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
  MockProviderApi,
  NationalRegistryUserApi,
  PaymentCatalogApi,
  UserProfileApi,
  DistrictsApi,
} from '@island.is/application/types'
import {
  DistrictCommissionerAgencies,
  Passport,
  Services,
  YES,
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
          id: 'intro',
          title: m.introSectionTitle,
          description: m.introSectionDescription,
          children: [
            buildCustomField({
              id: 'introInfo',
              title: '',
              component: 'IntroInfo',
              doesNotRequireAnswer: true,
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
          title: m.formName,
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
              provider: MockProviderApi,
              title: m.dataCollectionIdentityDocumentTitle,
              subTitle: m.dataCollectionIdentityDocumentSubtitle,
            }),
            buildDataProviderItem({
              provider: PaymentCatalogApi,
              title: '',
            }),
            buildDataProviderItem({
              provider: DistrictsApi,
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
                      .personalInfo as any)?.hasDisabilityDiscount.includes(
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
                  districtCommissioners: { data },
                },
              }) => {
                return (data as DistrictCommissionerAgencies[])?.map(
                  ({ id, name, place, address }) => ({
                    value: id,
                    label: `${name}, ${place}`,
                    tooltip: `${address}`,
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
