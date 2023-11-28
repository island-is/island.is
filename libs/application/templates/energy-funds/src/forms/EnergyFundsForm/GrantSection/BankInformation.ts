import {
  buildAlertMessageField,
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { information } from '../../../lib/messages/information'
import { Application } from '@island.is/api/schema'

export const bankInformationSubSection = buildSubSection({
  id: 'bankInformation',
  title: information.labels.pickVehicle.sectionTitle,
  children: [
    buildMultiField({
      id: 'bankInformationMultiField',
      title: information.labels.bankInformation.title,
      children: [
        buildTextField({
          id: 'bankInformation.grantAmount',
          title: information.labels.bankInformation.grantAmount,
          variant: 'currency',
          readOnly: true,
          defaultValue: (application: Application) => 900000, //TODO actual amount from API when connected
        }),
        buildDescriptionField({
          id: 'bankInformation.subtitle',
          title: information.labels.bankInformation.accountInfo,
          titleVariant: 'h5',
          space: 'gutter',
        }),
        buildTextField({
          title: information.labels.bankInformation.accountNumer,
          id: 'bankInformation.banknumber',
          dataTestId: 'bank-account-number',
          readOnly: true,
          format: '####-##-######',
          placeholder: '0000-00-000000',
          condition: (_, application) => {
            console.log('application', application)
            return true
          },
          defaultValue: (application: Application) =>
            (
              application.externalData.userProfile?.data as {
                bankInfo?: string
              }
            )?.bankInfo,
        }),
        buildAlertMessageField({
          id: 'bankInformation.information',
          title: information.labels.bankInformation.informationTitle,
          message: information.labels.bankInformation.informationDescription,
          alertType: 'info',
        }),
      ],
    }),
  ],
})
