import {
  buildCheckboxField,
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
} from '@island.is/application/core'
import { m } from '../lib/messages'
import { format as formatKennitala } from 'kennitala'

export const Draft: Form = buildForm({
  id: 'PassportApplicationDraftForm',
  title: m.formName,
  mode: FormModes.APPLYING,
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
              type: '', //todo: change to sýslumenn when ready
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
      title: m.serviceSection,
      children: [
        buildMultiField({
          id: 'service',
          title: m.serviceTitle,
          children: [
            buildRadioField({
              id: 'service.type',
              title: m.serviceType,
              options: [
                { value: 'regular', label: m.regularService },
                { value: 'express', label: m.expressService },
              ],
            }),

            buildSelectField({
              id: 'service.dropLocation',
              title: m.dropLocation,
              placeholder: m.dropLocationPlaceholder.defaultMessage,
              options: [
                {
                  label: 'Kópavogur',
                  value: '1',
                },
                {
                  label: 'Akureyri',
                  value: '2',
                },
                {
                  label: 'Egilstaðir',
                  value: '3',
                },
              ],
            }),

            buildCheckboxField({
              id: 'service.extraOptions',
              title: m.extraOptions,
              options: [
                {
                  label: m.extraOptionsBringOwnPhoto,
                  value: 'bringOwnPhoto',
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'approveExternalData',
      title: m.fetchDataSection,
      children: [
        buildExternalDataProvider({
          title: m.fetchData,
          id: 'fetchData',
          dataProviders: [
            buildDataProviderItem({
              id: 'insuranceInfo',
              title: m.insuranceInfoTitle,
              subTitle: m.insuranceInfoSubtitle,
              type: 'ExampleSucceeds',
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
          title: 'Yfirlit yfir greiðslu',
          children: [
            /*
             * TODO Finish payment section when payment connection is ready
             */
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              title: 'sick',
              actions: [
                {
                  event: 'SUBMIT',
                  name: 'Greiða',
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
        buildDescriptionField({
          id: 'final',
          title: 'Takk',
          description: 'Umsókn þín er samþykkt',
        }),
      ],
    }),
  ],
})
