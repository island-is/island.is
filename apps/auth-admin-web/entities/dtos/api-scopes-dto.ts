export class ApiScopesDTO {
  constructor() {
    this.enabled = true;
    this.name = "";
    this.displayName = "";
    this.description = "";
    this.showInDiscoveryDocument = true;
    this.required = false;
    this.emphasize = false;
  }

  enabled: boolean;
  name: string;
  displayName: string;
  description: string;
  showInDiscoveryDocument: boolean;
  required: boolean;
  emphasize: boolean;
}
