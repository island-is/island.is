import {
  buildAlertMessageField,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  buildTextField,
} from '@island.is/application/core'
import { information } from '../../../lib/messages/information'
import { Application } from '@island.is/api/schema'
import { grant } from '../../../lib/messages/grant'
import { DefaultEvents } from '@island.is/application/types'

export const GrantSection = buildSection({
  id: 'grant',
  title: grant.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'grantMultiField',
      title: information.labels.bankInformation.title,
      children: [
        buildTextField({
          id: 'grant.grantAmount',
          title: information.labels.bankInformation.grantAmount,
          variant: 'currency',
          readOnly: true,
          defaultValue: (application: Application) => 900000, //TODO actual amount from API when connected
        }),
        buildDescriptionField({
          id: 'grant.subtitle',
          title: information.labels.bankInformation.accountInfo,
          titleVariant: 'h5',
          space: 'gutter',
        }),
        buildTextField({
          title: information.labels.bankInformation.accountNumer,
          id: 'grant.banknumber',
          dataTestId: 'bank-account-number',
          readOnly: true,
          format: '####-##-######',
          placeholder: '0000-00-000000',
          defaultValue: (application: Application) =>
            (
              application.externalData.userProfile?.data as {
                bankInfo?: string
              }
            )?.bankInfo,
        }),
        buildAlertMessageField({
          id: 'grant.information',
          title: information.labels.bankInformation.informationTitle,
          message: information.labels.bankInformation.informationDescription,
          alertType: 'info',
        }),
        buildSubmitField({
          id: 'submit',
          placement: 'footer',
          title: grant.general.submit,
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: grant.general.submit,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
