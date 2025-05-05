import { EstateAsset, Advocate } from '@island.is/clients/syslumenn'

export type Asset = Partial<EstateAsset & { initial: boolean }>
export type AssetFormField = Asset & { id: string }

export type ErrorValue = { [key: string]: any }

export interface EstateMember {
  name: string
  nationalId: string
  relation: string
  relationWithApplicant?: string
  initial?: boolean
  dateOfBirth?: string
  custodian?: string
  foreignCitizenship?: ('yes' | 'no')[]
  noContactInfo?: ('Yes' | 'No')[]
  enabled?: boolean
  phone?: string
  email?: string
  advocate?: Advocate
}

export type AssetsRepeaterProps = {
  field: {
    id: string
    props: {
      assetName: 'guns' | 'vehicles'
      texts: {
        assetTitle: object
        assetNumber: object
        assetType: object
        addAsset: object
      }
    }
  }
  error: ErrorValue
}

export type LookupProps = {
  field: {
    id: string
    props?: {
      requiredNationalId?: boolean
      alertWhenUnder18?: boolean
      useDeceasedRegistry?: boolean
    }
  }
  nested?: boolean
  message?: string
  error: ErrorValue
}
