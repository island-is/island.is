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
  ssn: string
  relation: string
  dateOfBirth?: string
  foreignCitizenShip?: 'yes' | 'no'
}

type AssetFrame = {
  assetNumber: string
  description: string
}

type BankAccount = {
  accountNumber: string
  balance: string | number
}

type Stock = {
  organization: string
  ssn: string
  faceValue: string | number
  rateOfExchange: string | number
  value: string | number
}

type Debt = {
  creditorName: string
  ssn: string
  balance: string | number
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
    | 'yes'
    | 'no'
  //caseNumber: string
  notifier: Notifier
  estateMembers: EstateMember[]
  assets: AssetFrame[]
  vehicles: AssetFrame[]
  inventory: string
  inventoryValue: string | number
  bankAccounts: BankAccount[]
  stocks: Stock[]
  moneyAndDepositBoxesInfo: string
  moneyAndDepositBoxesValue: string | number
  otherAssets: string
  otherAssetsValue: string
  debts: Debt[]
  undividedEstateResidencePermission: 'yes' | 'no'
  applicantHasLegalCustodyOverEstate: 'yes' | 'no'
}
