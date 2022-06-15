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
  OPERATION_TYPES,
  YES,
  NO,
  ResturantTypes,
  HotelTypes,
} from '../lib/constants'
import { DefaultEvents } from '@island.is/application/core'
import { formatPhoneNumber } from '@island.is/application/ui-components'

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
      id: 'operation',
      title: m.operationTitle,
      children: [
        buildMultiField({
          id: 'operation',
          title: m.operationTitle,
          description: m.operationSubtitle,
          children: [
            buildRadioField({
              id: 'operation',
              title: '',
              options: [
                { value: OPERATION_TYPES.HOTEL, label: m.operationHotel },
                {
                  value: OPERATION_TYPES.RESTURANT,
                  label: m.operationResturant,
                },
              ],
              width: 'half',
              largeButtons: true,
            }),
            buildSelectField({
              id: 'operationType',
              title: 'Veldu tegund gististaðar',
              options: HotelTypes,
              backgroundColor: 'blue',
              condition: (formValue) =>
                formValue.operation === OPERATION_TYPES.HOTEL,
            }),
            buildSelectField({
              id: 'operationType',
              title: 'Veldu tegund veitingastaðar',
              backgroundColor: 'blue',
              options: ResturantTypes,
              condition: (formValue) =>
                formValue.operation === OPERATION_TYPES.RESTURANT,
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
