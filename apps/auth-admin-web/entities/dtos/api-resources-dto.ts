export class ApiResourcesDTO {
  constructor() {
    this.enabled = true;
    this.name = '';
    this.displayName = '';
    this.description = '';
    this.showInDiscoveryDocument = true;
  }

  enabled: boolean;
  name: string;
  displayName: string;
  description: string;
  showInDiscoveryDocument: boolean;
  nationalId!: number;
}
