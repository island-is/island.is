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
  APPLICATION_TYPES,
  YES,
  NO,
  ResturantTypes,
  HotelTypes,
  Operation,
  OPERATION_CATEGORY,
} from '../lib/constants'
import { DefaultEvents, Answer } from '@island.is/application/core'
import { formatPhoneNumber } from '@island.is/application/ui-components'
import { useFormContext } from 'react-hook-form'

export const Draft: Form = buildForm({
  id: 'OperatingLicenseApplicationDraftForm',
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
              id: 'userProfile',
              type: 'UserProfileProvider',
              title: m.dataCollectionUserProfileTitle,
              subTitle: m.dataCollectionUserProfileSubtitle,
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
      id: 'applicationInfo',
      title: m.operationTitle,
      children: [
        buildMultiField({
          id: 'applicationInfo',
          title: m.operationTitle,

          children: [
            buildRadioField({
              id: 'applicationInfo.operation',
              title: '',
              description: m.operationSubtitle,
              options: [
                { value: APPLICATION_TYPES.HOTEL, label: m.operationHotel },
                {
                  value: APPLICATION_TYPES.RESTURANT,
                  label: m.operationResturant,
                },
              ],
              width: 'half',
              largeButtons: true,
            }),

            buildCheckboxField({
              id: 'hotel.category',
              title: '',
              description: m.operationCategoryHotelTitle,
              backgroundColor: 'white',
              doesNotRequireAnswer: true,
              large: false,
              options: [
                {
                  value: OPERATION_CATEGORY.ONE,
                  label: m.operationCategoryHotelOne,
                },
                {
                  value: OPERATION_CATEGORY.TWO,
                  label: m.operationCategoryHotelTwo,
                },
              ],
              condition: (answers) =>
                (answers.applicationInfo as Operation)?.operation ===
                APPLICATION_TYPES.HOTEL,
            }),
            buildRadioField({
              id: 'resturant.category',
              title: '',
              description: m.operationCategoryResturantTitle,
              options: [
                {
                  value: OPERATION_CATEGORY.ONE,
                  label: m.operationCategoryResturantOne,
                },
                {
                  value: OPERATION_CATEGORY.TWO,
                  label: m.operationCategoryResturantTwo,
                },
              ],
              width: 'half',
              largeButtons: true,
              condition: (answers) =>
                (answers.applicationInfo as Operation)?.operation ===
                APPLICATION_TYPES.RESTURANT,
            }),
            buildSelectField({
              id: 'hotel.type',
              title: m.operationTypeHotelTitle,
              description: m.operationTypeHotelDescription,
              options: HotelTypes,
              backgroundColor: 'blue',
              condition: (answers) =>
                (answers.applicationInfo as Operation)?.operation ===
                APPLICATION_TYPES.HOTEL,
            }),
            buildSelectField({
              id: 'resturant.type',
              title: m.operationTypeResturantTitle,
              description: m.operationTypeResturantDescription,
              backgroundColor: 'blue',
              options: ResturantTypes,
              condition: (answers) =>
                (answers.applicationInfo as Operation)?.operation ===
                APPLICATION_TYPES.RESTURANT,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'info',
      title: m.infoTitle,
      children: [
        buildMultiField({
          id: 'info',
          title: m.infoTitle,
          description: m.personalInfoSubtitle,
          children: [
            buildTextField({
              id: 'info.email',
              title: m.email,
              width: 'half',
              defaultValue: (application: Application) =>
                (application.externalData.userProfile?.data as {
                  email?: string
                })?.email,
            }),
            buildTextField({
              id: 'info.phoneNumber',
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
              label: m.email,
              width: 'half',
              value: (application: Application) =>
                (application.answers.info as {
                  email?: string
                })?.email,
            }),
            buildKeyValueField({
              label: m.phoneNumber,
              width: 'half',
              value: (application: Application) => {
                const phone = (application.answers.info as {
                  phoneNumber?: string
                })?.phoneNumber

                return formatPhoneNumber(phone as string)
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
