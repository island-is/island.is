import { AuthScope } from '@island.is/auth/scopes'
import {
  PersonalRepresentativeService,
  PersonalRepresentativePublicDTO,
} from '@island.is/auth-api-lib/personal-representative'
import {
  BadRequestException,
  Controller,
  UseGuards,
  Get,
  Inject,
  Query,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { Documentation } from '@island.is/nest/swagger'
import { Audit, AuditService } from '@island.is/nest/audit'
import { environment } from '../../../environments'
import {
  Auth,
  CurrentAuth,
  IdsAuthGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'

const namespace = `${environment.audit.defaultNamespace}/personal-representatives`

@UseGuards(IdsAuthGuard, ScopesGuard)
@Scopes(AuthScope.publicPersonalRepresentative)
@ApiBearerAuth()
@ApiTags('Personal Representatives - Public')
@Controller('v1/personal-representatives')
@Audit({ namespace })
export class PersonalRepresentativesController {
  constructor(
    @Inject(PersonalRepresentativeService)
    private readonly prService: PersonalRepresentativeService,
    private readonly auditService: AuditService,
  ) {}

  /** Gets a personal representative rights by nationalId of personal representative */
  @Get()
  @Documentation({
    summary:
      'Gets personal representative rights by nationalId of personal representative',
    description:
      'Personal representative connections with rights. A personal representative can represent more than one person',
    response: { status: 200, type: [PersonalRepresentativePublicDTO] },
    request: {
      query: {
        prId: {
          required: true,
          type: 'string',
          description: 'nationalId of personal representative.',
        },
      },
    },
  })
  async getByPersonalRepresentative(
    @Query('prId') prId: string,
    @CurrentAuth() user: Auth,
  ): Promise<PersonalRepresentativePublicDTO[]> {
    if (!prId) {
      throw new BadRequestException(
        'NationalId of personal representative needs to be provided',
      )
    }

    const personalReps = await this.auditService.auditPromise(
      {
        auth: user,
        action: 'getPersonalRepresentativePermissions',
        namespace,
        resources: prId,
      },
      this.prService.getByPersonalRepresentative(prId, false),
    )

    return personalReps.map((pr) => PersonalRepresentativePublicDTO.fromDTO(pr))
  }
}
