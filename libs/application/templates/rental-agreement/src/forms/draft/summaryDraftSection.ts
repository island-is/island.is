import {
  buildCustomField,
  buildDescriptionField,
  buildHiddenInput,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { Routes } from '../../utils/enums'
import { summary, application } from '../../lib/messages'

export const SummaryDraftSection = buildSection({
  id: Routes.SUMMARY,
  title: summary.sectionName,
  children: [
    buildMultiField({
      id: Routes.SUMMARY,
      children: [
        buildDescriptionField({
          id: 'summaryTitle',
          title: summary.pageTitle,
          marginBottom: 2,
        }),
        buildDescriptionField({
          id: 'summaryFirstDescription',
          description: summary.pageDescriptionFirstParagraph,
        }),
        buildDescriptionField({
          id: 'summarySecondDescription',
          description: summary.pageDescriptionSecondparagraph,
        }),
        buildCustomField({
          id: 'summaryEditComponent',
          title: summary.pageTitle,
          component: 'SummaryEdit',
        }),
        buildSubmitField({
          id: 'toSummary',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: application.goToOverviewButton,
              type: 'primary',
            },
          ],
        }),
        buildHiddenInput({
          id: 'htmlSummary',
          defaultValue: () => {
            // Get email summary html
            const element = document.getElementById('email-summary-container')

            if (!element) {
              return null
            }

            // Create a clone of the element to avoid modifying the visible DOM
            const elementClone = element.cloneNode(true) as HTMLElement

            // Remove buttons from the cloned element only
            elementClone
              .querySelectorAll('button')
              .forEach((button) => button.remove())

            const jsonData = {
              id: element.id,
              className: element.className,
              html: elementClone.outerHTML,
            }
            return JSON.stringify(jsonData)
          },
        }),
      ],
    }),
  ],
})
