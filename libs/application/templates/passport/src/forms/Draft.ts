import {
  buildCheckboxField,
  buildDataProviderItem,
  buildDateField,
  buildExternalDataProvider,
  buildForm,
  buildIntroductionField,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSelectField,
  buildSubmitField,
  buildSubSection,
  buildTextField,
  buildDividerField,
  Form,
  FormModes,
} from '@island.is/application/core'
import { m } from './messages'

export const Draft: Form = buildForm({
  id: 'PassportApplicationDraftForm',
  name: m.formName,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'personalInfo',
      name: m.personalInfoSection,
      children: [
        buildMultiField({
          id: 'personalInfo',
          name: m.personalInfoTitle,
          children: [
            buildTextField({
              id: 'personalInfo.name',
              name: m.personalInfoName,
            }),
            buildTextField({
              id: 'personalInfo.nationalId',
              name: m.nationalId,
              width: 'half',
            }),
            buildTextField({
              id: 'personalInfo.phoneNumber',
              name: m.phoneNumber,
              width: 'half',
            }),
            buildTextField({
              id: 'personalInfo.email',
              name: m.email,
              width: 'half',
            }),
            buildTextField({
              id: 'personalInfo.otherEmail',
              name: m.otherEmail,
              width: 'half',
            }),
            buildTextField({
              id: 'personalInfo.height',
              name: m.height,
              width: 'half',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'service',
      name: m.serviceSection,
      children: [
        buildMultiField({
          id: 'service',
          name: m.serviceTitle,
          children: [
            buildRadioField({
              id: 'service.type',
              name: m.serviceType,
              options: [
                { value: 'regular', label: m.regularService },
                { value: 'express', label: m.expressService },
              ],
            }),

            buildSelectField({
              id: 'service.dropLocation',
              name: m.dropLocation,
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
              name: m.extraOptions,
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
      name: m.fetchDataSection,
      children: [
        buildExternalDataProvider({
          name: m.fetchData,
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
      name: m.paymentSection,
      children: [
        buildMultiField({
          id: 'payment',
          name: 'Yfirlit yfir greiðslu',
          children: [
            /*
             * TODO Finish payment section when payment connection is ready
             */
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              name: 'sick',
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
        buildIntroductionField({
          id: 'final',
          name: 'Takk',
          introduction: 'Umsókn þín er samþykkt',
        }),
      ],
    }),
  ],
})
