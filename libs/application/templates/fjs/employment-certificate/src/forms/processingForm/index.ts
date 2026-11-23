import {
  buildAlertMessageField,
  buildCustomField,
  buildForm,
  buildMessageWithLinkButtonField,
  buildMultiField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { Application, FormModes } from '@island.is/application/types'
import { FjarsyslaRikisinsLogo } from '@island.is/application/assets/institution-logos'
import { conclusion as m, sections } from '../../lib/messages'
import { COMMENT_ANSWER, MY_PAGES_PATH } from '../../utils/constants'
import {
  employmentHistoryStubSection,
  externalDataStubSection,
  personalInformationStubSection,
} from '../stubSections'
import { buildWhatNextField } from '../whatNextField'

const hasComment = (answers: Application['answers']) =>
  !!getValueViaPath<string>(answers, COMMENT_ANSWER)?.trim()

export const ProcessingForm = buildForm({
  id: 'processingForm',
  mode: FormModes.COMPLETED,
  logo: FjarsyslaRikisinsLogo,
  children: [
    externalDataStubSection,
    personalInformationStubSection,
    employmentHistoryStubSection,
    buildSection({
      id: 'conclusion',
      title: sections.conclusion,
      children: [
        buildMultiField({
          id: 'processingMultiField',
          title: m.title,
          children: [
            buildAlertMessageField({
              id: 'processingAlert',
              alertType: 'success',
              title: ({ answers }) =>
                hasComment(answers) ? m.commentReviewTitle : m.processingTitle,
              message: ({ answers }) =>
                hasComment(answers)
                  ? m.commentReviewMessage
                  : m.processingMessage,
            }),
            buildCustomField({
              id: 'commentSummary',
              component: 'CommentSummary',
              doesNotRequireAnswer: true,
            }),
            buildWhatNextField({
              introText: ({ answers }) =>
                hasComment(answers) ? m.reviewWhatNextIntro : m.whatNextIntro,
              description: ({ answers }) =>
                hasComment(answers)
                  ? m.reviewWhatNextDescription
                  : m.whatNextDescription,
            }),
            buildMessageWithLinkButtonField({
              id: 'myPagesLink',
              url: MY_PAGES_PATH,
              message: ({ answers }) =>
                hasComment(answers)
                  ? m.reviewActionMessage
                  : m.processingActionMessage,
              buttonTitle: m.myPagesButton,
              marginTop: 4,
            }),
          ],
        }),
      ],
    }),
  ],
})
