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
  buttons: defineMessages({
    asDocument: {
      id: 'ojoi.application:attachments.buttons.additionType.asDocument',
      defaultMessage: 'Bæta við viðaukum',
      description: 'Label of the button to add documents',
    },
    asAttachment: {
      id: 'ojoi.application:attachments.buttons.additionType.asAttachment',
      defaultMessage: 'Hlaða upp skjölum',
      description: 'Label of the button to upload attachments',
    },
    removeAddition: {
      id: 'ojoi.application:attachments.buttons.removeAddition',
      defaultMessage: 'Fjarlægja viðauka',
      description: 'Label of the button to remove an addition',
    },
    addAddition: {
      id: 'ojoi.application:attachments.buttons.addAddition',
      defaultMessage: 'Bæta við viðauka',
      description: 'Label of the button to add an addition',
    },
  }),
  additions: defineMessages({
    title: {
      id: 'ojoi.application:attachments.additions.title',
      defaultMessage: 'Viðauki {index}',
      description: 'Title of the additions section',
    },
  }),
  inputs: {
    fileUpload: defineMessages({
      header: {
        id: 'ojoi.application:attachments.fileUpload.header',
        defaultMessage: 'Dragðu skjöl hingað til að hlaða upp',
        description: 'Heading of the file upload input',
      },
      description: {
        id: 'ojoi.application:attachments.fileUpload.description',
        defaultMessage:
          'Tekið er við skjölum með endingu: .pdf. Veldu eitt skjal í einu til að stýra röðun.',
        description: 'Description of the file upload input',
      },
      buttonLabel: {
        id: 'ojoi.application:attachments.fileUpload.buttonLabel',
        defaultMessage: 'Veldu skjal',
        description: 'Label of the upload button of the file upload input',
      },
    }),
    radio: {
      title: defineMessages({
        label: {
          id: 'ojoi.application:attachments.radio.title.label',
          defaultMessage: 'Viðaukar eða fylgiskjöl',
          description: 'Label of the radio buttons',
        },
      }),
      numeric: defineMessages({
        label: {
          id: 'ojoi.application:attachments.radio.additions.label',
          defaultMessage: 'Viðauki (1, 2, 3..)',
          description: 'Label of the additions radio button',
        },
      }),
      roman: defineMessages({
        label: {
          id: 'ojoi.application:attachments.radio.documents.label',
          defaultMessage: 'Viðauki (I, II, III..)',
          description: 'Label of the documents radio button',
        },
      }),
    },
  },
}
