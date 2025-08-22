import { dedent } from 'ts-dedent'

import { PdfLinkButtonFormField } from './PdfLinkButtonFormField'

const createMockApplication = (data = {}) => ({
  id: '123',
  assignees: [],
  state: data.state || 'draft',
  applicant: '111111-3000',
  typeId: data.typeId || 'ExampleForm',
  modified: new Date(),
  created: new Date(),
  attachments: {},
  answers: data.answers || {},
  externalData: {
    payment: {
      data: [
        {
          priceAmount: 100,
          chargeItemName: 'lorem',
          chargeItemCode: 'ipsum',
        },
      ],
    },
  },
})

export default {
  title: 'Application System/PdfLinkButtonFormField',
  component: PdfLinkButtonFormField,
}

export const Default = {
  render: () => (
    <PdfLinkButtonFormField
      application={createMockApplication()}
      field={{
        id: 'field.id',
        title: 'Field title',
        verificationDescription: 'Verification description here',
        verificationLinkTitle: 'Verification link title here',
        verificationLinkUrl: 'https://island.is/sannreyna',

        getPdfFiles: () => [
          {
            base64: 'abc123',
            buttonText: 'Pdf button text here',
            filename: 'file1.pdf',
          },
          {
            base64: 'abc123',
            buttonText: 'Other pdf button text here',
            filename: 'file2.pdf',
          },
        ],

        setViewPdfFile: () => {
          console.log('Display PDF using <PDFViewer />')
        },

        viewPdfFile: true,
      }}
    />
  ),

  name: 'Default',
}
