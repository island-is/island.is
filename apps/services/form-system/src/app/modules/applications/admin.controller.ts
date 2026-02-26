import {
  Controller,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
  VERSION_NEUTRAL,
  Query,
} from '@nestjs/common'
import { ApiTags, ApiHeader } from '@nestjs/swagger'
import { Documentation } from '@island.is/nest/swagger'
import { ApplicationsService } from './applications.service'
import { CurrentUser, IdsUserGuard, Scopes } from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { ApplicationTypeDto } from './models/dto/applicationType.dto'
import { InstitutionDto } from './models/dto/institution.dto'
import { ApplicationAdminResponseDto } from './models/dto/applicationAdminResponse.dto'
import { ApplicationStatisticsDto } from './models/dto/applicationStatistics.dto'
import { ApplicationAdminSerializer } from './tools/applicationAdmin.serializer'
import type { Locale } from '@island.is/shared/types'

@UseGuards(IdsUserGuard)
@ApiTags('admin')
@ApiHeader({
  name: 'locale',
  description: 'Front-end language selected',
})
@Controller({ path: 'admin', version: ['1', VERSION_NEUTRAL] })
export class AdminController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  //TODOxy add audit? BypassDelegation?

  @Scopes(AdminPortalScope.applicationSystemAdmin)
  @Get('super-admin/overview/:page/:count')
  @UseInterceptors(ApplicationAdminSerializer)
  @Documentation({
    description: 'Get applications for super admin overview',
    response: {
      status: 200,
      type: ApplicationAdminResponseDto,
    },
    request: {
      params: {
        page: {
          type: 'number',
          required: true,
          description: 'The page to fetch',
        },
        count: {
          type: 'number',
          required: true,
          description: 'Number of items to fetch',
        },
      },
      query: {
        institutionNationalId: {
          type: 'string',
          required: false,
          description: 'To filter applications by nationalId of institution',
        },
        formId: {
          type: 'string',
          required: false,
          description: 'To filter applications by formId',
        },
        applicantNationalId: {
          type: 'string',
          required: false,
          description: 'To filter applications by applicant nationalId.',
        },
        searchStr: {
          type: 'string',
          required: false,
          description: 'To filter applications by any search string',
        },
        from: {
          type: 'string',
          required: false,
          description: 'Only return results created after specified date',
        },
        to: {
          type: 'string',
          required: false,
          description: 'Only return results created before specified date',
        },
        locale: {
          type: 'string',
          required: false,
          description: 'Locale',
          example: 'en',
        },
      },
    },
  })
  async getOverviewForSuperAdmin(
    @Param('page') page: number,
    @Param('count') count: number,
    @Query('institutionNationalId') institutionNationalId?: string,
    @Query('formId') formId?: string,
    @Query('applicantNationalId') applicantNationalId?: string,
    @Query('searchStr') searchStr?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('locale') locale?: Locale,
  ): Promise<ApplicationAdminResponseDto> {
    return this.applicationsService.findAllApplicationsByAdminFilters(
      page,
      count,
      institutionNationalId,
      formId,
      applicantNationalId,
      searchStr,
      from,
      to,
      locale,
    )
  }

  @Scopes(AdminPortalScope.applicationSystemInstitution)
  @Get('institution-admin/overview/:page/:count')
  @UseInterceptors(ApplicationAdminSerializer)
  @Documentation({
    description: 'Get applications for institution admin overview',
    response: {
      status: 200,
      type: ApplicationAdminResponseDto,
    },
    request: {
      params: {
        page: {
          type: 'number',
          required: true,
          description: 'The page to fetch',
        },
        count: {
          type: 'number',
          required: true,
          description: 'Number of items to fetch',
        },
      },
      query: {
        formId: {
          type: 'string',
          required: false,
          description: 'To filter applications by formId',
        },
        applicantNationalId: {
          type: 'string',
          required: false,
          description: 'To filter applications by applicant nationalId.',
        },
        searchStr: {
          type: 'string',
          required: false,
          description: 'To filter applications by any search string',
        },
        from: {
          type: 'string',
          required: false,
          description: 'Only return results created after specified date',
        },
        to: {
          type: 'string',
          required: false,
          description: 'Only return results created before specified date',
        },
        locale: {
          type: 'string',
          required: false,
          description: 'Locale',
          example: 'en',
        },
      },
    },
  })
  async getOverviewForInstitutionAdmin(
    @CurrentUser() user: User,
    @Param('page') page: number,
    @Param('count') count: number,
    @Query('formId') formId?: string,
    @Query('applicantNationalId') applicantNationalId?: string,
    @Query('searchStr') searchStr?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('locale') locale?: Locale,
  ): Promise<ApplicationAdminResponseDto> {
    return this.applicationsService.findAllApplicationsByAdminFilters(
      page,
      count,
      user.nationalId,
      formId,
      applicantNationalId,
      searchStr,
      from,
      to,
      locale,
    )
  }

  @Scopes(AdminPortalScope.applicationSystemAdmin)
  @Get('super-admin/application-types')
  @Documentation({
    description:
      'Get all application types, or only for a specific institution',
    response: {
      status: 200,
      type: [ApplicationTypeDto],
    },
    request: {
      query: {
        nationalId: {
          type: 'string',
          required: false,
          description: `To get the application types for a specific institution's national id.`,
        },
        locale: {
          type: 'string',
          required: false,
          description: 'Locale',
          example: 'en',
        },
      },
    },
  })
  async getApplicationTypesForSuperAdmin(
    @Query('nationalId') nationalId?: string,
    @Query('locale') locale?: Locale,
  ): Promise<ApplicationTypeDto[]> {
    return this.applicationsService.getAllApplicationTypes(nationalId, locale)
  }

  @Scopes(AdminPortalScope.applicationSystemInstitution)
  @Get('institution-admin/application-types/')
  @Documentation({
    description: 'Get all application types for institution admin',
    response: {
      status: 200,
      type: [ApplicationTypeDto],
    },
    request: {
      query: {
        locale: {
          type: 'string',
          required: false,
          description: 'Locale',
          example: 'en',
        },
      },
    },
  })
  async getApplicationTypesForInstitutionAdmin(
    @CurrentUser() user: User,
    @Query('locale') locale?: Locale,
  ): Promise<ApplicationTypeDto[]> {
    return this.applicationsService.getAllApplicationTypes(
      user.nationalId,
      locale,
    )
  }

  @Scopes(AdminPortalScope.applicationSystemAdmin)
  @Get('super-admin/institutions')
  @Documentation({
    description: 'Get a list of all institutions with active application types',
    response: {
      status: 200,
      type: [InstitutionDto],
    },
  })
  async getInstitutions(): Promise<InstitutionDto[]> {
    return this.applicationsService.getAllInstitutionsSuperAdmin()
  }

  @Scopes(AdminPortalScope.applicationSystemAdmin)
  @Get('super-admin/applications/statistics')
  @Documentation({
    description:
      'Get applications statistics for the entire application system (as super admin)',
    response: {
      status: 200,
      type: [ApplicationStatisticsDto],
    },
    request: {
      query: {
        startDate: {
          type: 'string',
          required: true,
          description: 'Start date for the statistics',
        },
        endDate: {
          type: 'string',
          required: true,
          description: 'End date for the statistics',
        },
      },
    },
  })
  async getStatisticsForSuperAdmin(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<ApplicationStatisticsDto[]> {
    return this.applicationsService.getApplicationCountByTypeIdAndStatus(
      startDate,
      endDate,
    )
  }

  @Scopes(AdminPortalScope.applicationSystemInstitution)
  @Get('institution-admin/applications/statistics')
  @Documentation({
    description: 'Get applications statistics for a specific institution',
    response: {
      status: 200,
      type: [ApplicationStatisticsDto],
    },
    request: {
      query: {
        startDate: {
          type: 'string',
          required: true,
          description: 'Start date for the statistics',
        },
        endDate: {
          type: 'string',
          required: true,
          description: 'End date for the statistics',
        },
      },
    },
  })
  async getStatisticsForInstitutionAdmin(
    @CurrentUser() user: User,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<ApplicationStatisticsDto[]> {
    return this.applicationsService.getApplicationCountByTypeIdAndStatus(
      startDate,
      endDate,
      user.nationalId,
    )
  }
}
