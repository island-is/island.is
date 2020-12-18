import { ApiResourceScope } from './api-resource-scope.model';
import { ApiResourceSecret } from './models/api-resource-secret.model';
import { ApiResourceUserClaim } from './models/api-resource-user-claim.model';

export class ApiResource {
  name!: string;
  enabled!: boolean;
  displayName!: string;
  description!: string;
  showInDiscoveryDocument!: boolean;
  public userClaims?: ApiResourceUserClaim[];
  readonly created!: Date;
  readonly modified?: Date;
  public scopes?: ApiResourceScope[];
  readonly apiSecrets?: ApiResourceSecret[];
}
