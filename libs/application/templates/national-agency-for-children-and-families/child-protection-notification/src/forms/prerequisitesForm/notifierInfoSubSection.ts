import { Application } from '@island.is/api/schema'
import {
  buildMultiField,
  buildPhoneField,
  buildRadioField,
  buildSelectField,
  buildSubSection,
  buildTextField,
  buildTitleField,
  coreMessages,
} from '@island.is/application/core'
import { prerequisitesMessages, sharedMessages } from '../../lib/messages'
import { getYesNoOptions } from '../../utils/childProtectionNotificationUtils'
import { getApplicationExternalData } from '../../utils/getApplicationExternalData'

export const notifierInfoSubSection = buildSubSection({
  id: 'notifierInfoSubSection',
  title: prerequisitesMessages.notifierInfo.subSectionTitle,
  children: [
    buildMultiField({
      id: 'notifierInfo',
      title: prerequisitesMessages.notifierInfo.subSectionTitle,
      description: prerequisitesMessages.notifierInfo.description,
      children: [
        buildTextField({
          id: 'notifierInfo.name',
          title: coreMessages.name,
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) =>
            getApplicationExternalData(application.externalData)
              .nationalRegistryName,
        }),
        buildTextField({
          id: 'notifierInfo.nationalId',
          title: coreMessages.nationalId,
          width: 'half',
          format: '######-####',
          readOnly: true,
          defaultValue: (application: Application) =>
            getApplicationExternalData(application.externalData)
              .nationalRegistryNationalId,
        }),
        buildTextField({
          id: 'notifierInfo.email',
          title: sharedMessages.email,
          width: 'half',
          variant: 'email',
          defaultValue: (application: Application) =>
            getApplicationExternalData(application.externalData)
              .userProfileEmail,
        }),
        buildPhoneField({
          id: 'notifierInfo.phoneNumber',
          title: sharedMessages.phone,
          width: 'half',
          enableCountrySelector: true,
          doesNotRequireAnswer: true,
          defaultValue: (application: Application) =>
            getApplicationExternalData(application.externalData)
              .userProfilePhoneNumber,
        }),
        buildRadioField({
          id: 'notifierInfo.notifierAnonymity',
          title: prerequisitesMessages.notifierInfo.wantsAnonymity,
          width: 'half',
          space: 4,
          options: getYesNoOptions(),
        }),
        buildTitleField({
          title: prerequisitesMessages.notifierInfo.relationshipToChild,
          titleVariant: 'h4',
          marginTop: 4,
          marginBottom: 0,
        }),
        buildSelectField({
          id: 'notifierInfo.relationshipToChild',
          title: prerequisitesMessages.notifierInfo.relationship,
          placeholder:
            prerequisitesMessages.notifierInfo.relationshipPlaceholder,
          options: () => {
            // TODO: Replace with values from barnaverndargatt API when available.
            return [
              {
                value: 'Valmöguleiki 1',
                label: 'Valmöguleiki 1',
              },
              {
                value: 'Valmöguleiki 2',
                label: 'Valmöguleiki 2',
              },
              {
                value: 'Valmöguleiki 3',
                label: 'Valmöguleiki 3',
              },
            ]
          },
        }),
      ],
    }),
  ],
})
