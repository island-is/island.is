import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
} from '@nestjs/common'
import { CreateDto } from './dto/create.dto'
import { FindByOwnerDto } from './dto/findByOwner.dto'
import { PartyLetterRegistry } from './partyLetterRegistry.model'
import { PartyLetterRegistryService } from './partyLetterRegistry.service'

@Controller('party-letter-registry')
export class PartyLetterRegistryController {
  constructor(
    private readonly partyLetterRegistryService: PartyLetterRegistryService,
  ) {}

  @Get()
  async findByOwner(
    @Query() { owner }: FindByOwnerDto,
  ): Promise<PartyLetterRegistry> {
    const resource = await this.partyLetterRegistryService.findByOwner(owner)

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
