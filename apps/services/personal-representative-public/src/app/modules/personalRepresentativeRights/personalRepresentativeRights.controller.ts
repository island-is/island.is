import { AuthScope } from '@island.is/auth/scopes'
import {
  PersonalRepresentativeAccess,
  PersonalRepresentativeAccessDTO,
  PersonalRepresentativeAccessService,
  PersonalRepresentativeService,
} from '@island.is/auth-api-lib/personal-representative'
import {
  BadRequestException,
  Controller,
  UseGuards,
  Get,
  Post,
  Body,
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
import { Audit, AuditService } from '@island.is/nest/audit'
import { environment } from '../../../environments'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  User,
} from '@island.is/auth-nest-tools'
import { PersonalRepresentativePublicDTO } from './dto/personalRepresentativePublicDTO.dto'

const namespace = `${environment.audit.defaultNamespace}/personal-representative-rights`

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(AuthScope.readPersonalRepresentative)
@ApiTags('Personal Representative Public - Rights')
@Controller('v1/personal-representative-rights')
@ApiBearerAuth()
@Audit({ namespace })
export class PersonalRepresentativeRightsController {
  constructor(
    @Inject(PersonalRepresentativeService)
    private readonly prService: PersonalRepresentativeService,
    @Inject(PersonalRepresentativeAccessService)
    private readonly prAccessService: PersonalRepresentativeAccessService,
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
    type: PersonalRepresentativePublicDTO,
  })
  @ApiParam({ name: 'nationalId', required: true, type: String })
  @Audit<PersonalRepresentativeDTO>({
    resources: (pr) => pr.id ?? '',
  })
  async getByPersonalRepresentative(
    @Param('nationalId') nationalId: string,
    @CurrentUser() user: User,
  ): Promise<PersonalRepresentativePublicDTO[]> {
    if (!nationalId) {
      throw new BadRequestException('NationalId needs to be provided')
    }

    const personalReps = await this.auditService.auditPromise(
      {
        user,
        action: 'getPersonalRepresentativePermissions',
        namespace,
        resources: nationalId,
      },
      this.prService.getByPersonalRepresentative(nationalId, false),
    )

    return personalReps.map((pr) =>
      new PersonalRepresentativePublicDTO().fromDTO(pr),
    )
  }

  /** Gets a personal representative rights by nationalId of personal representative */
  @ApiOperation({
    summary: 'Log access',
    description:
      'Logs the access of a personal representative on behalf of represented person',
  })
  @Post('log-access')
  @ApiOkResponse({
    description: 'Access log file',
    type: PersonalRepresentativeAccess,
  })
  @Audit<PersonalRepresentativeAccess>({
    resources: (log) => log.id ?? '',
  })
  async logAccessByPersonalRepresentative(
    @Body() personalRepresentativeAccess: PersonalRepresentativeAccessDTO,
    @CurrentUser() user: User,
  ): Promise<PersonalRepresentativeAccess | null> {
    if (!personalRepresentativeAccess) {
      throw new BadRequestException('access body needs to be provided')
    }

    return await this.auditService.auditPromise(
      {
        user,
        action: 'logPersonalRepresentativeAccess',
        namespace,
        resources:
          personalRepresentativeAccess.nationalIdPersonalRepresentative,
        meta: { fields: Object.keys(personalRepresentativeAccess) },
      },
      this.prAccessService.logAccess(personalRepresentativeAccess),
    )
  }
}
