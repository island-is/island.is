import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { SignatureCollectionService } from '../signatureCollection.service'
import { AdminPortalScope, ApiScope } from '@island.is/auth/scopes'
import { User, getRequest } from '@island.is/auth-nest-tools'
import { UserRole } from '@island.is/clients/signature-collection'

@Injectable()
export class CollectionGuard implements CanActivate {
  constructor(
    private readonly signatureCollectionService: SignatureCollectionService,
    private reflector: Reflector,
  ) {}

  getRole(user: User, isOwner?: boolean): UserRole {
    // If user then check scopes
    if (user.scope.includes(AdminPortalScope.signatureCollectionManage)) {
      return UserRole.ADMIN_MANAGER
    }
    if (user.scope.includes(AdminPortalScope.signatureCollectionProcess)) {
      return UserRole.ADMIN_PROCESSOR
    }
    if (user.scope.includes(ApiScope.signatureCollection)) {
      if (isOwner) {
        if (user.actor) {
          return UserRole.CANDIDATE_COLLECTOR
        } else {
          return UserRole.CANDIDATE_OWNER
        }
      } else if (!user.actor) {
        return UserRole.USER
      }
    }

    return UserRole.UNAUTHENTICATED
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get current collection info
    // Get singee if possible
    // Add to request body to get userRole
    const request = getRequest(context)

    const user = request.user
    const collection =
      await this.signatureCollectionService.currentCollectionInfo()
    if (!user) {
      request.body = {
        ...request.body,
        collection,
        role: UserRole.UNAUTHENTICATED,
      }
    } else {
      if (!user.scope.includes(ApiScope.signatureCollection)) {
        const role = this.getRole(user)
        request.body = { ...request.body, collection, role }
      } else {
        const signee = await this.signatureCollectionService.signee(user)
        const role = this.getRole(user, signee?.isOwner)
        request.body = { ...request.body, collection, role, signee }
      }
    }

    // Return true if collection exists
    return !!collection.id
  }
}
