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
  dateOfBirth: {
    id: 'judicial.system.core:date_of_birth',
    defaultMessage: 'Fæðingardagur',
    description: 'Notað fyrir orðið Fæðingardagur í öllum flæðum.',
  },
  dateOfBirthPlaceholder: {
    id: 'judicial.system.core:date_of_birth.placeholder',
    defaultMessage: 'dd.mm.áááá',
    description:
      'Notað sem skýritexti í Fæðingardagur textaboxi í öllum flæðum.',
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
  prosecutorPerson: {
    id: 'judicial.system.core:prosecutor_person',
    defaultMessage: 'Sækjandi',
    description: 'Notað fyrir orðið sækjandi í öllum flæðum.',
  },
  accused: {
    id: 'judicial.system.core:accused-v3',
    defaultMessage: 'kærð{suffix}',
    description: 'Notað fyrir orðið kærði í öllum flæðum.',
  },
  defendant: {
    id: 'judicial.system.core:defendant',
    defaultMessage: 'varnaraðil{suffix}',
    description: 'Notað fyrir orðið varnaraðili í öllum flæðum.',
  },
  sessionArrangementsNonePresent: {
    id: 'judicial.system.core:session_arrangements_none_present',
    defaultMessage:
      'Með heimild í 1. mgr. 104. gr. laga nr. 88/2008 voru hvorki varnaraðili né sóknaraðili kvaddir til þinghaldsins.',
    description: 'Notað fyrir þingbók undir mættir eru.',
  },
  indictmentDefendant: {
    id: 'judicial.system.core:indictment_defendant_v2',
    defaultMessage:
      '{gender, select, MALE {ákærði} FEMALE {ákærða} other {ákærða}}',
    description: 'Notað fyrir orðið ákærði í öllum flæðum.',
  },
  indictmentDefendants: {
    id: 'judicial.system.core:indictment_defendants',
    defaultMessage: 'ákærðu',
    description: 'Notað fyrir orðið ákærðu í öllum flæðum.',
  },
  requestCaseType: {
    id: 'judicial.system.core:request_case_type',
    defaultMessage: 'Krafa um {caseType}',
    description: 'Notað sem titill fyrir Krafa um í öllum flæðum',
  },
  court: {
    id: 'judicial.system.core:court',
    defaultMessage: 'Dómstóll',
    description: 'Notað fyrir orðið Dómstóll í öllum flæðum.',
  },
  selectGender: {
    id: 'judicial.system.core:select_gender',
    defaultMessage: 'Veldu kyn',
    description: 'Notað fyrir Veldu kyn í öllum flæðum',
  },
  citizenship: {
    id: 'judicial.system.core:citizenship',
    defaultMessage: 'Ríkisfang',
    description: 'Notað fyrir Ríkisfang í öllum flæðum',
  },
  selectCitizenship: {
    id: 'judicial.system.core:select_citizenship',
    defaultMessage: 'Veldu ríkisfang',
    description: 'Notað fyrir Veldu ríkisfang í öllum flæðum',
  },
  nationalIdNotFoundInNationalRegistry: {
    id: 'judicial.system.core:national_id_not_found_in_national_registry',
    defaultMessage: 'Ekki tókst að fletta upp kennitölu',
    description:
      'Notaður sem skilaboð um að kennitala varnaraðila hafi ekki fundist í þjóðskrá.',
  },
  judge: {
    id: 'judicial.system.core:judge',
    defaultMessage: 'Dómari',
    description: 'Notað fyrir orðið Dómari í öllum flæðum.',
  },
  registrar: {
    id: 'judicial.system.core:registrar',
    defaultMessage: 'Dómritari',
    description: 'Notað fyrir orðið Dómritari í öllum flæðum.',
  },
  policeCaseNumber: {
    id: 'judicial.system.core:police_case_number',
    defaultMessage: 'LÖKE málsnúmer',
    description: 'Notað fyrir orðið LÖKE málsnúmer í öllum flæðum.',
  },
  courtCaseNumber: {
    id: 'judicial.system.core:court_case_number',
    defaultMessage: 'Málsnúmer héraðsdóms',
    description: 'Notað fyrir orðið Málsnúmer héraðsdóms í öllum flæðum.',
  },
  caseType: {
    id: 'judicial.system.core:case_type',
    defaultMessage: 'Tegund kröfu',
    description: 'Notað fyrir orðið Tegund Kröfu í öllum flæðum.',
  },
  pastRestrictionCase: {
    id: 'judicial.system.core:past_restriction_case',
    defaultMessage:
      '{caseType, select, ADMISSION_TO_FACILITY {Fyrri vistun} TRAVEL_BAN {Fyrra farbann} other {Fyrri gæsla}}',
    description: 'Notað fyrir fyrri mál í öllum flæðum.',
  },
  arrestDate: {
    id: 'judicial.system.core:arrest_date',
    defaultMessage: 'Tími handtöku',
    description: 'Notað fyrir orðið Tími handtöku í öllum flæðum.',
  },
  update: {
    id: 'judicial.system.core:update',
    defaultMessage: 'Uppfæra',
    description: 'Notað fyrir orðið Uppfæra í öllum flæðum.',
  },
  and: {
    id: 'judicial.system.core:and',
    defaultMessage: 'og',
    description: 'Notað fyrir orðið og',
  },
  back: {
    id: 'judicial.system.core:back',
    defaultMessage: 'Til baka',
    description: 'Notað fyrir "Til baka" takka í öllum flæðum.',
  },
  continue: {
    id: 'judicial.system.core:continue',
    defaultMessage: 'Halda áfram',
    description: 'Notað fyrir "Halda áfram" takka í öllum flæðum.',
  },
  cancel: {
    id: 'judicial.system.core:cancel',
    defaultMessage: 'Hætta við',
    description: 'Notað fyrir "Hætta við" takka í öllum flæðum.',
  },
  createCase: {
    id: 'judicial.system.core:create_case',
    defaultMessage: 'Stofna mál',
    description: 'Notað fyrir "Stofna mál" takka í öllum flæðum.',
  },
  serviceInterruptionTitle: {
    id: 'judicial.system.core:service_interruption_title',
    defaultMessage: 'Mikilvæg skilaboð',
    description:
      'Notaður sem titil á skilboðum í borða sem er sýndur við þjónusturof',
  },
  serviceInterruptionText: {
    id: 'judicial.system.core:service_interruption_text',
    defaultMessage: 'NONE',
    description:
      'Notaður sem texti á skilboðum í borða sem er sýndur við þjónusturof. Stjórnar hvort skilboð eru sýnd eða ekki.',
  },
  serviceInterruptionTextProsecutor: {
    id: 'judicial.system.core:service_interruption_text_prosecutor',
    defaultMessage: 'NONE',
    description:
      '(Saksóknaraflæði): Notaður sem texti á skilboðum í borða sem er sýndur við þjónusturof. Stjórnar hvort skilboð eru sýnd eða ekki.',
  },
  serviceInterruptionTextCourt: {
    id: 'judicial.system.core:service_interruption_text_court',
    defaultMessage: 'NONE',
    description:
      '(Dómstólaflæði): Notaður sem texti á skilboðum í borða sem er sýndur við þjónusturof. Stjórnar hvort skilboð eru sýnd eða ekki.',
  },
  restrictionCase: {
    id: 'judicial.system.core:restriction_case',
    defaultMessage: 'gæsluvarðhald',
    description: 'Notaður fyrir orðið Gæsluvarðhald.',
  },
  travelBan: {
    id: 'judicial.system.core:travel_ban',
    defaultMessage: 'farbann',
    description: 'Notaður fyrir orðið Farbann.',
  },
  investigationCase: {
    id: 'judicial.system.core:investigation_case',
    defaultMessage: 'rannsóknarheimild',
    description: 'Notaður fyrir orðið Rannsóknarheimild.',
  },
  indictment: {
    id: 'judicial.system.core:indictment',
    defaultMessage: 'ákæra',
    description: 'Notaður fyrir orðið Ákæra.',
  },
  closeModal: {
    id: 'judicial.system.core:close_modal',
    defaultMessage: 'Loka glugga',
    description: 'Notaður fyrir texta í Loka glugga takka í modölum.',
  },
  uploadBoxTitle: {
    id: 'judicial.system.core:upload_box_title',
    defaultMessage: 'Dragðu skjöl hingað til að hlaða upp',
    description: 'Notaður fyrir titil í Hlaða upp skrám svæði.',
  },
  uploadBoxButtonLabel: {
    id: 'judicial.system.core:upload_box_button_label',
    defaultMessage: 'Velja skjöl til að hlaða upp',
    description: 'Notaður fyrir titil í takka á Hlaða upp skrám svæði.',
  },
  uploadBoxDescription: {
    id: 'judicial.system.core:upload_box_description',
    defaultMessage: 'Tekið er við skjölum með endingu: {fileEndings}',
    description: 'Notaður fyrir texta í Hlaða upp skrám svæði.',
  },
  appealCaseNumberHeading: {
    id: 'judicial.system.core:appeal_case_number_heading',
    defaultMessage: 'Málsnúmer Landsréttar',
    description: 'Titill á málsnúmeri á skráningarsíðu Landsréttar',
  },
  appealAssistantHeading: {
    id: 'judicial.system.core:appeal_assistant_heading',
    defaultMessage: 'Aðstoðarmaður',
    description: 'Titill á aðstoðrarmanni á skráningarsíðu Landsréttar',
  },
  appealJudgesHeading: {
    id: 'judicial.system.core:appeal_judges_heading',
    defaultMessage: 'Dómarar',
    description: 'Titill dómara á skráningarsíðu Landsréttar',
  },
})
