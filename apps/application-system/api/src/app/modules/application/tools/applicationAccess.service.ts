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
import {
  ActorDelegationsApi,
  ActorDelegationsControllerFindAllDirectionEnum,
  MergedDelegationDTO,
} from '@island.is/clients/auth/public-api'
import { AuthMiddleware } from '@island.is/auth-nest-tools'
import { ApplicationValidationService } from './applicationTemplateValidation.service'

type config = {
  shouldThrowIfPruned?: boolean
}

@Injectable()
export class ApplicationAccessService {
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly featureFlagService: FeatureFlagService,
    private readonly actorDelegationsApi: ActorDelegationsApi,
    private readonly validationService: ApplicationValidationService,
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
      const actorApplication =
        await this.applicationService.findByApplicantActor(id, actorNationalId)
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
  private async getRoleInState(
    application: Application,
    nationalId: string,
  ): Promise<RoleInState<EventObject> | undefined> {
    const templateId = application.typeId as ApplicationTypes
    const template = await getApplicationTemplateByTypeId(templateId)
    const helper = new ApplicationTemplateHelper(application, template)
    const currentUserRole =
      template.mapUserToRole(nationalId, application) || ''
    return helper.getRoleInState(currentUserRole)
  }

  async canDeleteApplication(
    application: Application,
    nationalId: string,
  ): Promise<boolean> {
    const role = await this.getRoleInState(application, nationalId)
    return role?.delete ?? false
  }

  evaluateIfRoleShouldBeListed = (
    application: Application,
    user: User,
    template: ApplicationTemplate<
      ApplicationContext,
      ApplicationStateSchema<EventObject>,
      EventObject
    >,
  ) => {
    const currentUserRole = template.mapUserToRole(user.nationalId, application)
    if (currentUserRole) {
      const templateHelper = new ApplicationTemplateHelper(
        application,
        template,
      )
      const roleInState = templateHelper.getRoleInState(currentUserRole)
      // if shouldBeListedForRole isnt defined it should show the application for backwards compatibility
      return roleInState?.shouldBeListedForRole === undefined
        ? true
        : roleInState?.shouldBeListedForRole
    }
    return true
  }

  private hasCustomDelegation(user: User): boolean {
    return user.delegationType?.includes(AuthDelegationType.Custom) ?? false
  }

  private async checkDelegationScopes(
    user: User,
    template: ApplicationTemplate<
      ApplicationContext,
      ApplicationStateSchema<EventObject>,
      EventObject
    >,
  ): Promise<boolean> {
    try {
      const delegations = await this.fetchUserDelegations(user)
      return delegations.some((delegation) =>
        delegation.scopes?.some((scopeObj) =>
          template.requiredScopes?.includes(scopeObj.scopeName),
        ),
      )
    } catch (e) {
      return false
    }
  }

  private async fetchUserDelegations(
    user: User,
  ): Promise<MergedDelegationDTO[]> {
    return await this.actorDelegationsApi
      .withMiddleware(new AuthMiddleware(user))
      .actorDelegationsControllerFindAll({
        direction: ActorDelegationsControllerFindAllDirectionEnum.incoming,
        delegationTypes: [AuthDelegationType.Custom],
        otherUser: user.nationalId,
      })
  }

  private checkUserScopes(user: User, requiredScopes?: string[]): boolean {
    if (!requiredScopes) {
      return false
    }
    return user.scope.some((scope) => requiredScopes.includes(scope))
  }

  private async hasValidCustomDelegation(
    user: User,
    template: ApplicationTemplate<
      ApplicationContext,
      ApplicationStateSchema<EventObject>,
      EventObject
    >,
    shouldCheckScope?: boolean,
  ): Promise<boolean> {
    const templateHasRequiredScope = template.requiredScopes !== undefined
    if (!this.hasCustomDelegation(user) || !templateHasRequiredScope) {
      return false
    }

    if (this.checkUserScopes(user, template.requiredScopes)) {
      return true
    }

    if (shouldCheckScope) {
      return await this.checkDelegationScopes(user, template)
    }

    return false
  }

  private async shouldShowApplicationOnOverview(
    user: User,
    template?: ApplicationTemplate<
      ApplicationContext,
      ApplicationStateSchema<EventObject>,
      EventObject
    >,
    scopeCheck?: boolean,
  ): Promise<boolean> {
    if (template === undefined) {
      return false
    }
    const isUserActingOnBehalfOfApplicant = !!user.actor

    // if the user is acting on behalf we need to check if it has the allowed delegations for the template
    if (isUserActingOnBehalfOfApplicant) {
      const userDelegations = user.delegationType
      if (template.allowedDelegations) {
        if (!userDelegations) {
          return false
        }

        return await this.matchesAtLeastOneDelegation(
          template.allowedDelegations,
          user,
          template,
          scopeCheck,
        )
      }
      // application doesnt allow delegation and user is acting on behalf of applicant
      else {
        return false
      }
    }

    return true
  }

  private async matchesAtLeastOneDelegation(
    delegations: AllowedDelegation[],
    user: User,
    template: ApplicationTemplate<
      ApplicationContext,
      ApplicationStateSchema<EventObject>,
      EventObject
    >,
    scopeCheck?: boolean,
  ): Promise<boolean> {
    for (const delegation of delegations) {
      if (
        await this.isDelegationAllowed(delegation, user, template, scopeCheck)
      ) {
        return true
      }
    }
    return false
  }

  /**
   * Checks if a user has the allowed delegation.
   *
   * @param delegation - The delegation to check against.
   * @param user - The user whose delegations are to be validated.
   * @param template - The application template context.
   * @param scopeCheck - Whether to fetch the extra scopes for the current user.
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
    scopeCheck?: boolean,
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

    // Check first if user has the required delegation type for a non custom delegation
    if (delegation.type !== AuthDelegationType.Custom) {
      // For non-custom delegation types, we simply check if the user's delegation type matches the
      // required delegation type and that the feature (if flagged) is enabled.
      return user.delegationType?.includes(delegation.type) && featureAllowed
    } else {
      // If the delegation type is "Custom", we need to verify if the user has the
      // required scope as per the template.
      return (
        (await this.hasValidCustomDelegation(user, template, scopeCheck)) &&
        featureAllowed
      )
    }
  }

  async hasAccessToTemplate(
    template:
      | ApplicationTemplate<
          ApplicationContext,
          ApplicationStateSchema<EventObject>,
          EventObject
        >
      | undefined,
    user: User,
    scopeCheck?: boolean,
  ): Promise<boolean> {
    // check if template is ready
    if (!template) {
      return false
    }
    if (await this.validationService.isTemplateReady(template, user)) {
      return await this.shouldShowApplicationOnOverview(
        user,
        template,
        scopeCheck,
      )
    }
    return false
  }
}
