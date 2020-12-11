import { IdentityResourceUserClaim } from './identity-resource-user-claim.model';

export class IdentityResource {
  name!: string;
  enabled!: boolean;
  displayName!: string;
  description!: string;
  showInDiscoveryDocument!: boolean;
  public userClaims?: IdentityResourceUserClaim[];
  required!: boolean;
  emphasize!: boolean;
  readonly created!: Date;
  readonly modified?: Date;
}
