import { AuthScope } from '@island.is/auth/scopes'
import {
  PersonalRepresentativeDTO,
  PersonalRepresentativeService,
} from '@island.is/auth-api-lib/personal-representative'
import {
  BadRequestException,
  Controller,
  UseGuards,
  Get,
  Inject,
  Param,
} from '@nestjs/common'
import {
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger'
import { AuditService } from '@island.is/nest/audit'
import { environment } from '../../../environments/'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  User,
} from '@island.is/auth-nest-tools'

const namespace = `${environment.audit.defaultNamespace}/personal-representative-permission`

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(AuthScope.readPersonalRepresentative)
@ApiTags('Personal Representative Permission')
@Controller('v1/personal-representative-permission')
@ApiBearerAuth()
export class PersonalRepresentativePermissionController {
  constructor(
    @Inject(PersonalRepresentativeService)
    private readonly prService: PersonalRepresentativeService,
    private readonly auditService: AuditService,
  ) {}

  /** Gets a personal representative rights by nationalId of personal representative */
  @ApiOperation({
    summary:
      'Gets personal representative rights by nationalId of personal representative',
    description: 'A personal representative can represent more than one person',
  })
  @Get(':nationalId')
  @ApiOkResponse({
    description: 'Personal representative connections with rights',
    type: PersonalRepresentativeDTO,
  })
  @ApiParam({ name: 'nationalId', required: true, type: String })
  async getByPersonalRepresentativeAsync(
    @Param('nationalId') nationalId: string,
    @CurrentUser() user: User,
  ): Promise<PersonalRepresentativeDTO[]> {
    if (!nationalId) {
      throw new BadRequestException('NationalId needs to be provided')
    }

    return await this.auditService.auditPromise(
      {
        user,
        action: 'getPersonalRepresentativePermissions',
        namespace,
        resources: nationalId,
      },
      this.prService.getByPersonalRepresentativeAsync(nationalId, false),
    )
  }
}
