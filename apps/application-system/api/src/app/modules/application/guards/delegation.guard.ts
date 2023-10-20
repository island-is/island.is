import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { User } from '@island.is/auth-nest-tools'
import { Reflector } from '@nestjs/core'
import {
  ApplicationService,
  TemplateService,
} from '@island.is/application/api/core'
import { verifyToken } from '../utils/tokenUtils'
import { DecodedAssignmentToken } from '../types'
import { BadSubject } from '@island.is/nest/problem'
import { BYPASS_DELEGATION_KEY } from './bypass-delegation.decorator'
import { FeatureFlagService } from '@island.is/nest/feature-flags'
import { ApplicationAccessService } from '../tools/applicationAccess.service'

@Injectable()
export class DelegationGuard implements CanActivate {
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly reflector: Reflector,
    private readonly applicationAccessService: ApplicationAccessService,
    private readonly featureFlagService: FeatureFlagService,
    private readonly templateService: TemplateService,
  ) {}

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
    // we check for metadata set by the bypass delegation decorator
    const bypassDelegation = this.reflector.getAllAndOverride<boolean>(
      BYPASS_DELEGATION_KEY,
      [context.getHandler(), context.getClass()],
    )
    const request = context.switchToHttp().getRequest()
    const user: User = request.user
    if (!user.actor) {
      // If there is no actor then the user is not using delegations
      return true
    } else {
      // typeId is type of application / applications the user is trying to access
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
        const applicationTemplate =
          await this.templateService.getApplicationTemplate(typeId)
        const delegations = applicationTemplate.allowedDelegations || []
        // Prepare an array of promises that will be resolved in parallel.
        // Each promise represents a permission check.
        const delegationCheckPromises = delegations.map((delegation) =>
          this.applicationAccessService.isDelegationAllowed(
            delegation,
            user,
            applicationTemplate,
          ),
        )
        // Execute all the permission checks in parallel and wait for them to finish.
        const delegationCheckResults = await Promise.all(
          delegationCheckPromises,
        )
        // Filter the original list of delegations using the results of the checks.
        // This will give us a new array containing only those delegations that are allowed.
        const allowedDelegations = delegations.filter(
          (_, index) => delegationCheckResults[index],
        )

        // returns true if the actors delegation type for the subject is allowed for this type of application
        if (allowedDelegations.length > 0) {
          return true
        } else {
          // throw bad subject with no fields,
          //  user is trying to access a ressource that does not support delegations with active delegation
          throw new BadSubject()
        }
      } else {
        // If the bypass delegation exists and is truthy we bypass delegation
        if (bypassDelegation) {
          return true
        }
        // This can happen if the user enters a drafted application and does not have access the getTypeIdFromApplicationId needs to get the application from the user id
        throw new BadSubject()
      }
    }
  }
}
