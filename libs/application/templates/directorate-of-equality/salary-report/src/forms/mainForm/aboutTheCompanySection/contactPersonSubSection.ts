import {
  buildDescriptionField,
  buildMultiField,
  buildPhoneField,
  buildSubSection,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { messages } from '../../../lib/messages'

export const contactPersonSubSection = buildSubSection({
  id: 'contactPerson',
  title: messages.aboutTheCompany.contactPerson.sectionTitle,
  children: [
    buildMultiField({
      id: 'contactPersonMultiField',
      title: messages.aboutTheCompany.contactPerson.title,
      description: messages.aboutTheCompany.contactPerson.intro,
      children: [
        buildDescriptionField({
          id: 'contactPerson.contactInfoTitle',
          title: messages.aboutTheCompany.contactPerson.contactInfoTitle,
          titleVariant: 'h4',
        }),
        buildTextField({
          id: 'contactPerson.name',
          title: messages.aboutTheCompany.contactPerson.name,
          placeholder: messages.aboutTheCompany.contactPerson.namePlaceholder,
          width: 'full',
          required: true,
          defaultValue: (application: Application) =>
            getValueViaPath(application.externalData, 'identity.data.name'),
        }),
        buildTextField({
          id: 'contactPerson.email',
          title: messages.aboutTheCompany.contactPerson.email,
          placeholder: messages.aboutTheCompany.contactPerson.emailPlaceholder,
          width: 'full',
          variant: 'email',
          required: true,
          defaultValue: (application: Application) =>
            getValueViaPath(application.externalData, 'userProfile.data.email'),
        }),
        buildPhoneField({
          id: 'contactPerson.phone',
          title: messages.aboutTheCompany.contactPerson.phone,
          placeholder: messages.aboutTheCompany.contactPerson.phonePlaceholder,
          width: 'half',
          required: true,
          defaultValue: (application: Application) =>
            getValueViaPath(
              application.externalData,
              'userProfile.data.mobilePhoneNumber',
            ),
        }),
      ],
    }),
  ],
})
