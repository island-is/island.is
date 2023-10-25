export interface Address {
  streetAddress: string
  postalCode: string
  city: string
}

export interface NationalRegistry {
  nationalId: string
  fullName: string
  address: Address
}

type Notifier = {
  name: string
  ssn: string
  phoneNumber: string
  email: string
  relation: string
}

type EstateMember = {
  name: string
  ssn?: string
  nationalId?: string
  relation?: string
  dateOfBirth?: string
  foreignCitizenShip?: 'yes' | 'no'
  phone?: string
  email?: string
} & SystemMetadata

type Representative = {
  name: string
  ssn: string
  phoneNumber: string
  email: string
}

type AssetFrame = {
  assetNumber?: string
  description?: string
  marketValue?: string | number
} & SystemMetadata

type BankAccount = {
  accountNumber?: string
  balance?: string | number
}

type Stock = {
  organization?: string
  ssn?: string
  nationalId?: string
  faceValue?: string | number
  rateOfExchange?: string | number
  value?: string | number
}

type Debt = {
  creditorName?: string
  ssn?: string
  nationalId?: string
  balance?: string | number
  loanIdentity?: string
}

type InfoValueField = {
  info?: string
  value?: string
}

type Claim = {
  publisher?: string
  value?: string | number
}

type Deceased = {
  name: string
  ssn: string
  dateOfDeath: string
  address: string
}

type SpouseField = {
  spouse: {
    name: string
    nationalId: string
  }
  selection: string
}

type EstateWithoutAssetsInfo = {
  estateAssetsExist?: string
  estateDebtsExist?: string
}

type SystemMetadata = {
  enabled?: boolean
}

export type UploadData = {
  applicationType: string
  deceased: Deceased
  claims: Claim[]
  caseNumber: string
  notifier: Notifier
  estateMembers: EstateMember[]
  assets: AssetFrame[]
  guns: AssetFrame[]
  vehicles: AssetFrame[]
  inventory: InfoValueField
  bankAccounts: BankAccount[]
  stocks: Stock[]
  moneyAndDeposit: InfoValueField
  otherAssets: InfoValueField
  debts: Debt[]
  representative?: Representative
  districtCommissionerHasWill: string
  settlement: string
  remarksOnTestament: string
  dividedEstate: string
  deceasedWithUndividedEstate?: SpouseField
  estateWithoutAssetsInfo: EstateWithoutAssetsInfo
}
