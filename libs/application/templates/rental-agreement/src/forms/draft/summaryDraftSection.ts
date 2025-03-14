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
              element
                .querySelectorAll('button')
                .forEach((button) => button.remove())

              const styles = `
                <style type="text/css">
                  label {
                    font-weight: bold;
                    display: inline-block;
                    margin-right: 4px;
                  }
                  label::after {
                    content: ":";
                    display: inline-block;
                  }
                  [class*="useBoxStyles_3"] {
                    border-bottom: 1px solid;
                    margin: 20px 0;
                    padding-bottom: 20px;
                  }
                  p {
                    display: inline-block;
                  }
                </style>
              `

              const styledHtml = `
              <html>
              <head>${styles}</head>
                <body>
                    ${element.outerHTML} 
                </body>
                </html>
              `

              const jsonData = {
                id: element.id,
                className: element.className,
                html: element.outerHTML,
              }

              return JSON.stringify(jsonData)
            }
            return null
          },
        }),
      ],
    }),
  ],
})
