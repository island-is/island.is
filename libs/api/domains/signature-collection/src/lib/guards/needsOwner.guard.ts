import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { BYPASS_AUTH_KEY, getRequest } from '@island.is/auth-nest-tools'
import { OwnerAccess } from '../decorators/needsOwner.decorator'
import { SignatureCollectionSignee } from '../models/signee.model'
import { SignatureCollectionService } from '../signatureCollection.service'

@Injectable()
export class NeedsOwnerGuard implements CanActivate {
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
    const ownerRestriction = this.reflector.get<OwnerAccess>(
      'is-owner',
      context.getHandler(),
    )
    // IsOwner decorator not used
    if (!ownerRestriction) {
      return true
    }

    const request = getRequest(context)

    const signee: SignatureCollectionSignee = request.body.signee
    const user = request.user
    const isDelegatedUser = !!user?.actor?.nationalId
    const { candidate } = signee

    if (signee.isOwner && candidate) {
      // Check if user is an actor for owner and if so check if registered collector, if not actor will be added as collector
      if (isDelegatedUser && ownerRestriction === OwnerAccess.AllowActor) {
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
