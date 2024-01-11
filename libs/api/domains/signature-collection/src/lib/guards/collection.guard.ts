import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { UserRole } from '../utils/role.types'
import { SignatureCollectionService } from '../signatureCollection.service'
import { AdminPortalScope, ApiScope } from '@island.is/auth/scopes'
import { User, getRequest } from '@island.is/auth-nest-tools'

@Injectable()
export class CollectionGuard implements CanActivate {
  constructor(
    private readonly signatureCollectionService: SignatureCollectionService,
    private reflector: Reflector,
  ) {}

  getRole(user: User, isOwner?: boolean): UserRole[] {
    const roles: UserRole[] = []

    // If user then check scopes
    if (user.scope.includes(AdminPortalScope.signatureCollectionManage)) {
      roles.push(UserRole.ADMIN_MANAGER)
    }
    if (user.scope.includes(AdminPortalScope.signatureCollectionProcess)) {
      roles.push(UserRole.ADMIN_PROCESSOR)
    }
    if (user.scope.includes(ApiScope.signatureCollection)) {
      if (isOwner) {
        if (user.actor) {
          roles.push(UserRole.CANDIDATE_COLLECTOR)
        } else {
          roles.push(UserRole.CANDIDATE_OWNER)
        }
      } else {
        roles.push(UserRole.USER)
      }
    }

    return roles
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
        console.log(user)
      if (
        !user.scope.includes(ApiScope.signatureCollection)
      ) {
        const roles = this.getRole(user)
        request.body = { ...request.body, collection, roles }
      } else {
        const signee = await this.signatureCollectionService.signee(
          user.nationalId,
        )
        const roles = this.getRole(user, signee?.isOwner)
        request.body = { ...request.body, collection, roles }
      }
    }

    // Return true if collection exists
    return !!collection.id
  }
}
