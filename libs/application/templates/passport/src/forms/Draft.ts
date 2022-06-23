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
  Service,
  DistrictCommissionerAgencies,
  YES,
} from '../lib/constants'
import { DefaultEvents } from '@island.is/application/core'
import { formatPhoneNumber } from '@island.is/application/ui-components'
import format from 'date-fns/format'

export const Draft: Form = buildForm({
  id: 'PassportApplicationDraftForm',
  title: m.formName,
  mode: FormModes.APPLYING,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'intro',
      title: m.infoTitle,
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
              id: 'nationalRegistry',
              type: 'NationalRegistryProvider',
              title: m.dataCollectionNationalRegistryTitle,
              subTitle: m.dataCollectionNationalRegistrySubtitle,
            }),
            buildDataProviderItem({
              id: 'userProfile',
              type: 'UserProfileProvider',
              title: m.dataCollectionUserProfileTitle,
              subTitle: m.dataCollectionUserProfileSubtitle,
            }),
            buildDataProviderItem({
              id: 'identityDocument',
              type: 'IdentityDocumentProvider',
              title: m.dataCollectionIdentityDocumentTitle,
              subTitle: m.dataCollectionIdentityDocumentSubtitle,
            }),
            buildDataProviderItem({
              id: 'payment',
              type: 'FeeInfoProvider',
              title: '',
            }),
            buildDataProviderItem({
              id: 'districtCommissioners',
              type: 'DistrictsProvider',
              title: '',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'passportSection',
      title: 'Vegabréfin þín',
      children: [
        buildMultiField({
          id: 'selectPassport',
          title: 'Vegabréfin þín',
          description:
            'Þú getur sótt um nýtt vegabréf fyrir þig og eftirfarandi einstaklinga í þinni umsjón. Veldu þann einstakling sem þú vilt hefja umsókn fyrir og haltu síðan áfram í næsta skref.',
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
      id: 'personalInfo',
      title: m.infoTitle,
      children: [
        buildMultiField({
          id: 'personalInfo',
          title: m.infoTitle,
          description: m.personalInfoSubtitle,
          condition: (answers) =>
            (answers.passport as any)?.userPassport !== '',
          children: [
            buildTextField({
              id: 'personalInfo.name',
              title: m.name,
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
              id: 'personalInfo.hasDisabilityDiscount',
              title: '',
              large: false,
              backgroundColor: 'white',
              defaultValue: [],
              options: [
                {
                  value: YES,
                  label: m.hasDisabilityDiscount,
                },
              ],
            }),
            buildSubmitField({
              id: 'approveCheckForDisability',
              placement: 'footer',
              title: '',
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Staðfesta',
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
        buildMultiField({
          id: 'childsPersonalInfo',
          title: m.infoTitle,
          description: m.personalInfoSubtitle,
          condition: (answers) =>
            (answers.passport as any)?.childPassport !== '',
          children: [
            buildTextField({
              id: 'childsPersonalInfo.name',
              title: m.name,
              backgroundColor: 'white',
              width: 'half',
              readOnly: true,
              defaultValue: 'Þitt Barn',
            }),
            buildTextField({
              id: 'childsPersonalInfo.nationalId',
              title: m.nationalId,
              backgroundColor: 'white',
              width: 'half',
              readOnly: true,
              defaultValue: '111111-1111',
            }),
            buildCheckboxField({
              id: 'childsPersonalInfo.hasDisabilityDiscount',
              title: '',
              large: false,
              backgroundColor: 'white',
              defaultValue: [],
              options: [
                {
                  value: YES,
                  label: m.hasDisabilityDiscount,
                },
              ],
            }),
            buildDescriptionField({
              id: 'childsPersonalInfo.guardian1',
              title: 'Forráðamaður 1',
              titleVariant: 'h3',
              space: 'gutter',
            }),
            buildTextField({
              id: 'childsPersonalInfo.guardian1.name',
              title: m.name,
              backgroundColor: 'blue',
              width: 'half',
              defaultValue: (application: Application) =>
                (application.externalData.nationalRegistry?.data as {
                  fullName?: string
                })?.fullName,
            }),
            buildTextField({
              id: 'childsPersonalInfo.guardian1.email',
              title: m.email,
              width: 'half',
              defaultValue: (application: Application) =>
                (application.externalData.userProfile?.data as {
                  email?: string
                })?.email,
            }),
            buildTextField({
              id: 'childsPersonalInfo.guardian1.phoneNumber',
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
              id: 'childsPersonalInfo.guardian2',
              title: 'Forráðamaður 2',
              titleVariant: 'h3',
              space: 'gutter',
            }),
            buildTextField({
              id: 'childsPersonalInfo.guardian2.name',
              title: m.name,
              backgroundColor: 'blue',
              width: 'half',
              defaultValue: '',
            }),
            buildTextField({
              id: 'childsPersonalInfo.guardian2.email',
              title: m.email,
              width: 'half',
              defaultValue: '',
              backgroundColor: 'blue',
            }),
            buildTextField({
              id: 'childsPersonalInfo.guardian2.phoneNumber',
              title: m.phoneNumber,
              width: 'half',
              variant: 'tel',
              format: '###-####',
              backgroundColor: 'blue',
              defaultValue: '',
            }),
            buildSubmitField({
              id: 'approveCheckForDisability',
              placement: 'footer',
              title: '',
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Staðfesta',
                  type: 'primary',
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
            buildDescriptionField({
              id: 'service.space',
              title: '',
              description: '',
              space: 'gutter',
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
      id: 'overview',
      title: m.overview,
      children: [
        buildMultiField({
          id: 'overviewPersonalInfo',
          title: m.overview,
          description: m.overviewDescription,
          condition: (answers) =>
            (answers.passport as any)?.userPassport !== '',
          children: [
            buildDividerField({}),
            buildDescriptionField({
              id: 'overviewPI.infoTitle',
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
              value: (application: Application) => {
                const date = (application.externalData.identityDocument
                  ?.data as {
                  expirationDate?: string
                })?.expirationDate

                return (
                  m.currentPassportExpiration.defaultMessage +
                  ' ' +
                  format(new Date(date as string), 'dd.MM.yy')
                )
              },
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
              title: m.serviceTypeTitle,
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
          ],
        }),
        buildMultiField({
          id: 'overviewChildsInfo',
          title: m.overview,
          description: m.overviewDescription,
          condition: (answers) =>
            (answers.passport as any)?.childPassport !== '',
          children: [
            buildDividerField({}),
            buildDescriptionField({
              id: 'overviewChild.infoTitle',
              title: m.infoTitle,
              titleVariant: 'h3',
              description: '',
              space: 'gutter',
            }),
            buildDescriptionField({
              id: 'overviewChild.space',
              title: '',
              description: '',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: m.name,
              width: 'half',
              value: (application: Application) =>
                (application.answers.childsPersonalInfo as {
                  name?: string
                })?.name,
            }),
            buildKeyValueField({
              label: m.nationalId,
              width: 'half',
              value: (application: Application) =>
                (application.answers.childsPersonalInfo as {
                  nationalId?: string
                })?.nationalId,
            }),
            buildDescriptionField({
              id: 'overviewChild.space1',
              title: '',
              description: '',
              space: 'gutter',
            }),
            buildDividerField({}),
            buildDescriptionField({
              id: 'overviewChild.infoTitle2',
              title: 'Forráðamaður 1',
              titleVariant: 'h3',
              description: '',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: m.name,
              width: 'half',
              value: (application: Application) =>
                ((application.answers.childsPersonalInfo as any).guardian1 as {
                  name?: string
                })?.name,
            }),
            /*buildKeyValueField({
              label: m.nationalId,
              width: 'half',
              value: (application: Application) =>
                ((application.answers.childsPersonalInfo as any).guardian1 as {
                  nationalId?: string
                })?.nationalId,
            }),*/
            buildDescriptionField({
              id: 'overviewChild.space2',
              title: '',
              description: '',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: m.email,
              width: 'half',
              value: (application: Application) =>
                ((application.answers.childsPersonalInfo as any).guardian1 as {
                  email?: string
                })?.email,
            }),
            buildKeyValueField({
              label: m.phoneNumber,
              width: 'half',
              value: (application: Application) => {
                const phone = ((application.answers.childsPersonalInfo as any)
                  .guardian1 as {
                  phoneNumber?: string
                })?.phoneNumber

                return formatPhoneNumber(phone as string)
              },
            }),
            buildDividerField({}),
            buildDescriptionField({
              id: 'overviewChild.infoTitle3',
              title: 'Forráðamaður 2',
              titleVariant: 'h3',
              description: '',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: m.name,
              width: 'half',
              value: (application: Application) =>
                ((application.answers.childsPersonalInfo as any).guardian2 as {
                  name?: string
                })?.name,
            }),
            /*buildKeyValueField({
              label: m.nationalId,
              width: 'half',
              value: (application: Application) =>
                ((application.answers.childsPersonalInfo as any).guardian2 as {
                  nationalId?: string
                })?.nationalId,
            }),*/
            buildDescriptionField({
              id: 'overviewChild.space3',
              title: '',
              description: '',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: m.email,
              width: 'half',
              value: (application: Application) =>
                ((application.answers.childsPersonalInfo as any).guardian2 as {
                  email?: string
                })?.email,
            }),
            buildKeyValueField({
              label: m.phoneNumber,
              width: 'half',
              value: (application: Application) => {
                const phone = ((application.answers.childsPersonalInfo as any)
                  .guardian2 as {
                  phoneNumber?: string
                })?.phoneNumber

                return formatPhoneNumber(phone as string)
              },
            }),
            buildDividerField({}),
            buildDescriptionField({
              id: 'overview.dropLocationTitle',
              title: m.serviceTypeTitle,
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
