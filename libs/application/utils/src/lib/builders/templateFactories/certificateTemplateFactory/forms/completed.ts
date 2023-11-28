import { Form } from '@island.is/application/types'
import { startForm } from '../../../form/formBuilder'

export const generateCompleted = (title: string): Form => {
  const completed = {
    id: 'SampleFormId',
    title: title,
    mode: 'draft',
    type: 'FORM',
    renderLastScreenBackButton: false,
    renderLastScreenButton: false,
    children: [
      {
        id: 'section1',
        title: 'Umsókn send inn!',
        type: 'SECTION',
        children: [
          {
            id: 'multifield1',
            title: title,
            type: 'MULTI_FIELD',
            children: [
              {
                id: 'pdfViewer',
                title: 'PDF viewer',
                type: 'PDF_VIEWER',
                children: null,
                component: 'PdfViewerFormField',
                pdfKey: 'criminalRecord.data.contentBase64',
                openMySitesLabel: 'Opna í Mínum síðum',
                downloadPdfButtonLabel: 'Sækja PDF',
                successTitle: 'Tókst',
                successDescription: 'Umsókn þín hefur verið móttekin.',
                verificationDescription:
                  'Vinsamlegast staðfestu upplýsingar hér að neðan.',
                verificationLinkTitle: 'Leiðbeiningar um staðfestingu',
                verificationLinkUrl: 'https://verification-url-example.com',
                viewPdfButtonLabel: 'Skoða PDF',
                openInboxButtonLabel: 'Opna tölvupóstinn',
                confirmationMessage: 'Upplýsingum þínum hefur verið staðfest.',
              },
            ],
          },
        ],
      },
    ],
  }
  return startForm('Completed').endForm()
}
