import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { getApplicationTemplateByTypeId } from '@island.is/application/template-loader'
import { User } from '@island.is/auth-nest-tools'
import { ApplicationService } from '@island.is/application/api/core'
import { verifyToken } from '../utils/tokenUtils'
import { DecodedAssignmentToken } from '../types'
import { BadSubject } from '@island.is/nest/problem'

@Injectable()
export class DelegationGuard implements CanActivate {
  constructor(private readonly applicationService: ApplicationService) {}

  async getTypeIdFromApplicationId(
    id: string,
    user: User,
  ): Promise<string | null> {
    if (!id) {
      return null
    }
    try {
      const application = await this.applicationService.findOneById(
        id,
        user.nationalId,
      )
      return application?.typeId || null
    } catch {
      return null
    }
  }

  async getTypeIdFromToken(token: string, user: User): Promise<string | null> {
    const decodedToken = verifyToken<DecodedAssignmentToken>(token)
    if (!decodedToken) {
      return null
    }
    return await this.getTypeIdFromApplicationId(
      decodedToken.applicationId,
      user,
    )
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const user: User = request.user
    if (!user.actor) {
      // If there is no actor then the user is not using delegations
      return true
    } else {
      // typeId is type of appliation / applications the user is trying to access
      // Directly accessible in request params or body
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
        const intersection =
          applicationTemplate.allowedDelegations?.filter((delegation) =>
            user.delegationType?.includes(delegation),
          ) || []
        // returns true if the actors delegation type for the subject is allowed for this type of application
        if (intersection.length > 0) {
          return true
        } else {
          // throw bad subject with no fields,
          //  user is trying to access a ressource that does not support delegations with active delegation
          throw new BadSubject()
        }
      } else {
        // This can happen if the user enters a drafted application and does not have access the getTypeIdFromApplicationId needs to get the application from the user id
        throw new BadSubject()
      }
    }
  }
}
