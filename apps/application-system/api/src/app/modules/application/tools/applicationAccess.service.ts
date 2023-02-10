import { Injectable, NotFoundException } from '@nestjs/common'

import { BadSubject, ProblemError } from '@island.is/nest/problem'
import { User } from '@island.is/auth-nest-tools'

import {
  Application as BaseApplication,
  ApplicationService,
} from '@island.is/application/api/core'
import { ApplicationTemplateHelper } from '@island.is/application/core'
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
import { coreErrorMessages } from '@island.is/application/core'

type config = {
  shouldThrowIfPruned?: boolean
}

@Injectable()
export class ApplicationAccessService {
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly featureFlagService: FeatureFlagService,
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
        const hasRole = await this.getRoleinState(
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

  async getRoleinState(
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
    const role = await this.getRoleinState(application, nationalId)
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

  async shouldShowApplicationOnOverview(
    application: Application,
    user: User,
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
          ))
        ) {
          return false
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
  ): Promise<boolean> {
    let matchesAtLeastOneDelegation = false
    for (const delegation of delegations) {
      if (await this.isDelegatationAllowed(delegation, user)) {
        matchesAtLeastOneDelegation = true
        break
      }
    }
    return matchesAtLeastOneDelegation
  }

  async isDelegatationAllowed(
    delegation: AllowedDelegation,
    user: User,
  ): Promise<boolean | undefined> {
    let featureAllowed = true
    if (delegation.featureFlag) {
      featureAllowed = await this.featureFlagService.getValue(
        delegation.featureFlag,
        false,
        user,
      )
    }
    return user.delegationType?.includes(delegation.type) && featureAllowed
  }
}
