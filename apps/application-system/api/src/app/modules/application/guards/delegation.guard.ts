import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { getApplicationTemplateByTypeId } from '@island.is/application/template-loader'
import { User } from '@island.is/auth-nest-tools'
import { ApplicationService } from '@island.is/application/api/core'
import { verifyToken } from '../utils/tokenUtils'
import { DecodedAssignmentToken } from '../types'

@Injectable()
export class DelegationGuard implements CanActivate {
  constructor(private readonly applicationService: ApplicationService) {}

  async getTypeIdFromApplicationId(
    id: string,
    user: User,
  ): Promise<string | null> {
    if(!id) {
      return null
    }
    const application = await this.applicationService.findOneById(
      id,
      user.nationalId,
    )
    return application?.typeId || null
  }

  async getTypeIdFromToken (token: string, user: User): Promise<string | null> {
    const decodedToken = verifyToken<DecodedAssignmentToken>(
      token,
    )
    if(!decodedToken) {
      return null
    }
    return await this.getTypeIdFromApplicationId(decodedToken.applicationId, user)
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const user: User = request.user
    if (!user.actor) {
      // If there is no actor then the user is not using delegations
      return true
    } else {
      // typeId is type of appliation / applications the user is trying to access
      // Directlly accessable in request params or body
      // If the request has the application id in params or the body contains a coded token from the assign application function
      // then we get the application to get its typeId
      const typeId =
        request.query.typeId ||
        request.body.typeId ||
        (await this.getTypeIdFromApplicationId(request.params.id, user)) ||
        (await this.getTypeIdFromToken(request.body.token, user))
        
      // Get the delegation types the application type supports
      if (typeId) {
        const applicationTemplate = await getApplicationTemplateByTypeId(typeId)
        // returns true if the actors delegation type for the subject is allowed for this type of application
        return (
          applicationTemplate.allowedDelegations?.includes(
            user.actor.delegationType,
          ) || false
        )
      } else {
        return false
      }
    }
  }
}
