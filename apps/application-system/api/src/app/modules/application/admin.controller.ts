import {
  Controller,
  Get,
  Param,
  UseInterceptors,
  Query,
  UseGuards,
  Inject,
} from '@nestjs/common'
import { ApiTags, ApiHeader } from '@nestjs/swagger'

import { IdsUserGuard, ScopesGuard, Scopes } from '@island.is/auth-nest-tools'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import { ApplicationService } from '@island.is/application/api/core'
import { Documentation } from '@island.is/nest/swagger'
import { DelegationGuard } from './guards/delegation.guard'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { BypassDelegation } from './guards/bypass-delegation.decorator'
import { ApplicationListAdminResponseDto } from './dto/applicationAdmin.response.dto'
import { ApplicationAdminSerializer } from './tools/applicationAdmin.serializer'

@UseGuards(IdsUserGuard, ScopesGuard, DelegationGuard)
@ApiTags('applications')
@ApiHeader({
  name: 'authorization',
  description: 'Bearer token authorization',
})
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

  @Scopes(AdminPortalScope.applicationSystem)
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
      nationalId,
    )
  }
  @Get('admin/institution/:nationalId/applications')
  async findAllInstitution(
    @Param('nationalId') nationalId: string,
    @Query('status') status?: string,
  ) {
    this.logger.debug(`Getting institution applications with status ${status}`)

    return this.applicationService.findAllByInstitutionAndFilters(
      nationalId,
      status,
    )
  }
}
