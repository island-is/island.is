type Language = 'en' | 'is'

type Translations = {
  [key in Language]: {
    accused: string
    active: string
    arraignmentDate: string
    caseNumber: string
    completed: string
    courtCeremony: string
    date: string
    defendant: string
    institution: string
    location: string
    notAvailable: string
    parliamentaryConfirmation: string
    prosecutor: string
    subpoena: string
    name: string
    nationalId: string
    address: string
    defender: string
    email: string
    phoneNumber: string
    information: string
    type: string
    indictment: string
    court: string
    judge: string
    prosecutorsOffice: string
  }
}

const translations: Translations = {
  en: {
    accused: 'Accused',
    active: 'Active',
    arraignmentDate: 'Arraignment date',
    caseNumber: 'Case number',
    completed: 'Completed',
    courtCeremony: 'Court ceremony',
    date: 'Date',
    defendant: 'Defendant',
    institution: 'Institution',
    location: 'Location',
    notAvailable: 'N/A',
    parliamentaryConfirmation: 'Parliamentary confirmation',
    prosecutor: 'Prosecutor',
    subpoena: 'Subpoena',
    name: 'Name',
    nationalId: 'National ID',
    address: 'Address',
    defender: 'Defender',
    email: 'Email',
    phoneNumber: 'Phone Nr.',
    information: 'Information',
    type: 'Type',
    indictment: 'Indictment',
    court: 'Court',
    judge: 'Judge',
    prosecutorsOffice: 'Institution',
  },
  is: {
    accused: 'Ákærði',
    active: 'Í vinnslu',
    arraignmentDate: 'Verður tekið fyrir á dómþingi',
    caseNumber: 'Málsnúmer',
    completed: 'Lokið',
    courtCeremony: 'Dómsathöfn',
    date: 'Dagsetning',
    defendant: 'Varnaraðili',
    institution: 'Embætti',
    location: 'Staður',
    notAvailable: 'Ekki skráð',
    parliamentaryConfirmation: 'Þingfesting',
    prosecutor: 'Ákærandi',
    subpoena: 'Fyrirkall',
    name: 'Nafn',
    nationalId: 'Kennitala',
    address: 'Heimilisfang',
    defender: 'Verjandi',
    email: 'Netfang',
    phoneNumber: 'Símanúmer',
    information: 'Málsupplýsingar',
    type: 'Tegund',
    indictment: 'Ákæra',
    court: 'Dómstóll',
    judge: 'Dómari',
    prosecutorsOffice: 'Embætti',
  },
}

export const getTranslations = (lang = 'is'): Translations[Language] => {
  const language = lang in translations ? (lang as Language) : 'is'
  return translations[language]
}
