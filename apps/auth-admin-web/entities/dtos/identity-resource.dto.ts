export default class IdentityResourceDTO {
  constructor() {
    this.enabled = true
    this.name = ''
    this.description = ''
    this.displayName = ''
    this.showInDiscoveryDocument = true
    this.required = false
    this.emphasize = false
    this.automaticDelegationGrant = false
  }

  enabled: boolean
  name: string
  displayName: string
  description: string
  showInDiscoveryDocument: boolean
  required: boolean
  emphasize: boolean
  automaticDelegationGrant: boolean
}
