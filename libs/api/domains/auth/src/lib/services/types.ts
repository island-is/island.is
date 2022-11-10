import { User } from '@island.is/auth-nest-tools'
import {
  CreateDelegationInput,
  DelegationInput,
  DelegationsInput,
  DeleteDelegationInput,
  PatchDelegationInput,
  UpdateDelegationInput,
} from '../dto'
import { ApiScope } from '../models'
import { ScopeTreeNode } from '../models/scopeTreeNode.model'
import { ApiScopesInput } from '../dto/apiScopes.input'

export interface MeDelegationsServiceInterface {
  getDelegations(user: User, input: DelegationsInput): Promise<DelegationDTO[]>

  getDelegationById(
    user: User,
    input: DelegationInput,
  ): Promise<DelegationDTO | null>

  createOrUpdateDelegation(
    user: User,
    input: CreateDelegationInput,
  ): Promise<DelegationDTO>

  deleteDelegation(user: User, input: DeleteDelegationInput): Promise<boolean>

  updateDelegation(
    user: User,
    input: UpdateDelegationInput,
  ): Promise<DelegationDTO>

  patchDelegation(
    user: User,
    input: PatchDelegationInput,
  ): Promise<DelegationDTO>
}

export interface ApiScopeServiceInterface {
  getApiScopes(user: User, input: ApiScopesInput): Promise<ApiScope[]>

  getScopeTree(
    user: User,
    input: ApiScopesInput,
  ): Promise<Array<typeof ScopeTreeNode>>
}

export interface DelegationScopeDTO {
  id?: string | null
  delegationId: string
  scopeName: string
  displayName: string
  validFrom: Date
  validTo?: Date | null
  domainName?: string | null
}

export interface DelegationDTO {
  id?: string | null
  fromNationalId: string
  fromName: string
  toNationalId: string
  toName?: string | null
  validTo?: Date | null
  domainName?: string | null
  type: DelegationType
  provider: DelegationProvider
  scopes?: Array<DelegationScopeDTO>
}

export interface MergedDelegationDTO {
  fromNationalId: string
  fromName?: string | null
  toNationalId: string
  toName?: string | null
  validTo?: Date | null
  types: DelegationType[]
}

export enum DelegationProvider {
  Thjodskra = 'thjodskra',
  Fyrirtaekjaskra = 'fyrirtaekjaskra',
  Talsmannagrunnur = 'talsmannagrunnur',
  Delegationdb = 'delegationdb',
}

export enum DelegationType {
  LegalGuardian = 'LegalGuardian',
  ProcurationHolder = 'ProcurationHolder',
  PersonalRepresentative = 'PersonalRepresentative',
  Custom = 'Custom',
}
