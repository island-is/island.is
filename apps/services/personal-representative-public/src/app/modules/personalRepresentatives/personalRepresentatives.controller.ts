import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth,ApiTags } from '@nestjs/swagger'

import { AuthScope } from '@island.is/auth/scopes'
import {
  PersonalRepresentativePublicDTO,
  PersonalRepresentativeService,
} from '@island.is/auth-api-lib/personal-representative'
import { IdsAuthGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import { Documentation } from '@island.is/nest/swagger'

import { environment } from '../../../environments'

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

    const personalReps = await this.prService.getByPersonalRepresentative(
      prId,
      false,
    )

    return personalReps.map((pr) => PersonalRepresentativePublicDTO.fromDTO(pr))
  }
}
