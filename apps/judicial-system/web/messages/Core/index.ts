import { defineMessages } from 'react-intl'

export const core = defineMessages({
  gender: {
    id: 'judicial.system.core:gender',
    defaultMessage: 'Kyn',
    description: 'Notað fyrir orðið Kyn í öllum flæðum.',
  },
  male: {
    id: 'judicial.system.core:gender.male',
    defaultMessage: 'Karl',
    description: 'Notað fyrir orðið Karl í öllum flæðum.',
  },
  female: {
    id: 'judicial.system.core:gender.female',
    defaultMessage: 'Kona',
    description: 'Notað fyrir orðið Kona í öllum flæðum.',
  },
  otherGender: {
    id: 'judicial.system.core:gender.other',
    defaultMessage: 'Kynsegin/Annað',
    description: 'Notað fyrir orðið Kynsegin/Annað í öllum flæðum.',
  },
  nationalId: {
    id: 'judicial.system.core:national_id',
    defaultMessage: 'Kennitala',
    description: 'Notað fyrir orðið Kennitala í öllum flæðum.',
  },
  fullName: {
    id: 'judicial.system.core:full_name',
    defaultMessage: 'Fullt nafn',
    description: 'Notað fyrir orðið Fullt nafn í öllum flæðum.',
  },
  addressOrResidence: {
    id: 'judicial.system.core:address_or_residence',
    defaultMessage: 'Lögheimili/dvalarstaður',
    description: 'Notað fyrir orðið Lögheimili/dvalarstaður í öllum flæðum.',
  },
  pdfButtonRequest: {
    id: 'judicial.system.core:pdf_button_request',
    defaultMessage: 'Krafa - PDF',
    description: 'Notað fyrir texta á hnappi til að sækja kröfu sem pdf skjal.',
  },
  pdfButtonRuling: {
    id: 'judicial.system.core:pdf_button_ruling',
    defaultMessage: 'Þingbók og úrskurður - PDF',
    description:
      'Notað fyrir texta á hnappi til að sækja þingbók og úrskurð sem pdf skjal.',
  },
  pdfButtonRulingShortVersion: {
    id: 'judicial.system.core:pdf_button_ruling_short_version',
    defaultMessage: 'Þingbók án úrskurðar - PDF',
    description:
      'Notað fyrir texta á hnappi til að sækja þingbók án úrskurðar sem pdf skjal.',
  },
  pdfButtonCustodyNotice: {
    id: 'judicial.system.core:pdf_button_custody_notice',
    defaultMessage: 'Vistunarseðill - PDF',
    description:
      'Notað fyrir texta á hnappi til að sækja vistunarseðil sem pdf skjal.',
  },
  caseNumber: {
    id: 'judicial.system.core:case_number',
    defaultMessage: 'Mál nr. {caseNumber}',
    description: 'Notað fyrir texta fyrir númer á máli',
  },
  prosecutor: {
    id: 'judicial.system.core:prosecutor',
    defaultMessage: 'Sóknaraðili',
    description: 'Notað fyrir orðið sóknaraðili í öllum flæðum.',
  },
  accused: {
    id: 'judicial.system.core:accused',
    defaultMessage: 'Varnaraðili',
    description: 'Notað fyrir orðið varnaraðili í öllum flæðum.',
  },
})
