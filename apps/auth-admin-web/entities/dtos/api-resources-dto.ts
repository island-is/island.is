export class ApiResourcesDTO {
  constructor() {
    this.enabled = true
    this.name = ''
    this.displayName = ''
    this.description = ''
    this.showInDiscoveryDocument = true
    this.contactEmail = ''
  }

  enabled: boolean
  name: string
  displayName: string
  description: string
  showInDiscoveryDocument: boolean
  nationalId!: string
  contactEmail: string
}
