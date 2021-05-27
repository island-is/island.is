export class ApiScopeDTO {
  constructor() {
    this.enabled = true
    this.name = ''
    this.displayName = ''
    this.description = ''
    this.showInDiscoveryDocument = true
    this.required = false
    this.emphasize = false
    this.grantToLegalGuardians = false
    this.grantToProcuringHolders = false
    this.allowExplicitDelegationGrant = false
    this.automaticDelegationGrant = false
    this.alsoForDelegatedUser = false
    this.isAccessControlled = false
    this.groupId = null
  }

  enabled: boolean
  name: string
  displayName: string
  description: string
  showInDiscoveryDocument: boolean
  required: boolean
  emphasize: boolean
  grantToLegalGuardians: boolean
  grantToProcuringHolders: boolean
  allowExplicitDelegationGrant: boolean
  automaticDelegationGrant: boolean
  alsoForDelegatedUser: boolean
  isAccessControlled: boolean
  groupId?: string
}
