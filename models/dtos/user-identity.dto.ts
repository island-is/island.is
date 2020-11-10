import { ClaimDto } from "./claim.dto";

export class UserIdentityDto {
  constructor() {
    this.subjectId = "";
    this.name = "";
    this.providerName = "";
    this.active = true;
    this.providerSubjectId = "";
    this.claims = [];
  }
  subjectId: string;
  name: string;
  providerName: string;
  active: boolean;
  providerSubjectId: string;
  claims: ClaimDto[];
}
