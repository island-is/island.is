export type ClientType = {
  label: string
  value: string
}

export type Election = {
  electionId: string
  name: string
  electionDate: Date
  genitiveName?: string
}

export type ElectionInfo = {
  electionType: number
  electionDate: string
}

export type FinancialType = {
  numericValue: number
  financialTypeId: string
}

export type KeyValue = {
  key: number
  value: number
}

export type Config = {
  key: string
  value: number
}

export type TaxInfo = {
  key: number
  value: string
}

export enum ClientTypes {
  Individual = 150000000,
  PoliticalParty = 150000001,
  Cemetery = 150000002,
}

export enum ContactType {
  Actor = 0,
  BoardMember = 1,
  Inspector = 2,
}

export type Client = {
  nationalId: string
  name?: string
  email?: string
  phone?: string
}

export type Contact = {
  nationalId: string
  name: string
  email?: string
  phone?: string
  contactType: ContactType
}

export type ContactDto = {
  star_national_id: string
  star_contact_type: number
  star_name: string
  star_email?: string
  star_phone?: string
}

export type DigitalSignee = {
  phone: string
  email: string
}

export interface PersonalElectionSubmitInput {
  client: Client
  actor: Contact | undefined
  digitalSignee: DigitalSignee
  electionId: string
  noValueStatement: boolean
  values?: PersonalElectionFinancialStatementValues
  file?: string
}

export type PersonalElectionFinancialStatementValues = {
  contributionsByLegalEntities: number // 100 Framlög lögaðila
  individualContributions: number // 101 Framlög einstaklinga
  candidatesOwnContributions: number // 102 Eigin framlög frambjóðanda
  capitalIncome: number // 128 Fjármagnstekjur
  otherIncome: number // 129 Aðrar tekjur
  electionOfficeExpenses: number // 130 Kosningaskrifstofa
  advertisingAndPromotions: number // 131 Auglýsingar og kynningar
  meetingsAndTravelExpenses: number // 132 Fundir og ferðakostnaður
  otherExpenses: number // 139 Annar kostnaður
  financialExpenses: number // 148 Fjármagnsgjöld
  fixedAssetsTotal: number // 150 Fastafjármunirsamtals
  currentAssets: number // 160 Veltufjármunir samtals
  longTermLiabilitiesTotal: number // 170 Langtímaskuldirsamtals
  shortTermLiabilitiesTotal: number // 180 Skammtímaskuldir samtals
  equityTotal: number // 190 Eigið fé alls
}

export type PoliticalPartyFinancialStatementValues = {
  contributionsFromTheTreasury: number // 200 Framlög úr ríkissjóði
  parliamentaryPartySupport: number // 201 Þingflokksstyrkur
  municipalContributions: number // 202 Framlög sveitarfélaga
  contributionsFromLegalEntities: number // 203 Framlög lögaðila
  contributionsFromIndividuals: number // 204 Framlög einstaklinga'
  generalMembershipFees: number // 205 Almenn félagsgjöld
  capitalIncome: number // 228 Fjármagnstekjur
  otherIncome: number // 229 Aðrar tekjur
  officeOperations: number // 230 Rekstur skrifstofu
  otherOperatingExpenses: number // 239 Annar rekstrarkostnaður
  financialExpenses: number // 248 Fjármagnsgjöld
  fixedAssetsTotal: number // 250 Fastafjármunirsamtals
  currentAssets: number // 260 Veltufjármunir samtals
  longTermLiabilitiesTotal: number // 270 Langtímaskuldir samtals
  shortTermLiabilitiesTotal: number // 280 Skammtímaskuldir samtals
  equityTotal: number // 290 Eigið fé alls
}

export type CemeteryFinancialStatementValues = {
  careIncome: number // 300 Umhirðutekjur
  burialRevenue: number // 301 Grafartekjur
  grantFromTheCemeteryFund: number // 302 Styrkur frá kirkjugarðasjóði
  capitalIncome: number // 328 Fjármagnstekjur
  otherIncome: number // 329 Aðrar tekjur
  salaryAndSalaryRelatedExpenses: number // 330 Laun og launatengd gjöld
  funeralExpenses: number // 331 Útfararkostnaður
  operationOfAFuneralChapel: number // 332 Rekstur útfararkapellu
  donationsToCemeteryFund: number // 334 Framlög til kirkjugarðasjóðs
  contributionsAndGrantsToOthers: number // 335 Framlög og styrkir til annarra
  otherOperatingExpenses: number // 339 Annar rekstrarkostnaður
  financialExpenses: number // 348 Fjármagnsgjöld
  depreciation: number // 349 Afskriftir
  fixedAssetsTotal: number // 350 Fastafjármunirsamtals
  currentAssets: number // 360 Veltufjármunir samtals
  longTermLiabilitiesTotal: number // 370 Langtímaskuldir samtals
  shortTermLiabilitiesTotal: number // 380 Skammtímaskuldir samtals
  equityAtTheBeginningOfTheYear: number // 391 Eigið fé 1. janúar
  revaluationDueToPriceChanges: number // 392 Endurmat vegna verðbreytinga
  reassessmentOther: number // 393 Endurmat, annað
}
