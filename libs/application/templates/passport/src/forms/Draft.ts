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
} from '@island.is/application/core'
import { m } from '../lib/messages'

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
          ],
        }),
      ],
    }),
    buildSection({
      id: 'personalInfo',
      title: m.personalInfoSection,
      children: [
        buildMultiField({
          id: 'personalInfo',
          title: m.personalInfoTitle,
          children: [
            buildTextField({
              id: 'personalInfo.name',
              title: m.personalInfoName,
            }),
            buildTextField({
              id: 'personalInfo.nationalId',
              title: m.nationalId,
              width: 'half',
            }),
            buildTextField({
              id: 'personalInfo.phoneNumber',
              title: m.phoneNumber,
              width: 'half',
            }),
            buildTextField({
              id: 'personalInfo.email',
              title: m.email,
              width: 'half',
            }),
            buildTextField({
              id: 'personalInfo.otherEmail',
              title: m.otherEmail,
              width: 'half',
            }),
            buildTextField({
              id: 'personalInfo.height',
              title: m.height,
              width: 'half',
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
