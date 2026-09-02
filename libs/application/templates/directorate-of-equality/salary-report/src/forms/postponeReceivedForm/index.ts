import {
  buildAlertMessageField,
  buildCustomField,
  buildExpandableDescriptionField,
  buildForm,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { DirectorateOfEqualityLogo } from '@island.is/application/assets/institution-logos'
import { messages } from '../../lib/messages'

/**
 * The whole form for States.POSTPONE_RECEIVED: one screen, no way onward.
 *
 * Being the form's only screen is what makes it a dead end — ScreenFooter hands
 * the applicant the last-screen button out to Mínar síður instead of a "Halda
 * áfram" into work they have just postponed. PostponeReceiptCloser moves the
 * application to POSTPONED as they leave, so the úrbótaáætlun flow is what
 * greets them next time and this screen is not reachable again.
 *
 * Hand-rolled rather than buildFormConclusionSection: that helper takes no
 * extra children (the closer has to live here), and its "Opna Mínar síður" link
 * would duplicate the footer button on a single-screen form.
 */
export const postponeReceivedForm = buildForm({
  id: 'postponeReceivedForm',
  logo: DirectorateOfEqualityLogo,
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'postponeReceipt',
      title: messages.postponed.introSectionTitle,
      tabTitle: messages.postponed.introSectionTitle,
      children: [
        buildMultiField({
          id: 'postponeReceiptMultiField',
          title: messages.postponed.introTitle,
          children: [
            buildAlertMessageField({
              id: 'postponeReceiptAlert',
              title: messages.postponed.alertTitle,
              message: messages.postponed.introDescription,
              alertType: 'success',
            }),
            buildExpandableDescriptionField({
              id: 'postponeReceiptExpandable',
              title: messages.postponed.expandableHeader,
              introText: messages.postponed.expandableIntro,
              description: messages.postponed.expandableDescription,
              startExpanded: true,
            }),
            buildCustomField({
              // Not an answer path: the field registers no input and writes
              // nothing — it dispatches a state event.
              id: 'postponeReceiptCloser',
              title: '',
              component: 'PostponeReceiptCloser',
              doesNotRequireAnswer: true,
            }),
          ],
        }),
      ],
    }),
  ],
})
