import { defineMessages } from 'react-intl'

export const appealSections = defineMessages({
  disclaimerV2: {
    id: 'judicial.system.core:appeal_sections.disclaimer',
    defaultMessage:
      'Dómari kynnir rétt til að kæra úrskurð og um kærufrest skv. 193. gr. laga nr. 88/2008.',
    description:
      'Notaður sem texti í "Ákvörðun um kæru" hlutanum á þingbókar skrefi í öllum málategundum.',
  },
  titleV2: {
    id: 'judicial.system.core:appeal_sections.title',
    defaultMessage: 'Ákvörðun um kæru',
    description:
      'Notaður sem titill fyrir "Ákvörðun um kæru" hlutann á þingbókar skrefi í öllum málategundum.',
  },
  defendantTitleV2: {
    id: 'judicial.system.core:appeal_sections.defendant_title',
    defaultMessage: 'Afstaða varnaraðila til málsins í lok þinghalds',
    description:
      'Notaður sem titill fyrir "Afstaða varnaraðila til málsins í lok þinghalds" spjald á þingbókar skrefi í öllum málategundum.',
  },
  defendantAppealV2: {
    id: 'judicial.system.core:appeal_sections.defendant_appeal',
    defaultMessage: 'Varnaraðili kærir úrskurðinn',
    description:
      'Notaður sem texti við valmöguleika varnaraðila um að kæra úrskurðinn radio takkann á þingbókar skrefi í öllum málategundum.',
  },
  defendantAnnouncementAutofillSpokespersonAppealV2: {
    id: 'judicial.system.core:appeal_sections.defendant_announcement_autofill_spokesperson_appeal',
    defaultMessage:
      'Talsmaður varnaraðila kærir úrskurðinn í því skyni að úrskurðurinn verði felldur úr gildi.',
    description:
      'Notaður sem texti sem segir til um í hvaða skyni er kært þegar talsmaður varnaraðila kærir úrskurð í þinghaldi.',
  },
  defendantAnnouncementAutofillAppealV2: {
    id: 'judicial.system.core:appeal_sections.defendant_announcement_autofill_appeal',
    defaultMessage:
      'Varnaraðili kærir úrskurðinn í því skyni að úrskurðurinn verði felldur úr gildi{caseType, select, CUSTODY {, en til vara að gæsluvarðhaldi verði markaður skemmri tími/ honum verði gert að sæta farbanni í stað gæsluvarðahalds} other {}}.',
    description:
      'Notaður sem texti sem segir til um í hvaða skyni er kært þegar varnaraðili kærir úrskurð í þinghaldi.',
  },
  defendantAcceptV2: {
    id: 'judicial.system.core:appeal_sections.defendant_accept',
    defaultMessage: 'Varnaraðili unir úrskurðinum',
    description:
      'Notaður sem texti við valmöguleika varnaraðila um að una úrskurðinum radio takkann á þingbókar skrefi í öllum málategundum.',
  },
  defendantPostponeV2: {
    id: 'judicial.system.core:appeal_sections.defendant_postpone',
    defaultMessage: 'Varnaraðili tekur sér lögboðinn frest',
    description:
      'Notaður sem texti við valmöguleika varnaraðila um lögbundinn frest radio takkann á þingbókar skrefi í öllum málategundum.',
  },
  defendantNotApplicableV2: {
    id: 'judicial.system.core:appeal_secions.defendant_not_applicable',
    defaultMessage: 'Á ekki við',
    description:
      'Notaður sem texti við valmöguleika kærða um á ekki við radio takkann á þingbókar skrefi í öllum málategundum.',
  },
  defendantAnnouncementLabelV2: {
    id: 'judicial.system.core:appeal_secions.defendant_announcement_label',
    defaultMessage: 'Yfirlýsing varnaraðila',
    description:
      'Notaður sem titill á "Yfirlýsing varnaraðila" innsláttarsvæði á þingbókar skrefi í öllum málategundum.',
  },
  defendantAnnouncementPlaceholderV2: {
    id: 'judicial.system.core:appeal_secions.defendant_announcement_placeholder',
    defaultMessage:
      'Hér er hægt að bóka frekar um það sem varnaraðili vill taka fram ef við á.',
    description:
      'Notaður sem placeholder í "Yfirlýsing varnaraðila" innsláttarsvæði á þingbókar skrefi í öllum málategundum.',
  },
  prosecutorTitleV2: {
    id: 'judicial.system.core:appeal_sections.prosecutor_title',
    defaultMessage: 'Afstaða sækjanda til málsins í lok þinghalds',
    description:
      'Notaður sem titill fyrir "Afstaða sækjanda til málsins í lok þinghalds" spjald á þingbókar skrefi í öllum málategundum.',
  },
  prosecutorAppealV2: {
    id: 'judicial.system.core:appeal_sections.prosecutor_appeal',
    defaultMessage: 'Sækjandi kærir úrskurðinn',
    description:
      'Notaður sem texti við valmöguleika sækjanda um að kæra úrskurðinn radio takkann á þingbókar skrefi í öllum málategundum.',
  },
  prosecutorAnnoncementAutofillAppealV2: {
    id: 'judicial.system.core:appeal_sections.prosecutor_announcement_autofill_appeal',
    defaultMessage:
      'Sækjandi kærir úrskurðinn í því skyni að úrskurðurinn verði felldur úr gildi og krafa hans verði tekin til greina.',
    description:
      'Notaður sem texti sem segir til um í hvaða skyni er kært þegar sækjandi kærir úrskurð í þinghaldi.',
  },
  prosecutorAcceptV2: {
    id: 'judicial.system.core:appeal_sections.prosecutor_accept',
    defaultMessage: 'Sækjandi unir úrskurðinum',
    description:
      'Notaður sem texti við valmöguleika sækjanda um að una úrskurðinum radio takkann á þingbókar skrefi í öllum málategundum.',
  },
  prosecutorPostponeV2: {
    id: 'judicial.system.core:appeal_sections.prosecutor_postpone',
    defaultMessage: 'Sækjandi tekur sér lögboðinn frest',
    description:
      'Notaður sem texti við valmöguleika sækjanda um lögbundinn frest radio takkann á þingbókar skrefi í öllum málategundum.',
  },
  prosecutorNotApplicableV2: {
    id: 'judicial.system.core:appeal_sections.prosecutor_not_applicable',
    defaultMessage: 'Á ekki við',
    description:
      'Notaður sem texti við valmöguleika sækjanda um á ekki við radio takkann á þingbókar skrefi í öllum málategundum.',
  },
  prosecutorAnnouncementLabelV2: {
    id: 'judicial.system.core:appeal_sections.prosecutor_announcement_label',
    defaultMessage: 'Yfirlýsing sækjanda',
    description:
      'Notaður sem titill á "Yfirlýsing sækjanda" innsláttarsvæði á þingbókar skrefi í í öllum málategundum.',
  },
  prosecutorAnnouncementPlaceholderV2: {
    id: 'judicial.system.core:appeal_sections.prosecutor_announcement_placeholder',
    defaultMessage:
      'Hér er hægt að bóka frekar um það sem sækjandi vill taka fram ef við á.',
    description:
      'Notaður sem placeholder í "Yfirlýsing sækjanda" innsláttarsvæði á þingbókar skrefi í í öllum málategundum.',
  },
})
