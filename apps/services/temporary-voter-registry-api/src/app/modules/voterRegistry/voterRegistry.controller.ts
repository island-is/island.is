import { Controller, Get, NotFoundException, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { FindOneDto } from './dto/findOne.dto'
import { VoterRegistry } from './voterRegistry.model'
import { VoterRegistryService } from './voterRegistry.service'

@Controller('voter-registry')
export class VoterRegistryController {
  constructor(private readonly voterRegistryService: VoterRegistryService) {}

  @Get()
  async findOne(@Query() { nationalId }: FindOneDto): Promise<VoterRegistry> {
    console.log('Inside', { nationalId })
    const resource = await this.voterRegistryService.findByNationalId(
      nationalId,
    )

    if (!resource) {
      throw new NotFoundException("This resource doesn't exist")
    }

    return resource
  }
}
