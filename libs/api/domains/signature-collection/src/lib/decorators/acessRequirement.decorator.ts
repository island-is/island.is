import { SetMetadata } from '@nestjs/common'

export enum OwnerAccess {
  AllowActor = 'AllowActor',
  RestrictActor = 'RestrictActor',
}
export enum UserAccess {
  RestrictActor = 'RestrictActor',
}
export const AccessRequirement = (access?: OwnerAccess | UserAccess) =>
  SetMetadata('owner-access', access)
