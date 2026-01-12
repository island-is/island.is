import {
  Controller,
  Get,
  Param,
  UseInterceptors,
  Query,
  UseGuards,
  Inject,
} from '@nestjs/common'
import { ApiTags, ApiHeader, ApiBearerAuth } from '@nestjs/swagger'

import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  Scopes,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import { ApplicationService } from '@island.is/application/api/core'
import { Documentation } from '@island.is/nest/swagger'
import { DelegationGuard } from './guards/delegation.guard'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { BypassDelegation } from './guards/bypass-delegation.decorator'
import {
  ApplicationAdminPaginatedResponse,
  ApplicationInstitution,
  ApplicationStatistics,
  ApplicationTypeAdmin,
} from './dto/applicationAdmin.response.dto'
import {
  ApplicationAdminSerializer,
  ApplicationAdminStatisticsSerializer,
  ApplicationTypeAdminSerializer,
} from './tools/applicationAdmin.serializer'

@UseGuards(IdsUserGuard, ScopesGuard, DelegationGuard)
@ApiTags('applications')
@ApiBearerAuth()
@ApiHeader({
  name: 'locale',
  description: 'Front-end language selected',
})
@Controller()
export class AdminController {
  constructor(
    private readonly applicationService: ApplicationService,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
  ) {}

  @Scopes(AdminPortalScope.applicationSystemAdmin)
  @BypassDelegation()
  @Get('admin/applications/statistics')
  @UseInterceptors(ApplicationAdminStatisticsSerializer)
  @Documentation({
    description:
      'Get applications statistics for the entire application system (as super admin)',
    response: {
      status: 200,
      type: [ApplicationStatistics],
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
  async getSuperAdminCountByTypeIdAndStatus(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.applicationService.getApplicationCountByTypeIdAndStatus(
      startDate,
      endDate,
    )
  }

  @Scopes(AdminPortalScope.applicationSystemInstitution)
  @BypassDelegation()
  @Get('admin/applications/statistics/institution')
  @UseInterceptors(ApplicationAdminStatisticsSerializer)
  @Documentation({
    description: 'Get applications statistics for a specific institution',
    response: {
      status: 200,
      type: [ApplicationStatistics],
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
  async getInstitutionCountByTypeIdAndStatus(
    @CurrentUser() user: User,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.applicationService.getApplicationCountByTypeIdAndStatus(
      startDate,
      endDate,
      user.nationalId,
    )
  }

  @Scopes(AdminPortalScope.applicationSystemAdmin)
  @BypassDelegation()
  @Get('admin/applications/overview/:page/:count')
  @UseInterceptors(ApplicationAdminSerializer)
  @Audit<ApplicationAdminPaginatedResponse>({
    resources: (apps) => apps.rows.map((app) => app.id),
  })
  @Documentation({
    description: 'Get applications for super admin overview',
    response: {
      status: 200,
      type: ApplicationAdminPaginatedResponse,
    },
    request: {
      params: {
        page: {
          type: 'number',
          required: true,
          description: `The page to fetch`,
        },
        count: {
          type: 'number',
          required: true,
          description: `Number of items to fetch`,
        },
      },
      query: {
        status: {
          type: 'string',
          required: false,
          description:
            'To filter applications by status. Comma-separated for multiple values.',
        },
        applicantNationalId: {
          type: 'string',
          required: false,
          description: 'To filter applications by applicant nationalId.',
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
        typeIdValue: {
          type: 'string',
          required: false,
          description: 'To filter applications by typeId',
        },
        institutionNationalId: {
          type: 'string',
          required: false,
          description: 'To filter applications by nationalId of institution',
        },
        searchStr: {
          type: 'string',
          required: false,
          description: 'To filter applications by any search string',
        },
      },
    },
  })
  async findAllSuperAdmin(
    @Param('page') page: number,
    @Param('count') count: number,
    @Query('status') status?: string,
    @Query('applicantNationalId') applicantNationalId?: string,
    @Query('institutionNationalId') institutionNationalId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('typeIdValue') typeIdValue?: string,
    @Query('searchStr') searchStr?: string,
  ) {
    return this.applicationService.findAllByAdminFilters(
      page ?? 1,
      count ?? 12,
      status,
      applicantNationalId,
      institutionNationalId,
      from,
      to,
      typeIdValue,
      searchStr,
    )
  }

  @Scopes(AdminPortalScope.applicationSystemInstitution)
  @BypassDelegation()
  @Get('admin/applications/overview/institution/:page/:count')
  @UseInterceptors(ApplicationAdminSerializer)
  @Audit<ApplicationAdminPaginatedResponse>({
    resources: (apps) => apps.rows.map((app) => app.id),
  })
  @Documentation({
    description: 'Get applications for a specific institution',
    response: {
      status: 200,
      type: ApplicationAdminPaginatedResponse,
    },
    request: {
      params: {
        page: {
          type: 'number',
          required: true,
          description: `The page to fetch`,
        },
        count: {
          type: 'number',
          required: true,
          description: `Number of items to fetch`,
        },
      },
      query: {
        status: {
          type: 'string',
          required: false,
          description:
            'To filter applications by status. Comma-separated for multiple values.',
        },
        applicantNationalId: {
          type: 'string',
          required: false,
          description: 'To filter applications by applicant nationalId.',
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
        typeIdValue: {
          type: 'string',
          required: false,
          description: 'To filter applications by typeId',
        },
        searchStr: {
          type: 'string',
          required: false,
          description: 'To filter applications by any search string',
        },
      },
    },
  })
  async findAllInstitutionAdmin(
    @CurrentUser() user: User,
    @Param('page') page: number,
    @Param('count') count: number,
    @Query('status') status?: string,
    @Query('applicantNationalId') applicantNationalId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('typeIdValue') typeIdValue?: string,
    @Query('searchStr') searchStr?: string,
  ) {
    return this.applicationService.findAllByAdminFilters(
      page ?? 1,
      count ?? 12,
      status,
      applicantNationalId,
      user.nationalId,
      from,
      to,
      typeIdValue,
      searchStr,
    )
  }

  //todo sækja nationalId úr token WEE WOOO
  @Scopes(AdminPortalScope.applicationSystemInstitution)
  @BypassDelegation()
  @Get('admin/applications/application-types/:nationalId/')
  @UseInterceptors(ApplicationTypeAdminSerializer)
  @Documentation({
    description: 'Get application types for a specific institution',
    response: {
      status: 200,
      type: [ApplicationTypeAdmin],
    },
    request: {
      params: {
        nationalId: {
          type: 'string',
          required: true,
          description: `To get the application types for a specific institution's national id.`,
        },
      },
    },
  })
  async getApplicationTypesInstitutionAdmin(
    @Param('nationalId') nationalId: string,
  ) {
    return this.applicationService.getAllApplicationTypesInstitutionAdmin(
      nationalId,
    )
  }

  @Scopes(AdminPortalScope.applicationSystemAdmin)
  @BypassDelegation()
  @Get('admin/applications/application-types')
  @UseInterceptors(ApplicationTypeAdminSerializer)
  @Documentation({
    description: 'Get all application types',
    response: {
      status: 200,
      type: [ApplicationTypeAdmin],
    },
  })
  async getApplicationTypesSuperAdmin() {
    return this.applicationService.getAllApplicationTypesSuperAdmin()
  }

  @Scopes(AdminPortalScope.applicationSystemAdmin)
  @BypassDelegation()
  @Get('admin/applications/institutions')
  @Documentation({
    description: 'Get a list of all institutions with active application types',
    response: {
      status: 200,
      type: [ApplicationInstitution],
    },
  })
  async getInstitutionsSuperAdmin() {
    return this.applicationService.getAllInstitutionsSuperAdmin()
  }
}
