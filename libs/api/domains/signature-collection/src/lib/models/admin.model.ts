import { User } from '@island.is/auth-nest-tools'
import { AdminPortalScope } from '@island.is/auth/scopes'

export interface SignatureCollectionAdmin extends User {
  adminScope:
    | AdminPortalScope.signatureCollectionManage
    | AdminPortalScope.signatureCollectionProcess
    | AdminPortalScope.signatureCollectionMunicipality
}
