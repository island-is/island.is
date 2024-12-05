import {
  buildAlertMessageField,
  buildMultiField,
  buildPhoneField,
  buildSection,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { information } from '../../../lib/messages/information'
import { shared } from '../../../lib/messages'
import { Application } from '@island.is/application/types'

export const informationSection = buildSection({
  id: 'informationSection',
  title: information.general.sectionTitle,
  children: [
    buildMultiField({
      title: information.general.pageTitle,
      id: 'information',
      description: information.general.pageDescription,
      children: [
        buildTextField({
          id: 'information.nationalId',
          title: shared.labels.ssn,
          backgroundColor: 'white',
          width: 'half',
          format: '######-####',
          readOnly: true,
          defaultValue: (application: Application) => {
            const nationalId = getValueViaPath<string>(
              application.externalData,
              'identity.data.nationalId',
            )
            return nationalId
          },
        }),
        buildTextField({
          id: 'information.name',
          title: shared.labels.name,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            const name = getValueViaPath<string>(
              application.externalData,
              'identity.data.name',
            )
            return name
          },
        }),
        // buildAlertMessageField({
        //   id: 'userInformation.alert',
        //   title: '',
        //   alertType: 'info',
        //   message: information.alerts.alertMessage,
        //   links: [
        //     {
        //       title: information.alerts.alertMessageLinkTitle,
        //       url: information.alerts.alertMessageLink,
        //       isExternal: false,
        //     },
        //   ],
        // }),
        // buildTextField({
        //   id: 'information.email',
        //   title: shared.labels.email,
        //   width: 'half',
        //   variant: 'email',
        //   readOnly: true,
        //   defaultValue: (application: Application) => {
        //     const email = getValueViaPath<string>(
        //       application.externalData,
        //       'userProfile.data.email',
        //     )
        //     return email
        //   },
        // }),
        // buildPhoneField({
        //   id: 'information.phoneNumber',
        //   title: shared.labels.phone,
        //   width: 'half',
        //   readOnly: true,
        //   defaultValue: (application: Application) => {
        //     const phoneNumber = getValueViaPath<string>(
        //       application.externalData,
        //       'userProfile.data.mobilePhoneNumber',
        //     )
        //     return phoneNumber
        //   },
        // }),
      ],
    }),
  ],
})
