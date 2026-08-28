import {
  buildAlertMessageField,
  buildCustomField,
  buildExpandableDescriptionField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { messages } from '../../lib/messages'
import { hasNotSeenPostponeReceipt } from '../../utils/salaryAnalysisNavigation'

// Hand-rolled rather than buildFormConclusionSection: the screen needs
// PostponeReceiptMarker alongside the conclusion content, and the helper takes
// no extra children. It also skips the helper's "Opna Mínar síður" link field —
// with every other section conditioned away this is the form's last screen, so
// the shell's own last-screen button already offers that exit.
export const postponeReceiptSection = buildSection({
  id: 'postponeReceipt',
  title: messages.postponed.introSectionTitle,
  tabTitle: messages.postponed.introSectionTitle,
  condition: hasNotSeenPostponeReceipt,
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
          // Not an answer path: the field registers no input and the flag
          // reaches the server through the component's own mutation.
          id: 'postponeReceiptMarker',
          title: '',
          component: 'PostponeReceiptMarker',
          doesNotRequireAnswer: true,
        }),
      ],
    }),
  ],
})
