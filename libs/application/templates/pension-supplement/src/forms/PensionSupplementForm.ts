import {
  buildForm,
  buildMultiField,
  buildPhoneField,
  buildSection,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { Application, Form, FormModes } from '@island.is/application/types'
import Logo from '../assets/Logo'
import { pensionSupplementFormMessage } from '../lib/messages'
import { UserProfile } from '@island.is/api/schema'

export const PensionSupplementForm: Form = buildForm({
  id: 'PensionSupplementDraft',
  title: pensionSupplementFormMessage.shared.formTitle,
  logo: Logo,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'prerequisites',
      title: pensionSupplementFormMessage.pre.externalDataSection,
      children: [],
    }),
    buildSection({
      id: 'infoSection',
      title: pensionSupplementFormMessage.info.section,
      children: [
        buildSubSection({
          id: 'info',
          title: pensionSupplementFormMessage.info.subSectionTitle,
          children: [
            buildMultiField({
              id: 'applicantInfo',
              title: pensionSupplementFormMessage.info.subSectionTitle,
              description:
                pensionSupplementFormMessage.info.subSectionDescription,
              children: [
                buildTextField({
                  id: 'applicantInfo.email',
                  title: pensionSupplementFormMessage.info.applicantEmail,
                  width: 'half',
                  variant: 'email',
                  required: true,
                  defaultValue: (application: Application) => {
                    const data = application.externalData.userProfile
                      .data as UserProfile
                    return data.email
                  },
                }),
                buildPhoneField({
                  id: 'applicantInfo.phonenumber',
                  title: pensionSupplementFormMessage.info.applicantPhonenumber,
                  width: 'half',
                  placeholder: '000-0000',
                  required: true,
                  defaultValue: (application: Application) => {
                    const data = application.externalData.userProfile
                      .data as UserProfile
                    return data.mobilePhoneNumber
                  },
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'payment',
          title: pensionSupplementFormMessage.info.paymentTitle,
          children: [
            buildMultiField({
              id: 'paymentInfo',
              title: pensionSupplementFormMessage.info.paymentTitle,
              description: '',
              children: [],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'additionalInfo',
      title: pensionSupplementFormMessage.additionalInfo.section,
      children: [],
    }),
    buildSection({
      id: 'confirm',
      title: pensionSupplementFormMessage.confirm.section,
      children: [],
    }),
  ],
})
