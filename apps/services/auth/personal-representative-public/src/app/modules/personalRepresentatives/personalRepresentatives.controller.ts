import { AuthScope } from '@island.is/auth/scopes'
import {
  PersonalRepresentativeService,
  PersonalRepresentativePublicDTO,
} from '@island.is/auth-api-lib'
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
import { Audit } from '@island.is/nest/audit'
import { IdsAuthGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'

const namespace = '@island.is/personal-representative-public/personal-representatives'

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
  @Audit<PersonalRepresentativePublicDTO>({
    resources: (pr) =>
      `${pr.nationalIdPersonalRepresentative}-${pr.nationalIdRepresentedPerson}`,
  })
  async getByPersonalRepresentative(
    @Query('prId') prId: string,
  ): Promise<PersonalRepresentativePublicDTO[]> {
    if (!prId) {
      throw new BadRequestException(
        'NationalId of personal representative needs to be provided',
      )
    }

    const personalReps = await this.prService.getByPersonalRepresentative({
      nationalIdPersonalRepresentative: prId,
    })

    return personalReps.map((pr) => PersonalRepresentativePublicDTO.fromDTO(pr))
  }
}
