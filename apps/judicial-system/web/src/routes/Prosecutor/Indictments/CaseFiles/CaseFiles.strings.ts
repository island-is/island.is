import { defineMessage } from 'react-intl'

export const caseFiles = {
  heading: defineMessage({
    id: 'judicial.system.indictments:case_files.heading',
    defaultMessage: 'Dómskjöl',
    description: 'Notaður sem titill á dómskjöl skrefi í ákærum.',
  }),
  sections: {
    inputFieldLabel: defineMessage({
      id: 'judicial.system.indictments:case_files.sections.input_field_label',
      defaultMessage: 'Dragðu gögn hingað til að hlaða upp',
      description: 'Texti í öllum file upload svæðum.',
    }),
    buttonLabel: defineMessage({
      id: 'judicial.system.indictments:case_files.sections.button_label',
      defaultMessage: 'Velja gögn til að hlaða upp',
      description: 'Texti í tökkum í öllum file upload svæðum.',
    }),
    coverLetter: defineMessage({
      id: 'judicial.system.indictments:case_files.sections.cover_letter',
      defaultMessage: 'Fylgibréf',
      description: 'Titill á fylgibréf hluta á dómskjalaskjá í ákærum.',
    }),
    indictment: defineMessage({
      id: 'judicial.system.indictments:case_files.sections.indictment',
      defaultMessage: 'Ákæra',
      description: 'Titill á ákæra hluta á dómskjalaskjá í ákærum.',
    }),
    criminalRecord: defineMessage({
      id: 'judicial.system.indictments:case_files.sections.criminal_record',
      defaultMessage: 'Sakavottorð',
      description: 'Titill á sakavottorð hluta á dómskjalaskjá í ákærum.',
    }),
    costBreakdown: defineMessage({
      id: 'judicial.system.indictments:case_files.sections.cost_breakdown',
      defaultMessage: 'Sakarkostnaður',
      description: 'Titill á sakarkostnaður hluta á dómskjalaskjá í ákærum.',
    }),
    otherDocuments: defineMessage({
      id: 'judicial.system.indictments:case_files.sections.other_documents',
      defaultMessage: 'Önnur gögn',
      description: 'Titill á önnur gögn hluta á dómskjalaskjá í ákærum.',
    }),
  },
}
