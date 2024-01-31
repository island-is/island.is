import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { SignatureCollectionService } from '../signatureCollection.service'
import { ApiScope } from '@island.is/auth/scopes'
import { getRequest } from '@island.is/auth-nest-tools'

@Injectable()
export class CollectionGuard implements CanActivate {
  constructor(
    private readonly signatureCollectionService: SignatureCollectionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get current collection info
    // Get singee if possible
    // Add to request body to get userRole
    const request = getRequest(context)

    const user = request.user
    // make collection info available to all
    const collection =
      await this.signatureCollectionService.currentCollectionInfo()
    if (!user || !user.scope.includes(ApiScope.signatureCollection)) {
      request.body = {
        ...request.body,
        collection,
      }
    } else {
      const signee = await this.signatureCollectionService.signee(user)
      request.body = { ...request.body, collection, signee }
    }

    // Return true if collection exists
    return !!collection.id
  }
}
