import { defineMessage } from 'react-intl'

export const courtDocuments = {
  header: defineMessage({
    id: 'judicial.system.core:court_documents.header',
    defaultMessage: 'Dómskjöl',
    description:
      'Notað sem fyrirsögn í "Dómskjöl" textaboxi á þingbókar skrefi í rannsóknarheimildum.',
  }),
  tag: defineMessage({
    id: 'judicial.system.core:court_documents.tag',
    defaultMessage: 'Þingmerkt nr. {index}',
    description:
      'Notaður sem text í Þingmerkt nr. # taggi í "Lagt er fram" svæði á þingbókarskjám',
  }),
  text: defineMessage({
    id: 'judicial.system.core:court_documents.text',
    defaultMessage: 'Rannsóknargögn málsins liggja frammi.',
    description:
      'Notað sem útskýringar texti í "Dómskjöl" textaboxi á þingbókar skrefi í rannsóknarheimildum.',
  }),
  add: {
    label: defineMessage({
      id: 'judicial.system.core:courtDocuments.add.label',
      defaultMessage: 'Heiti dómsskjals',
      description:
        'Notaður sem titill fyrir í "Heiti dómskjals" textaboxi í "Lagt er fram" svæði á þingbókarskjám',
    }),
    placeholder: defineMessage({
      id: 'judicial.system.core:courtDocuments.add.placeholder',
      defaultMessage: 'Skrá inn heiti á skjali hér',
      description:
        'Notaður sem skýritexti í "Heiti dómskjals" textaboxi í "Lagt er fram" svæði á þingbókarskjám',
    }),
    buttonText: defineMessage({
      id: 'judicial.system.core:courtDocuments.add.button_text',
      defaultMessage: 'Bæta við skjali',
      description:
        'Texti í "Bæta við skjali" takka í "Lagt er fram" svæði á þingbókarskjám',
    }),
  },
  whoFiled: {
    prosecutor: defineMessage({
      id: 'judicial.system.core:court_documents.who_filed.prosecutor',
      defaultMessage: 'Sóknaraðili lagði fram',
      description:
        'Notaður sem text fyrir "Hver lagði fram?" í dómskjala upphlöðun þegar sóknaraðili leggur fram dómsskjal',
    }),
    defendant: defineMessage({
      id: 'judicial.system.core:court_documents.who_filed.defendant',
      defaultMessage: 'Varnaraðili lagði fram',
      description:
        'Notaður sem text fyrir "Hver lagði fram?" í dómskjala upphlöðun þegar varnaraðili leggur fram dómsskjal',
    }),
    court: defineMessage({
      id: 'judicial.system.core:court_documents.who_filed.court',
      defaultMessage: 'Dómurinn lagði fram',
      description:
        'Notaður sem text fyrir "Hver lagði fram?" í dómskjala upphlöðun þegar dómurinn leggur fram dómsskjal',
    }),
  },
}
