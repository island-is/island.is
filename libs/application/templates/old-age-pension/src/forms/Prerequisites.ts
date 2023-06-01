import {
  buildCustomField,
  buildDataProviderItem,
  buildDescriptionField,
  buildExternalDataProvider,
  buildForm,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSubmitField,
  buildSubSection,
} from '@island.is/application/core'
import {
  DefaultEvents,
  Form,
  FormModes,
  NationalRegistrySpouseApi,
  NationalRegistryUserApi,
  UserProfileApi,
} from '@island.is/application/types'
import Logo from '../assets/Logo'
import { NO, YES } from '../lib/constants'
import { oldAgePensionFormMessage } from '../lib/messages'
import { getApplicationAnswers } from '../lib/oldAgePensionUtils'

export const PrerequisitesForm: Form = buildForm({
  id: 'OldAgePensionPrerequisites',
  title: oldAgePensionFormMessage.shared.formTitle,
  logo: Logo,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'prerequisites',
      title: oldAgePensionFormMessage.shared.prerequisitesSection,
      children: [
        buildSubSection({
          id: 'information',
          title: 'Til upplýsinga',
          children: [
          ],
        }),
        buildSubSection({
          id: 'externalData',
          title: oldAgePensionFormMessage.shared.externalDataSubSection,
          children: [
            buildExternalDataProvider({
              id: 'approveExternalData',
              title: oldAgePensionFormMessage.shared.externalDataSubSection,
              checkboxLabel: oldAgePensionFormMessage.shared.checkboxProvider,
              dataProviders: [
                buildDataProviderItem({
                  provider: UserProfileApi,
                  title:
                    oldAgePensionFormMessage.shared.userProfileInformationTitle,
                  subTitle:
                    oldAgePensionFormMessage.shared
                      .userProfileInformationSubTitle,
                }),
                buildDataProviderItem({
                  provider: NationalRegistryUserApi,
                  title: oldAgePensionFormMessage.shared.skraInformationTitle,
                  subTitle:
                    oldAgePensionFormMessage.shared.skraInformationSubTitle,
                }),
                buildDataProviderItem({
                  provider: NationalRegistrySpouseApi,
                  title: oldAgePensionFormMessage.shared.skraInformationTitle,
                  subTitle:
                    oldAgePensionFormMessage.shared.skraInformationSubTitle,
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'questions',
          title: oldAgePensionFormMessage.shared.questionTitle,
          children: [
            buildMultiField({
              id: 'questions',
              title: oldAgePensionFormMessage.shared.questionTitle,
              children: [
                buildRadioField({
                  id: 'questions.pensionFund',
                  title:
                    oldAgePensionFormMessage.shared.pensionFundQuestionTitle,
                  description: '',
                  options: [
                    { value: YES, label: oldAgePensionFormMessage.shared.yes },
                    { value: NO, label: oldAgePensionFormMessage.shared.no },
                  ],
                  width: 'half',
                }),
                buildCustomField({
                  id: '......',
                  title: 'Hvert sækir TR upplýsingarnar sínar',
                  component: 'FieldAccordionCard',
                  description:
                    oldAgePensionFormMessage.shared.pensionFundAlertDescription,
                  doesNotRequireAnswer: true,
                }),
                buildCustomField({
                  id: 'question.pensionFundAlert',
                  title: oldAgePensionFormMessage.shared.pensionFundAlertTitle,
                  component: 'FieldAlertMessage',
                  description:
                    oldAgePensionFormMessage.shared.pensionFundAlertDescription,
                  doesNotRequireAnswer: true,
                  condition: (answers) => {
                    const { pensionFundQuestion } = getApplicationAnswers(
                      answers,
                    )

                    return pensionFundQuestion === NO
                  },
                }),
                buildRadioField({
                  id: 'questions.abroad',
                  title: oldAgePensionFormMessage.shared.abroadQuestionTitle,
                  description: '',
                  options: [
                    { value: YES, label: oldAgePensionFormMessage.shared.yes },
                    { value: NO, label: oldAgePensionFormMessage.shared.no },
                  ],
                  width: 'half',
                }),
                buildSubmitField({
                  id: 'toDraft',
                  title: oldAgePensionFormMessage.shared.confirmationTitle,
                  refetchApplicationAfterSubmit: true,
                  actions: [
                    {
                      event: DefaultEvents.SUBMIT,
                      name: oldAgePensionFormMessage.shared.startApplication,
                      type: 'primary',
                      condition: (answers) => {
                        const { pensionFundQuestion } = getApplicationAnswers(
                          answers,
                        )

                        return pensionFundQuestion !== NO
                      },
                    },
                  ],
                }),
              ],
            }),
            // Has to be here so that the submit button appears (does not appear if no screen is left).
            // Tackle that as AS task.
            buildDescriptionField({
              id: 'unused',
              title: '',
              description: '',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'applicant',
      title: oldAgePensionFormMessage.shared.applicantSection,
      children: [],
    }),
    buildSection({
      id: 'arrangement',
      title: oldAgePensionFormMessage.shared.arrangementSection,
      children: [],
    }),
    buildSection({
      id: 'relatedApplications',
      title: oldAgePensionFormMessage.shared.relatedApplicationsSection,
      children: [],
    }),
    buildSection({
      id: 'comment',
      title: oldAgePensionFormMessage.shared.commentSection,
      children: [],
    }),
    buildSection({
      id: 'confirmation',
      title: oldAgePensionFormMessage.shared.confirmationSection,
      children: [],
    }),
  ],
})
