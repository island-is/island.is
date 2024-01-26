import { SetMetadata } from '@nestjs/common'

export enum OwnerAccess {
  AllowActor = 'AllowActor',
  RestrictActor = 'RestrictActor',
}
export const IsOwner = (access: OwnerAccess) => SetMetadata('is-owner', access)
