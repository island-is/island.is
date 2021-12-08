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
  Req,
} from '@nestjs/common'
import {
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger'
import { AuthGuard } from '../common'
import { AuditService } from '@island.is/nest/audit'
import { environment } from '../../../environments/'
import type { HttpRequest } from '../../app.types'
import { User } from '@island.is/auth-nest-tools'

const namespace = `${environment.audit.defaultNamespace}/personal-representative-permission`

@ApiTags('Personal Representative Permission')
@Controller('v1/personal-representative-permission')
@UseGuards(AuthGuard)
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
    @Req() request: HttpRequest,
  ): Promise<PersonalRepresentativeDTO[]> {
    if (!nationalId) {
      throw new BadRequestException('NationalId needs to be provided')
    }
    // Since we do not have an island.is user login we need to create a user object
    const user: User = {
      nationalId: nationalId,
      scope: [],
      authorization: '',
      client: request.serviceProvider,
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
