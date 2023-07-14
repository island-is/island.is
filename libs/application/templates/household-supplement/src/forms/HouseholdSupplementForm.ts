import {
  buildCustomField,
  buildDescriptionField,
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
import { householdSupplementFormMessage } from '../lib/messages'
import { UserProfile } from '@island.is/api/schema'

export const HouseholdSupplementForm: Form = buildForm({
  id: 'HouseholdSupplementDraft',
  title: householdSupplementFormMessage.shared.formTitle,
  logo: Logo,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'prerequisites',
      title: householdSupplementFormMessage.pre.prerequisitesSection,
      children: [],
    }),
    buildSection({
      id: 'infoSection',
      title: householdSupplementFormMessage.info.section,
      children: [
        buildSubSection({
          id: 'info',
          title: householdSupplementFormMessage.info.subSectionTitle,
          children: [
            buildMultiField({
              id: 'applicantInfo',
              title: householdSupplementFormMessage.info.subSectionTitle,
              description:
                householdSupplementFormMessage.info.subSectionDescription,
              children: [
                buildTextField({
                  id: 'applicantInfo.email',
                  title: householdSupplementFormMessage.info.applicantEmail,
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
                  title:
                    householdSupplementFormMessage.info.applicantPhonenumber,
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
          title: householdSupplementFormMessage.info.paymentTitle,
          children: [
            buildMultiField({
              id: 'paymentInfo',
              title: householdSupplementFormMessage.info.paymentTitle,
              description: '',
              children: [
                buildCustomField(
                  {
                    id: 'paymentInfo.alert',
                    title:
                      householdSupplementFormMessage.info.paymentAlertTitle,
                    component: 'FieldAlertMessage',
                    description:
                      householdSupplementFormMessage.info.paymentAlertMessage,
                  },
                  { type: 'info' },
                ),
                buildTextField({
                  id: 'paymentInfo.bank',
                  title: householdSupplementFormMessage.info.paymentBank,
                  backgroundColor: 'white',
                  //disabled: true,
                  format: '####-##-######',
                  placeholder: '0000-00-000000',
                  defaultValue: (application: Application) => {
                    const userProfile = application.externalData.userProfile
                      .data as UserProfile
                    return userProfile.bankInfo
                  },
                }),
              ],
            }),
          ],
        }),
        // buildSubSection({
        //   id: 'householdSupplementSection',
        //   title: householdSupplementFormMessage.shared.householdSupplement,
        //   children: [
        //     buildMultiField({
        //       id: 'householdSupplement',
        //       title: householdSupplementFormMessage.shared.householdSupplement,
        //       description:
        //         householdSupplementFormMessage.info
        //           .householdSupplementDescription,
        //       children: [],
        //     }),
        //   ],
        // }),
      ],
    }),
    // buildSection({
    //   id: 'additionalInfo',
    //   title: householdSupplementFormMessage.additionalInfo.section,
    //   children: [],
    // }),
    buildSection({
      id: 'confirm',
      title: householdSupplementFormMessage.confirm.section,
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
                    title: householdSupplementFormMessage.confirm.confirmTitle,
                    component: 'Review',
                  },
                  {
                    editable: true,
                  },
                ),
                buildSubmitField({
                  id: 'submit',
                  placement: 'footer',
                  title: householdSupplementFormMessage.confirm.confirmTitle,
                  actions: [
                    {
                      event: DefaultEvents.SUBMIT,
                      name: householdSupplementFormMessage.confirm.confirmTitle,
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
          title: householdSupplementFormMessage.conclusion.title,
          component: 'Conclusion',
        }),
      ],
    }),
  ],
})
