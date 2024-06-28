type Language = 'en' | 'is'

type Translations = {
  [key in Language]: {
    accused: string
    active: string
    address: string
    arraignmentDate: string
    caseNumber: string
    completed: string
    court: string
    courtCaseNumber: string
    courtCeremony: string
    date: string
    defendant: string
    defender: string
    email: string
    information: string
    institution: string
    indictment: string
    judge: string
    location: string
    name: string
    nationalId: string
    notAvailable: string
    parliamentaryConfirmation: string
    phoneNumber: string
    prosecutor: string
    prosecutorsOffice: string
    subpoena: string
    subpoenaSent: string
    type: string
    waiveRightToCounsel: string
  }
}

const translations: Translations = {
  en: {
    accused: 'Accused',
    active: 'Active',
    address: 'Address',
    arraignmentDate: 'Arraignment date',
    caseNumber: 'Case number',
    completed: 'Completed',
    court: 'Court',
    courtCaseNumber: 'Case number',
    courtCeremony: 'Court ceremony',
    date: 'Date',
    defendant: 'Defendant',
    defender: 'Defender',
    email: 'Email',
    information: 'Information',
    institution: 'Institution',
    indictment: 'Indictment',
    judge: 'Judge',
    location: 'Location',
    name: 'Name',
    nationalId: 'National ID',
    notAvailable: 'N/A',
    parliamentaryConfirmation: 'Parliamentary confirmation',
    phoneNumber: 'Phone Nr.',
    prosecutor: 'Prosecutor',
    prosecutorsOffice: 'Institution',
    subpoena: 'Subpoena',
    subpoenaSent: 'Subpoena sent',
    type: 'Type',
    waiveRightToCounsel: 'Right to counsel waived',
  },
  is: {
    accused: 'Ákærði',
    active: 'Í vinnslu',
    address: 'Lögheimili',
    arraignmentDate: 'Verður tekið fyrir á dómþingi',
    caseNumber: 'Málsnúmer',
    completed: 'Lokið',
    court: 'Dómstóll',
    courtCaseNumber: 'Málsnúmer héraðsdóms',
    courtCeremony: 'Dómsathöfn',
    date: 'Dagsetning',
    defendant: 'Varnaraðili',
    defender: 'Verjandi',
    email: 'Netfang',
    information: 'Málsupplýsingar',
    institution: 'Embætti',
    indictment: 'Ákæra',
    judge: 'Dómari',
    location: 'Staður',
    name: 'Nafn',
    nationalId: 'Kennitala',
    notAvailable: 'Ekki skráð',
    parliamentaryConfirmation: 'Þingfesting',
    phoneNumber: 'Símanúmer',
    prosecutor: 'Ákærandi',
    prosecutorsOffice: 'Embætti',
    subpoena: 'Fyrirkall',
    subpoenaSent: 'Fyrirkall sent',
    type: 'Tegund',
    waiveRightToCounsel: 'Ekki er óskað eftir verjanda',
  },
}

export const getTranslations = (lang = 'is'): Translations[Language] => {
  const language =
    lang.toLowerCase() in translations ? (lang as Language) : 'is'
  return translations[language]
}
