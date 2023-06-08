import { defineMessages } from 'react-intl'

export const indictment = defineMessages({
  heading: {
    id: 'judicial.system.core:indictments_indictment.heading',
    defaultMessage: 'Ákæra',
    description: 'Notaður sem titill á ákæra skrefi í ákærum.',
  },
  indictmentIntroductionTitle: {
    id: 'judicial.system.core:indictments_indictment.indictment_introduction_title',
    defaultMessage: 'Inngangur',
    description:
      'Notaður sem titill á Inngangur svæði á ákæra skrefi í ákærum.',
  },
  indictmentIntroductionLabel: {
    id: 'judicial.system.core:indictments_indictment.indictment_introduction_label',
    defaultMessage: 'Inngangur',
    description:
      'Notaður sem titill á Inngangur textasvæði á ákæra skrefi í ákærum.',
  },
  indictmentIntroductionPlaceholder: {
    id: 'judicial.system.core:indictments_indictment.indictment_introduction_placeholder',
    defaultMessage: 'Hver höfðar sakamál á hendur hverjum?',
    description:
      'Notaður sem skýritexti á Inngangur textasvæði á ákæra skrefi í ákærum.',
  },
  indictmentIntroductionAutofillAnnounces: {
    id: 'judicial.system.core:indictments_indictment.indictment_introduction_autofill_announces',
    defaultMessage: 'gjörir kunnugt:',
    description:
      'Notaður sem sjálfgefinn texti í Inngangur textasvæði á ákæra skrefi í ákærum.',
  },
  indictmentIntroductionAutofillCourt: {
    id: 'judicial.system.core:indictments_indictment.indictment_introduction_court',
    defaultMessage: 'Að höfða ber sakamál fyrir {court} á hendur',
    description:
      'Notaður sem sjálfgefinn texti í Inngangur textasvæði á ákæra skrefi í ákærum.',
  },
  indictmentIntroductionAutofillDefendant: {
    id: 'judicial.system.core:indictments_indictment.indictment_introduction_defendant_name',
    defaultMessage: '{defendantName}, kt. {defendantNationalId}',
    description:
      'Notaður sem sjálfgefinn texti í Inngangur textasvæði á ákæra skrefi í ákærum.',
  },
  indictmentCountHeading: {
    id: 'judicial.system.core:indictments_indictment.indictment_count_heading',
    defaultMessage: 'Ákæruliður {count}',
    description: 'Notaður sem titill á ákærulið.',
  },
  addIndictmentCount: {
    id: 'judicial.system.core:indictments_indictment.add_indictment_count',
    defaultMessage: 'Bæta við ákærulið',
    description: 'Notaður sem texti á "Bæta við ákærulið" hnappi.',
  },
  demandsTitle: {
    id: 'judicial.system.core:indictments_indictment.demands_title',
    defaultMessage: 'Refsikrafa',
    description:
      'Notaður sem titill á Refsikrafa svæði á ákæra skrefi í ákærum.',
  },
  demandsRequestSuspension: {
    id: 'judicial.system.core:indictments_indictment.demands_request_suspesion',
    defaultMessage: 'Krefjast sviptingar',
    description:
      'Notaður sem titill á krejast sviptingar haki á ákæra skrefi í ákærum.',
  },
  demandsLabel: {
    id: 'judicial.system.core:indictments_indictment.demands_label',
    defaultMessage: 'Refsikrafa',
    description:
      'Notaður sem titill á Refsikrafa textasvæði á ákæra skrefi í ákærum.',
  },
  demandsPlaceholder: {
    id: 'judicial.system.core:indictments_indictment.demands_placeholder',
    defaultMessage: 'Þess er krafist að...',
    description:
      'Notaður sem skýritexti á Refsikrafa textasvæði á ákæra skrefi í ákærum.',
  },
  demandsAutofill: {
    id: 'judicial.system.core:indictments_indictment.demands_autofill',
    defaultMessage:
      'Þess er krafist að ákærði verði dæmdur til refsingar og til greiðslu alls sakarkostnaðar.',
    description: 'Notaður sem sjálfvirkur texti í Refsikrafa textasvæði.',
  },
  demandsAutofillWithSuspension: {
    id: 'judicial.system.core:indictments_indictment.demands_autofill_with_suspension',
    defaultMessage:
      'Þess er krafist að ákærði verði dæmdur til refsingar, til greiðslu alls sakarkostnaðar og til að sæta sviptingu ökuréttar skv. 99. gr. og 101. gr. laga nr. 77/2019.',
    description:
      'Notaður sem sjálfvirkur texti í Refsikrafa textasvæði þegar krafist er sviptingar ökuréttinda.',
  },
  pdfButtonIndictment: {
    id: 'judicial.system.core:indictments_indictment.pdf_button_indictment',
    defaultMessage: 'Ákæra - PDF',
    description: 'Notaður sem texti á hnappi til að sækja ákæru sem PDF skjal.',
  },
})
