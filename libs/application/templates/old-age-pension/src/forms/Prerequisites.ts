import {
  buildAlertMessageField,
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
import { NationalRegistryResidenceHistoryApi } from '../dataProviders'

export const PrerequisitesForm: Form = buildForm({
  id: 'OldAgePensionPrerequisites',
  title: oldAgePensionFormMessage.shared.formTitle,
  logo: Logo,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'prerequisites',
      title: oldAgePensionFormMessage.pre.prerequisitesSection,
      children: [
        buildSubSection({
          id: 'externalData',
          title: oldAgePensionFormMessage.pre.externalDataSubSection,
          children: [
            buildExternalDataProvider({
              id: 'approveExternalData',
              title: oldAgePensionFormMessage.pre.externalDataSubSection,
              checkboxLabel: oldAgePensionFormMessage.pre.checkboxProvider,
              dataProviders: [
                buildDataProviderItem({
                  provider: UserProfileApi,
                  title:
                    oldAgePensionFormMessage.pre.userProfileInformationTitle,
                  subTitle:
                    oldAgePensionFormMessage.pre.userProfileInformationSubTitle,
                }),
                buildDataProviderItem({
                  provider: NationalRegistryUserApi,
                  title: oldAgePensionFormMessage.pre.skraInformationTitle,
                  subTitle:
                    oldAgePensionFormMessage.pre.skraInformationSubTitle,
                }),
                buildDataProviderItem({
                  provider: NationalRegistrySpouseApi,
                  title: oldAgePensionFormMessage.pre.skraInformationTitle,
                  subTitle:
                    oldAgePensionFormMessage.pre.skraInformationSubTitle,
                }),
                buildDataProviderItem({
                  provider: NationalRegistryResidenceHistoryApi,
                  title: 'Búsetusaga',
                  subTitle: 'Búsetusaga frá Þjóðskrá.',
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'questions',
          title: oldAgePensionFormMessage.pre.questionTitle,
          children: [
            buildMultiField({
              id: 'questions',
              title: oldAgePensionFormMessage.pre.questionTitle,
              children: [
                buildRadioField({
                  id: 'questions.pensionFund',
                  title: oldAgePensionFormMessage.pre.pensionFundQuestionTitle,
                  description: '',
                  options: [
                    { value: YES, label: oldAgePensionFormMessage.shared.yes },
                    { value: NO, label: oldAgePensionFormMessage.shared.no },
                  ],
                  width: 'half',
                }),
                buildCustomField(
                  {
                    id: 'question.pensionFundAlert',
                    title: oldAgePensionFormMessage.pre.pensionFundAlertTitle,
                    component: 'FieldAlertMessage',
                    description:
                      oldAgePensionFormMessage.pre.pensionFundAlertDescription,
                    doesNotRequireAnswer: true,
                    condition: (answers) => {
                      const { pensionFundQuestion } = getApplicationAnswers(
                        answers,
                      )

                      return pensionFundQuestion === NO
                    },
                  },
                  { type: 'warning' },
                ),
                buildRadioField({
                  id: 'questions.fishermen',
                  title: oldAgePensionFormMessage.pre.fishermenQuestionTitle,
                  description: '',
                  options: [
                    { value: YES, label: oldAgePensionFormMessage.shared.yes },
                    { value: NO, label: oldAgePensionFormMessage.shared.no },
                  ],
                  width: 'half',
                }),
                buildSubmitField({
                  id: 'toDraft',
                  title: oldAgePensionFormMessage.pre.confirmationTitle,
                  refetchApplicationAfterSubmit: true,
                  actions: [
                    {
                      event: DefaultEvents.SUBMIT,
                      name: oldAgePensionFormMessage.pre.startApplication,
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
      title: oldAgePensionFormMessage.applicant.applicantSection,
      children: [],
    }),
    buildSection({
      id: 'arrangement',
      title: oldAgePensionFormMessage.shared.arrangementSection,
      children: [],
    }),
    buildSection({
      id: 'relatedApplications',
      title:
        oldAgePensionFormMessage.connectedApplications
          .relatedApplicationsSection,
      children: [],
    }),
    buildSection({
      id: 'comment',
      title: oldAgePensionFormMessage.comment.commentSection,
      children: [],
    }),
    buildSection({
      id: 'confirmation',
      title: oldAgePensionFormMessage.review.confirmSectionTitle,
      children: [],
    }),
  ],
})
