import {
  buildCustomField,
  buildForm,
  buildMultiField,
  buildPhoneField,
  buildSection,
  buildSubSection,
  buildSubmitField,
  buildTextField,
} from '@island.is/application/core'
import {
  Application,
  DefaultEvents,
  Form,
  FormModes,
} from '@island.is/application/types'
import Logo from '../assets/Logo'
import { childPensionFormMessage } from '../lib/messages'
import { UserProfile } from '@island.is/api/schema'

export const ChildPensionForm: Form = buildForm({
  id: 'ChildPensionDraft',
  title: childPensionFormMessage.shared.formTitle,
  logo: Logo,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'prerequisites',
      title: childPensionFormMessage.pre.prerequisitesSection,
      children: [],
    }),
    buildSection({
      id: 'infoSection',
      title: childPensionFormMessage.info.section,
      children: [
        buildSubSection({
          id: 'info',
          title: childPensionFormMessage.info.subSectionTitle,
          children: [
            buildMultiField({
              id: 'applicantInfo',
              title: childPensionFormMessage.info.subSectionTitle,
              description: childPensionFormMessage.info.subSectionDescription,
              children: [
                buildTextField({
                  id: 'applicantInfo.email',
                  title: childPensionFormMessage.info.applicantEmail,
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
                  title: childPensionFormMessage.info.applicantPhonenumber,
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
          id: 'periodSection',
          title: childPensionFormMessage.period.periodTitle,
          children: [
            buildMultiField({
              id: 'periodField',
              title: childPensionFormMessage.period.periodTitle,
              description: childPensionFormMessage.period.periodDescription,
              children: [
                buildCustomField({
                  id: 'period',
                  component: 'Period',
                  title: childPensionFormMessage.period.periodTitle,
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'payment',
          title: childPensionFormMessage.info.paymentTitle,
          children: [
            buildMultiField({
              id: 'paymentInfo',
              title: childPensionFormMessage.info.paymentTitle,
              description: '',
              children: [],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'additionalInfo',
      title: childPensionFormMessage.additionalInfo.section,
      children: [],
    }),
    buildSection({
      id: 'confirm',
      title: childPensionFormMessage.confirm.section,
      children: [
        buildSubSection({
          title: '',
          children: [
            buildMultiField({
              id: 'confirm',
              title: '',
              description: '',
              children: [
                buildCustomField(
                  {
                    id: 'confirmScreen',
                    title: childPensionFormMessage.confirm.title,
                    component: 'Review',
                  },
                  {
                    editable: true,
                  },
                ),
                buildSubmitField({
                  id: 'submit',
                  placement: 'footer',
                  title: childPensionFormMessage.confirm.title,
                  actions: [
                    {
                      event: DefaultEvents.SUBMIT,
                      name: childPensionFormMessage.confirm.title,
                      type: 'primary',
                    },
                  ],
                }),
              ],
            }),
          ],
        }),
        buildCustomField({
          id: 'thankYou',
          title: childPensionFormMessage.conclusionScreen.title,
          component: 'Conclusion',
        }),
      ],
    }),
  ],
})
