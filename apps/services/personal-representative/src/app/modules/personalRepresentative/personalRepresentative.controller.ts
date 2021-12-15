import { AuthScope } from '@island.is/auth/scopes'
import {
  PersonalRepresentativeDTO,
  PersonalRepresentativeService,
} from '@island.is/auth-api-lib/personal-representative'
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
} from '@nestjs/common'
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { isNationalIdValid } from '@island.is/financial-aid/shared/lib'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  User,
} from '@island.is/auth-nest-tools'
import { environment } from '../../../environments'
import { Audit, AuditService } from '@island.is/nest/audit'

const namespace = `${environment.audit.defaultNamespace}/personal-representative`

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(AuthScope.writePersonalRepresentative)
@ApiTags('Personal Representative')
@Controller('v1/personal-representative')
@ApiBearerAuth()
@Audit({ namespace })
export class PersonalRepresentativeController {
  constructor(
    @Inject(PersonalRepresentativeService)
    private readonly prService: PersonalRepresentativeService,
    private readonly auditService: AuditService,
  ) {}

  /** Gets all personal representatives */
  @ApiOperation({ summary: 'Gets all personal representatives' })
  @Get('all/:includeInvalid?')
  @ApiOkResponse({
    description: 'Personal representative connections with rights',
    type: PersonalRepresentativeDTO,
  })
  @ApiParam({
    name: 'includeInvalid',
    required: false,
    type: 'boolean',
    allowEmptyValue: true,
  })
  @Audit<PersonalRepresentativeDTO[]>({
    resources: (prs) => prs.map((pr) => pr.id ?? ''),
  })
  async getAll(
    @Param('includeInvalid') includeInvalid?: boolean,
  ): Promise<PersonalRepresentativeDTO[]> {
    const personalRepresentatives = await this.prService.getAllAsync(
      includeInvalid ? (includeInvalid as boolean) : false,
    )

    if (!personalRepresentatives) {
      throw new NotFoundException('No personal representatives found')
    }

    return personalRepresentatives
  }

  /** Gets a personal representative rights by it's id */
  @ApiOperation({ summary: 'Gets a personal representative rights by id' })
  @Get(':id')
  @ApiOkResponse({
    description: 'Personal representative connection with rights',
    type: PersonalRepresentativeDTO,
  })
  @Audit<PersonalRepresentativeDTO>({
    resources: (pr) => pr.id ?? '',
  })
  async getAsync(@Param('id') id: string): Promise<PersonalRepresentativeDTO> {
    if (!id) {
      throw new BadRequestException('Id needs to be provided')
    }

    const personalRepresentative = await this.prService.getPersonalRepresentativeAsync(
      id,
    )

    if (!personalRepresentative) {
      throw new NotFoundException(
        "This particular personal representative doesn't exist",
      )
    }

    return personalRepresentative
  }

  /** Gets a personal representative rights by nationalId of personal representative */
  @ApiOperation({
    summary:
      'Gets personal representative rights by nationalId of personal representative',
    description: 'A personal representative can represent more than one person',
  })
  @Get('byPersonalRepresentative/:nationalId/:includeInvalid?')
  @ApiOkResponse({
    description: 'Personal representative connections with rights',
    type: PersonalRepresentativeDTO,
  })
  @ApiParam({ name: 'nationalId', required: true, type: String })
  @ApiParam({
    name: 'includeInvalid',
    required: false,
    type: 'boolean',
    allowEmptyValue: true,
  })
  @Audit<PersonalRepresentativeDTO[]>({
    resources: (prs) => prs.map((pr) => pr.id ?? ''),
  })
  async getByPersonalRepresentativeAsync(
    nationalId: string,
    includeInvalid?: boolean,
  ): Promise<PersonalRepresentativeDTO[]> {
    if (!nationalId) {
      throw new BadRequestException('NationalId needs to be provided')
    }

    const personalRepresentatives = await this.prService.getByPersonalRepresentativeAsync(
      nationalId,
      includeInvalid ? (includeInvalid as boolean) : false,
    )

    return personalRepresentatives
  }

  /** Gets a personal representative rights by nationalId of represented person */
  @ApiOperation({
    summary:
      'Gets a personal representative rights by nationalId of represented person',
  })
  @Get('byRepresentedPerson/:nationalId/:includeInvalid?')
  @ApiOkResponse({
    description: 'Personal representative connection with rights',
    type: PersonalRepresentativeDTO,
  })
  @ApiParam({ name: 'nationalId', required: true, type: String })
  @ApiParam({
    name: 'includeInvalid',
    required: false,
    type: 'boolean',
    allowEmptyValue: false,
  })
  @Audit<PersonalRepresentativeDTO>({
    resources: (pr) => pr.id ?? '',
  })
  async getByRepresentedPersonAsync(
    nationalId: string,
    includeInvalid?: boolean,
  ): Promise<PersonalRepresentativeDTO | null> {
    if (!nationalId) {
      throw new BadRequestException('NationalId needs to be provided')
    }

    const personalRepresentative = await this.prService.getPersonalRepresentativeByRepresentedPersonAsync(
      nationalId,
      includeInvalid ? (includeInvalid as boolean) : false,
    )

    return personalRepresentative
  }

  /** Removes a personal representative by it's id */
  @ApiOperation({
    summary: 'Delete a personal representative connection by id',
  })
  @Delete(':id')
  @ApiOkResponse()
  async removeAsync(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<number> {
    if (!id) {
      throw new BadRequestException('Id needs to be provided')
    }
    return await this.auditService.auditPromise(
      {
        user,
        action: 'deletePersonalRepresentative',
        namespace,
        resources: id,
      },
      this.prService.deleteAsync(id),
    )
  }

  /** Creates a right type */
  @ApiOperation({
    summary: 'Create a new personal representative connection',
    description:
      'All other connections between nationalIds are removed, right list must be supplied',
  })
  @Post()
  @ApiCreatedResponse({
    description: 'Created personal representative connections with rights',
    type: PersonalRepresentativeDTO,
  })
  @Audit<PersonalRepresentativeDTO>({
    resources: (pr) => pr.id ?? '',
  })
  async create(
    @Body() personalRepresentative: PersonalRepresentativeDTO,
    @CurrentUser() user: User,
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
    const currentContract = await this.prService.getPersonalRepresentativeByRepresentedPersonAsync(
      personalRepresentative.nationalIdRepresentedPerson,
      true,
    )

    if (currentContract && currentContract.id) {
      await this.auditService.auditPromise(
        {
          user,
          action: 'deleteExistingPersonalRepresentative',
          namespace,
          resources: personalRepresentative.nationalIdRepresentedPerson,
          meta: { fields: Object.keys(currentContract) },
        },
        this.prService.deleteAsync(currentContract.id),
      )
    }
    // Create a new personal representative
    return await this.auditService.auditPromise(
      {
        user,
        action: 'createPersonalRepresentative',
        namespace,
        resources: personalRepresentative.nationalIdRepresentedPerson,
        meta: { fields: Object.keys(personalRepresentative) },
      },
      this.prService.createAsync(personalRepresentative),
    )
  }
}
