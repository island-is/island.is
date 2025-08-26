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

import { IdsUserGuard, ScopesGuard, Scopes } from '@island.is/auth-nest-tools'
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
  ApplicationListAdminResponseDto,
  ApplicationStatistics,
  ApplicationTypeAdminInstitution,
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
  @Get('admin/applications-statistics')
  @UseInterceptors(ApplicationAdminStatisticsSerializer)
  @Documentation({
    description: 'Get applications statistics',
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
  async getCountByTypeIdAndStatus(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.applicationService.getApplicationCountByTypeIdAndStatus(
      startDate,
      endDate,
    )
  }

  @Scopes(AdminPortalScope.applicationSystemAdmin)
  @BypassDelegation()
  @Get('admin/:nationalId/applications')
  @UseInterceptors(ApplicationAdminSerializer)
  @Audit<ApplicationListAdminResponseDto[]>({
    resources: (apps) => apps.map((app) => app.id),
  })
  @Documentation({
    description: 'Get applications for a specific user',
    response: {
      status: 200,
      type: [ApplicationListAdminResponseDto],
    },
    request: {
      params: {
        nationalId: {
          type: 'string',
          required: true,
          description: `To get the applications for a specific user's national id.`,
        },
      },
      query: {
        typeId: {
          type: 'string',
          required: false,
          description:
            'To filter applications by type. Comma-separated for multiple values.',
        },
        status: {
          type: 'string',
          required: false,
          description:
            'To filter applications by status. Comma-separated for multiple values.',
        },
      },
    },
  })
  async findAllAdmin(
    @Param('nationalId') nationalId: string,
    @Query('typeId') typeId?: string,
    @Query('status') status?: string,
  ) {
    this.logger.debug(`Getting applications with status ${status}`)

    return this.applicationService.findAllByNationalIdAndFilters(
      nationalId,
      typeId,
      status,
      true, // Show pruned applications
    )
  }

  @Scopes(AdminPortalScope.applicationSystemInstitution)
  @BypassDelegation()
  @Get('admin/institution/:nationalId/applications/:page/:count')
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
        nationalId: {
          type: 'string',
          required: true,
          description: `To get the applications for a specific institution's national id.`,
        },
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
        searchStrValue: {
          type: 'string',
          required: false,
          description: 'To filter applications by any search string',
        },
      },
    },
  })
  async findAllInstitutionAdmin(
    @Param('nationalId') nationalId: string,
    @Param('page') page: number,
    @Param('count') count: number,
    @Query('status') status?: string,
    @Query('applicantNationalId') applicantNationalId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('typeIdValue') typeIdValue?: string,
    @Query('searchStrValue') searchStrValue?: string,
  ) {
    return this.applicationService.findAllByInstitutionAndFilters(
      nationalId,
      page ?? 1,
      count ?? 12,
      status,
      applicantNationalId,
      from,
      to,
      typeIdValue,
      searchStrValue,
    )
  }

  @Scopes(AdminPortalScope.applicationSystemInstitution)
  @BypassDelegation()
  @Get('admin/institution/:nationalId/application-types')
  @UseInterceptors(ApplicationTypeAdminSerializer)
  @Documentation({
    description: 'Get application types for a specific institution',
    response: {
      status: 200,
      type: [ApplicationTypeAdminInstitution],
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
}
