export class ApiScopeGroupDTO {
  constructor() {
    // TODO: Remove this when implemented in Auth-Admin-Web
    this.domainName = '@island.is'
    this.displayName = 'Temporary'
  }
  name!: string
  displayName!: string
  description!: string
  domainName!: string
}
