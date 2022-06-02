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
} from '@island.is/application/core'
import { m } from '../lib/messages'
import { format as formatKennitala } from 'kennitala'
import {
  Services,
  AUTH_TYPES,
  Service,
  DistrictCommissionerAgencies,
} from '../lib/constants'
import { DefaultEvents } from '@island.is/application/core'

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
      title: m.personalInfoTitle,
      children: [
        buildMultiField({
          id: 'personalInfo',
          title: m.personalInfoTitle,
          description: m.personalInfoSubtitle,
          children: [
            buildTextField({
              id: 'personalInfo.name',
              title: m.personalInfoName,
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
            buildSubmitField({
              id: 'payment',
              placement: 'footer',
              title: 'sick',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.PAYMENT,
                  name: 'Greiða',
                  type: 'primary',
                },
              ],
            }),

            buildRadioField({
              id: 'service.type',
              title: '',
              width: 'half',
              space: 'none',
              options: [
                {
                  value: Services.REGULAR,
                  label: m.regularService,
                  subLabel: m.regularServiceSublabel.defaultMessage,
                },
                {
                  value: Services.EXPRESS,
                  label: m.expressService,
                  subLabel: m.expressServiceSublabel.defaultMessage,
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
              component: 'AuthenticationWarning',
              condition: (answers) =>
                (answers.service as Service)?.authentication === 'none',
            }),
          ],
        }),
      ],
    }),
  ],
})
