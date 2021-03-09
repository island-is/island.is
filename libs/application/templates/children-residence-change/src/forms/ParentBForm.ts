import {
  buildForm,
  buildSection,
  Form,
  FormModes,
  buildCustomField,
  Application,
  buildMultiField,
  buildTextField,
} from '@island.is/application/core'
import Logo from '../../assets/Logo'
import * as m from '../lib/messages'

export const ParentBForm: Form = buildForm({
  id: 'ParentBForm',
  title: m.application.name,
  logo: Logo,
  mode: FormModes.REVIEW,
  children: [
    buildSection({
      id: 'contact',
      title: m.contactInfo.general.sectionTitle,
      children: [
        buildMultiField({
          id: 'contactInfo',
          title: m.contactInfo.general.pageTitle,
          description: m.contactInfo.general.description,
          children: [
            buildTextField({
              id: 'parentB.email',
              title: m.contactInfo.inputs.emailLabel,
              variant: 'email',
              backgroundColor: 'blue',
              defaultValue: (application: Application) =>
                (application.externalData.userProfile?.data as {
                  email?: string
                })?.email,
            }),
            buildTextField({
              id: 'parentB.phoneNumber',
              title: m.contactInfo.inputs.phoneNumberLabel,
              variant: 'tel',
              format: '###-####',
              backgroundColor: 'blue',
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
      id: 'approveTermsParentB',
      title: m.section.effect,
      children: [
        buildCustomField({
          id: 'approveTermsParentB',
          title: m.terms.general.pageTitle,
          component: 'Terms',
        }),
      ],
    }),
    buildSection({
      id: 'residenceChangeOverview',
      title: m.section.overview,
      children: [
        buildCustomField({
          id: 'residenceChangeReview',
          title: m.contract.general.pageTitle,
          component: 'Overview',
        }),
      ],
    }),
    buildSection({
      id: 'submitted',
      title: m.section.received,
      children: [
        buildCustomField({
          id: 'residenceChangeConfirmation',
          title: m.confirmation.general.pageTitle,
          component: 'Confirmation',
        }),
      ],
    }),
  ],
})
