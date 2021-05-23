import { Controller, Get, NotFoundException, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { FindOneDto } from './dto/findOne.dto'
import { VoterRegistry } from './voterRegistry.model'
import { VoterRegistryService } from './voterRegistry.service'

@Controller('voter-registry')
@ApiTags('temporaryVoterRegistry')
export class VoterRegistryController {
  constructor(private readonly voterRegistryService: VoterRegistryService) {}

  @Get()
  async findOne(@Query() { nationalId }: FindOneDto): Promise<VoterRegistry> {
    const resource = await this.voterRegistryService.findByNationalId(
      nationalId,
    )

    // we return a empty record when no record is found
    if (!resource) {
      return {
        id: '0',
        regionNumber: 0,
        regionName: 'Ekki á skrá',
        nationalId,
      } as VoterRegistry
    }

    return resource
  }
}
