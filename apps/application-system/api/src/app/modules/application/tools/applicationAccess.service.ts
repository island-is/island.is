import { Injectable, NotFoundException } from '@nestjs/common'

import { BadSubject, ProblemError } from '@island.is/nest/problem'
import { User } from '@island.is/auth-nest-tools'

import {
  Application as BaseApplication,
  ApplicationService,
} from '@island.is/application/api/core'
import {
  ApplicationTemplateHelper,
  coreErrorMessages,
} from '@island.is/application/core'
import {
  AllowedDelegation,
  Application,
  ApplicationContext,
  ApplicationStateSchema,
  ApplicationTemplate,
  ApplicationTypes,
  RoleInState,
} from '@island.is/application/types'
import { getApplicationTemplateByTypeId } from '@island.is/application/template-loader'
import { EventObject } from 'xstate'
import { FeatureFlagService } from '@island.is/nest/feature-flags'
import { ProblemType } from '@island.is/shared/problem'
import { AuthDelegationType } from '@island.is/shared/types'
// temp disable, todo fix
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { DelegationType } from '@island.is/auth-api-lib'
import {
  ActorDelegationsApi,
  ActorDelegationsControllerFindAllDirectionEnum,
} from '@island.is/clients/auth/public-api'

type config = {
  shouldThrowIfPruned?: boolean
}

@Injectable()
export class ApplicationAccessService {
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly featureFlagService: FeatureFlagService,
    private readonly actorDelegationsApi: ActorDelegationsApi,
  ) {}

  async findOneByIdAndNationalId(id: string, user: User, config?: config) {
    const existingApplication = await this.applicationService.findOneById(
      id,
      user.nationalId,
    )

    if (config?.shouldThrowIfPruned && existingApplication?.pruned) {
      throw new ProblemError({
        type: ProblemType.HTTP_NOT_FOUND,
        title: coreErrorMessages.applicationIsPrunedAndReadOnly.description,
        detail: coreErrorMessages.applicationIsPrunedAndReadOnly.defaultMessage,
      })
    }

    if (!existingApplication) {
      // Throws bad subject error if user is actor on application
      const actorNationalId = user.actor
        ? user.actor.nationalId
        : user.nationalId
      const actorApplication = await this.applicationService.findByApplicantActor(
        id,
        actorNationalId,
      )
      if (actorApplication) {
        throw new BadSubject([{ nationalId: actorApplication.applicant }])
      }

      // Check if user has role in current state in application that allows access
      const existingApplicationById = await this.applicationService.findOneById(
        id,
      )
      if (existingApplicationById) {
        const hasRole = await this.getRoleInState(
          existingApplicationById as Application,
          user.nationalId,
        )
        if (hasRole) {
          return existingApplicationById
        }
      }

      throw new NotFoundException(
        `An application with the id ${id} does not exist`,
      )
    }

    return existingApplication as BaseApplication
  }

  /**
   * Fetches the role of a user in a given application's state.
   *
   * @param application The application to fetch the role for.
   * @param nationalId The national ID of the user.
   * @returns The role of the user in the application state, or undefined if the user has no role.
   */
  async getRoleInState(
    application: Application,
    nationalId: string,
  ): Promise<RoleInState<EventObject> | undefined> {
    const templateId = application.typeId as ApplicationTypes
    const template = await getApplicationTemplateByTypeId(templateId)
    const helper = new ApplicationTemplateHelper(application, template)
    const currentUserRole =
      template.mapUserToRole(nationalId, application) || ''
    const role = helper.getRoleInState(currentUserRole)
    return role
  }

  async canDeleteApplication(
    application: Application,
    nationalId: string,
  ): Promise<boolean> {
    const role = await this.getRoleInState(application, nationalId)
    return role?.delete ?? false
  }

  private evaluateIfRoleShouldBeListed = (
    userRole: string | undefined,
    templateHelper: ApplicationTemplateHelper<
      ApplicationContext,
      ApplicationStateSchema<EventObject>,
      EventObject
    >,
  ) => {
    if (userRole) {
      const roleInState = templateHelper.getRoleInState(userRole)
      // if shouldBeListedForRole isnt defined it should show the application for backwards compatibility
      return roleInState?.shouldBeListedForRole === undefined
        ? true
        : roleInState?.shouldBeListedForRole
    }
    return true
  }

  async hasValidCustomDelegation(
    user: User,
    template: ApplicationTemplate<
      ApplicationContext,
      ApplicationStateSchema<EventObject>,
      EventObject
    >,
    scopeCheck?: boolean,
  ): Promise<boolean> {
    const userDelegations = user.delegationType
    const requiredScopes = template.requiredScopes
    console.log('the neationalid is ', user.nationalId)

    // Must be a custom delegation
    if (
      !userDelegations ||
      !userDelegations.includes(AuthDelegationType.Custom)
    ) {
      return false
    }

    // Custom delegations must have required scopes on their template
    if (!requiredScopes) {
      return false
    }

    // If we dont have the scopes available like in service portal we need to fetch
    // them for the user logged in
    if (scopeCheck) {
      const delegations = await this.actorDelegationsApi.actorDelegationsControllerFindAll(
        {
          direction: ActorDelegationsControllerFindAllDirectionEnum.incoming,
          delegationTypes: [DelegationType.Custom],
          otherUser: user.nationalId,
        },
      )

      console.log('we just check delegations', delegations)

      for (const delegation of delegations) {
        console.log('we just check delegations', delegation)
        if (!delegation.scopes) continue
        for (const scopeObj of delegation.scopes) {
          console.log('we just check scopeObj', scopeObj)
          if (template.requiredScopes.includes(scopeObj.scopeName)) {
            console.log('the scope matches')
            return true
          }
        }
      }
      console.log('false 4')
      return false
    } else {
      for (const scope of user.scope) {
        console.log('we just check scope', scope)
        if (requiredScopes?.includes(scope)) {
          console.log('the scope matches')
          return true
        }
      }
      console.log('false 5')
      return false
    }
  }

  async shouldShowApplicationOnOverview(
    application: Application,
    user: User,
    scopeCheck?: boolean,
    template?: ApplicationTemplate<
      ApplicationContext,
      ApplicationStateSchema<EventObject>,
      EventObject
    >,
  ): Promise<boolean> {
    if (template === undefined) {
      return false
    }
    const nationalId = user.nationalId
    const isUserActingOnBehalfOfApplicant = !!user.actor

    // if the user is acting on behalf we need to check if it has the allowed delegations for the template
    if (isUserActingOnBehalfOfApplicant) {
      const userDelegations = user.delegationType
      if (template.allowedDelegations) {
        if (!userDelegations) {
          return false
        }

        if (
          !(await this.matchesAtLeastOneDelegation(
            template.allowedDelegations,
            user,
            template,
          ))
        ) {
          return false
        }
        // Need to check this better, what if the user isnt in custom delegation?
        if (await this.hasValidCustomDelegation(user, template, scopeCheck)) {
          return true
        }
      }
      // application doesnt allow delegation and user is acting on behalf of applicant
      else {
        return false
      }
    }

    const currentUserRole = template.mapUserToRole(nationalId, application)
    const templateHelper = new ApplicationTemplateHelper(application, template)
    return this.evaluateIfRoleShouldBeListed(currentUserRole, templateHelper)
  }

  private async matchesAtLeastOneDelegation(
    delegations: AllowedDelegation[],
    user: User,
    template: ApplicationTemplate<
      ApplicationContext,
      ApplicationStateSchema<EventObject>,
      EventObject
    >,
  ): Promise<boolean> {
    let matchesAtLeastOneDelegation = false
    for (const delegation of delegations) {
      if (await this.isDelegationAllowed(delegation, user, template)) {
        matchesAtLeastOneDelegation = true
        break
      }
    }
    return matchesAtLeastOneDelegation
  }

  /**
   * Checks if a user has the allowed delegation.
   *
   * @param delegation - The delegation to check against.
   * @param user - The user whose delegations are to be validated.
   * @param template - The application template context.
   * @returns A Promise that resolves to a boolean indicating whether the user has the allowed delegation.
   */
  async isDelegationAllowed(
    delegation: AllowedDelegation,
    user: User,
    template: ApplicationTemplate<
      ApplicationContext,
      ApplicationStateSchema<EventObject>,
      EventObject
    >,
  ): Promise<boolean | undefined> {
    // Check if feature flag is set for the delegation. If it is, we need to validate
    // if the feature is enabled for the user.
    let featureAllowed = true
    if (delegation.featureFlag) {
      featureAllowed = await this.featureFlagService.getValue(
        delegation.featureFlag,
        false,
        user,
      )
    }
    // If the delegation type is "Custom", we need to verify if the user has the
    // required scope as per the template.
    if (delegation.type === AuthDelegationType.Custom) {
      console.log('we are in custom delegation')
      // The user can proceed if the custom delegation is valid and the feature (if flagged) is enabled.
      return (
        (await this.hasValidCustomDelegation(user, template, false)) &&
        featureAllowed
      )
    }
    // For non-custom delegation types, we simply check if the user's delegation type matches the
    // required delegation type and that the feature (if flagged) is enabled.
    return user.delegationType?.includes(delegation.type) && featureAllowed
  }
}
