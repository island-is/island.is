export class ClientClaimDTO {
  constructor() {
    this.clientId = null;
    this.type = null;
    this.value = null;
  }

  clientId?: string;
  type?: string;
  value?: string;
}
