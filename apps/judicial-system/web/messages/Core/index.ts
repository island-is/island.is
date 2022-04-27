import { CaseType } from '@island.is/judicial-system/types'
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
    defaultMessage: `{caseType, select, ${CaseType.ADMISSION_TO_FACILITY} {Fyrri vistun} ${CaseType.TRAVEL_BAN} {Fyrra farbann} other {Fyrri gæsla}}`,
    description: 'Notað fyrir fyrri mál í öllum flæðum.',
  },
  // TODO: remove pastCustody and pastTravelBan, use pastRestrictionCase instead
  pastCustody: {
    id: 'judicial.system.core:past_custody',
    defaultMessage: 'Fyrri gæsla',
    description: 'Notað fyrir orðið Fyrri gæsla í öllum flæðum.',
  },
  pastTravelBan: {
    id: 'judicial.system.core:past_travel_ban',
    defaultMessage: 'Fyrra farbann',
    description: 'Notað fyrir orðið Fyrra farbann í öllum flæðum.',
  },
  arrestDate: {
    id: 'judicial.system.core:arrest_date',
    defaultMessage: 'Tími handtöku',
    description: 'Notað fyrir orðið Tími handtöku í öllum flæðum.',
  },
  confirmedCourtDate: {
    id: 'judicial.system.core:confirmed_court_date',
    defaultMessage: 'Staðfestur fyrirtökutími',
    description: 'Notað fyrir orðið Staðfestur fyrirtökutími í öllum flæðum.',
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
})
