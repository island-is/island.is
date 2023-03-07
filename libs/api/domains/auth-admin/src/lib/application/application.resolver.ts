import { UseGuards } from '@nestjs/common'
import { IdsUserGuard } from '@island.is/auth-nest-tools'
import { Application } from './models/application.model'
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { ApplicationsService } from './applications.service'
import { ApplicationsPayload } from './dto/applications-payload'
import { ApplicationEnvironment } from './models/applications-environment.model'
import { Environment } from '../models/environment'
import { ApplicationsInput } from './dto/applications.input'

@UseGuards(IdsUserGuard)
@Resolver(() => Application)
export class ApplicationResolver {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Query(() => ApplicationsPayload, { name: 'authAdminApplications' })
  getApplications(@Args('tenantId') tenantId: string) {
    return this.applicationsService.getApplications(tenantId)
  }

  @ResolveField('defaultEnvironment', () => ApplicationEnvironment)
  resolveDefaultEnvironment(
    @Parent() application: Application,
  ): ApplicationEnvironment {
    if (application.environments.length === 0) {
      throw new Error(
        `Application ${application.applicationId} has no environments`,
      )
    }

    // Depends on the priority order being decided by the backend
    return application.environments[0]
  }

  @ResolveField('availableEnvironments', () => [Environment])
  resolveAvailableEnvironments(
    @Parent() application: Application,
  ): Environment[] {
    return application.environments.map((env) => env.environment)
  }
}
