import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Post,
  Query,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Endorsement } from './endorsement.model'
import { EndorsementService } from './endorsement.service'
import { FindEndorsementDto } from './dto/findEndorsement.dto'
import { EndorsementDto } from './dto/Endorsement.dto'

@ApiTags('endorsement')
@Controller('endorsement')
export class EndorsementController {
  constructor(private readonly endorsementService: EndorsementService) {}

  @Get()
  async findAll(
    @Query() { listId }: FindEndorsementDto,
  ): Promise<Endorsement[]> {
    // TODO: Add auth here
    const endorsement = await this.endorsementService.findEndorsementsByNationalId(
      {
        nationalId: '0000000000', // TODO: Replace this with requesting user
        listId,
      },
    )

    return endorsement
  }

  @Post()
  async create(@Body() { listId }: EndorsementDto): Promise<Endorsement> {
    // TODO: Add auth here
    // TODO: Validate rules here
    try {
      return await this.endorsementService.createEndorsementOnList({
        nationalId: '0000000000', // TODO: Replace this with requesting user
        listId,
      })
    } catch (error) {
      throw new NotFoundException(["This list doesn't exist"])
    }
  }

  @Delete()
  async delete(@Body() { listId }: EndorsementDto): Promise<boolean> {
    // TODO: Add auth here
    const endorsement = await this.endorsementService.deleteFromListByNationalId(
      {
        nationalId: '0000000000', // TODO: Replace this with requesting user
        listId,
      },
    )

    if (endorsement === 0) {
      throw new NotFoundException(["This endorsement doesn't exist"])
    }

    return endorsement > 0
  }
}
