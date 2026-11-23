import {
  buildAlertMessageField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import {
  DefaultEvents,
  ExternalData,
  FormModes,
} from '@island.is/application/types'
import { FjarsyslaRikisinsLogo } from '@island.is/application/assets/institution-logos'
import { conclusion as m, sections } from '../../lib/messages'
import { submitFailedWithPreviewChanged } from '../../utils/submitResult'
import {
  employmentHistoryStubSection,
  externalDataStubSection,
  personalInformationStubSection,
} from '../stubSections'
import { buildWhatNextField } from '../whatNextField'

const previewChanged = (_answers: unknown, externalData: ExternalData) =>
  submitFailedWithPreviewChanged(externalData)

const otherFailure = (answers: unknown, externalData: ExternalData) =>
  !previewChanged(answers, externalData)

/**
 * A retry sends the same answers again. Only after `409 preview_changed` can
 * the applicant go back and check the history instead.
 */
export const SubmissionFailedForm = buildForm({
  id: 'submissionFailedForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
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
          id: 'submissionFailedMultiField',
          title: m.title,
          children: [
            buildAlertMessageField({
              id: 'failedAlert',
              alertType: 'error',
              title: m.failedTitle,
              message: m.failedMessage,
              condition: otherFailure,
            }),
            buildAlertMessageField({
              id: 'previewChangedAlert',
              alertType: 'warning',
              title: m.previewChangedTitle,
              message: m.previewChangedMessage,
              condition: previewChanged,
            }),
            buildWhatNextField({
              title: m.failedWhatNextHeader,
              introText: m.failedWhatNextIntro,
              description: m.failedWhatNextDescription,
            }),
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.EDIT,
                  name: m.backToHistoryButton,
                  type: 'primary',
                  condition: previewChanged,
                },
                {
                  event: DefaultEvents.SUBMIT,
                  name: m.retryButton,
                  type: 'primary',
                  condition: otherFailure,
                },
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})
