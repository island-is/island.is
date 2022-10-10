export type Client = {
  label: string
  value: string
}

export type Election = {
  electionId: string
  name: string
  electionDate: Date
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

export enum ClientTypes {
  Individual = 150000000,
  PoliticalParty = 150000001,
  Cemetery = 150000002,
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
