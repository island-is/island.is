import { SetMetadata } from '@nestjs/common'
import { UserDelegationContext } from '../guards/delegationGuards.guard'

export const DelegationRequirement = (
  ...userDelegationContext: UserDelegationContext[]
) => SetMetadata('delegation-requirement', userDelegationContext)
