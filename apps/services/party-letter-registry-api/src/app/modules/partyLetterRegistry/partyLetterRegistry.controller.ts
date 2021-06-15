import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
} from '@nestjs/common'
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger'
import { CreateDto } from './dto/create.dto'
import { FindByManagerDto } from './dto/findByManager.dto'
import { FindByOwnerDto } from './dto/findByOwner.dto'
import { PartyLetterRegistry } from './partyLetterRegistry.model'
import { PartyLetterRegistryService } from './partyLetterRegistry.service'

@Controller('party-letter-registry')
@ApiTags('partyLetterRegistry')
export class PartyLetterRegistryController {
  constructor(
    private readonly partyLetterRegistryService: PartyLetterRegistryService,
  ) {}

  @ApiOkResponse({
    description: 'Finds party letter by owners national id',
    type: PartyLetterRegistry,
  })
  @Get('owner')
  async findByOwner(
    @Query() { owner }: FindByOwnerDto,
  ): Promise<PartyLetterRegistry> {
    const resource = await this.partyLetterRegistryService.findByOwner(owner)

    if (!resource) {
      throw new NotFoundException("This resource doesn't exist")
    }

    return resource
  }

  @ApiOkResponse({
    description: 'Finds party letter by managers national id',
    type: PartyLetterRegistry,
  })
  @Get('manager')
  async findByManager(
    @Query() { manager }: FindByManagerDto,
  ): Promise<PartyLetterRegistry> {
    const resource = await this.partyLetterRegistryService.findByManager(
      manager,
    )

    if (!resource) {
      throw new NotFoundException("This resource doesn't exist")
    }

    return resource
  }

  @ApiCreatedResponse({
    description: 'Creates a new party letter entry',
    type: PartyLetterRegistry,
  })
  @ApiBody({
    type: CreateDto,
  })
  @Post()
  async create(@Body() input: CreateDto): Promise<PartyLetterRegistry> {
    return await this.partyLetterRegistryService.create(input)
  }
}
