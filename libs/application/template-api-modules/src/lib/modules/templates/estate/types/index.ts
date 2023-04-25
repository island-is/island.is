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
  relation?: string
  dateOfBirth?: string
  foreignCitizenShip?: 'yes' | 'no'
}

type Representative = {
  name: string
  ssn: string
  phoneNumber: string
  email: string
}

type AssetFrame = {
  assetNumber?: string
  description?: string
}

type BankAccount = {
  accountNumber?: string
  balance?: string | number
}

type Stock = {
  organization?: string
  ssn?: string
  faceValue?: string | number
  rateOfExchange?: string | number
  value?: string | number
}

type Debt = {
  creditorName?: string
  ssn?: string
  balance?: string | number
}

type InfoValueField = {
  info?: string
  value?: string
}

export interface UploadData {
  [key: string]:
    | string
    | Notifier
    | EstateMember[]
    | AssetFrame[]
    | number
    | BankAccount[]
    | Stock[]
    | Debt[]
    | Representative
    | 'Yes'
    | 'No'
    | InfoValueField
  //caseNumber: string
  notifier: Notifier
  estateMembers: EstateMember[]
  assets: AssetFrame[]
  vehicles: AssetFrame[]
  inventory: InfoValueField
  bankAccounts: BankAccount[]
  stocks: Stock[]
  moneyAndDeposit: InfoValueField
  otherAssets: InfoValueField
  debts: Debt[]
}
