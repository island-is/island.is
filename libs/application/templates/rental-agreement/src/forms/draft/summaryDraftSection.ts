import {
  buildCustomField,
  buildDescriptionField,
  buildHiddenInput,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { summary } from '../../lib/messages'

export const SummaryDraftSection = buildSection({
  id: 'summary',
  title: summary.sectionName,
  children: [
    buildMultiField({
      id: 'summary',
      title: '',
      children: [
        buildDescriptionField({
          id: 'summaryTitle',
          title: summary.pageTitle,
          marginBottom: 2,
        }),
        buildDescriptionField({
          id: 'summaryFirstDescription',
          title: '',
          description: summary.pageDescriptionFirstParagraph,
        }),
        buildDescriptionField({
          id: 'summarySecondDescription',
          title: '',
          description: summary.pageDescriptionSecondparagraph,
        }),
        buildCustomField({
          id: 'summaryEditComponent',
          title: 'Samantekt',
          component: 'SummaryEdit',
        }),
        buildSubmitField({
          id: 'toSummary',
          title: 'í yfirlit',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: 'Áfram í yfirlit',
              type: 'primary',
            },
          ],
        }),
        buildHiddenInput({
          id: 'htmlSummary',
          defaultValue: () => {
            const element = document.getElementById('my-super-email-summary')
            if (element) {
              const jsonData = {
                  id: element.id,
                  className: element.className,
                  html: element.outerHTML,
              };
          
              console.log('JSON Data:', JSON.stringify(jsonData));
              return JSON.stringify(jsonData);
          }
          return null;
          },
        })
      ],
    }),
  ],
})
