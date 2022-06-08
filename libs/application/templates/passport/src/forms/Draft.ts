import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSelectField,
  buildSubmitField,
  buildTextField,
  Form,
  FormModes,
  Application,
  buildCustomField,
  buildDividerField,
  buildKeyValueField,
  buildCheckboxField,
} from '@island.is/application/core'
import { m } from '../lib/messages'
import { format as formatKennitala } from 'kennitala'
import {
  Services,
  AUTH_TYPES,
  Service,
  DistrictCommissionerAgencies,
  YES,
} from '../lib/constants'
import { DefaultEvents } from '@island.is/application/core'
import { formatPhoneNumber } from '@island.is/application/ui-components'

export const Draft: Form = buildForm({
  id: 'PassportApplicationDraftForm',
  title: m.formName,
  mode: FormModes.APPLYING,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'externalData',
      title: m.dataCollectionTitle,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: m.formName,
          subTitle: m.dataCollectionSubtitle,
          checkboxLabel: m.dataCollectionCheckboxLabel,
          dataProviders: [
            buildDataProviderItem({
              id: 'districtCommissioners',
              type: 'DistrictsProvider',
              title: m.dataCollectionDistrictCommissionersTitle,
              subTitle: m.dataCollectionDistrictCommissionersSubitle,
            }),
            buildDataProviderItem({
              id: 'userProfile',
              type: 'UserProfileProvider',
              title: m.dataCollectionUserProfileTitle,
              subTitle: m.dataCollectionUserProfileSubtitle,
            }),
            buildDataProviderItem({
              id: 'nationalRegistry',
              type: 'NationalRegistryProvider',
              title: m.dataCollectionNationalRegistryTitle,
              subTitle: m.dataCollectionNationalRegistrySubtitle,
            }),
            buildDataProviderItem({
              id: 'identityDoucment',
              type: 'IdentityDocumentProvider',
              title: m.dataCollectionIdentityDocumentTitle,
              subTitle: m.dataCollectionIdentityDocumentSubtitle,
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
      id: 'personalInfo',
      title: m.infoTitle,
      children: [
        buildMultiField({
          id: 'personalInfo',
          title: m.infoTitle,
          description: m.personalInfoSubtitle,
          children: [
            buildTextField({
              id: 'personalInfo.name',
              title: m.infoTitle,
              backgroundColor: 'white',
              width: 'half',
              readOnly: true,
              defaultValue: (application: Application) =>
                (application.externalData.nationalRegistry?.data as {
                  fullName?: string
                })?.fullName,
            }),
            buildTextField({
              id: 'personalInfo.nationalId',
              title: m.nationalId,
              backgroundColor: 'white',
              width: 'half',
              readOnly: true,
              defaultValue: (application: Application) => {
                const nationalId =
                  (application.externalData.nationalRegistry?.data as {
                    nationalId?: string
                  })?.nationalId ?? ''

                return formatKennitala(nationalId)
              },
            }),
            buildTextField({
              id: 'personalInfo.email',
              title: m.email,
              width: 'half',
              defaultValue: (application: Application) =>
                (application.externalData.userProfile?.data as {
                  email?: string
                })?.email,
            }),
            buildTextField({
              id: 'personalInfo.phoneNumber',
              title: m.phoneNumber,
              width: 'half',
              variant: 'tel',
              format: '###-####',
              defaultValue: (application: Application) =>
                (application.externalData.userProfile?.data as {
                  mobilePhoneNumber?: string
                })?.mobilePhoneNumber,
            }),
            buildDescriptionField({
              id: 'personalInfo.space',
              title: '',
              description: '',
              space: 'gutter',
            }),
            buildCheckboxField({
              id: 'personalInfo.isPassportLost',
              title: '',
              large: false,
              backgroundColor: 'white',
              defaultValue: [],
              options: [
                {
                  value: YES,
                  label: m.isCurrentPassportLost,
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'serviceSection',
      title: m.serviceTitle,
      children: [
        buildMultiField({
          id: 'service',
          title: m.serviceTitle,
          description: m.serviceType,
          children: [
            buildRadioField({
              id: 'service.type',
              title: '',
              width: 'half',
              space: 'none',
              options: [
                {
                  value: Services.REGULAR,
                  label:
                    m.serviceTypeRegular.defaultMessage +
                    ' - ' +
                    m.serviceTypeRegularPrice.defaultMessage,
                  subLabel: m.serviceTypeRegularSublabel.defaultMessage,
                },
                {
                  value: Services.EXPRESS,
                  label:
                    m.serviceTypeExpress.defaultMessage +
                    ' - ' +
                    m.serviceTypeExpressPrice.defaultMessage,
                  subLabel: m.serviceTypeExpressSublabel.defaultMessage,
                },
              ],
            }),
            buildDescriptionField({
              id: 'service.dropLocationDescription',
              title: m.dropLocation,
              titleVariant: 'h3',
              space: 2,
              description: m.dropLocationDescription,
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
            buildDescriptionField({
              id: 'service.dropLocationAuthenticationDescription',
              title: m.dropLocationAuthentication,
              titleVariant: 'h3',
              space: 4,
              description: m.dropLocationAuthenticationDescription,
            }),
            buildRadioField({
              id: 'service.authentication',
              backgroundColor: 'white',
              title: '',
              largeButtons: false,
              options: AUTH_TYPES,
            }),
            buildCustomField({
              id: 'service.warning',
              title: '',
              component: 'AuthWarning',
              condition: (answers) =>
                (answers.service as Service)?.authentication === 'none',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'overview',
      title: m.overview,
      children: [
        buildMultiField({
          id: 'overview',
          title: m.overview,
          description: m.overviewDescription,
          children: [
            buildDividerField({}),
            buildDescriptionField({
              id: 'overview.infoTitle',
              title: m.infoTitle,
              titleVariant: 'h3',
              description: '',
              space: 'gutter',
            }),
            buildDescriptionField({
              id: 'overview.space',
              title: '',
              description: '',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: m.name,
              width: 'half',
              value: (application: Application) =>
                (application.answers.personalInfo as {
                  name?: string
                })?.name,
            }),
            buildKeyValueField({
              label: m.nationalId,
              width: 'half',
              value: (application: Application) =>
                (application.answers.personalInfo as {
                  nationalId?: string
                })?.nationalId,
            }),
            buildDescriptionField({
              id: 'overview.space1',
              title: '',
              description: '',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: m.email,
              width: 'half',
              value: (application: Application) =>
                (application.answers.personalInfo as {
                  email?: string
                })?.email,
            }),
            buildKeyValueField({
              label: m.phoneNumber,
              width: 'half',
              value: (application: Application) => {
                const phone = (application.answers.personalInfo as {
                  phoneNumber?: string
                })?.phoneNumber

                return formatPhoneNumber(phone as string)
              },
            }),
            buildDescriptionField({
              id: 'overview.space2',
              title: '',
              description: '',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: m.currentPassportStatus,
              width: 'half',
              value: 'halló',
            }),
            buildDescriptionField({
              id: 'overview.space3',
              title: '',
              description: '',
              space: 'gutter',
            }),
            buildDividerField({}),
            buildDescriptionField({
              id: 'overview.dropLocationTitle',
              title: m.serviceTitle,
              titleVariant: 'h3',
              description: '',
              space: 'gutter',
            }),
            buildDescriptionField({
              id: 'overview.space4',
              title: '',
              description: '',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: m.serviceTypeTitle,
              width: 'half',
              value: (application: Application) =>
                (application.answers.service as Service).type ===
                Services.REGULAR
                  ? m.serviceTypeRegular
                  : m.serviceTypeExpress,
            }),
            buildKeyValueField({
              label: m.dropLocation,
              width: 'half',
              value: ({
                externalData: {
                  districtCommissioners: { data },
                },
                answers,
              }) => {
                const district = (data as DistrictCommissionerAgencies[]).find(
                  (d) => d.id === (answers.service as Service).dropLocation,
                )
                return `${district?.name}, ${district?.place}`
              },
            }),
            buildDescriptionField({
              id: 'overview.space5',
              title: '',
              description: '',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: m.authenticationType,
              width: 'half',
              value: (application: Application) =>
                AUTH_TYPES.find(
                  (o) =>
                    o.value ===
                    (application.answers.service as Service).authentication,
                )?.label,
            }),
            buildDescriptionField({
              id: 'overview.space6',
              title: '',
              description: '',
              space: 'gutter',
            }),
            buildCheckboxField({
              id: 'overview.willBringPassport',
              title: '',
              large: false,
              backgroundColor: 'white',
              defaultValue: [],
              options: [
                {
                  value: YES,
                  label: m.willBringPassport,
                },
              ],
            }),
            buildSubmitField({
              id: 'confirmOverview',
              placement: 'footer',
              title: '',
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: m.confirm,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'payment',
      title: m.paymentSection,
      children: [
        buildMultiField({
          id: 'payment',
          title: 'Greiðsla',
          children: [
            buildCustomField({
              id: 'paymentCharge',
              title: '',
              component: 'PaymentCharge',
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
