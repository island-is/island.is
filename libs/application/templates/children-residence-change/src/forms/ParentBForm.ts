import {
  buildForm,
  buildSection,
  Form,
  FormModes,
  buildCustomField,
  buildMultiField,
  buildTextField,
  buildSubmitField,
  DefaultEvents,
} from '@island.is/application/core'
import Logo from '../../assets/Logo'
import * as m from '../lib/messages'

export const ParentBForm: Form = buildForm({
  id: 'ParentBForm',
  title: m.application.name,
  logo: Logo,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'parentBIntro',
      title: m.parentBIntro.general.sectionTitle,
      children: [
        buildCustomField({
          id: 'parentBIntro',
          title: m.parentBIntro.general.pageTitle,
          component: 'ParentBIntro',
        }),
      ],
    }),
    buildSection({
      id: 'contact',
      title: m.contactInfo.general.sectionTitle,
      children: [
        buildMultiField({
          id: 'contactInfo',
          title: m.contactInfo.general.pageTitle,
          description: m.contactInfo.general.parentBDescription,
          children: [
            buildTextField({
              id: 'parentB.email',
              title: m.contactInfo.inputs.emailLabel,
              variant: 'email',
              backgroundColor: 'blue',
            }),
            buildTextField({
              id: 'parentB.phoneNumber',
              title: m.contactInfo.inputs.phoneNumberLabel,
              variant: 'tel',
              format: '###-####',
              backgroundColor: 'blue',
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
        buildMultiField({
          id: 'residenceChangeOverview',
          title: m.contract.general.pageTitle,
          children: [
            buildCustomField({
              id: 'residenceChangeReview',
              title: m.contract.general.pageTitle,
              component: 'Overview',
            }),
            buildSubmitField({
              id: 'assign',
              title: '',
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: m.application.signature,
                  type: 'primary',
                },
              ],
            }),
          ],
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
