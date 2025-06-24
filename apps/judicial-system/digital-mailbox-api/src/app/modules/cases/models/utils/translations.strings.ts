type Language = 'en' | 'is'

type Translations = {
  [key in Language]: {
    accused: string
    active: string
    address: string
    appealDeadline: string
    appealDecision: string
    appealDecisionText: string
    arraignmentDate: string
    appealDecisionAccept: string
    appealDecisionPostpone: string
    caseNumber: string
    completed: string
    court: string
    courtCaseNumber: string
    courtCeremony: string
    courtContactInfo: string
    date: string
    defendant: string
    defender: string
    email: string
    information: string
    institution: string
    indictment: string
    judge: string
    districtCourtAssistant: string
    location: string
    name: string
    nationalId: string
    notAvailable: string
    parliamentaryConfirmation: string
    phoneNumber: string
    prosecutor: string
    prosecutorsOffice: string
    ruling: string
    rulingDate: string
    rulingInstructions: string
    rulingTitle: string
    subpoena: string
    subpoenaSent: string
    subpoenaServed: string
    type: string
    waiveRightToCounsel: string
  }
}

const translations: Translations = {
  en: {
    accused: 'Accused',
    active: 'Active',
    address: 'Address',
    appealDeadline: 'Appeal deadline', //TODO: Verify translation
    appealDecision: 'Appeal decision', //TODO: Verify translation
    appealDecisionText:
      'Ég hef tekið við leiðbeiningum um rétt til áfrýjunar og áfrýjunarfrest', //TODO: translate
    appealDecisionAccept: 'Ég uni dómi.',
    appealDecisionPostpone: 'Ég tek áfrýjunarfrest.',
    arraignmentDate: 'Arraignment date',
    caseNumber: 'Case number',
    completed: 'Completed',
    court: 'Court',
    courtCaseNumber: 'Case number',
    courtCeremony: 'Court ceremony',
    courtContactInfo:
      'Please contact the court if you wish to change your choice of defender',
    date: 'Date',
    defendant: 'Defendant',
    defender: 'Defender',
    email: 'Email',
    information: 'Information',
    institution: 'Institution',
    indictment: 'Indictment',
    judge: 'Judge',
    districtCourtAssistant: 'Assistant judge',
    location: 'Location',
    name: 'Name',
    nationalId: 'National ID',
    notAvailable: 'N/A',
    parliamentaryConfirmation: 'Parliamentary confirmation',
    phoneNumber: 'Phone Nr.',
    prosecutor: 'Prosecutor',
    prosecutorsOffice: 'Institution',
    ruling: 'Ruling', //TODO: Verify translation
    rulingDate: 'Ruling date', //TODO: Verify translation
    rulingTitle: 'Ruling', //TODO: Verify translation
    rulingInstructions: 'Ruling instructions', //TODO: Verify translation
    subpoena: 'Subpoena',
    subpoenaSent: 'Subpoena sent',
    subpoenaServed:
      'Confirmation of subpoena service has been sent to the police and court',
    type: 'Type',
    waiveRightToCounsel: 'Right to counsel waived',
  },
  is: {
    accused: 'Ákærði',
    active: 'Í vinnslu',
    address: 'Lögheimili',
    appealDeadline: 'Áfrýjunarfrestur til og með',
    appealDecision: 'Afstaða til dóms',
    appealDecisionAccept: 'Ég uni dómi.',
    appealDecisionPostpone: 'Ég tek áfrýjunarfrest.',
    appealDecisionText:
      'Ég hef tekið við leiðbeiningum um rétt til áfrýjunar og áfrýjunarfrest',
    arraignmentDate: 'Verður tekið fyrir á dómþingi',
    caseNumber: 'Málsnúmer',
    completed: 'Lokið',
    court: 'Dómstóll',
    courtCaseNumber: 'Málsnúmer héraðsdóms',
    courtCeremony: 'Dómsathöfn',
    courtContactInfo:
      'Vinsamlegast hafið samband við dómstól til að breyta verjanda vali',
    date: 'Dagsetning',
    defendant: 'Varnaraðili',
    defender: 'Verjandi',
    email: 'Netfang',
    information: 'Málsupplýsingar',
    institution: 'Embætti',
    indictment: 'Ákæra',
    judge: 'Dómari',
    districtCourtAssistant: 'Aðstoðarmaður dómara',
    location: 'Staður',
    name: 'Nafn',
    nationalId: 'Kennitala',
    notAvailable: 'Ekki skráð',
    parliamentaryConfirmation: 'Þingfesting',
    phoneNumber: 'Símanúmer',
    prosecutor: 'Ákærandi',
    prosecutorsOffice: 'Embætti',
    ruling: 'Dómsorð',
    rulingDate: 'Dómur kveðinn upp',
    rulingInstructions: 'Leiðbeiningar tengdar þínum dómi',

    rulingTitle: 'Niðurstaða dóms',
    subpoena: 'Fyrirkall',
    subpoenaSent: 'Fyrirkall sent',
    subpoenaServed:
      'Staðfesting á móttöku hefur verið send á lögreglu og dómstóla',
    type: 'Tegund',
    waiveRightToCounsel: 'Ekki er óskað eftir verjanda',
  },
}

export const getTranslations = (lang = 'is'): Translations[Language] => {
  const language =
    lang.toLowerCase() in translations ? (lang as Language) : 'is'
  return translations[language]
}
