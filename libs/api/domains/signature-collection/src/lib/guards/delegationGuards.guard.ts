import { BYPASS_AUTH_KEY, getRequest, User } from '@island.is/auth-nest-tools'
import { AuthDelegationType } from '@island.is/shared/types'
import { CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { isPerson } from 'kennitala'

export enum UserDelegationContext {
  Person,
  PersonDelegatedToPerson,
  PersonDelegatedToCompany,
  ProcurationHolder,
  AllowAll,
}

export class DelegationTypeGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  private determineUserDelegationContext(
    user: Express.User & User,
  ): UserDelegationContext {
    // If actor found on user, then user is delegated
    if (user.actor?.nationalId) {
      // If delegation is from person to person
      if (isPerson(user.nationalId)) {
        return UserDelegationContext.PersonDelegatedToPerson
      } else {
        // Determine whether it's a procuration vs delegation to a company
        const hasProcuration = user.delegationType?.some(
          (delegation) => delegation === AuthDelegationType.ProcurationHolder,
        )

        return hasProcuration
          ? UserDelegationContext.ProcurationHolder
          : UserDelegationContext.PersonDelegatedToCompany
      }
    }

    return UserDelegationContext.Person
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const bypassAuth = this.reflector.getAllAndOverride<boolean>(
      BYPASS_AUTH_KEY,
      [context.getHandler(), context.getClass()],
    )
    if (bypassAuth) {
      return true
    }

    const { user } = getRequest(context)
    if (!user) {
      return false
    }

    const delegationContextRestrictions = this.reflector.getAllAndOverride<
      UserDelegationContext[]
    >('delegation-requirement', [context.getHandler(), context.getClass()])

    if (
      !delegationContextRestrictions ||
      delegationContextRestrictions.includes(UserDelegationContext.AllowAll)
    ) {
      return true
    }

    const userDelegationContext = this.determineUserDelegationContext(user)

    return delegationContextRestrictions.includes(userDelegationContext)
  }
}
