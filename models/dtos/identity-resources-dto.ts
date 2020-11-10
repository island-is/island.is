export class IdentityResourcesDTO {
  constructor() {
    this.key = "";
    this.enabled = true;
    this.name = "";
    this.description = "";
    this.displayName = "";
    this.showInDiscoveryDocument = true;
    this.required = false;
    this.emphasize = false;
  }
  key: string;
  enabled: boolean;
  name: string;
  displayName: string;
  description: string;
  showInDiscoveryDocument: boolean;
  required: boolean;
  emphasize: boolean;
}
