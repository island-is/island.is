import { LanguageType } from '../languageType.model'

class CertificationType {
  type!: string
  name!: LanguageType
  description!: LanguageType
  isCommon!: boolean
}

export const Certifications: CertificationType[] = [
  {
    type: 'estateGuardianshipCertificateStamped',
    name: {
      is: 'Búsforræðisvottorð',
      en: 'Certificate of authority to manage an estate',
    },
    description: {
      is: 'Búsforræðisvottorð með stimpli',
      en: 'A document stating that the party in question has custody of his estate, ie. has not been declared bankrupt.',
    },
    isCommon: false,
  },
  {
    type: 'estateGuardianshipCertificateUnstamped',
    name: {
      is: 'Búsforræðisvottorð án stimpils',
      en: 'Certificate of authority to manage an estate',
    },
    description: {
      is: 'Búsforræðisvottorð án stimpils',
      en: 'A document stating that the party in question has custody of his estate, ie. has not been declared bankrupt.',
    },
    isCommon: false,
  },
  {
    type: 'residenceCertificate',
    name: {
      is: 'Búsetuvottorð',
      en: 'Residence certificate',
    },
    description: {
      is: 'Búsetuvottorð',
      en: 'Residence certificate',
    },
    isCommon: false,
  },
  {
    type: 'indebtednessCertificate',
    name: {
      is: 'Skuldleysisvottorð',
      en: 'Certificate of indebtedness',
    },
    description: {
      is: 'Skuldleysisvottorð',
      en: 'Certificate of indebtedness',
    },
    isCommon: false,
  },
  {
    type: 'criminalRecordStamped',
    name: {
      is: 'Sakavottorð',
      en: 'Criminal record',
    },
    description: {
      is: 'Sakavottorð með stimpli',
      en: 'Document containing your criminal record with stamp',
    },
    isCommon: false,
  },
  {
    type: 'criminalRecordUnstamped',
    name: {
      is: 'Sakavottorð án stimpils',
      en: 'Criminal record without stamp',
    },
    description: {
      is: 'Sakavottorð án stimpils',
      en: 'Document containing your criminal record without stamp',
    },
    isCommon: false,
  },
]
