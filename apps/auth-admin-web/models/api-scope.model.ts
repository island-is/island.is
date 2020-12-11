import { ApiScopeUserClaim } from './api-scope-user-claim.model';

export class ApiScope {
  name!: string;
  enabled!: boolean;
  displayName!: string;
  description!: string;
  showInDiscoveryDocument!: boolean;
  public userClaims?: ApiScopeUserClaim[];
  required!: boolean;
  emphasize!: boolean;
  readonly created!: Date;
  readonly modified?: Date;
}
