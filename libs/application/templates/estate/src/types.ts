import { FormValue } from '@island.is/application/types'
import { EstateAsset } from '@island.is/clients/syslumenn'

export enum RoleConfirmationEnum {
  CONTINUE = 'continue',
  DELEGATE = 'delegate',
}

export enum RelationEnum {
  PARENT = 'parent',
  CHILD = 'child',
  SIBLING = 'sibling',
  SPOUSE = 'spouse',
}
export enum OtherPropertiesEnum {
  ACCOUNTS = 'accounts',
  OWN_BUSINESS = 'ownBusiness',
  RESIDENCE = 'residence',
  ASSETS_ABROAD = 'assetsAbroad',
}

export type Asset = Partial<EstateAsset & { initial: boolean }>

export type AssetFormField = Asset & { id: string }

export type Answers = {
  additionalInfo: string
  applicantEmail: string
  applicantName: string
  applicantPhone: string
  applicantRelation: RelationEnum
  approveExternalData: true
  assets: {
    assets: Asset[]
    encountered?: boolean
  }
  assetsAbroad: boolean
  authorizationForFuneralExpenses?: boolean
  bankStockOrShares: boolean
  caseNumber: string
  certificateOfDeathAnnouncement: string
  districtCommissionerHasWill: boolean
  estateMembers: {
    members: EstateMember[]
    encountered?: boolean
  }
  financesDataCollectionPermission?: boolean
  knowledgeOfOtherWills: 'yes' | 'no'
  marriageSettlement: boolean
  occupationRightViaCondominium: boolean
  otherProperties: OtherPropertiesEnum
  ownBusinessManagement: boolean
  roleConfirmation: RoleConfirmationEnum
  vehicles: {
    vehicles: Asset[]
    encountered?: boolean
  }
} & FormValue

export interface EstateMember {
  name: string
  nationalId: string
  relation: RelationEnum | string
  relationWithApplicant: RelationEnum | string
  initial?: boolean
  dateOfBirth?: string
  custodian?: string
  foreignCitizenship?: ('yes' | 'no')[]
  enabled?: boolean
  phone?: string
  email?: string
}
