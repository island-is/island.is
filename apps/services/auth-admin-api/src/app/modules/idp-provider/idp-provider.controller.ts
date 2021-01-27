import {
  IdpProviderService,
  IdpRestriction,
  IdpProviderDTO,
} from '@island.is/auth-api-lib'
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiOAuth2,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger'
import { IdsAuthGuard } from '@island.is/auth-nest-tools'
import { NationalIdGuard } from '../access/national-id-guard'

// @ApiOAuth2(['@identityserver.api/read'])
@UseGuards(IdsAuthGuard, NationalIdGuard)
@ApiTags('idp-provider')
@Controller('backend/idp-provider')
export class IdpProviderController {
  constructor(private readonly idpProviderService: IdpProviderService) {}

  /** Finds available idp providers */
  @Get()
  @ApiOkResponse({ type: [IdpRestriction] })
  async findAll(): Promise<IdpRestriction[] | null> {
    return await this.idpProviderService.findAll()
  }

  /** Finds available idp restrictions */
  @Get(':name')
  @ApiOkResponse({ type: IdpRestriction })
  async find(@Param('name') name: string): Promise<IdpRestriction | null> {
    return await this.idpProviderService.find(name)
  }

  /** Adds new IDP provider */
  @Post()
  @ApiCreatedResponse({ type: IdpRestriction })
  async create(@Body() idpProvider: IdpProviderDTO): Promise<IdpRestriction> {
    return await this.idpProviderService.create(idpProvider)
  }

  /** Deletes an idp provider */
  @Delete(':name')
  @ApiCreatedResponse()
  async delete(@Param('name') name: string): Promise<number> {
    if (!name) {
      throw new BadRequestException('name must be provided')
    }

    return await this.idpProviderService.delete(name)
  }

  /** Deletes an idp provider */
  @Put(':name')
  @ApiCreatedResponse()
  async update(
    @Param('name') name: string,
    @Body() idpProvider: IdpProviderDTO,
  ): Promise<[number, IdpRestriction[]] | null> {
    if (!name) {
      throw new BadRequestException('name must be provided')
    }
    if (!idpProvider) {
      throw new BadRequestException('idpProvider object must be provided')
    }

    return await this.idpProviderService.update(idpProvider, name)
  }
}
