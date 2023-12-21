import { defineMessages } from 'react-intl'

export const additionsAndDocuments = {
  general: defineMessages({
    formTitle: {
      id: 'ojoi.application:additionsAndDocuments.general.formTitle',
      defaultMessage: 'Viðaukar og fylgirit',
      description: 'Title of the addition and documents form',
    },
    formIntro: {
      id: 'ojoi.application:additionsAndDocuments.general.formIntro',
      defaultMessage:
        'Hér skal skrá fylgiskjöl og viðauka sem eiga að birtast með auglýsingu á vef Stjórnartíðinda. Önnur gögn sem tilheyra meginmáli auglýsingar (t.d. myndefni) ætti að skrá gegnum ritil fyrir meginmálið.',
      description: 'Intro of the addition and documents form',
    },
    sectionTitle: {
      id: 'ojoi.application:additionsAndDocuments.general.sectionTitle',
      defaultMessage: 'Viðaukar og fylgirit',
      description: 'Title of the addition and documents section',
    },
  }),
  fileUpload: defineMessages({
    header: {
      id: 'ojoi.application:additionsAndDocuments.fileUpload.header',
      defaultMessage: 'Dragðu skjalið hingað til að hlaða upp',
      description: 'Heading of the file upload input',
    },
    description: {
      id: 'ojoi.application:additionsAndDocuments.fileUpload.description',
      defaultMessage: 'Tekið er við skjölum með endingu: .pdf',
      description: 'Description of the file upload input',
    },
    buttonLabel: {
      id: 'ojoi.application:additionsAndDocuments.fileUpload.buttonLabel',
      defaultMessage: 'Velja skjöl til að hlaða upp',
      description: 'Label of the upload button of the file upload input',
    },
  }),
  nameOfDocumentsChapter: defineMessages({
    title: {
      id: 'ojoi.application:additionsAndDocuments.nameOfDocumentsChapter.title',
      defaultMessage: 'Við birtingu verða skjölin nefnd:',
      description: 'Title of the name of documents chapter',
    },
  }),
  radio: {
    additions: defineMessages({
      label: {
        id: 'ojoi.application:additionsAndDocuments.radio.additions.label',
        defaultMessage: 'Viðaukar',
        description: 'Label of the additions radio button',
      },
    }),
    documents: defineMessages({
      label: {
        id: 'ojoi.application:additionsAndDocuments.radio.documents.label',
        defaultMessage: 'Fylgirit',
        description: 'Label of the documents radio button',
      },
    }),
  },
}
