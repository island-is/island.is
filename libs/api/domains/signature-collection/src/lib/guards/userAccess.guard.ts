import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { BYPASS_AUTH_KEY, getRequest } from '@island.is/auth-nest-tools'
import { SignatureCollectionService } from '../signatureCollection.service'
import { UserDelegationContext } from './delegationGuards.guard'

@Injectable()
export class IsOwnerGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly signatureCollectionService: SignatureCollectionService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const bypassAuth = this.reflector.getAllAndOverride<boolean>(
      BYPASS_AUTH_KEY,
      [context.getHandler(), context.getClass()],
    )

    // if the bypass auth exists and is truthy we bypass auth
    if (bypassAuth) {
      return true
    }
    const request = getRequest(context)
    const isOwnerRestriction = this.reflector.getAllAndOverride<boolean>(
      'is-owner',
      [context.getHandler(), context.getClass()],
    )

    // IsOwner decorator not used
    if (!isOwnerRestriction) {
      return true
    }

    const isDelegationRestrictions = this.reflector.getAllAndOverride<
      UserDelegationContext[] | undefined
    >('delegation-requirement', [context.getHandler(), context.getClass()])

    const allowsDelegationToOwner = isDelegationRestrictions?.some(
      (t) =>
        t === UserDelegationContext.PersonDelegatedToPerson ||
        t === UserDelegationContext.PersonDelegatedToCompany,
    )

    const user = request.user
    if (!user) {
      return false
    }
    const isDelegatedUser = !!user?.actor?.nationalId
    // IsOwner needs signee
    const signee = await this.signatureCollectionService.signee(user)
    request.body = { ...request.body, signee }

    const { candidate } = signee

    if (signee.isOwner && candidate) {
      // Check if user is an actor for owner and if so check if registered collector, if not actor will be added as collector
      if (isDelegatedUser && allowsDelegationToOwner) {
        const isCollector = await this.signatureCollectionService.isCollector(
          candidate.id,
          user,
        )
        return isCollector
      }
      return true
    }

    // if the user is not owner we return false
    return false
  }
}
