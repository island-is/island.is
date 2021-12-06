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
import { AuthGuard } from '../common'

@ApiTags('Personal Representative Rights')
@Controller('v1/rights')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class RightsController {
  constructor(
    @Inject(PersonalRepresentativeService)
    private readonly prService: PersonalRepresentativeService,
  ) {}

  /** Gets a personal representative rights by nationalId of personal representative */
  @ApiOperation({
    summary:
      'Gets personal representative rights by nationalId of personal representative',
    description: 'A personal representative can represent more than one person',
  })
  @Get('byPersonalRepresentative/:nationalId')
  @ApiOkResponse({
    description: 'Personal representative connections with rights',
    type: PersonalRepresentativeDTO,
  })
  @ApiParam({ name: 'nationalId', required: true, type: String })
  async getByPersonalRepresentativeAsync(
    @Param('nationalId') nationalId: string,
  ): Promise<PersonalRepresentativeDTO[]> {
    if (!nationalId) {
      throw new BadRequestException('NationalId needs to be provided')
    }

    return await this.prService.getByPersonalRepresentativeAsync(
      nationalId,
      false,
    )
  }

  /** Gets a personal representative rights by nationalId of represented person */
  @ApiOperation({
    summary:
      'Gets a personal representative rights by nationalId of represented person',
  })
  @Get('byRepresentedPerson/:nationalId')
  @ApiOkResponse({
    description: 'Personal representative connection with rights',
    type: PersonalRepresentativeDTO,
  })
  @ApiParam({ name: 'nationalId', required: true, type: String })
  async getByRepresentedPersonAsync(
    @Param('nationalId') nationalId: string,
  ): Promise<PersonalRepresentativeDTO | null> {
    if (!nationalId) {
      throw new BadRequestException('NationalId needs to be provided')
    }

    return await this.prService.getPersonalRepresentativeByRepresentedPersonAsync(
      nationalId,
      false,
    )
  }
}
