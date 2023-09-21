import {
  buildCustomField,
  buildForm,
  buildMultiField,
  buildPhoneField,
  buildSection,
  buildSubSection,
  buildSubmitField,
  buildTextField,
  buildRepeater,
  buildRadioField,
} from '@island.is/application/core'
import {
  Application,
  DefaultEvents,
  Form,
  FormModes,
  CustomField,
} from '@island.is/application/types'
import Logo from '../assets/Logo'
import { childPensionFormMessage } from '../lib/messages'
import { UserProfile } from '@island.is/api/schema'
import {
  getApplicationExternalData,
  getApplicationAnswers,
} from '../lib/childPensionUtils'
import { YES, NO } from '../lib/constants'

const buildChildReason = (index: number): CustomField =>
  buildCustomField(
    {
      id: `chooseChildren.selectedChildrenInCustody[${index}].reason`,
      title: childPensionFormMessage.info.childPensionReasonTitle,
      condition: (answers, _) => {
        const { selectedCustodyKids } = getApplicationAnswers(answers)

        return index < (selectedCustodyKids.length || 0)
      },
      component: 'ChildPensionReason',
    },
    {
      showDescription: true,
      childName: ({ answers }: Application) => {
        const { selectedChildrenInCustody } = getApplicationAnswers(answers)

        return selectedChildrenInCustody[index].name
      },
    },
  )

const buildChildReasons = (): CustomField[] =>
  [...Array(10)].map((_key, index) => buildChildReason(index))

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
        buildSubSection({
          id: 'childrenSection',
          title: childPensionFormMessage.info.childrenTitle,
          children: [
            buildCustomField({
              id: 'chooseChildren',
              title: childPensionFormMessage.info.chooseChildrenTitle,
              condition: (_, externalData) => {
                const { custodyInformation } =
                  getApplicationExternalData(externalData)
                return custodyInformation.length !== 0
              },
              component: 'ChooseChildren',
            }),
            ...buildChildReasons(),
            buildRadioField({
              condition: (answers, externalData) => {
                const { custodyInformation } =
                  getApplicationExternalData(externalData)
                const { selectedCustodyKids } = getApplicationAnswers(answers)
                return custodyInformation.length !== 0
                  ? selectedCustodyKids.length !== 0
                  : false
              },
              id: 'childPensionAddChild',
              title: childPensionFormMessage.info.childPensionAddChildQuestion,
              width: 'half',
              required: true,
              options: [
                {
                  value: YES,
                  label: childPensionFormMessage.shared.yes,
                },
                {
                  value: NO,
                  label: childPensionFormMessage.shared.no,
                },
              ],
            }),
            buildRepeater({
              id: 'registerChildRepeater',
              title: childPensionFormMessage.info.registerChildRepeaterTitle,
              component: 'RegisterChildRepeater',
              condition: (answers, externalData) => {
                const { custodyInformation } =
                  getApplicationExternalData(externalData)
                const { childPensionAddChild } = getApplicationAnswers(answers)

                return (
                  custodyInformation.length === 0 ||
                  childPensionAddChild === YES
                )
              },
              children: [
                buildMultiField({
                  id: 'registerChild',
                  title: childPensionFormMessage.info.registerChildTitle,
                  space: 3,
                  children: [
                    buildCustomField({
                      id: 'registerChild',
                      title: '',
                      component: 'RegisterChild',
                    }),
                    buildCustomField({
                      id: 'reason',
                      title: '',
                      component: 'ChildPensionReason',
                    }),
                  ],
                }),
              ],
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
