import { defineMessages } from 'react-intl'

export const attachments = {
  general: defineMessages({
    title: {
      id: 'ojoi.application:attachments.general.title',
      defaultMessage: 'Viðaukar og fylgiskjöl',
      description: 'Title of the addition and documents form',
    },
    intro: {
      id: 'ojoi.application:attachments.general.intro',
      defaultMessage:
        'Hér skal skrá fylgiskjöl og viðauka sem eiga að birtast með auglýsingu á vef Stjórnartíðinda. Önnur gögn sem tilheyra meginmáli auglýsingar (t.d. myndefni) ætti að skrá gegnum ritil fyrir meginmálið.',
      description: 'Intro of the addition and documents form',
    },
    section: {
      id: 'ojoi.application:attachments.general.section',
      defaultMessage: 'Viðaukar og fylgiskjöl',
      description: 'Title of the addition and documents section',
    },
  }),
  headings: defineMessages({
    fileNames: {
      id: 'ojoi.application:attachments.headings.fileNames',
      defaultMessage: 'Við birtingu verða skjölin nefnd:',
      description: 'Heading of the attachments section',
    },
  }),
  inputs: {
    fileUpload: defineMessages({
      header: {
        id: 'ojoi.application:attachments.fileUpload.header',
        defaultMessage: 'Dragðu skjalið hingað til að hlaða upp',
        description: 'Heading of the file upload input',
      },
      description: {
        id: 'ojoi.application:attachments.fileUpload.description',
        defaultMessage: 'Tekið er við skjölum með endingu: .pdf',
        description: 'Description of the file upload input',
      },
      buttonLabel: {
        id: 'ojoi.application:attachments.fileUpload.buttonLabel',
        defaultMessage: 'Velja skjöl til að hlaða upp',
        description: 'Label of the upload button of the file upload input',
      },
    }),
    radio: {
      additions: defineMessages({
        label: {
          id: 'ojoi.application:attachments.radio.additions.label',
          defaultMessage: 'Viðaukar (1, 2, 3..)',
          description: 'Label of the additions radio button',
        },
      }),
      documents: defineMessages({
        label: {
          id: 'ojoi.application:attachments.radio.documents.label',
          defaultMessage: 'Fylgiskjöl (I, II, III..)',
          description: 'Label of the documents radio button',
        },
      }),
    },
  },
}
