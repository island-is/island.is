import { AuthScope } from '@island.is/auth/scopes'
import {
  PaginatedPersonalRepresentativeDto,
  PersonalRepresentativeDTO,
  PersonalRepresentativeCreateDTO,
  PersonalRepresentativeService,
  PaginationWithNationalIdsDto,
} from '@island.is/auth-api-lib'
import {
  BadRequestException,
  Body,
  Controller,
  UseGuards,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Inject,
  Query,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { Documentation } from '@island.is/nest/swagger'
import { isNationalIdValid } from '@island.is/financial-aid/shared/lib'
import type { Auth } from '@island.is/auth-nest-tools'
import {
  CurrentAuth,
  IdsAuthGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { environment } from '../../../environments'
import { Audit, AuditService } from '@island.is/nest/audit'

const namespace = `${environment.audit.defaultNamespace}/personal-representative`

@UseGuards(IdsAuthGuard, ScopesGuard)
@Scopes(AuthScope.adminPersonalRepresentative)
@ApiTags('Personal Representatives')
@Controller('v1/personal-representatives')
@ApiBearerAuth()
@Audit({ namespace })
export class PersonalRepresentativesController {
  constructor(
    @Inject(PersonalRepresentativeService)
    private readonly prService: PersonalRepresentativeService,
    private readonly auditService: AuditService,
  ) {}

  /** Gets a list of personal representatives */
  @Get()
  @Documentation({
    summary: 'Gets all personal representatives',
    description: 'Personal representative connections with rights',
    response: { status: 200, type: [PaginatedPersonalRepresentativeDto] },
  })
  @Audit<PaginatedPersonalRepresentativeDto>({
    resources: (pgData) => pgData.data.map((pr) => pr.id ?? ''),
  })
  async getAll(
    @Query() query: PaginationWithNationalIdsDto,
  ): Promise<PaginatedPersonalRepresentativeDto> {
    return this.prService.getMany(true, query)
  }

  /** Gets a personal representative rights by it's id */
  @Get(':id')
  @Documentation({
    summary: 'Gets a personal representative rights by id',
    description: 'Personal representative connection with rights',
    response: { status: 200, type: PersonalRepresentativeDTO },
    request: {
      params: {
        id: {
          required: true,
          description: 'Unique id for a specific connection',
          type: String,
        },
      },
    },
  })
  @Audit<PersonalRepresentativeDTO>({
    resources: (pr) => pr.id ?? '',
  })
  async get(@Param('id') id: string): Promise<PersonalRepresentativeDTO> {
    console.log(id)
    const personalRepresentative =
      await this.prService.getPersonalRepresentative(id)

    if (!personalRepresentative) {
      throw new NotFoundException(
        "This particular personal representative doesn't exist",
      )
    }

    return personalRepresentative
  }
  /** Removes a personal representative by it's id */
  @Delete(':id')
  @Documentation({
    summary: 'Delete a personal representative connection by id',
    response: { status: 204 },
    request: {
      params: {
        id: {
          required: true,
          description: 'Unique id for a specific connection',
          type: String,
        },
      },
    },
  })
  async remove(
    @Param('id') id: string,
    @CurrentAuth() user: Auth,
  ): Promise<void> {
    if (!id) {
      throw new BadRequestException('Id needs to be provided')
    }
    await this.auditService.auditPromise(
      {
        auth: user,
        action: 'deletePersonalRepresentative',
        namespace,
        resources: id,
      },
      this.prService.delete(id),
    )
  }

  /** Creates a personal representative */
  @Post()
  @Documentation({
    summary: 'Create a new personal representative connection',
    description:
      'Created personal representative connections with rights. All other connections between nationalIds are removed, right list must be supplied',
    response: { status: 201, type: PersonalRepresentativeDTO },
  })
  async create(
    @Body() personalRepresentative: PersonalRepresentativeCreateDTO,
    @CurrentAuth() user: Auth,
  ): Promise<PersonalRepresentativeDTO | null> {
    if (personalRepresentative.rightCodes.length === 0) {
      throw new BadRequestException('RightCodes list must be provided')
    }
    if (
      !isNationalIdValid(
        personalRepresentative.nationalIdPersonalRepresentative,
      )
    ) {
      throw new BadRequestException('Invalid national Id of representative')
    }
    if (
      !isNationalIdValid(personalRepresentative.nationalIdRepresentedPerson)
    ) {
      throw new BadRequestException('Invalid national Id of Represented')
    }

    // Find current personal representative connection between nationalIds and remove since only one should be active
    const currentContract =
      await this.prService.getPersonalRepresentativeByRepresentedPerson(
        personalRepresentative.nationalIdRepresentedPerson,
        true,
      )

    if (currentContract && currentContract.id) {
      await this.auditService.auditPromise(
        {
          auth: user,
          action: 'deleteExistingPersonalRepresentative',
          namespace,
          resources: personalRepresentative.nationalIdRepresentedPerson,
          meta: { fields: Object.keys(currentContract) },
        },
        this.prService.delete(currentContract.id),
      )
    }

    // Create a new personal representative
    return await this.auditService.auditPromise(
      {
        auth: user,
        action: 'createPersonalRepresentative',
        namespace,
        resources: (pr) => pr?.id ?? '',
        meta: { fields: Object.keys(personalRepresentative) },
      },
      this.prService.create(personalRepresentative),
    )
  }
}
