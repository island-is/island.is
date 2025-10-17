export interface GetVistaSkjalDtoType {
  VistaSkjalType: VistaSkjalType
}
interface VistaSkjalType {
  tokst: number
  villulysing?: string
  radnumer_si?: number
  skjalanumer_si?: number
  villulisti?: VilluListi[]
}
interface VilluListi {
  linunumer?: number
  villa?: number
  tegundvillu?: string
  villulysinginnri?: string
}

export interface ApplyHealthInsuranceInputs {
  vistaskjal: VistaSkjalInput
  attachmentNames: string[]
}

export interface GetVistaSkjalBody {
  sjukratryggingumsokn: Sjukratryggingumsokn
}

interface Sjukratryggingumsokn {
  einstaklingur: Einstaklingur
  numerumsoknar: string
  dagsumsoknar: string
  dagssidustubusetuthjodskra: string
  dagssidustubusetu: string
  stadaeinstaklings: string
  bornmedumsaekjanda: number
  fyrrautgafuland: string
  fyrrautgafulandkodi: string
  fyrriutgafustofnunlands: string
  tryggdurfyrralandi: number
  tryggingaretturfyrralandi: number
  vidbotarupplysingar: string
  fylgiskjol?: Fylgiskjol
}

interface Einstaklingur {
  kennitala: string
  erlendkennitala: string
  nafn: string
  heimili: string
  postfangstadur: string
  rikisfang: string
  rikisfangkodi: string
  simi: string
  netfang: string
}

export interface Fylgiskjol {
  fylgiskjal: Fylgiskjal[]
}

export interface Fylgiskjal {
  heiti: string
  innihald: string
}

export interface VistaSkjalInput {
  applicationNumber: string
  applicationDate: Date
  nationalId: string
  foreignNationalId: string
  name: string
  address?: string
  postalAddress?: string
  citizenship?: string
  countryCode?: string
  email: string
  phoneNumber: string
  residenceDateFromNationalRegistry?: Date
  residenceDateUserThink?: Date
  userStatus: string
  isChildrenFollowed: number
  previousCountry: string
  previousCountryCode: string
  previousIssuingInstitution?: string
  additionalInformation?: string
  isHealthInsuredInPreviousCountry: number
  hasHealthInsuranceRightInPreviousCountry: number
  attachmentsFileNames?: string[]
}

export enum ErrorCodes {
  APPLICATION_ID_MISSING = 's570_umsoknnrvantar',
  APPLICATION_ID_EXISTS = 's570_umsoknnrtil',
  APPLICATION_DATE_IN_FUTURE = 's570_dagsumsoknar',
  APPLICATION_NATIONAL_ID_NOT_FOUND = 's570_kteinstthj',
  APPLICANT_DECEASED = 's570_kteinstlatinn',
  APPLICANT_ALREADY_INSURED = 's570_einstsjukratr',
  APPLICANT_HAS_ACTIVE_APPLICATION = 's570_umsoknivinnslu',
  APPLICATION_ENCODING_WRONG = 's570_rangtencoding',
  APPLICANT_STUDENT_ATTACHMENT_MISSING = 's570_student',
}
