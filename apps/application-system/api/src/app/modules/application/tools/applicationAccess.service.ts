import { Injectable, NotFoundException } from '@nestjs/common'

import { BadSubject } from '@island.is/nest/problem'
import { User } from '@island.is/auth-nest-tools'

import {
  Application as BaseApplication,
  ApplicationService,
} from '@island.is/application/api/core'
import { ApplicationTemplateHelper } from '@island.is/application/core'
import {
  Application,
  ApplicationContext,
  ApplicationStateSchema,
  ApplicationTemplate,
  ApplicationTypes,
} from '@island.is/application/types'
import { getApplicationTemplateByTypeId } from '@island.is/application/template-loader'
import { EventObject } from 'xstate'

@Injectable()
export class ApplicationAccessService {
  constructor(private readonly applicationService: ApplicationService) {}

  async findOneByIdAndNationalId(id: string, user: User) {
    const existingApplication = await this.applicationService.findOneById(
      id,
      user.nationalId,
    )

    if (!existingApplication) {
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

      throw new NotFoundException(
        `An application with the id ${id} does not exist`,
      )
    }

    return existingApplication as BaseApplication
  }

  async canDeleteApplication(
    application: Application,
    nationalId: string,
  ): Promise<boolean> {
    const templateId = application.typeId as ApplicationTypes
    const template = await getApplicationTemplateByTypeId(templateId)
    const helper = new ApplicationTemplateHelper(application, template)
    const currentUserRole =
      template.mapUserToRole(nationalId, application) || ''
    const role = helper.getRoleInState(currentUserRole)
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

  shouldShowApplicationOnOverview = (
    application: Application,
    user: User,
    template?: ApplicationTemplate<
      ApplicationContext,
      ApplicationStateSchema<EventObject>,
      EventObject
    >,
  ): boolean => {
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
        const matchesAtLeastOneDelegation = template.allowedDelegations.some(
          (d) => userDelegations.includes(d.type),
        )
        if (!matchesAtLeastOneDelegation) {
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
}
