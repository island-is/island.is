import { Injectable, NotFoundException } from '@nestjs/common'

import {
  Application as BaseApplication,
  ApplicationService,
} from '@island.is/application/api/core'
import {
  Application,
  ApplicationContext,
  ApplicationStateSchema,
  ApplicationTemplate,
  ApplicationTemplateHelper,
  ApplicationTypes,
} from '@island.is/application/core'
import { getApplicationTemplateByTypeId } from '@island.is/application/template-loader'
import { EventObject } from 'xstate'
@Injectable()
export class ApplicationAccessService {
  constructor(private readonly applicationService: ApplicationService) {}

  async findOneByIdAndNationalId(id: string, nationalId: string) {
    const existingApplication = await this.applicationService.findOneById(
      id,
      nationalId,
    )

    if (!existingApplication) {
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
    const currentUserRoles =
      template.mapUserToRole(nationalId, application) || ''

    if (Array.isArray(currentUserRoles)) {
      for (const role in currentUserRoles) {
        const currentRole = helper.getRoleInState(currentUserRoles[role])
        if (currentRole?.delete) {
          return true
        }
      }
      return false
    }
    const role = helper.getRoleInState(currentUserRoles)
    return role?.delete ?? false
  }

  private async evaluateIfRoleShouldBeListed(
    userRole: string | undefined,
    templateHelper: ApplicationTemplateHelper<
      ApplicationContext,
      ApplicationStateSchema<EventObject>,
      EventObject
    >,
  ) {
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
    nationalId: string,
    template?: ApplicationTemplate<
      ApplicationContext,
      ApplicationStateSchema<EventObject>,
      EventObject
    >,
  ): Promise<boolean> {
    if (template === undefined) {
      return false
    }

    const currentUserRoles = template.mapUserToRole(nationalId, application)
    const templateHelper = new ApplicationTemplateHelper(application, template)
    if (Array.isArray(currentUserRoles)) {
      for (const role in currentUserRoles) {
        if (
          await this.evaluateIfRoleShouldBeListed(
            currentUserRoles[role],
            templateHelper,
          )
        ) {
          return true
        }
      }
      // return false if true isn't returned from evaluateRole before
      return false
    }
    return this.evaluateIfRoleShouldBeListed(currentUserRoles, templateHelper)
  }
}
