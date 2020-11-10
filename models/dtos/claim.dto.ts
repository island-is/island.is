export class ClaimDto {
  constructor() {
    this.type = "";
    this.value = "";
    this.valueType = "";
    this.originalIssuer = "";
    this.issuer = "";
  }

  type: string;
  value: string;
  valueType: string;
  issuer: string;
  originalIssuer: string;
}
