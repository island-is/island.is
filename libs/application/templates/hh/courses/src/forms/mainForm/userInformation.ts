import {
  buildAlertMessageField,
  buildMultiField,
  buildPhoneField,
  buildSection,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { Application } from '@island.is/application/types'

export const userInformation = buildSection({
  id: 'userInformation',
  title: m.userInformation.sectionTitle,
  children: [
    buildMultiField({
      id: 'userInformationMultiField',
      title: m.userInformation.sectionTitle,
      description: m.userInformation.sectionDescription,
      children: [
        buildTextField({
          id: 'userInformation.name',
          title: m.userInformation.name,
          readOnly: true,
          width: 'half',
          defaultValue: (application: Application) =>
            getValueViaPath(
              application.externalData,
              'nationalRegistry.data.fullName',
            ),
        }),
        buildTextField({
          id: 'userInformation.nationalId',
          title: m.userInformation.nationalId,
          readOnly: true,
          width: 'half',
          defaultValue: (application: Application) =>
            getValueViaPath(
              application.externalData,
              'nationalRegistry.data.nationalId',
            ),
        }),
        buildTextField({
          id: 'userInformation.email',
          title: m.userInformation.email,
          required: true,
          width: 'half',
          defaultValue: (application: Application) =>
            getValueViaPath(application.externalData, 'userProfile.data.email'),
        }),
        buildPhoneField({
          id: 'userInformation.phone',
          title: m.userInformation.phone,
          required: true,
          width: 'half',
          defaultValue: (application: Application) =>
            getValueViaPath(
              application.externalData,
              'userProfile.data.mobilePhoneNumber',
            ),
        }),
        buildTextField({
          id: 'userInformation.healthcenter',
          title: m.userInformation.healthcenter,
          readOnly: true,
          condition: (_, externalData) =>
            !!getValueViaPath(
              externalData,
              'currentHealthcenter.data.healthCenter.name',
            ),
          defaultValue: (application: Application) =>
            getValueViaPath(
              application.externalData,
              'currentHealthcenter.data.healthCenter.name',
            ),
        }),
        buildAlertMessageField({
          id: 'userInformation.noHealthcenterAlert',
          title: m.userInformation.healthcenter,
          message: m.userInformation.noHealthcenter,
          alertType: 'info',
          condition: (_, externalData) =>
            !getValueViaPath(
              externalData,
              'currentHealthcenter.data.healthCenter.name',
            ),
        }),
      ],
    }),
  ],
})
