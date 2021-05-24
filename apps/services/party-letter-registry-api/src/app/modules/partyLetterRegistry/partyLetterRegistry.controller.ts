import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
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

  @Post()
  async create(@Body() input: CreateDto): Promise<PartyLetterRegistry> {
    return await this.partyLetterRegistryService.create(input)
  }
}
